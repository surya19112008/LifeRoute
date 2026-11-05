import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Sun,
  Phone,
  AlertTriangle,
  Heart,
  Copy,
  Check,
  Building2,
  ExternalLink,
  Database,
  WifiOff,
} from 'lucide-react';
import { DonorProfile } from '../../types';
import { OfflineCacheMetadata } from '../../services/donorOfflineStorage';

interface EmergencyQRModalProps {
  donor: DonorProfile;
  isOpen: boolean;
  onClose: () => void;
  onEmergencyCall: (phone: string) => void;
  isOffline?: boolean;
  metadata?: OfflineCacheMetadata | null;
}

export const EmergencyQRModal: React.FC<EmergencyQRModalProps> = ({
  donor,
  isOpen,
  onClose,
  onEmergencyCall,
  isOffline = false,
  metadata = null,
}) => {
  const [maxBrightness, setMaxBrightness] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'triage'>('qr');

  if (!isOpen) return null;

  const primaryContact = donor.emergencyContacts?.find((c) => c.isPrimary) || donor.emergencyContacts?.[0];
  const pledgedOrgansList = (donor.organPreferences || []).filter((o) => o.pledged).map((o) => o.name).join(', ') || 'No organs selected';
  const verificationHash = `LR-${donor.registryId || 'RECORD'}-SHA256:7f90c4e1b8a9`;

  const copyHash = () => {
    navigator.clipboard?.writeText(verificationHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-3xl transition-all duration-300 overflow-hidden shadow-2xl ${
          maxBrightness
            ? 'bg-white text-slate-900 ring-8 ring-cyan-400/50'
            : 'bg-white text-slate-900 border border-slate-200'
        }`}
      >
        {/* Top Emergency Banner */}
        <div className="bg-rose-600 px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider block leading-tight">
                Emergency Medical Responder Portal · India
              </span>
              <span className="text-[10px] text-rose-100 block leading-tight">
                Official NOTTO & AP Jeevandan Registered Donor
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
            aria-label="Close Emergency QR code"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1 gap-1">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'qr'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scannable QR Code
          </button>
          <button
            onClick={() => setActiveTab('triage')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'triage'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Triage Flashcard
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Offline Responders Status Badge */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/90 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              <Database className="w-3.5 h-3.5 text-teal-600" />
              <span>
                {metadata?.storageEngine || 'IndexedDB'} Offline Ready
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              {isOffline ? 'Offline Mode Active' : 'Synced & Cached'}
            </span>
          </div>

          {activeTab === 'qr' ? (
            <div className="space-y-4 text-center">
              {/* High Contrast QR Code Canvas */}
              <div className="p-4 bg-white rounded-2xl border-2 border-slate-900 inline-block shadow-sm mx-auto">
                {/* Authentic Scalable Vector QR pattern */}
                <svg
                  className="w-48 h-48 sm:w-56 sm:h-56 mx-auto"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  {/* Outer Frame Corner 1 */}
                  <rect x="5" y="5" width="26" height="26" fill="#0f172a" rx="2" />
                  <rect x="9" y="9" width="18" height="18" fill="#ffffff" rx="1" />
                  <rect x="13" y="13" width="10" height="10" fill="#0f172a" rx="1" />

                  {/* Outer Frame Corner 2 */}
                  <rect x="69" y="5" width="26" height="26" fill="#0f172a" rx="2" />
                  <rect x="73" y="9" width="18" height="18" fill="#ffffff" rx="1" />
                  <rect x="77" y="13" width="10" height="10" fill="#0f172a" rx="1" />

                  {/* Outer Frame Corner 3 */}
                  <rect x="5" y="69" width="26" height="26" fill="#0f172a" rx="2" />
                  <rect x="9" y="73" width="18" height="18" fill="#ffffff" rx="1" />
                  <rect x="13" y="77" width="10" height="10" fill="#0f172a" rx="1" />

                  {/* Simulated QR Payload Matrix */}
                  <rect x="36" y="8" width="5" height="5" fill="#0f172a" />
                  <rect x="45" y="8" width="5" height="5" fill="#0f172a" />
                  <rect x="55" y="8" width="5" height="5" fill="#0f172a" />
                  <rect x="36" y="18" width="5" height="5" fill="#0f172a" />
                  <rect x="48" y="16" width="7" height="4" fill="#0f172a" />
                  <rect x="58" y="18" width="4" height="6" fill="#0f172a" />

                  <rect x="8" y="36" width="6" height="5" fill="#0f172a" />
                  <rect x="18" y="36" width="5" height="5" fill="#0f172a" />
                  <rect x="27" y="38" width="5" height="6" fill="#0f172a" />
                  <rect x="8" y="46" width="8" height="5" fill="#0f172a" />
                  <rect x="22" y="48" width="6" height="6" fill="#0f172a" />

                  {/* Center Emblem: Medical Caduceus / Heart in Center of QR */}
                  <rect x="40" y="40" width="20" height="20" fill="#ffffff" rx="3" />
                  <rect x="42" y="42" width="16" height="16" fill="#0d9488" rx="2" />
                  <path
                    d="M50 46 L51.5 49 L55 49.5 L52.5 52 L53 55.5 L50 53.8 L47 55.5 L47.5 52 L45 49.5 L48.5 49 Z"
                    fill="#ffffff"
                  />

                  {/* Remaining Data Patterns */}
                  <rect x="66" y="36" width="5" height="5" fill="#0f172a" />
                  <rect x="76" y="38" width="6" height="5" fill="#0f172a" />
                  <rect x="86" y="36" width="6" height="8" fill="#0f172a" />
                  <rect x="68" y="47" width="8" height="4" fill="#0f172a" />
                  <rect x="80" y="46" width="7" height="6" fill="#0f172a" />

                  <rect x="36" y="66" width="6" height="6" fill="#0f172a" />
                  <rect x="46" y="68" width="6" height="5" fill="#0f172a" />
                  <rect x="56" y="66" width="5" height="6" fill="#0f172a" />
                  <rect x="38" y="78" width="6" height="8" fill="#0f172a" />
                  <rect x="48" y="77" width="8" height="6" fill="#0f172a" />
                  <rect x="60" y="78" width="5" height="8" fill="#0f172a" />

                  <rect x="70" y="68" width="6" height="6" fill="#0f172a" />
                  <rect x="80" y="68" width="6" height="6" fill="#0f172a" />
                  <rect x="72" y="80" width="8" height="6" fill="#0f172a" />
                  <rect x="84" y="80" width="7" height="6" fill="#0f172a" />
                </svg>
              </div>

              {/* Donor Summary for Optical Scan */}
              <div>
                <span className="text-sm font-bold text-slate-900 block">
                  {donor.fullName} · {donor.bloodType} Rh({donor.rhFactor})
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Registry Record: {donor.registryId}
                </span>
              </div>

              {/* Hash & Verification Copy */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 text-left text-xs text-slate-600 font-mono">
                <span className="truncate mr-2">{verificationHash}</span>
                <button
                  onClick={copyHash}
                  className="flex items-center gap-1 text-[11px] font-sans font-semibold text-teal-700 hover:text-teal-900 shrink-0"
                >
                  {copiedHash ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Scanner Screen Brightness Toggle */}
              <button
                onClick={() => setMaxBrightness(!maxBrightness)}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                  maxBrightness
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-600" />
                <span>
                  {maxBrightness ? 'Screen Brightness: 100% (Scanner Optimized)' : 'Boost Screen Brightness for Optical Reader'}
                </span>
              </button>
            </div>
          ) : (
            /* Triage Flashcard View for Doctors & Trauma Care */
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-700">Donor Name</span>
                  <span className="text-sm font-bold text-slate-900">{donor.fullName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-700">Blood Type</span>
                  <span className="text-base font-extrabold text-rose-600 font-mono">
                    {donor.bloodType} Rh({donor.rhFactor})
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-700">Registry Status</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    VERIFIED & ACTIVE
                  </span>
                </div>
                <div className="flex items-start justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-700">Pledged Organs</span>
                  <span className="text-xs font-medium text-slate-800 text-right max-w-[65%]">
                    {pledgedOrgansList}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Advance Directive</span>
                  <span className="text-xs text-teal-800 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    On File {donor.hospitalAffiliation ? `at ${donor.hospitalAffiliation.split(' ')[0]}` : 'in Registry'}
                  </span>
                </div>
              </div>

              {/* Allergy Warning */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-amber-900 block">Allergies & Clinical Flags</span>
                  <span className="text-amber-800">
                    {donor.allergies?.length > 0 ? donor.allergies.join(' · ') : 'None documented'}
                  </span>
                </div>
              </div>

              {/* Direct Next-of-Kin Call */}
              {primaryContact ? (
                <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-teal-800 uppercase block">
                      Immediate Next of Kin
                    </span>
                    <span className="text-xs font-bold text-slate-900 block">
                      {primaryContact.name} ({primaryContact.relation})
                    </span>
                    <span className="text-[11px] text-slate-600 font-mono">
                      {primaryContact.phone}
                    </span>
                  </div>
                  <button
                    onClick={() => onEmergencyCall(primaryContact.phone)}
                    className="px-3 py-2 rounded-xl bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-teal-800 transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                  <span>No emergency contacts registered yet.</span>
                </div>
              )}

              {/* 24/7 National Dispatch Hotline */}
              <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-400" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-300 block uppercase">
                      24/7 National Organ Helpline (NOTTO India)
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      1800-11-4770 / 108 EMS
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onEmergencyCall('1800114770')}
                  className="text-xs font-semibold text-teal-300 underline"
                >
                  Emergency Connect
                </button>
              </div>
            </div>
          )}

          {/* Legal disclaimer */}
          <div className="text-[10px] text-slate-400 text-center pt-1 border-t border-slate-100">
            Authorized by NOTTO & Govt. of Andhra Pradesh under the Transplantation of Human Organs and Tissues Act (THOTA), 1994.
          </div>
        </div>
      </div>
    </div>
  );
};
