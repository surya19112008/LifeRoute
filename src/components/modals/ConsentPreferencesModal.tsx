import React, { useState } from 'react';
import {
  X,
  Heart,
  Eye,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  Sparkles,
  Shield,
  Save,
} from 'lucide-react';
import { DonorProfile, PledgedOrgan, OrganId } from '../../types';

interface ConsentPreferencesModalProps {
  donor: DonorProfile;
  isOpen: boolean;
  onClose: () => void;
  onSavePreferences: (updatedOrgans: PledgedOrgan[], allowResearch: boolean) => void;
}

export const ConsentPreferencesModal: React.FC<ConsentPreferencesModalProps> = ({
  donor,
  isOpen,
  onClose,
  onSavePreferences,
}) => {
  const [organs, setOrgans] = useState<PledgedOrgan[]>(donor.organPreferences);
  const [allowResearch, setAllowResearch] = useState(donor.allowResearch);
  const [hasSaved, setHasSaved] = useState(false);

  if (!isOpen) return null;

  const toggleOrgan = (id: OrganId) => {
    setOrgans((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, pledged: !item.pledged } : item
      )
    );
  };

  const handleSelectAll = (select: boolean) => {
    setOrgans((prev) => prev.map((item) => ({ ...item, pledged: select })));
  };

  const handleSave = () => {
    onSavePreferences(organs, allowResearch);
    setHasSaved(true);
    setTimeout(() => {
      setHasSaved(false);
      onClose();
    }, 1200);
  };

  const pledgedCount = organs.filter((o) => o.pledged).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Consent Preferences
              </h3>
              <p className="text-xs text-slate-500">
                Manage authorized organs and clinical parameters
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

        {/* Scrollable Organ List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Quick toggle actions */}
          <div className="flex items-center justify-between bg-teal-50/60 border border-teal-100 rounded-2xl p-3">
            <div>
              <span className="text-xs font-bold text-teal-900 block">
                {pledgedCount} of {organs.length} Organs & Tissues Authorized
              </span>
              <span className="text-[11px] text-teal-700">
                Pledged under Uniform Anatomical Gift Act
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSelectAll(true)}
                className="px-2.5 py-1 text-xs font-semibold text-teal-800 bg-white rounded-lg border border-teal-200 hover:bg-teal-50"
              >
                Pledge All
              </button>
              <button
                type="button"
                onClick={() => handleSelectAll(false)}
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-white rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Organs list */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block px-1">
              Select Organs to Pledge
            </span>

            {organs.map((organ) => {
              const isPledged = organ.pledged;
              return (
                <div
                  key={organ.id}
                  onClick={() => toggleOrgan(organ.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isPledged
                      ? 'bg-teal-50/30 border-teal-200 shadow-2xs'
                      : 'bg-white border-slate-200/70 opacity-65 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isPledged
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {organ.id === 'heart' && <Heart className="w-5 h-5 fill-current" />}
                      {organ.id === 'cornea' && <Eye className="w-5 h-5" />}
                      {organ.id === 'kidneys' && (
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M7.5 4C5 4 3 6.5 3 10c0 4.5 3.5 8 6 8 1 0 1.8-.4 2.5-1-.2-.8-.5-1.8-.5-3 0-2.5 1.5-4 1.5-4s-.8-6-5-6zm9 0c-4.2 0-5 6-5 6s1.5 1.5 1.5 4c0 1.2-.3 2.2-.5 3 .7.6 1.5 1 2.5 1 2.5 0 6-3.5 6-8 0-3.5-2-6-4.5-6z" />
                        </svg>
                      )}
                      {!['heart', 'cornea', 'kidneys'].includes(organ.id) && (
                        <Sparkles className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 block leading-tight">
                          {organ.name}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                          {organ.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {organ.transplantUtility}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-teal-800 font-mono mt-1">
                        <Clock className="w-3 h-3 text-teal-600" />
                        <span>Preservation: {organ.preservationWindow}</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div
                    className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ml-3 ${
                      isPledged ? 'bg-teal-600' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                        isPledged ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Biomedical Research Consent Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="min-w-0 pr-3">
              <span className="text-xs font-bold text-slate-900 block">
                Biomedical Research & Medical Training
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                If an organ cannot be transplanted into a human recipient, allow accredited university research to advance therapies.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAllowResearch(!allowResearch)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                allowResearch ? 'bg-teal-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  allowResearch ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Security & Legal note */}
          <div className="flex items-start gap-2 text-[11px] text-slate-400 p-2">
            <Shield className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>
              Your choices are encrypted and synchronized instantly with the National Organ Registry. You may modify or revoke this declaration at any time without penalty.
            </span>
          </div>
        </div>

        {/* Footer with Save Action */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={hasSaved}
            className="flex-1 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all cursor-pointer"
          >
            {hasSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Pledge Successfully Updated!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Updated Consent ({pledgedCount} Pledged)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
