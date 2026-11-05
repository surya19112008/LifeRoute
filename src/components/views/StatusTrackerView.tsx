import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Radio,
  MapPin,
  Truck,
  RotateCcw,
  Play,
  FileCheck,
  AlertTriangle,
  Building2,
  Phone,
  Eye,
  Heart,
  ExternalLink,
  ChevronRight,
  Battery,
  Thermometer,
  Compass,
} from 'lucide-react';
import { DonorProfile } from '../../types';

interface StatusTrackerViewProps {
  donor: DonorProfile;
  onOpenQR: () => void;
  onOpenTransitPodModal: () => void;
}

export const StatusTrackerView: React.FC<StatusTrackerViewProps> = ({
  donor,
  onOpenQR,
  onOpenTransitPodModal,
}) => {
  const [activeSegment, setActiveSegment] = useState<'registry' | 'live_transit'>('live_transit');
  const [currentCheckpoint, setCurrentCheckpoint] = useState(3);
  const [timerCount, setTimerCount] = useState(16 * 60 + 24); // 16 min 24 sec

  // Countdown timer simulation for live transit
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerCount((prev) => (prev > 0 ? prev - 1 : 16 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const transitCheckpoints = [
    {
      id: 'cp_1',
      stepNumber: '01',
      title: 'Brain-Death Certified',
      time: '08:45 AM',
      location: 'KGH Trauma ICU, Maharanipeta, Visakhapatnam',
      status: 'completed',
      detail: 'Certified under statutory THOTA criteria by 2 independent critical care neurologists at King George Hospital.',
      officer: 'Dr. K. S. Rao, MD (Chief Neurologist, KGH Vizag)',
    },
    {
      id: 'cp_2',
      stepNumber: '02',
      title: 'Organ Procurement & Pod Seal',
      time: '09:12 AM',
      location: 'KGH Surgical Trauma OT-2',
      status: 'completed',
      detail: 'Donor Kidney (Right Graft) flushed with preservation solution and sealed in LifeRoute Orbit-P pod at 4.2°C.',
      officer: 'Dr. P. V. Ramana, MS, MCh (Transplant Surgeon, AMC Vizag)',
    },
    {
      id: 'cp_3',
      stepNumber: '03',
      title: 'Vizag Green Corridor Dispatch',
      time: '09:28 AM',
      location: 'KGH Emergency Gate to Jagadamba Junction',
      status: 'completed',
      detail: 'Visakhapatnam City Traffic Police deployed. 12 intersections preempted to green along the BRTS corridor.',
      officer: 'Sub-Inspector V. Naidu (Vizag Traffic Control)',
    },
    {
      id: 'cp_4',
      stepNumber: '04',
      title: 'BRTS Corridor Rapid Transit',
      time: 'LIVE NOW',
      location: 'Maddilapalem to Hanumanthawaka BRTS, Vizag',
      status: 'active',
      detail: 'Convoy traveling at 68 km/h. Continuous telemetry streaming: Perfusion 4.2°C, 96% humidity, 88% battery.',
      officer: 'AP Jeevandan Telemetry Server #AP-VIZAG-1',
    },
    {
      id: 'cp_5',
      stepNumber: '05',
      title: 'Recipient OR Sterile Custody Handover',
      time: 'ETA in 14 min',
      location: 'Apollo Hospitals, Health City, Arilova',
      status: 'upcoming',
      detail: 'Apollo transplant surgical team in scrub room. Immediate HLA cross-match confirmation and cold ischemia clock stop.',
      officer: 'Transplant Coordinator K. Padmavathi, RN (Apollo Vizag)',
    },
    {
      id: 'cp_6',
      stepNumber: '06',
      title: 'Vascular Anastomosis & Graft Re-perfusion',
      time: 'Estimated 10:15 AM',
      location: 'Transplant OT-1, Apollo Health City',
      status: 'upcoming',
      detail: 'Successful vascular connection and kidney graft re-vascularization to save Vizag recipient life.',
      officer: 'Surgical Team B (Dr. B. Prasad, MS)',
    },
  ];

  const advanceCheckpoint = () => {
    setCurrentCheckpoint((prev) => (prev < 5 ? prev + 1 : 0));
  };

  const resetCheckpoint = () => {
    setCurrentCheckpoint(3);
  };

  return (
    <div className="space-y-4 py-2">
      {/* Title & Segment Switcher */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Status Tracker
            </h2>
            <p className="text-xs text-slate-500">
              Live lifecycle status & dispatch monitoring
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telemetry Live</span>
          </div>
        </div>

        {/* Tab segmented control */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80 gap-1">
          <button
            onClick={() => setActiveSegment('live_transit')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSegment === 'live_transit'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Live Organ Transit Mission
          </button>
          <button
            onClick={() => setActiveSegment('registry')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSegment === 'registry'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Donor Registry Verification
          </button>
        </div>
      </div>

      {activeSegment === 'live_transit' ? (
        /* LIVE ORGAN TRANSIT CORRIDOR TRACKER */
        <div className="space-y-3.5">
          {/* Mission Telemetry Summary Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-lg space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-teal-300 font-bold uppercase tracking-wider">
                Emergency Dispatch #LR-TX-9042
              </span>
              <span className="text-xs font-mono font-extrabold text-white bg-teal-800/80 px-2.5 py-0.5 rounded-lg border border-teal-600/40">
                ETA {formatTime(timerCount)}
              </span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Kidney Graft Vizag Green Corridor Transit
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                KGH Maharanipeta → Apollo Health City, Arilova (14.2 km · Vizag BRTS)
              </p>
            </div>

            {/* Micro Sensors Strip */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Temperature</span>
                  <span className="font-mono font-bold text-white">4.2°C</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Speed</span>
                  <span className="font-mono font-bold text-white">78 km/h</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Pod Battery</span>
                  <span className="font-mono font-bold text-white">88%</span>
                </div>
              </div>
            </div>

            {/* Simulator Action Button */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                onClick={advanceCheckpoint}
                className="flex-1 py-2 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {currentCheckpoint === 5 ? 'Reset Simulation' : 'Advance to Next Checkpoint'}
                </span>
              </button>
              <button
                onClick={resetCheckpoint}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Reset to current live position"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenTransitPodModal}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs transition-colors"
              >
                Pod Image
              </button>
            </div>
          </div>

          {/* Sequential Checkpoints Timeline */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Transit Milestones & Chain of Custody
              </span>
              <span className="text-[11px] text-teal-700 font-mono font-semibold">
                Step {currentCheckpoint + 1} of 6
              </span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {transitCheckpoints.map((cp, idx) => {
                const isPassed = idx < currentCheckpoint;
                const isCurrent = idx === currentCheckpoint;

                return (
                  <div key={cp.id} className="relative group">
                    {/* Timeline Node */}
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white shadow-2xs text-[10px] font-bold ${
                        isPassed
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-teal-600 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <span>{cp.stepNumber}</span>
                      )}
                    </div>

                    {/* Checkpoint Details */}
                    <div
                      className={`min-w-0 p-3 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-teal-50/50 border-teal-200 shadow-xs'
                          : 'bg-white border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 leading-tight">
                          {cp.title}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                            isCurrent
                              ? 'bg-teal-700 text-white'
                              : 'text-slate-400 bg-slate-100'
                          }`}
                        >
                          {cp.time}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{cp.location}</span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                        {cp.detail}
                      </p>

                      <div className="text-[10px] text-slate-400 pt-1 mt-1 border-t border-slate-100 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-teal-600" />
                        <span>Signed by: {cp.officer}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* DONOR REGISTRY VERIFICATION TRACKER */
        <div className="space-y-3.5">
          {/* Certificate Badge */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-200 text-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">
                    Official National Donor Registry Certificate
                  </span>
                  <span className="text-[11px] text-emerald-800 font-mono">
                    ID #{donor.registryId} · Verified
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-white/80 px-2 py-1 rounded-lg border border-emerald-200">
                100% READY
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your anatomical gift declaration is fully synchronized across national transplant procurement systems and hospital emergency databases.
            </p>
          </div>

          {/* 5-Step Registry Milestones */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
              Registry Compliance Steps
            </span>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    1. First-Person Legal Authorization Signed
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Completed on {donor.registeredDate} · Cryptographic audit hash recorded
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    2. UNOS / NOTTO National Registry Synchronized
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Record ID: {donor.registryId} · Verified on {donor.lastVerifiedDate}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    3. Next-of-Kin Emergency Acknowledgement
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {donor.emergencyContacts?.filter((c) => c.notified).length || 0} of {donor.emergencyContacts?.length || 0} designated emergency contacts informed and verified
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    4. Trauma Intensive Care Integration
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Affiliated with {donor.hospitalAffiliation || 'Regional Trauma Center'} · Trauma protocol linked
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    5. Emergency Responder QR Scannable 24/7
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Offline cryptographic payload scannable by paramedics and trauma doctors
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Scan Trigger */}
          <button
            onClick={onOpenQR}
            className="w-full py-3 px-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Launch Emergency Responder QR Display</span>
          </button>
        </div>
      )}
    </div>
  );
};
