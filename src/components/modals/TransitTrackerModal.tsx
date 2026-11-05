import React, { useState, useEffect } from 'react';
import {
  X,
  Truck,
  Thermometer,
  Battery,
  MapPin,
  Compass,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { TransitMission } from '../../types';

interface TransitTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: TransitMission | null;
  onUpdateStatus?: (id: string, newStatus: string) => void;
}

export const TransitTrackerModal: React.FC<TransitTrackerModalProps> = ({
  isOpen,
  onClose,
  mission,
  onUpdateStatus,
}) => {
  const [transitProgress, setTransitProgress] = useState(62);
  const [liveTemp, setLiveTemp] = useState(4.2);

  useEffect(() => {
    if (!isOpen) return;
    if (mission?.temp) {
      const parsed = parseFloat(mission.temp);
      if (!isNaN(parsed)) setLiveTemp(parsed);
    }
    const interval = setInterval(() => {
      setTransitProgress((prev) => (prev >= 98 ? 62 : prev + 1));
      setLiveTemp((prev) => Number((prev + (Math.random() * 0.1 - 0.05)).toFixed(1)));
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen, mission]);

  if (!isOpen) return null;

  const currentMission: TransitMission = mission || {
    id: 'TX-LIVE',
    code: 'CONVOY-GREEN-14',
    organ: 'Kidney (Renal Graft)',
    status: 'In Transit · Police Green Corridor Active',
    origin: 'Trauma Center KGH',
    destination: 'Apollo Specialty Surgical OR',
    eta: '14 min',
    temp: '4.2°C',
    urgency: 'Critical Tier 1',
    speed: '72 km/h',
    battery: '88%',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-teal-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-800 flex items-center justify-center text-teal-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white leading-tight">
                  LifeRoute Transit Corridor
                </h3>
                <span className="text-[10px] font-mono font-bold bg-teal-800 text-teal-300 px-2 py-0.5 rounded">
                  {currentMission.code}
                </span>
              </div>
              <p className="text-xs text-teal-200">
                Organ: {currentMission.organ} · {currentMission.urgency}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-slate-700">
          {/* Smart Capsule Device Showcase */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 relative">
            <img
              src="/src/assets/images/organ_transit_capsule_1793892711236.jpg"
              alt="Medical Organ Transit Smart Container"
              referrerPolicy="no-referrer"
              className="w-full h-44 object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-md text-white p-2.5 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold">LifeRoute Orbit Perfusion Pod</span>
              </div>
              <span className="font-mono text-teal-300 font-bold">{liveTemp}°C Hypothermic</span>
            </div>
          </div>

          {/* Telemetry Sensor Metrics Strip */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-2xl bg-teal-50 border border-teal-100 text-center">
              <span className="text-[10px] font-bold text-teal-700 block uppercase">
                Perfusion Temp
              </span>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Thermometer className="w-4 h-4 text-teal-600" />
                <span className="text-base font-extrabold text-teal-900 font-mono">
                  {liveTemp}°C
                </span>
              </div>
              <span className="text-[9px] text-teal-600 block">Cold-Chain Guard</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                Pod Battery
              </span>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Battery className="w-4 h-4 text-emerald-600" />
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  {currentMission.battery || '92%'}
                </span>
              </div>
              <span className="text-[9px] text-slate-500 block">12h runtime left</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">
                Transit Speed
              </span>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Compass className="w-4 h-4 text-cyan-600" />
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  {currentMission.speed || '68 km/h'}
                </span>
              </div>
              <span className="text-[9px] text-slate-500 block">Escort Tracking</span>
            </div>
          </div>

          {/* Route Progression */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                Live Mission Corridor
              </span>
              <span className="text-teal-700 font-bold font-mono">
                ETA: {currentMission.eta}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${transitProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <div>
                <span className="font-bold text-slate-800 block">{currentMission.origin}</span>
                <span>Dispatch / Departure Point</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-800 block">{currentMission.destination}</span>
                <span>Recipient OR Prepared</span>
              </div>
            </div>
          </div>

          {/* Traffic Signal Automation Notice */}
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-950">
            <Radio className="w-5 h-5 text-emerald-700 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              <strong>Green Corridor Preemption Active:</strong> Municipal emergency traffic preemption has prioritized this mission. All signals along the corridor route held green for organ preservation.
            </p>
          </div>

          {onUpdateStatus && currentMission.status !== 'Delivered to OR' && (
            <button
              onClick={() => onUpdateStatus(currentMission.id, 'Delivered to OR')}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Arrived & Handed Over to Surgical Team</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Close Transit View
          </button>
        </div>
      </div>
    </div>
  );
};
