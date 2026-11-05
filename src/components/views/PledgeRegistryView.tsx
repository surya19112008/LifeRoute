import React from 'react';
import {
  Heart,
  Eye,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { DonorProfile, PledgedOrgan } from '../../types';

interface PledgeRegistryViewProps {
  donor: DonorProfile;
  onOpenConsentModal: () => void;
  onSelectOrgan: (organ: PledgedOrgan) => void;
}

export const PledgeRegistryView: React.FC<PledgeRegistryViewProps> = ({
  donor,
  onOpenConsentModal,
  onSelectOrgan,
}) => {
  const pledgedList = donor.organPreferences.filter((o) => o.pledged);

  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Pledge Registry
          </h2>
          <p className="text-xs text-slate-500">
            Legal anatomical gift record #{donor.registryId}
          </p>
        </div>
        <button
          onClick={onOpenConsentModal}
          className="min-h-[36px] px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Edit Pledges</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Total Organs Pledged
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              {pledgedList.length}
            </span>
            <span className="text-xs text-slate-500">of {donor.organPreferences.length}</span>
          </div>
          <span className="text-[10px] text-teal-700 font-semibold block mt-0.5">
            Can save up to 8 lives
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Research Consent
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-sm font-extrabold text-emerald-700">
              {donor.allowResearch ? 'Authorized' : 'Declined'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Biomedical studies opt-in
          </span>
        </div>
      </div>

      {/* Pledged Items List */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block px-1">
          Registered Anatomical Gifts
        </span>

        {donor.organPreferences.map((organ) => (
          <div
            key={organ.id}
            onClick={() => onSelectOrgan(organ)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              organ.pledged
                ? 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-xs'
                : 'bg-slate-50/60 border-dashed border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  organ.pledged ? 'bg-teal-50 text-teal-700' : 'bg-slate-200 text-slate-400'
                }`}
              >
                {organ.id === 'heart' && <Heart className="w-5 h-5 fill-rose-500 text-rose-600" />}
                {organ.id === 'cornea' && <Eye className="w-5 h-5 text-teal-600" />}
                {organ.id !== 'heart' && organ.id !== 'cornea' && <Sparkles className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{organ.name}</span>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                    {organ.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1 font-mono text-[11px] text-teal-800">
                    <Clock className="w-3 h-3 text-teal-600" />
                    {organ.preservationWindow}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              {organ.pledged ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Active
                </span>
              ) : (
                <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  Excluded
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legal Declaration Info */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <FileText className="w-4 h-4 text-teal-700" />
          <span>Legal Declaration Record</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Initial Registration: {donor.registeredDate} · Last Verified: {donor.lastVerifiedDate}. Legally enforceable as a first-person donor authorization under Title 42 Public Health Code.
        </p>
      </div>
    </div>
  );
};
