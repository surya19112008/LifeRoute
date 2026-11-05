import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
  ChevronRight,
  Play,
  RotateCcw,
  Sparkles,
  MapPin,
  AlertCircle,
  FileCheck,
  Radio,
} from 'lucide-react';
import { DonorProfile } from '../types';

interface StatusTrackerProps {
  donor: DonorProfile;
  onOpenDetailedTracker?: () => void;
  onOpenTransitHub?: () => void;
  onOpenQR?: () => void;
}

export type TrackerMode = 'registry' | 'transit';

export const StatusTracker: React.FC<StatusTrackerProps> = ({
  donor,
  onOpenDetailedTracker,
  onOpenTransitHub,
  onOpenQR,
}) => {
  const [trackerMode, setTrackerMode] = useState<TrackerMode>('registry');
  const [transitStep, setTransitStep] = useState(3); // 0 to 5
  const [isSimulating, setIsSimulating] = useState(false);

  // Registry Readiness Milestones
  const registryMilestones = [
    {
      id: 'reg_1',
      title: 'Legal Organ Pledge Signed',
      timestamp: `${donor.registeredDate} · 10:24 AM`,
      authority: 'NOTTO / AP Jeevandan Program Consent',
      status: 'completed',
      detail: 'Legally binding declaration under THOTA Act, 1994 (India) with cryptographic digital signature.',
    },
    {
      id: 'reg_2',
      title: 'National Database Synced',
      timestamp: `${donor.lastVerifiedDate} · 06:00 AM`,
      authority: `NOTTO & AP Jeevandan ID #${donor.registryId}`,
      status: 'completed',
      detail: 'Registry record synchronized with national organ procurement portal and Andhra Pradesh state servers.',
    },
    {
      id: 'reg_3',
      title: 'Next-of-Kin Confirmed',
      timestamp: `${donor.emergencyContacts?.filter((c) => c.notified).length || 0} of ${donor.emergencyContacts?.length || 0} Contacts Confirmed`,
      authority: 'Family Emergency Consensus',
      status: donor.emergencyContacts?.length ? 'completed' : 'pending',
      detail: donor.emergencyContacts?.length
        ? `Primary contact ${donor.emergencyContacts[0]?.name || 'designated next of kin'} confirmed your anatomical gift wishes.`
        : 'Register next-of-kin contacts to ensure medical consensus during triage.',
    },
    {
      id: 'reg_4',
      title: 'Trauma Network Linked',
      timestamp: 'Active & Verified',
      authority: donor.hospitalAffiliation,
      status: 'completed',
      detail: 'Advance directive and clinical parameters registered with KGH Vizag Intensive Care Unit.',
    },
    {
      id: 'reg_5',
      title: 'Emergency Dispatch Ready',
      timestamp: 'Armed 24/7',
      authority: 'LifeRoute Vizag Rapid Transit Protocol',
      status: 'active',
      detail: 'Offline scannable emergency QR code ready with instant Vizag City Police green corridor activation.',
    },
  ];

  // Active Emergency Transit Milestones (Mission #LR-TX-9042)
  const transitMilestones = [
    {
      id: 'tx_1',
      step: '01',
      title: 'Brain-Death Certified',
      time: '08:45 AM',
      location: 'KGH Trauma ICU, Maharanipeta, Vizag',
      status: 'completed',
      detail: 'Certified under statutory THOTA criteria by 2 independent neurologists at King George Hospital.',
    },
    {
      id: 'tx_2',
      step: '02',
      title: 'Surgical Recovery & Pod Seal',
      time: '09:12 AM',
      location: 'KGH Operation Theatre Suite 2',
      status: 'completed',
      detail: 'Donor Kidney sealed in LifeRoute Orbit-P container at 4.2°C hypothermic perfusion.',
    },
    {
      id: 'tx_3',
      step: '03',
      title: 'Green Corridor Departure',
      time: '09:28 AM',
      location: 'Jagadamba Junction · Vizag Police Escort',
      status: 'completed',
      detail: 'Vizag City Traffic Police deployed. 12 municipal traffic signals preempted to green towards Maddilapalem.',
    },
    {
      id: 'tx_4',
      step: '04',
      title: 'BRTS Corridor Rapid Transit',
      time: 'NOW (09:41 AM)',
      location: 'Maddilapalem to Hanumanthawaka BRTS',
      status: 'active',
      detail: 'Convoy traveling at 68 km/h. Pod temp stable at 4.2°C. ETA 14 minutes to Health City.',
    },
    {
      id: 'tx_5',
      step: '05',
      title: 'Recipient OR Sterile Handover',
      time: 'ETA 09:55 AM',
      location: 'Apollo Hospitals, Health City, Arilova',
      status: 'upcoming',
      detail: 'Apollo transplant surgical team scrubbed and awaiting sterile custody transfer.',
    },
    {
      id: 'tx_6',
      step: '06',
      title: 'Vascular Anastomosis',
      time: 'Estimated 10:15 AM',
      location: 'Transplant OR-1, Apollo Vizag',
      status: 'upcoming',
      detail: 'Kidney graft re-perfusion and post-transplant functional stabilization.',
    },
  ];

  const handleNextStep = () => {
    setIsSimulating(true);
    setTransitStep((prev) => (prev < 5 ? prev + 1 : 0));
    setTimeout(() => setIsSimulating(false), 500);
  };

  const handleReset = () => {
    setTransitStep(3);
  };

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Status Tracker
          </h3>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Tab switchers: Registry Status vs Transit Corridor */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60 text-xs">
          <button
            onClick={() => setTrackerMode('registry')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              trackerMode === 'registry'
                ? 'bg-white text-teal-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Registry Status
          </button>
          <button
            onClick={() => setTrackerMode('transit')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              trackerMode === 'transit'
                ? 'bg-white text-teal-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Live Transit
          </button>
        </div>
      </div>

      {/* Main Tracker Container */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4 relative overflow-hidden">
        {trackerMode === 'registry' ? (
          /* REGISTRY READINESS TRACKER */
          <div className="space-y-3.5">
            {/* Status overview headline */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-teal-700 tracking-wider uppercase block">
                  Citizen Donor Verification
                </span>
                <h4 className="text-sm font-bold text-slate-900 leading-tight mt-0.5">
                  100% Armed & Emergency Ready
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  All 5 Milestones Passed
                </span>
              </div>
            </div>

            {/* Vertical Milestones Timeline */}
            <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-teal-100">
              {registryMilestones.map((item, idx) => (
                <div key={item.id} className="relative group">
                  {/* Status node */}
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 leading-tight">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {item.timestamp}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-teal-700 block mt-0.5">
                      {item.authority}
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick action bar */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                National Organ Registry Token #{donor.registryId}
              </span>
              <button
                onClick={onOpenQR}
                className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 py-1"
              >
                <span>Test Emergency Scanner</span>
                <ChevronRight className="w-3.5 h-3.5 text-teal-600" />
              </button>
            </div>
          </div>
        ) : (
          /* LIVE ORGAN TRANSIT TRACKER */
          <div className="space-y-3.5">
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-teal-700 uppercase">
                    Mission #LR-TX-9042
                  </span>
                  <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded border border-rose-100">
                    Critical Tier 1
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight mt-0.5">
                  Kidney Graft · Police Green Corridor
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-extrabold text-teal-900 block">
                  ETA 16 min
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Temp 4.2°C · 78 km/h
                </span>
              </div>
            </div>

            {/* Step progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
                <span>Checkpoint {transitStep + 1} of 6</span>
                <span className="text-teal-700 font-bold">
                  {transitMilestones[transitStep].title}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex gap-1 p-0.5">
                {transitMilestones.map((_, i) => (
                  <div
                    key={i}
                    className={`h-full flex-1 rounded-full transition-all duration-300 ${
                      i <= transitStep ? 'bg-teal-600' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Active Milestone Card */}
            <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-teal-700 animate-pulse" />
                  <span>Current Checkpoint: {transitMilestones[transitStep].title}</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-teal-800 bg-white/80 px-2 py-0.5 rounded">
                  {transitMilestones[transitStep].time}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {transitMilestones[transitStep].detail}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-teal-800 font-medium pt-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>{transitMilestones[transitStep].location}</span>
              </div>
            </div>

            {/* Simulated Live Checkpoint Stepper Controls */}
            <div className="pt-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleNextStep}
                  disabled={isSimulating}
                  className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs active:scale-95"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{transitStep === 5 ? 'Restart Mission' : 'Simulate Next Checkpoint'}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  title="Reset to current live position"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {onOpenTransitHub && (
                <button
                  onClick={onOpenTransitHub}
                  className="text-xs font-bold text-teal-800 hover:underline"
                >
                  Full Pod View
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
