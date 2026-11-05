import React from 'react';
import {
  X,
  ShieldCheck,
  HeartPulse,
  Scale,
  Activity,
  Truck,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface EmergencyProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTransitHub: () => void;
}

export const EmergencyProtocolModal: React.FC<EmergencyProtocolModalProps> = ({
  isOpen,
  onClose,
  onOpenTransitHub,
}) => {
  if (!isOpen) return null;

  const protocolStages = [
    {
      step: '01',
      title: 'Triage & Absolute Life-Saving Priority',
      subtitle: 'Your life and survival always come first',
      description:
        'Emergency medical technicians and hospital trauma doctors focus 100% of their expertise and resources on saving your life. The emergency doctors treating you have zero connection to organ recovery or transplant surgical teams.',
      icon: HeartPulse,
      accent: 'teal',
    },
    {
      step: '02',
      title: 'Independent Brain-Death Certification',
      subtitle: 'Strict legal & clinical criteria before any consideration',
      description:
        'Organ recovery can only be considered after irreversible cessation of all brain activity is formally certified by two independent, senior physicians who are legally barred from participating in recipient transplant surgeries.',
      icon: Scale,
      accent: 'slate',
    },
    {
      step: '03',
      title: 'National Registry Verification & Family Support',
      subtitle: 'Honoring your authenticated wishes with next-of-kin care',
      description:
        'Hospital organ procurement coordinators scan the LifeRoute QR code to verify your active legal registration in the national database. Trained grief coordinators immediately consult your designated next-of-kin.',
      icon: Users,
      accent: 'emerald',
    },
    {
      step: '04',
      title: 'Green Corridor Transit & Recipient Match',
      subtitle: 'Perfusion-controlled rapid transport to matching patients',
      description:
        'Organs are matched by blood type, tissue compatibility, and medical urgency via algorithmic matching. LifeRoute dispatches temperature-monitored smart containers with police-escorted green corridors or air transit.',
      icon: Truck,
      accent: 'cyan',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-teal-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Emergency Organ Donation Protocol
              </h3>
              <p className="text-xs text-teal-800">
                Ethical safeguards, legal rights & transit sequence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300/70 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Key Myth vs Reality Pill-Free Banner */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1.5">
            <span className="font-bold text-slate-900 block">
              Ethical Oath & Safety Guarantee
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              "If paramedics see I'm an organ donor, will they try less hard to save me?" — <strong className="text-slate-900">Never.</strong> First responders and ER physicians take the Hippocratic oath. Their only mission is your survival. Your donor registration isn't even checked until long after death has been irrevocably pronounced.
            </p>
          </div>

          {/* Sequential 4 Steps */}
          <div className="space-y-3">
            {protocolStages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.step}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-white hover:border-teal-200 hover:shadow-xs transition-all flex items-start gap-3.5"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                      <Icon className="w-4.5 h-4.5 text-teal-700" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold mt-1">
                      {stage.step}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {stage.title}
                    </span>
                    <span className="text-[11px] font-medium text-teal-700 block mt-0.5">
                      {stage.subtitle}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {stage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Link to live transit hub */}
          <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/70 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-teal-900 block">
                Want to see how organ transit works live?
              </span>
              <span className="text-[11px] text-teal-700">
                Explore temperature telemetry and green corridors
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenTransitHub();
              }}
              className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs"
            >
              Explore Transit Hub
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
