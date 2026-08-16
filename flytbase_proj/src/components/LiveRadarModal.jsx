import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { wsService } from '../services/websocketService';
import { 
  Compass, 
  X, 
  Radio, 
  BatteryCharging, 
  Wind, 
  ShieldCheck, 
  Activity, 
  Play, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export default function LiveRadarModal({ isOpen, onClose }) {
  const { activeProject } = useProject();
  const [drones, setDrones] = useState([
    { id: 'SPIDER-1', name: 'Matrice 350 RTK (Alpha)', lat: 40.7484, lng: -73.9857, alt: '120m', speed: '14 m/s', batt: 88, status: 'In Flight', corridor: 'Corridor Alpha' },
    { id: 'SPIDER-2', name: 'StarkPort Dock 4 Pod', lat: 40.7589, lng: -73.9851, alt: '0m', speed: '0 m/s', batt: 100, status: 'Docked / Standby', corridor: 'Hangar 2' },
    { id: 'SPIDER-3', name: 'Matrice 30T (Thermal)', lat: 40.7614, lng: -73.9776, alt: '95m', speed: '11 m/s', batt: 64, status: 'In Flight', corridor: 'Corridor Beta' }
  ]);

  const [lastTelemetryMessage, setLastTelemetryMessage] = useState(null);

  if (!isOpen || !activeProject) return null;

  const handleSimulateHeartbeat = () => {
    wsService.simulateLiveEvent(activeProject);
    setLastTelemetryMessage(`Live BVLOS Telemetry pulse dispatched for ${activeProject.client}`);
    setTimeout(() => setLastTelemetryMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="card-clean rounded-2xl w-full max-w-3xl p-6 border border-zinc-800 bg-[#0E1119] shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={() => onClose(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                StarkPort Live Telemetry & Sky-Corridor Radar
              </h3>
              <span className="badge-clean bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live BVLOS Stream
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Real-time avionics telemetry for {activeProject.client} autonomous drone fleet.
            </p>
          </div>
        </div>

        {/* Radar Visualizer Canvas / Grid */}
        <div className="relative h-64 bg-[#07090F] rounded-xl border border-zinc-800 overflow-hidden flex items-center justify-center">
          
          {/* Radar Circles */}
          <div className="absolute w-52 h-52 rounded-full border border-cyan-500/15" />
          <div className="absolute w-36 h-36 rounded-full border border-cyan-500/25" />
          <div className="absolute w-20 h-20 rounded-full border border-cyan-500/35" />
          <div className="absolute w-full h-[1px] bg-cyan-500/10" />
          <div className="absolute h-full w-[1px] bg-cyan-500/10" />

          {/* Radar Sweep Line */}
          <div className="absolute w-28 h-28 border-r-2 border-cyan-400/40 rounded-full radar-sweep pointer-events-none origin-bottom-right" />

          {/* Drones on Radar */}
          <div className="absolute top-16 left-28 flex items-center gap-1 bg-zinc-900/90 border border-cyan-500/50 px-2 py-1 rounded-md text-[10px] text-cyan-300 shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>SPIDER-1 (120m)</span>
          </div>

          <div className="absolute bottom-20 right-32 flex items-center gap-1 bg-zinc-900/90 border border-emerald-500/50 px-2 py-1 rounded-md text-[10px] text-emerald-300 shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>DOCK-4 (Standby)</span>
          </div>

          <div className="absolute top-24 right-20 flex items-center gap-1 bg-zinc-900/90 border border-amber-500/50 px-2 py-1 rounded-md text-[10px] text-amber-300 shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>SPIDER-3 (Thermal)</span>
          </div>

          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-zinc-500">
            GEOLOCATION: 40.7128° N, 74.0060° W • 5G ULTRA-WIDEBAND TELEMETRY
          </div>
        </div>

        {/* Telemetry Drones Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          {drones.map(drone => (
            <div key={drone.id} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white font-mono">{drone.id}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                  drone.status === 'In Flight' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-zinc-800 text-zinc-300'
                }`}>
                  {drone.status}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate">{drone.name}</p>
              <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-zinc-400 pt-1 border-t border-zinc-850">
                <span>Alt: {drone.alt}</span>
                <span>Speed: {drone.speed}</span>
                <span>Batt: {drone.batt}%</span>
                <span>{drone.corridor}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Actions & Feedback */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          <span className="text-xs text-zinc-400 font-mono">
            {lastTelemetryMessage ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {lastTelemetryMessage}
              </span>
            ) : (
              'WebSockets channel syncing flight telemetry across clients.'
            )}
          </span>

          <button
            onClick={handleSimulateHeartbeat}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold border border-zinc-700 transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate Live Event</span>
          </button>
        </div>

      </div>
    </div>
  );
}
