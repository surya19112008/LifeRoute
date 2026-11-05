import React from 'react';
import {
  X,
  Clock,
  Heart,
  Eye,
  Activity,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { PledgedOrgan } from '../../types';

interface OrganDetailModalProps {
  organ: PledgedOrgan | null;
  onClose: () => void;
  onOpenTransitHub: () => void;
}

export const OrganDetailModal: React.FC<OrganDetailModalProps> = ({
  organ,
  onClose,
  onOpenTransitHub,
}) => {
  if (!organ) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center">
              {organ.id === 'heart' && <Heart className="w-6 h-6 fill-rose-500 text-rose-600" />}
              {organ.id === 'cornea' && <Eye className="w-6 h-6 text-teal-600" />}
              {organ.id === 'kidneys' && (
                <svg className="w-6 h-6 fill-amber-500 text-amber-600" viewBox="0 0 24 24">
                  <path d="M7.5 4C5 4 3 6.5 3 10c0 4.5 3.5 8 6 8 1 0 1.8-.4 2.5-1-.2-.8-.5-1.8-.5-3 0-2.5 1.5-4 1.5-4s-.8-6-5-6zm9 0c-4.2 0-5 6-5 6s1.5 1.5 1.5 4c0 1.2-.3 2.2-.5 3 .7.6 1.5 1 2.5 1 2.5 0 6-3.5 6-8 0-3.5-2-6-4.5-6z" />
                </svg>
              )}
              {!['heart', 'cornea', 'kidneys'].includes(organ.id) && (
                <Activity className="w-6 h-6 text-teal-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {organ.name}
                </h3>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  Pledged
                </span>
              </div>
              <span className="text-xs text-slate-500">{organ.category} Pledge</span>
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
        <div className="p-5 space-y-4 text-xs">
          {/* Key metrics grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">
                Preservation Window
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  {organ.preservationWindow}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">
                Transit Temperature
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <Thermometer className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  4.0°C – 6.0°C
                </span>
              </div>
            </div>
          </div>

          {/* Clinical utility */}
          <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-1">
            <span className="font-bold text-teal-900 block flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-teal-700" />
              Clinical Impact
            </span>
            <p className="text-slate-700 leading-relaxed text-[12px]">
              {organ.transplantUtility}
            </p>
          </div>

          {/* Clinical note */}
          {organ.clinicalNote && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600">
              <span className="font-bold text-slate-800 block text-[11px] mb-0.5">
                Transit Logistics Protocol:
              </span>
              <p className="text-[11px] leading-relaxed">{organ.clinicalNote}</p>
            </div>
          )}

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-900 font-semibold text-[11px]">
                Organ transit capsule tracked live via GPS
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenTransitHub();
              }}
              className="text-[11px] font-bold text-teal-800 hover:underline"
            >
              View Transit
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
