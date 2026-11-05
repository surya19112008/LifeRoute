import React from 'react';
import { AlertCircle, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';

interface EmergencySupportBannerProps {
  onOpenProtocol: () => void;
  onOpenTransitHub: () => void;
}

export const EmergencySupportBanner: React.FC<EmergencySupportBannerProps> = ({
  onOpenProtocol,
  onOpenTransitHub,
}) => {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/40 border border-teal-200/60 p-4 relative overflow-hidden transition-all shadow-xs">
      {/* Background ambient cadence line */}
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none text-teal-800">
        <HeartPulse className="w-24 h-24" />
      </div>

      <div className="relative z-10 space-y-2.5">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-100/90 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>How your donor card works in an emergency</span>
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 inline" />
            </h4>
            <p className="text-[12px] text-slate-600 leading-relaxed mt-1">
              Your life is always the hospital's first priority. In acute trauma, ER staff focus 100% on saving you. First responders scan this card only if brain-death is officially certified by independent doctors, instantly coordinating green transit corridors to save up to 8 lives.
            </p>
          </div>
        </div>

        {/* 3 Fast Micro-Checkmarks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-teal-100/70 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
            <span>Certified by 2 non-transplant MDs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
            <span>Family contact notified within 15 min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
            <span>GPS monitored cold-chain transit</span>
          </div>
        </div>

        {/* Interactive buttons */}
        <div className="flex items-center justify-between pt-1 gap-2">
          <button
            onClick={onOpenProtocol}
            className="text-[11px] font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 py-1 group"
          >
            <span>Read full medical emergency protocol</span>
            <ArrowRight className="w-3 h-3 text-teal-600 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={onOpenTransitHub}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white/80 border border-slate-200/80 px-2.5 py-1 rounded-lg shadow-2xs hover:bg-white transition-colors"
          >
            Live Corridor Status
          </button>
        </div>
      </div>
    </section>
  );
};
