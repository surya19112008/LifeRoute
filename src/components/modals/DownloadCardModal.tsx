import React, { useState } from 'react';
import {
  X,
  Download,
  Smartphone,
  Printer,
  CheckCircle2,
  Share2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Heart,
} from 'lucide-react';
import { DonorProfile } from '../../types';

interface DownloadCardModalProps {
  donor: DonorProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadCardModal: React.FC<DownloadCardModalProps> = ({
  donor,
  isOpen,
  onClose,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [activeFormat, setActiveFormat] = useState<'wallet' | 'printable' | 'lockscreen'>('wallet');

  if (!isOpen) return null;

  const triggerDownload = (type: string) => {
    setDownloadSuccess(`Successfully prepared your ${type}! Downloading...`);
    if (type === 'Printable Physical Card') {
      window.print();
    }
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3000);
  };

  const primaryContact = donor.emergencyContacts?.find((c) => c.isPrimary) || donor.emergencyContacts?.[0];
  const contactName = primaryContact?.name || 'Next of Kin Documented';
  const contactPhone = primaryContact?.phone || 'Emergency Services 108';
  const pledgedNames = (donor.organPreferences || []).filter((o) => o.pledged).map((o) => o.name).join(', ') || 'No organs selected';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Download className="w-5 h-5 text-cyan-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Download Digital Donor Card
              </h3>
              <p className="text-xs text-slate-500">
                Keep your legal donor credentials accessible anywhere offline
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

        {/* Tab Format Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1 gap-1">
          <button
            onClick={() => setActiveFormat('wallet')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeFormat === 'wallet'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mobile Wallet
          </button>
          <button
            onClick={() => setActiveFormat('printable')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeFormat === 'printable'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Physical Wallet Card
          </button>
          <button
            onClick={() => setActiveFormat('lockscreen')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeFormat === 'lockscreen'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lock Screen Wallpaper
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {downloadSuccess && (
            <div className="p-3 bg-cyan-50 border border-cyan-200 text-cyan-900 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {activeFormat === 'wallet' && (
            <div className="space-y-4 text-center">
              {/* Apple / Google Wallet pass card mockup */}
              <div className="max-w-xs mx-auto rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 text-white p-5 shadow-xl border border-slate-800 text-left relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <span className="text-xs font-bold tracking-tight">LifeRoute Organ Donor Pass</span>
                  </div>
                  <span className="text-[10px] font-mono text-teal-400 font-semibold">
                    {donor.bloodType}
                  </span>
                </div>

                <div className="py-3 space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase">Donor Name</span>
                  <span className="text-sm font-bold block">{donor.fullName}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left py-2 border-t border-slate-800 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Registry ID</span>
                    <span className="font-mono text-teal-300 font-semibold">{donor.registryId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Next of Kin</span>
                    <span className="font-medium text-slate-200">{contactName}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-8 h-8 text-white/90" />
                    <span className="text-[9px] text-slate-400 leading-tight">
                      First Responder Tap/Scan Compatible
                    </span>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
              </div>

              {/* Wallet Integration Actions */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => triggerDownload('Apple Wallet Pass (.pkpass)')}
                  className="p-3 rounded-2xl bg-black text-white hover:bg-slate-900 flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Add to Apple Wallet</span>
                </button>
                <button
                  onClick={() => triggerDownload('Google Wallet Pass')}
                  className="p-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Save to Google Wallet</span>
                </button>
              </div>
            </div>
          )}

          {activeFormat === 'printable' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 text-center">
                Printable ISO/IEC 7810 ID-1 standard wallet card format. Fits standard driver's license card holders.
              </p>

              {/* Printable Physical Card Front & Back Preview */}
              <div className="border-2 border-dashed border-slate-300 p-4 rounded-2xl bg-slate-50 space-y-3">
                {/* Front Side */}
                <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-xs relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5 text-teal-800 font-extrabold text-xs">
                        <span>LIFEROUTE INDIA · AP JEEVANDAN DONOR CARD</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        Official Declaration under THOTA Act, 1994 (Govt. of India)
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-rose-600 font-mono bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {donor.bloodType} Rh({donor.rhFactor})
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={donor.avatarUrl}
                      alt={donor.fullName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">{donor.fullName}</span>
                      <span className="text-[11px] text-slate-500 font-mono block">ID: {donor.registryId}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">ORGANS: {pledgedNames}</span>
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-300 shadow-xs text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 border-b pb-1">
                    <span>EMERGENCY DISPATCH & NEXT OF KIN</span>
                    <span className="text-teal-700 font-mono">1800-11-4770 / 108</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Primary: <span className="font-bold text-slate-900">{contactName}</span> ({contactPhone})
                  </div>
                  <div className="text-[10px] text-slate-400 italic">
                    "I hereby pledge my organs & tissues in accordance with THOTA Act, 1994 (India) & AP Jeevandan Program."
                  </div>
                </div>
              </div>

              <button
                onClick={() => triggerDownload('Printable Physical Card')}
                className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Wallet Card (Front & Back)</span>
              </button>
            </div>
          )}

          {activeFormat === 'lockscreen' && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-600">
                Paramedics often check your phone's lock screen during unresponsive emergencies before unlocking it.
              </p>

              {/* Phone Lock Screen Preview */}
              <div className="w-44 mx-auto rounded-3xl bg-slate-900 text-white p-3 shadow-lg border-2 border-slate-700 text-center space-y-2">
                <div className="text-2xl font-light tracking-tight mt-1">09:41</div>
                <div className="text-[9px] text-slate-400">Wednesday, November 5</div>

                {/* Lock screen emergency widget */}
                <div className="bg-slate-800/90 rounded-2xl p-2.5 border border-slate-700 text-left space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-rose-400 font-bold">
                    <span>ORGAN DONOR</span>
                    <span>{donor.bloodType}</span>
                  </div>
                  <span className="text-[11px] font-bold block truncate">{donor.fullName || 'Citizen Donor'}</span>
                  <span className="text-[9px] text-slate-400 block truncate">ICE: {contactPhone}</span>
                </div>
              </div>

              <button
                onClick={() => triggerDownload('Emergency Lock-Screen Wallpaper')}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Emergency Lock-Screen Image</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
