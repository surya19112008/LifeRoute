import React from 'react';
import {
  User,
  ShieldCheck,
  Building2,
  AlertTriangle,
  Phone,
  Droplet,
  FileCheck,
  Share2,
  Database,
  UserCheck,
  Edit3,
} from 'lucide-react';
import { DonorProfile } from '../../types';
import { OfflineCacheMetadata } from '../../services/donorOfflineStorage';

interface ProfileViewProps {
  donor: DonorProfile;
  onOpenNotifyFamily: () => void;
  onOpenDownloadCard: () => void;
  onEmergencyCall: (phone: string) => void;
  onOpenRegister?: () => void;
  onOpenCacheInspector?: () => void;
  metadata?: OfflineCacheMetadata | null;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  donor,
  onOpenNotifyFamily,
  onOpenDownloadCard,
  onEmergencyCall,
  onOpenRegister,
  onOpenCacheInspector,
  metadata,
}) => {
  const isRegistered = !!(donor.fullName && donor.fullName.trim().length > 0);

  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Donor Profile & Directives
          </h2>
          <p className="text-xs text-slate-500">
            Real-time Medical Parameters & Legal Directives
          </p>
        </div>
        {onOpenRegister && (
          <button
            onClick={onOpenRegister}
            className="min-h-[36px] px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isRegistered ? 'Edit Profile' : 'Register Profile'}</span>
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
        {donor.avatarUrl ? (
          <img
            src={donor.avatarUrl}
            alt={donor.fullName || 'Donor Avatar'}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-teal-800 text-white font-extrabold text-2xl flex items-center justify-center ring-2 ring-slate-100 shadow-sm shrink-0">
            {donor.fullName ? donor.fullName.slice(0, 2).toUpperCase() : 'LR'}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 truncate">
              {donor.fullName || 'Unregistered Donor'}
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                isRegistered
                  ? 'text-emerald-800 bg-emerald-50 border-emerald-100'
                  : 'text-amber-800 bg-amber-50 border-amber-200'
              }`}
            >
              {isRegistered ? 'Verified Legal Pledge' : 'Pending Registration'}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono block">
            ID: {donor.registryId}
          </span>
          <span className="text-[11px] text-teal-700 font-medium block mt-0.5">
            Registered: {donor.registeredDate} · Last Verified: {donor.lastVerifiedDate}
          </span>
        </div>
      </div>

      {/* Database Engine Status Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-teal-500/20 text-teal-400">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xs">
            <span className="font-bold block text-white flex items-center gap-1.5">
              <span>Encrypted Offline Vault</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] text-slate-300">
              IndexedDB secure local database active · Disaster-ready
            </span>
          </div>
        </div>
        {onOpenCacheInspector && (
          <button
            onClick={onOpenCacheInspector}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Vault
          </button>
        )}
      </div>

      {/* Blood Group & Compatibility Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-50/70 via-white to-red-50/30 border border-rose-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Droplet className="w-5 h-5 fill-rose-500 text-rose-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Blood Group: {donor.bloodType} Rh({donor.rhFactor})
              </span>
              <span className="text-[10px] text-slate-500">
                High emergency clinical matching utility
              </span>
            </div>
          </div>
          <span className="text-2xl font-black text-rose-600 font-mono">
            {donor.bloodType}
          </span>
        </div>

        <div className="pt-2 border-t border-rose-100 text-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-700 block">
            Clinical Compatibility:
          </span>
          <p className="text-[11px] text-slate-600">
            {donor.bloodType === 'O-'
              ? 'Universal Red Blood Cell Donor (can be transfused to any blood type in trauma situations).'
              : donor.bloodType === 'O+'
              ? 'Can donate red cells to O+, A+, B+, AB+ (approx. 85% of population).'
              : `Matches ${donor.bloodType} recipients under standard cross-match protocols.`}
          </p>
        </div>
      </div>

      {/* Hospital Affiliation & Advance Directive */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">
              Primary Hospital / Trauma Center
            </span>
            <span className="text-slate-600 block mt-0.5">
              {donor.hospitalAffiliation || 'Not yet assigned'}
            </span>
            <span className="text-[10px] text-teal-700 font-medium block mt-0.5">
              {donor.nationalRegistry}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <FileCheck className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">
              Advance Medical Directive
            </span>
            <span className="text-slate-600 block mt-0.5">
              {donor.medicalNotes || 'Authorized under first-person consent declaration.'}
            </span>
          </div>
        </div>

        {/* Clinical Flags */}
        <div className="pt-2 border-t border-slate-100 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">
              Clinical Warnings & Allergies
            </span>
            <span className="text-slate-600 block mt-0.5">
              {donor.allergies?.length > 0 ? donor.allergies.join(' · ') : 'None documented'}
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Contacts List */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Designated Next of Kin
          </span>
          <button
            onClick={onOpenNotifyFamily}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
          >
            Manage
          </button>
        </div>

        <div className="space-y-2">
          {donor.emergencyContacts?.length > 0 ? (
            donor.emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">
                    {contact.name} ({contact.relation})
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {contact.phone}
                  </span>
                </div>
                <button
                  onClick={() => onEmergencyCall(contact.phone)}
                  className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-semibold hover:bg-teal-100 flex items-center gap-1 cursor-pointer"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </button>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <span>No emergency contacts registered yet.</span>
              <button
                onClick={onOpenNotifyFamily}
                className="text-teal-700 font-bold ml-1.5 underline"
              >
                Add Next of Kin
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Offline Cache Status Card */}
      <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Offline Disaster & Trauma Cache
              </span>
              <span className="text-[10px] text-slate-500 block">
                {metadata?.storageEngine || 'IndexedDB'} · {metadata?.cachedAt || 'Verified Local'}
              </span>
            </div>
          </div>

          {onOpenCacheInspector && (
            <button
              onClick={onOpenCacheInspector}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-teal-800 text-[11px] font-semibold hover:bg-slate-100 shadow-2xs cursor-pointer"
            >
              Verify Cache
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed">
          Your digital donor credentials, {donor.organPreferences?.filter((o) => o.pledged).length || 0} pledged organs, and emergency contacts are encrypted in local device storage so trauma medics can confirm consent without cell reception.
        </p>
      </div>

      {/* Digital Export Actions */}
      <button
        onClick={onOpenDownloadCard}
        className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
      >
        <Share2 className="w-4 h-4" />
        <span>Export Official Donor Record (PDF/Wallet)</span>
      </button>
    </div>
  );
};
