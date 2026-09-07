# contracts.md — FROZEN INTERFACES

**Status: FROZEN as of planning chat 1. Do not change without a version bump and a note in the changelog at the bottom.**

This file is pasted into EVERY delegation prompt (Hermes / GLM / Codex / Antigravity). No delegate ever sees another delegate's implementation — only this file and their own module spec. If two modules disagree at integration time, this file is right and the code is wrong.

Language: Python 3.11+. Types are Pydantic v2 models. Async throughout.

---

## 0. Project layout

```
walkthrough-agent/
  app/
    schemas.py          # M0 — everything in this document
    browser/
      driver.py         # M1
      resolver.py       # M2
    teach/
      compiler.py       # M3
      rehearser.py      # M4
    runtime/
      orchestrator.py   # M5
      narrator.py       # M6
      interrupt.py      # M7
      qa.py             # M8
    safety/
      guard.py          # M9
    store.py            # M10
    server.py           # M11 (FastAPI + WebSocket)
    llm.py              # shared model client
  workflows/            # frozen WorkflowSpec JSON lands here
  tests/
  ui/                   # M11 static frontend
```

Rules that apply to every module:
- A module imports ONLY from `app.schemas`, its declared dependencies, and stdlib/third-party. Never sideways into a sibling's internals.
- Every public function is `async def` unless it is pure computation.
- No module prints. Logging via `structlog` only. User-visible text goes through the event bus (§5).
- No module calls an LLM directly. All model calls go through `app.llm.complete()` (§7).

---

## 1. Core enums

```python
from enum import Enum

class ActionType(str, Enum):
    NAVIGATE = "navigate"     # go to a URL
    CLICK    = "click"
    TYPE     = "type"         # fill a field
    SELECT   = "select"       # dropdown option
    SCROLL   = "scroll"
    WAIT_FOR = "wait_for"     # wait for an element/state, no interaction
    ASSERT   = "assert"       # verify we landed where we expected

class RiskLevel(str, Enum):
    SAFE        = "safe"
    CAUTION     = "caution"      # mutates dummy account state, reversible
    DESTRUCTIVE = "destructive"  # irreversible / real-world side effect — ALWAYS BLOCKED

class StepStatus(str, Enum):
    PENDING   = "pending"
    RUNNING   = "running"
    DONE      = "done"
    FAILED    = "failed"
    SKIPPED   = "skipped"

class RunState(str, Enum):
    IDLE        = "idle"
    RUNNING     = "running"
    INTERRUPTED = "interrupted"
    COMPLETED   = "completed"
    ABORTED     = "aborted"

class InterruptKind(str, Enum):
    QUESTION   = "question"     # answer, cursor unchanged
    SKIP       = "skip"         # advance cursor past current/next step
    JUMP       = "jump"         # move cursor to a named/indexed step
    REPEAT     = "repeat"       # re-run current step
    STOP       = "stop"         # abort run
    UNCLEAR    = "unclear"      # ask the human to clarify
```

---

## 2. Locators — the self-heal contract

**Execution policy (locked): saved locator first, LLM self-heal on miss.**

At call time the driver tries each candidate in `LocatorBundle.candidates` in order. If all miss within `timeout_ms`, it hands the current a11y snapshot plus `intent` to the resolver, which returns a fresh candidate. A successful heal is written back to the bundle and emitted as a visible `heal` event.

```python
class Locator(BaseModel):
    strategy: Literal["role", "test_id", "label", "placeholder", "text", "css"]
    value: str
    # for strategy == "role": the accessible name
    name: str | None = None
    exact: bool = False

class LocatorBundle(BaseModel):
    intent: str                      # natural language: "the settings gear icon, top right"
    candidates: list[Locator]        # ordered, most-preferred first. len >= 1
    healed_at: datetime | None = None
    heal_count: int = 0
```

Ordering preference when a module produces candidates: `test_id` > `role` > `label` > `placeholder` > `text` > `css`. CSS is last-resort and must never be a bare tag or nth-child chain.

---

## 3. Workflow artifact (the thing teaching produces, call time consumes)

