import React from 'react';
import { TransitTrip, Job } from '../../types';
import { useApp } from '../../context/AppContext';
import { Truck, MapPin, ShieldAlert, CheckCircle, Clock, AlertTriangle, Coffee, Compass } from 'lucide-react';

interface CorridorMapProps {
  trip: TransitTrip;
  job?: Job;
  compact?: boolean;
}

export const CorridorMap: React.FC<CorridorMapProps> = ({ trip, job, compact = false }) => {
  const { advanceTripCheckpoint, updateTripProgress, resolveIncident } = useApp();

  const unresolvedIncidents = trip.incidents.filter((i) => !i.isResolved);

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              GPS Satellite Telemetry (Northern Corridor)
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-1 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            {job ? `${job.origin} ➔ ${job.destination}` : 'Active Transit Corridor'}
          </h3>
          <p className="text-xs text-slate-400">
            Last ping: <span className="text-slate-200 font-medium">{trip.lastUpdated}</span> • Current location:{' '}
            <span className="text-amber-300 font-medium">{trip.currentLocationName}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs text-slate-400">Transit Progress</div>
            <div className="text-xl font-black text-amber-400">{trip.currentProgressPercent}%</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
            <Truck className="w-6 h-6 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-emerald-400 transition-all duration-700 ease-out"
            style={{ width: `${trip.currentProgressPercent}%` }}
          />
        </div>
        <div
          className="absolute -top-3 transform -translate-x-1/2 transition-all duration-700 pointer-events-none"
          style={{ left: `${Math.min(96, Math.max(4, trip.currentProgressPercent))}%` }}
        >
          <div className="bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-slate-900 animate-pulse">
            <Truck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Incidents Warning Banner if any */}
      {unresolvedIncidents.length > 0 && (
        <div className="mb-4 bg-amber-500/10 border border-amber-500/40 rounded-xl p-3.5 flex items-start gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Active Transit Advisory / Stoppage Reported
              </span>
              <span className="text-xs text-slate-400">{unresolvedIncidents[0].timestamp}</span>
            </div>
            <h4 className="text-sm font-semibold text-white mt-0.5">{unresolvedIncidents[0].title}</h4>
            <p className="text-xs text-slate-300 mt-1">{unresolvedIncidents[0].description}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] text-amber-200 bg-amber-500/20 px-2 py-0.5 rounded">
                Location: {unresolvedIncidents[0].locationName}
              </span>
              <button
                onClick={() => resolveIncident(trip.jobId, unresolvedIncidents[0].id)}
                className="text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-2.5 py-0.5 rounded transition"
              >
                Mark Cleared / Resumed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Corridor Visual Route representation */}
      <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 mb-4">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Route Checkpoints &amp; Waypoints</span>
          <span className="text-slate-500">A104 Northern Highway</span>
        </div>

        <div className="space-y-3">
          {trip.checkpoints.map((cp, idx) => {
            const isPassed = cp.passed;
            const isCurrent = !isPassed && (idx === 0 || trip.checkpoints[idx - 1]?.passed);

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 p-2.5 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-amber-500/10 border border-amber-500/30'
                    : isPassed
                    ? 'bg-slate-900/60'
                    : 'opacity-60'
                }`}
              >
                <div className="pt-0.5">
                  {isPassed ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-amber-500/30 text-amber-300 flex items-center justify-center animate-pulse">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-xs">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${isPassed ? 'text-slate-200' : isCurrent ? 'text-amber-300' : 'text-slate-400'}`}>
                      {cp.name}
                    </span>
                    {cp.kmFromStart !== undefined && (
                      <span className="text-xs text-slate-500 font-mono">+{cp.kmFromStart} km</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    {cp.isWeighbridge && (
                      <span className="text-[10px] bg-sky-900/40 text-sky-300 border border-sky-700/50 px-1.5 py-0.2 rounded font-medium">
                        KeNHA Axle Weighbridge
                      </span>
                    )}
                    {isPassed && cp.passedAt && (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Cleared at {cp.passedAt}
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[11px] text-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Vehicle currently in this sector
                      </span>
                    )}
                  </div>
                </div>

                {!isPassed && isCurrent && (
                  <button
                    onClick={() => advanceTripCheckpoint(trip.jobId, idx)}
                    className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg shadow transition shrink-0"
                  >
                    Clear Waypoint
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulation Controls for testing */}
      {!compact && (
        <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Live Simulation Tools:</span> Test route updates and checkpoint handshakes
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateTripProgress(trip.jobId, 10)}
              className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-2.5 py-1.5 rounded-lg transition"
            >
              +10% Progress
            </button>
            <button
              onClick={() => updateTripProgress(trip.jobId, -10)}
              className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-2.5 py-1.5 rounded-lg transition"
            >
              -10% Progress
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
