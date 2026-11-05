import React from 'react';
import {
  QrCode,
  Heart,
  Eye,
  Phone,
  CheckCircle2,
  Sparkles,
  Info,
  Database,
  WifiOff,
  UserPlus,
  User,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { DonorProfile, PledgedOrgan } from '../types';

interface DigitalDonorCardProps {
  donor: DonorProfile;
  onShowQR: () => void;
  onSelectOrgan: (organ: PledgedOrgan) => void;
  onContactCall: (phone: string) => void;
  onOpenRegister?: () => void;
  onOpenCacheInspector?: () => void;
  isOffline?: boolean;
  storageEngine?: 'IndexedDB' | 'localStorage';
}

export const DigitalDonorCard: React.FC<DigitalDonorCardProps> = ({
  donor,
  onShowQR,
  onSelectOrgan,
  onContactCall,
  onOpenRegister,
  onOpenCacheInspector,
  isOffline = false,
  storageEngine = 'IndexedDB',
}) => {
  const isRegistered = !!(donor.fullName && donor.fullName.trim().length > 0);
  const primaryContact =
    donor.emergencyContacts?.find((c) => c.isPrimary) || donor.emergencyContacts?.[0];

  // Highlighted organs
  const heartOrgan = donor.organPreferences?.find((o) => o.id === 'heart');
  const kidneysOrgan = donor.organPreferences?.find((o) => o.id === 'kidneys');
  const corneaOrgan = donor.organPreferences?.find((o) => o.id === 'cornea');
  const otherPledgedCount = (donor.organPreferences || []).filter(
    (o) => o.pledged && !['heart', 'kidneys', 'cornea'].includes(o.id)
  ).length;

  if (!isRegistered) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-md p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center mx-auto shadow-xs">
          <UserPlus className="w-7 h-7" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full uppercase">
            Official Organ Pledge Setup
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">
            Register Your Real Donor Card
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            All mock data has been removed. Register your legal anatomical gift declaration, blood group, emergency next of kin, and clinical directives.
          </p>
        </div>

        <button
          onClick={onOpenRegister}
          className="w-full py-3.5 px-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Register Donor Profile Now</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/50 transition-all">
      {/* Decorative medical accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500" />

      {/* Ambient background glow */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-teal-100/40 blur-2xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-cyan-100/30 blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="p-5 sm:p-6 relative z-10 space-y-4.5">
        {/* Card Header: National Seal & Verification ID */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-teal-600 flex items-center justify-center text-white text-[11px] font-bold tracking-wider">
              LR
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>National Organ Registry</span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span className="font-mono text-slate-700 font-medium text-[11px]">
                {donor.registryId}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {onOpenCacheInspector && (
              <button
                onClick={onOpenCacheInspector}
                title={`Cached in ${storageEngine} for offline trauma response`}
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                  isOffline
                    ? 'text-amber-800 bg-amber-50 border-amber-300 hover:bg-amber-100'
                    : 'text-teal-800 bg-teal-50 border-teal-200/80 hover:bg-teal-100'
                }`}
              >
                {isOffline ? (
                  <WifiOff className="w-3 h-3 text-amber-600" />
                ) : (
                  <Database className="w-3 h-3 text-teal-600" />
                )}
                <span>{isOffline ? 'Offline' : storageEngine}</span>
              </button>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Verified
            </span>
          </div>
        </div>

        {/* Primary Donor Info: Name & Blood Group Stamp */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              {donor.avatarUrl ? (
                <img
                  src={donor.avatarUrl}
                  alt={donor.fullName}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-700 text-white font-extrabold text-xl flex items-center justify-center ring-2 ring-slate-100 shadow-sm">
                  {donor.fullName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-xs">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-medium text-slate-400 block tracking-tight uppercase">
                PLEDGED CITIZEN DONOR
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">
                {donor.fullName}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span>DOB: {donor.dateOfBirth || 'Documented'}</span>
                {donor.hospitalAffiliation && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-teal-700 font-medium truncate max-w-[140px]">
                      {donor.hospitalAffiliation}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Blood Group Highlight Card */}
          <div className="shrink-0 text-right bg-gradient-to-b from-rose-50/70 to-red-50/40 border border-red-200/70 rounded-2xl px-3 py-2 text-center shadow-2xs">
            <span className="text-[10px] font-semibold text-rose-500 block uppercase tracking-wide">
              Blood Group
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight font-mono block leading-none my-0.5">
              {donor.bloodType}
            </span>
            <span className="text-[10px] text-rose-700/80 font-medium block">
              Rh(D) {donor.rhFactor}
            </span>
          </div>
        </div>

        {/* Pledged Organs Section */}
        <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Authorized Anatomical Gifts
            </span>
            <span className="text-[11px] text-teal-700 font-medium">
              Tap for transit criteria
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Heart */}
            <button
              onClick={() => heartOrgan && onSelectOrgan(heartOrgan)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all active:scale-[0.98] group ${
                heartOrgan?.pledged
                  ? 'bg-white border-slate-200 hover:border-teal-400'
                  : 'bg-slate-100/60 border-slate-200/40 opacity-50'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Heart
                  className={`w-5 h-5 ${
                    heartOrgan?.pledged ? 'fill-rose-500 text-rose-600' : 'text-slate-400'
                  }`}
                />
              </div>
              <span className="text-xs font-semibold text-slate-800 mt-1.5">Heart</span>
              <span className="text-[10px] font-mono text-slate-400">
                {heartOrgan?.pledged ? '4–6h window' : 'Excluded'}
              </span>
            </button>

            {/* Kidneys */}
            <button
              onClick={() => kidneysOrgan && onSelectOrgan(kidneysOrgan)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all active:scale-[0.98] group ${
                kidneysOrgan?.pledged
                  ? 'bg-white border-slate-200 hover:border-teal-400'
                  : 'bg-slate-100/60 border-slate-200/40 opacity-50'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg
                  className={`w-5 h-5 ${
                    kidneysOrgan?.pledged ? 'fill-amber-500 text-amber-600' : 'text-slate-400'
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M7.5 4C5 4 3 6.5 3 10c0 4.5 3.5 8 6 8 1 0 1.8-.4 2.5-1-.2-.8-.5-1.8-.5-3 0-2.5 1.5-4 1.5-4s-.8-6-5-6zm9 0c-4.2 0-5 6-5 6s1.5 1.5 1.5 4c0 1.2-.3 2.2-.5 3 .7.6 1.5 1 2.5 1 2.5 0 6-3.5 6-8 0-3.5-2-6-4.5-6z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-800 mt-1.5">Kidneys</span>
              <span className="text-[10px] font-mono text-slate-400">
                {kidneysOrgan?.pledged ? '24–36h pair' : 'Excluded'}
              </span>
            </button>

            {/* Cornea */}
            <button
              onClick={() => corneaOrgan && onSelectOrgan(corneaOrgan)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all active:scale-[0.98] group ${
                corneaOrgan?.pledged
                  ? 'bg-white border-slate-200 hover:border-teal-400'
                  : 'bg-slate-100/60 border-slate-200/40 opacity-50'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Eye
                  className={`w-5 h-5 ${
                    corneaOrgan?.pledged ? 'text-teal-600' : 'text-slate-400'
                  }`}
                />
              </div>
              <span className="text-xs font-semibold text-slate-800 mt-1.5">Cornea</span>
              <span className="text-[10px] font-mono text-slate-400">
                {corneaOrgan?.pledged ? 'Sight restore' : 'Excluded'}
              </span>
            </button>
          </div>

          {otherPledgedCount > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>+ {otherPledgedCount} more authorized (Liver, Lungs, Tissue)</span>
              </span>
              <span className="text-teal-700 font-medium">Verified Legal Directives</span>
            </div>
          )}
        </div>

        {/* Emergency Contact Info strip */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-teal-50/70 border border-teal-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-teal-800 block uppercase tracking-wide">
                Primary Emergency Contact (Next of Kin)
              </span>
              {primaryContact ? (
                <>
                  <span className="text-xs font-bold text-slate-900 truncate block">
                    {primaryContact.name} ({primaryContact.relation.split('/')[0].trim()})
                  </span>
                  <span className="text-[11px] text-slate-600 font-mono">
                    {primaryContact.phone}
                  </span>
                </>
              ) : (
                <span className="text-xs text-slate-500 italic block">
                  No next of kin added yet
                </span>
              )}
            </div>
          </div>

          {primaryContact ? (
            <button
              onClick={() => onContactCall(primaryContact.phone)}
              className="shrink-0 min-h-[36px] px-3 py-1.5 rounded-xl bg-white border border-teal-200 text-teal-800 text-xs font-semibold hover:bg-teal-50 active:scale-95 transition-all shadow-2xs cursor-pointer"
            >
              Call Contact
            </button>
          ) : (
            <button
              onClick={onOpenRegister}
              className="shrink-0 min-h-[36px] px-3 py-1.5 rounded-xl bg-white border border-teal-200 text-teal-800 text-xs font-semibold hover:bg-teal-50 transition-all cursor-pointer"
            >
              Add Contact
            </button>
          )}
        </div>

        {/* Prominent "Show Emergency QR Code" Button */}
        <button
          onClick={onShowQR}
          className="w-full min-h-[50px] py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white font-semibold text-sm flex items-center justify-between shadow-md shadow-teal-900/15 hover:shadow-lg hover:from-teal-600 hover:to-slate-800 active:scale-[0.99] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="text-sm font-bold block leading-tight">
                Show Emergency QR Code
              </span>
              <span className="text-[11px] text-teal-200 block font-normal leading-tight">
                For First Responders & Trauma Teams
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-teal-100 bg-white/10 px-2.5 py-1 rounded-lg">
            <span>Instant Scan</span>
            <svg
              className="w-4 h-4 text-teal-200 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Card Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5 px-1">
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Legally recognized under Title 42 & State Health Regulations
          </span>
          <span className="font-mono text-[10px]">VERIFIED DIRECTIVE</span>
        </div>
      </div>
    </div>
  );
};
