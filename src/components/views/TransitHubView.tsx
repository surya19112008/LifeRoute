/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Truck,
  Thermometer,
  ShieldAlert,
  Compass,
  Radio,
  Clock,
  ArrowRight,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { TransitMapComponent, VehiclePlaceholder } from '../TransitMapComponent';
import { TransitMission } from '../../types';
import { useRealtimeTransits } from '../../hooks/useRealtimeTransits';

interface TransitHubViewProps {
  onOpenLiveTracker: (mission?: TransitMission) => void;
  onOpenProtocol: () => void;
}

export const TransitHubView: React.FC<TransitHubViewProps> = ({
  onOpenLiveTracker,
  onOpenProtocol,
}) => {
  const { transits, addTransit, updateTransitStatus, deleteTransit } = useRealtimeTransits();
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(
    transits.length > 0 ? transits[0].id : null
  );

  // New Dispatch Form Modal State
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [organ, setOrgan] = useState('Heart (Cardiopulmonary)');
  const [code, setCode] = useState('POLICE-ESCORT-18');
  const [origin, setOrigin] = useState('Regional Trauma Center KGH');
  const [destination, setDestination] = useState('Apollo Specialty Transplant OR');
  const [eta, setEta] = useState('14 min');
  const [urgency, setUrgency] = useState('Critical Tier 1');
  const [speed, setSpeed] = useState('74 km/h');

  const selectedMission =
    transits.find((t) => t.id === selectedMissionId) || (transits.length > 0 ? transits[0] : null);

  const handleCreateDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await addTransit({
      code: code.trim() || `CONVOY-${Math.floor(1000 + Math.random() * 9000)}`,
      organ,
      status: 'In Transit · Green Corridor Active',
      origin: origin.trim(),
      destination: destination.trim(),
      eta: eta.trim() || '15 min',
      temp: '4.0°C',
      urgency,
      speed: speed.trim() || '70 km/h',
      battery: '94%',
    });
    setSelectedMissionId(created.id);
    setIsDispatchModalOpen(false);
  };

  return (
    <div className="space-y-4 py-2">
      {/* Top Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Emergency Transit Hub
          </h2>
          <p className="text-xs text-slate-500">
            Real-time organ dispatch & green corridor telemetry
          </p>
        </div>
        <button
          onClick={() => setIsDispatchModalOpen(true)}
          className="min-h-[36px] px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Dispatch Organ</span>
        </button>
      </div>

      {/* Visual Interactive Map Component */}
      <TransitMapComponent
        onVehicleSelect={(veh: VehiclePlaceholder) => {
          const match = transits.find((t) => t.code === veh.code);
          if (match) setSelectedMissionId(match.id);
        }}
        onOpenLivePodTracker={() => onOpenLiveTracker(selectedMission || undefined)}
      />

      {/* Hero Transit Capsule Card */}
      {selectedMission ? (
        <div className="rounded-3xl bg-slate-900 text-white p-5 relative overflow-hidden shadow-lg border border-slate-800">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-teal-300 font-bold tracking-wider uppercase">
                Police Escort: {selectedMission.code}
              </span>
              <span className="text-xs font-bold bg-white/10 px-2 py-0.5 rounded-lg text-emerald-300">
                {selectedMission.status.split('·')[0]}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold">{selectedMission.organ}</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                From {selectedMission.origin} → {selectedMission.destination}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Temperature</span>
                <span className="text-sm font-extrabold text-teal-300 font-mono">
                  {selectedMission.temp || '4.0°C'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Time to OR</span>
                <span className="text-sm font-extrabold text-white font-mono">
                  {selectedMission.eta}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Battery</span>
                <span className="text-sm font-extrabold text-emerald-400 font-mono">
                  {selectedMission.battery || '94%'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onOpenLiveTracker(selectedMission)}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Open Real-Time Transit Pod Tracker</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-50 border border-slate-200/90 p-5 text-center space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">No Active Organ Transits</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Live dispatches between donor trauma center and recipient OR appear here.
            </p>
          </div>
          <button
            onClick={() => setIsDispatchModalOpen(true)}
            className="py-2 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Emergency Transit Mission</span>
          </button>
        </div>
      )}

      {/* Active Missions List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Live Network Dispatch Missions
          </h4>
          <span className="text-[11px] text-teal-700 font-semibold">
            {transits.length} active
          </span>
        </div>

        <div className="space-y-2">
          {transits.map((item) => {
            const isSelected = (selectedMission?.id || '') === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedMissionId(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-teal-50/50 border-teal-300 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 block">
                        {item.organ}
                      </span>
                      <span className="text-[10px] font-mono text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded font-semibold">
                        {item.code}
                      </span>
                    </div>
                    <span className="text-[11px] text-teal-700 font-medium">
                      {item.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-900">
                      ETA {item.eta}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {item.speed} · {item.temp}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="truncate max-w-[45%] font-medium">{item.origin}</span>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                  <span className="truncate max-w-[45%] text-right font-medium text-slate-700">
                    {item.destination}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Protocol Card */}
      <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-center justify-between">
        <div className="text-xs">
          <span className="font-bold text-teal-900 block">
            How LifeRoute green corridors work
          </span>
          <span className="text-[11px] text-teal-700">
            Certified protocols with emergency traffic control
          </span>
        </div>
        <button
          onClick={onOpenProtocol}
          className="text-xs font-bold text-teal-800 underline cursor-pointer"
        >
          View Guide
        </button>
      </div>

      {/* Dispatch Modal */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold">Dispatch New Organ Transit Mission</h3>
              </div>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDispatch} className="p-5 overflow-y-auto space-y-3.5 text-xs text-slate-700">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Organ Pledged / Transported
                </label>
                <select
                  value={organ}
                  onChange={(e) => setOrgan(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-teal-600"
                >
                  <option value="Heart (Cardiopulmonary)">Heart (Cardiopulmonary)</option>
                  <option value="Kidneys (Dual Renal Graft)">Kidneys (Dual Renal Graft)</option>
                  <option value="Liver (Split-Graft)">Liver (Split-Graft)</option>
                  <option value="Lungs (Ex-Vivo Perfusion)">Lungs (Ex-Vivo Perfusion)</option>
                  <option value="Corneal Tissue (Pair)">Corneal Tissue (Pair)</option>
                  <option value="Skin & Bone Tissue">Skin & Bone Tissue</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Convoy / Vehicle Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. CONVOY-9042, MEDVAC-101"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-teal-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Origin Hospital / Trauma Center
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. King George Hospital (KGH) Trauma Center"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-teal-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Destination Recipient OR
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Apollo Health City Transplant OT"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-teal-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    ETA to OR
                  </label>
                  <input
                    type="text"
                    value={eta}
                    onChange={(e) => setEta(e.target.value)}
                    placeholder="e.g. 14 min"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    Corridor Urgency
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-teal-600"
                  >
                    <option value="Critical Tier 1">Critical Tier 1</option>
                    <option value="Stat Priority">Stat Priority</option>
                    <option value="Cold-Chain Scheduled">Cold-Chain Scheduled</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Launch Live Escort</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
