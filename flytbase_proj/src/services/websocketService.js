/**
 * Real-Time WebSockets & Broadcast Engine for Spider-Sync
 * Uses BroadcastChannel API for multi-tab zero-config synchronization
 * and emits simulated live drone flight & delivery telemetry events.
 */

class WebSocketSyncService {
  constructor() {
    this.channelName = 'spidersync_realtime_bus';
    this.channel = typeof window !== 'undefined' && 'BroadcastChannel' in window
      ? new BroadcastChannel(this.channelName)
      : null;
    this.listeners = new Set();
    this.isConnected = true;
    this.simulationTimer = null;

    if (this.channel) {
      this.channel.onmessage = (event) => {
        this.notify(event.data);
      };
    }
  }

  // Subscribe to real-time events
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Broadcast an event to all tabs and local listeners
  broadcast(type, payload) {
    const message = {
      type,
      payload,
      timestamp: new Date().toISOString(),
      senderId: typeof window !== 'undefined' ? window.name || 'tab-main' : 'server'
    };

    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (e) {
        console.warn('BroadcastChannel error:', e);
      }
    }
    // Also notify local listeners
    this.notify(message);
  }

  notify(data) {
    this.listeners.forEach((callback) => {
      try {
        callback(data);
      } catch (err) {
        console.error('WebSocket subscriber error:', err);
      }
    });
  }

  // Trigger a simulated incoming live flight event (e.g. battery swap done, telemetry heartbeat)
  simulateLiveEvent(project) {
    const liveEvents = [
      {
        type: 'TELEMETRY_PING',
        summary: `Autonomous BVLOS telemetry signal healthy (142ms latency, 99.8% signal) on ${project.client}.`,
        author: 'FlytBase Cloud Edge',
        sentiment: 'positive'
      },
      {
        type: 'DOCKING_SUCCESS',
        summary: `Automated battery hot-swap cycle completed in 48 seconds at StarkPort Pod 4.`,
        author: 'Peter Parker (Lead Delivery)',
        sentiment: 'positive'
      },
      {
        type: 'WEATHER_ALERT',
        summary: `Wind shear gust of 22 knots recorded along Corridor Alpha. Adaptive flight stabilizer engaged.`,
        author: 'Ghost-Spider Telemetry',
        sentiment: 'warning'
      }
    ];

    const randomEvent = liveEvents[Math.floor(Math.random() * liveEvents.length)];
    this.broadcast('LIVE_FLIGHT_UPDATE', {
      projectId: project.id,
      ...randomEvent
    });
  }
}

export const wsService = new WebSocketSyncService();