```python
class StepKnowledge(BaseModel):
    """Captured during rehearsal. This is what QA is grounded in."""
    page_url: str
    page_title: str
    a11y_digest: str          # trimmed accessibility tree, <= 4000 chars
    visible_text: str         # trimmed, <= 3000 chars
    screenshot_path: str | None = None
    observed_effect: str      # what changed after the action, one sentence
    captured_at: datetime

class Step(BaseModel):
    id: str                   # stable slug, e.g. "open-settings"
    index: int                # 0-based position at freeze time
    action: ActionType
    intent: str               # human-readable purpose of this step
    locator: LocatorBundle | None = None    # None only for NAVIGATE
    value: str | None = None                # text for TYPE, option for SELECT, url for NAVIGATE
    narration_hint: str                     # seed for the narrator, NOT the final text
    risk: RiskLevel = RiskLevel.SAFE
    knowledge: StepKnowledge | None = None  # populated by rehearsal
    timeout_ms: int = 8000

class WorkflowSpec(BaseModel):
    id: str                   # slug
    version: int = 1
    title: str
    description: str
    target_domain: str        # e.g. "mail.google.com" — enforced by the guard
    entry_url: str
    steps: list[Step]
    taught_at: datetime
    rehearsal_passed: bool    # MUST be True before a spec may be run at call time
    source_utterance: str     # the raw teaching input, kept for provenance
```

Persistence: `workflows/{id}.v{version}.json`, plain `model_dump_json(indent=2)`.

---

## 4. Runtime state

```python
class StepRecord(BaseModel):
    step_id: str
    status: StepStatus
    started_at: datetime | None = None
    ended_at: datetime | None = None
    error: str | None = None
    healed: bool = False

class SessionState(BaseModel):
    session_id: str
    workflow_id: str
    cursor: int                       # index of the step currently at hand
    state: RunState
    records: list[StepRecord]
    interrupt_count: int = 0
    transcript: list["ChatTurn"] = []
```

**The cursor invariant — the single most important rule in this project:**

> Handling an interruption of kind `QUESTION` MUST NOT modify `cursor`. Only `SKIP`, `JUMP`, and step completion may modify `cursor`. Any code path that mutates the cursor while answering a question is a bug, regardless of how the demo looks.

---

## 5. Events — the bus between runtime and UI

Everything the user sees is an event. One WebSocket, JSON frames, this shape:

```python
class Event(BaseModel):
    type: Literal[
        "narration",      # agent speaking about the walkthrough
        "step_start", "step_done", "step_failed",
        "heal",           # locator self-healed, visible on purpose
        "interrupt_received", "answer", "resumed",
        "plan_changed",   # cursor moved by an interruption
        "blocked",        # safety guard refused an action
        "run_started", "run_completed", "run_aborted",
        "teach_progress", "teach_question", "teach_complete",
        "error",
    ]
    session_id: str
    ts: datetime
    text: str | None = None       # human-readable payload
    step_id: str | None = None
    cursor: int | None = None
    data: dict = {}               # type-specific extras

class ChatTurn(BaseModel):
    role: Literal["agent", "customer"]
    text: str
    ts: datetime
    during_step: str | None = None
```

Inbound from UI is exactly two message shapes:
```json
{"kind": "start_run", "workflow_id": "gmail-signature"}
{"kind": "user_message", "text": "wait, what does that toggle do?"}
```

---

## 6. Module interfaces

Each delegate implements exactly these signatures. Nothing more is public.

### M1 `browser/driver.py`
```python
class Driver:
    async def start(self, entry_url: str, storage_state: str | None) -> None
    async def stop(self) -> None
    async def snapshot(self) -> PageSnapshot          # a11y digest + text + url + title
    async def screenshot(self, path: str) -> str
    async def act(self, step: Step, resolver: "Resolver", guard: "Guard") -> ActResult
    async def find(self, bundle: LocatorBundle, timeout_ms: int) -> Handle | None

class PageSnapshot(BaseModel):
    url: str
    title: str
    a11y_digest: str
    visible_text: str

class ActResult(BaseModel):
    ok: bool
    healed: bool = False
    error: str | None = None
    effect: str = ""          # observed diff summary, one sentence
```
`act()` is the ONLY place actions happen. It calls `guard.check()` before touching the page and raises `BlockedAction` if refused. On locator miss it calls `resolver.heal()` exactly once, retries, then fails.

### M2 `browser/resolver.py`
```python
class Resolver:
    async def resolve(self, intent: str, snap: PageSnapshot) -> LocatorBundle
    async def heal(self, bundle: LocatorBundle, snap: PageSnapshot) -> LocatorBundle | None
```

### M3 `teach/compiler.py`
```python
async def compile_workflow(utterance: str, site_hint: str) -> DraftWorkflow

class DraftWorkflow(BaseModel):
    title: str
    target_domain: str
    entry_url: str
    steps: list[DraftStep]        # action + intent + value + narration_hint, no locators
    ambiguities: list[str]        # questions to ask the human. May be empty.
```

