import React from 'react';
import { SlidersHorizontal, Users, Download, ChevronRight, Check } from 'lucide-react';

interface QuickActionsGridProps {
  pledgedCount: number;
  totalOrgans: number;
  familyNotifiedCount: number;
  totalFamily: number;
  onOpenConsent: () => void;
  onOpenNotifyFamily: () => void;
  onOpenDownloadCard: () => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  pledgedCount,
  familyNotifiedCount,
  totalFamily,
  onOpenConsent,
  onOpenNotifyFamily,
  onOpenDownloadCard,
}) => {
  return (
    <section className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Quick Actions
        </h3>
        <span className="text-[11px] text-slate-500 font-medium">
          Registry Management
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Action 1: Update Consent Preferences */}
        <button
          onClick={onOpenConsent}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-300 hover:shadow-xs transition-all text-left flex items-center justify-between group active:scale-[0.98] min-h-[56px]"
          aria-label="Update Consent Preferences"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <SlidersHorizontal className="w-5 h-5 text-teal-600" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate leading-tight">
                Update Consent Preferences
              </span>
              <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                {pledgedCount} organs pledged · Custom limits
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </button>

        {/* Action 2: Notify Family Members */}
        <button
          onClick={onOpenNotifyFamily}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-xs transition-all text-left flex items-center justify-between group active:scale-[0.98] min-h-[56px]"
          aria-label="Notify Family Members"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 block truncate leading-tight">
                  Notify Family Members
                </span>
                <span className="flex items-center text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                  <Check className="w-2.5 h-2.5 mr-0.5 stroke-[3]" />
                  Synced
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                {familyNotifiedCount} of {totalFamily} next of kin informed
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </button>

        {/* Action 3: Download Digital Card */}
        <button
          onClick={onOpenDownloadCard}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-cyan-300 hover:shadow-xs transition-all text-left flex items-center justify-between group active:scale-[0.98] min-h-[56px]"
          aria-label="Download Digital Card"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate leading-tight">
                Download Digital Card
              </span>
              <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                Apple Wallet · Google Pay · PDF
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </button>
      </div>
    </section>
  );
};
