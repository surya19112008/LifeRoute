import React from 'react';
import { X, Bell, ShieldCheck, CheckCircle2, Clock, Info, Database } from 'lucide-react';
import { DonorProfile } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  donor?: DonorProfile;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  donor,
}) => {
  if (!isOpen) return null;

  const pledgedCount = donor?.organPreferences?.filter((o) => o.pledged).length || 0;
  const verifiedContactsCount = donor?.emergencyContacts?.filter((c) => c.notified).length || 0;

  const liveEvents = [
    {
      id: 'e1',
      title: 'Disaster Offline Cache Synchronized',
      time: 'Live',
      desc: 'All records encrypted in local IndexedDB storage for offline first-responder access.',
      type: 'db',
    },
    {
      id: 'e2',
      title: donor?.fullName
        ? `Registry Verified: ${donor.fullName}`
        : 'Official Donor Card Ready',
      time: donor?.lastVerifiedDate || 'Current',
      desc: `Legal declaration confirmed under ID #${donor?.registryId || 'NOTTO-LR'} with ${pledgedCount} organs pledged for life-saving transplant.`,
      type: 'success',
    },
    {
      id: 'e3',
      title: `${verifiedContactsCount} Next-of-Kin Contacts Armed`,
      time: 'Active',
      desc: donor?.emergencyContacts?.length
        ? `Emergency contact ${donor.emergencyContacts[0].name} designated for first-responder verification.`
        : 'Add family next-of-kin contacts to ensure rapid hospital consensus.',
      type: 'info',
    },
    {
      id: 'e4',
      title: 'Emergency QR Token Validated',
      time: '24/7 Verified',
      desc: 'High-contrast optical QR code ready for paramedic and green corridor police scanner terminals.',
      type: 'shield',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Bell className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Live Registry Activity
              </h3>
              <p className="text-xs text-slate-500">
                Real-time security updates & sync status
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

        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          {liveEvents.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  {item.type === 'db' && <Database className="w-3.5 h-3.5 text-teal-600" />}
                  {item.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  {item.type === 'info' && <Info className="w-3.5 h-3.5 text-cyan-600" />}
                  {item.type === 'shield' && <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />}
                  <span>{item.title}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {item.time}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