### M4 `teach/rehearser.py`
```python
async def rehearse(draft: DraftWorkflow, driver: Driver, resolver: Resolver,
                   guard: Guard, emit: EmitFn) -> WorkflowSpec
```
Drives the live site, resolves each draft step to a `LocatorBundle`, captures `StepKnowledge`, sets `rehearsal_passed`. Emits `teach_progress` / `teach_question`.

### M5 `runtime/orchestrator.py`
```python
class Orchestrator:
    def __init__(self, spec: WorkflowSpec, driver: Driver, resolver: Resolver,
                 narrator: Narrator, interrupter: Interrupter, qa: QA,
                 guard: Guard, emit: EmitFn)
    async def run(self) -> SessionState
    def submit_user_message(self, text: str) -> None    # non-blocking, enqueues
    @property
    def state(self) -> SessionState
```
The run loop, normative:
```
state = RUNNING
while cursor < len(steps) and state == RUNNING:
    await drain_events()          # may answer questions, may move cursor, may abort
    if cursor >= len(steps) or state != RUNNING: break
    step = steps[cursor]
    emit(step_start); await narrator.narrate(step); result = await driver.act(step,...)
    await drain_events()          # interruption arriving mid-step is handled BEFORE advancing
    record(result)
    if result.ok: cursor += 1
    else: handle_failure(step, result)
```
`drain_events()` loops until the queue is empty — that is what makes consecutive interruptions free.

### M6 `runtime/narrator.py`
```python
class Narrator:
    async def narrate(self, step: Step, snap: PageSnapshot) -> str   # emits, returns text
    async def resume_line(self, step: Step, cursor: int) -> str       # "back to it — step 3 of 5..."
```
Must use the live snapshot, not only `narration_hint`. Canned output is a scoring failure.

### M7 `runtime/interrupt.py`
```python
async def classify(text: str, spec: WorkflowSpec, cursor: int) -> InterruptDecision

class InterruptDecision(BaseModel):
    kind: InterruptKind
    target_step_index: int | None = None    # for JUMP/SKIP
    rationale: str
```

### M8 `runtime/qa.py`
```python
class QA:
    async def answer(self, question: str, spec: WorkflowSpec, cursor: int,
                     live: PageSnapshot) -> Answer

class Answer(BaseModel):
    text: str
    grounded: bool          # False => the answer said "I don't know"
    sources: list[str]      # step ids / "live_page" used
```
Grounding rule: answer from `spec.steps[*].knowledge` + `live` ONLY. If unsupported, return `grounded=False` and text that says so plainly. Guessing is worse than declining.

### M9 `safety/guard.py`
```python
class Guard:
    def __init__(self, allowed_domains: list[str])
    def check(self, step: Step, snap: PageSnapshot) -> GuardVerdict

class GuardVerdict(BaseModel):
    allowed: bool
    risk: RiskLevel
    reason: str

class BlockedAction(Exception): ...
```
Blocks: off-allowlist navigation; any step whose resolved element name/text matches the destructive vocabulary (send, delete permanently, empty trash, buy, purchase, publish, deactivate, unsubscribe all, confirm payment). Blocked actions emit a `blocked` event and are narrated aloud — the refusal is a feature we show the judge.

### M10 `store.py`
```python
async def save_workflow(spec: WorkflowSpec) -> str
async def load_workflow(workflow_id: str, version: int | None = None) -> WorkflowSpec
async def list_workflows() -> list[WorkflowSummary]
```

### M11 `server.py`
FastAPI. `GET /` serves the UI. `WS /ws/{session_id}` speaks §5. `GET /api/workflows`. Browser view: CDP screencast frames relayed as base64 on the same socket, event type `frame` (exempt from the §5 enum).

### shared `llm.py`
```python
async def complete(system: str, user: str, json_schema: dict | None = None,
                   max_tokens: int = 1024) -> str | dict
```
One retry on transient error. On JSON mode, strip fences before parsing.

---

## 7. Conventions delegates must follow

- Pydantic v2 (`model_validate`, `model_dump_json`), not v1.
- No bare `except:`. Catch specific, re-raise with context.
- Every public function gets a docstring with one usage example.
- Timeouts everywhere; nothing may hang a demo.
- Never `time.sleep`. `await asyncio.sleep`.
- No secrets in code. `.env` via `pydantic-settings`.
- Tests use the fakes in `tests/fakes.py` (FakeDriver, FakeLLM) — never a real browser or real model.

---

## Changelog
- v1 — initial freeze. Execution policy: saved locator first, LLM self-heal on miss.
