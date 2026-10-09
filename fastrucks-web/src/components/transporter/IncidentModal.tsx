import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IncidentType } from '../../types';
import { AlertTriangle, Coffee, Wrench, ShieldAlert, Clock, X, MapPin, CheckCircle2 } from 'lucide-react';

interface IncidentModalProps {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({ jobId, isOpen, onClose }) => {
  const { reportIncident, sendChatMessage, currentUser } = useApp();

  const [type, setType] = useState<IncidentType>('rest_meal_stop');
  const [title, setTitle] = useState('Driver Meal & Rest Break');
  const [description, setDescription] = useState('Driver taking a mandatory fatigue rest break, meal stop, and tire/lashing check.');
  const [locationName, setLocationName] = useState('Delamere Farm Rest Stop, Naivasha');
  const [durationMins, setDurationMins] = useState(25);
  const [notifyViaChat, setNotifyViaChat] = useState(true);

  if (!isOpen) return null;

  const incidentPresets: Array<{
    type: IncidentType;
    label: string;
    icon: React.ReactNode;
    defaultTitle: string;
    defaultDesc: string;
    defaultDuration: number;
    color: string;
  }> = [
    {
      type: 'rest_meal_stop',
      label: 'Meal / Rest Stop (Fatigue Break)',
      icon: <Coffee className="w-4 h-4" />,
      defaultTitle: 'Driver Meal & Rest Break',
      defaultDesc: 'Driver stopped for meal, restroom break, and vehicle safety walkthrough. Vehicle stationary.',
      defaultDuration: 30,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-300 dark:border-emerald-700',
    },
    {
      type: 'weighbridge_queue',
      label: 'KeNHA Weighbridge Queue',
      icon: <Clock className="w-4 h-4" />,
      defaultTitle: 'KeNHA Weighbridge Inspection Delay',
      defaultDesc: 'Heavy commercial vehicle queue at weighbridge scale. Awaiting axle-weight clearance.',
      defaultDuration: 45,
      color: 'bg-sky-500/10 text-sky-600 border-sky-300 dark:border-sky-700',
    },
    {
      type: 'flat_tire',
      label: 'Puncture / Flat Tire',
      icon: <Wrench className="w-4 h-4" />,
      defaultTitle: 'Puncture / Wheel Change',
      defaultDesc: 'Rear tire puncture occurred. Driver replacing with spare wheel on safe road shoulder.',
      defaultDuration: 40,
      color: 'bg-amber-500/10 text-amber-600 border-amber-300 dark:border-amber-700',
    },
    {
      type: 'mechanical_breakdown',
      label: 'Mechanical Issue / Fault',
      icon: <AlertTriangle className="w-4 h-4" />,
      defaultTitle: 'Mechanical Check / Engine Sensor',
      defaultDesc: 'Air pressure sensor warning / cooling check underway by driver and road technician.',
      defaultDuration: 60,
      color: 'bg-rose-500/10 text-rose-600 border-rose-300 dark:border-rose-700',
    },
    {
      type: 'police_clearance',
      label: 'Police / Road Safety Check',
      icon: <ShieldAlert className="w-4 h-4" />,
      defaultTitle: 'Traffic Police Roadside Inspection',
      defaultDesc: 'National Transport and Safety Authority (NTSA) / Police document and inspection check.',
      defaultDuration: 20,
      color: 'bg-purple-500/10 text-purple-600 border-purple-300 dark:border-purple-700',
    },
  ];

  const handleSelectPreset = (preset: typeof incidentPresets[0]) => {
    setType(preset.type);
    setTitle(preset.defaultTitle);
    setDescription(preset.defaultDesc);
    setDurationMins(preset.defaultDuration);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportIncident(jobId, {
      type,
      title,
      description,
      locationName,
      durationEstimateMins: durationMins,
    });

    if (notifyViaChat) {
      sendChatMessage(
        jobId,
        `⚠️ [TRANSIT LOG]: ${title} at ${locationName}. Expected duration: ~${durationMins} mins. Details: ${description}`
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Quick Transit &amp; Stoppage Logger</h3>
              <p className="text-xs text-amber-100">Notify supplier of reason for vehicle stop (&gt;10 min rule)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select Incident / Stoppage Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {incidentPresets.map((preset) => (
                <button
                  key={preset.type}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition ${
                    type === preset.type
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/40'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${preset.color}`}>{preset.icon}</div>
                  <span className="truncate">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Current Highway Stop Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Delamere Farm Rest Stop, Naivasha or Gilgil Weighbridge"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Title & Duration */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Headline / Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Est. Mins
              </label>
              <input
                type="number"
                min="5"
                max="360"
                value={durationMins}
                onChange={(e) => setDurationMins(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Detailed Notes for Supplier
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Checkbox: Post to Chat */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="notifyChat"
              checked={notifyViaChat}
              onChange={(e) => setNotifyViaChat(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <label htmlFor="notifyChat" className="text-xs text-slate-600 dark:text-slate-400">
              Post an automatic notification update to the supplier in-app chat thread
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-lg shadow-amber-500/20"
            >
              Broadcast Stoppage to Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
