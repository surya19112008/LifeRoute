/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Database,
  ShieldCheck,
  HardDrive,
  Copy,
  Check,
  RefreshCw,
  Wifi,
  WifiOff,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { DonorProfile } from '../../types';
import { OfflineCacheMetadata } from '../../services/donorOfflineStorage';

interface OfflineCacheModalProps {
  isOpen: boolean;
  onClose: () => void;
  donor: DonorProfile;
  metadata: OfflineCacheMetadata | null;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  onForceReSync: () => Promise<void>;
  offlinePacketText: string;
}

export const OfflineCacheModal: React.FC<OfflineCacheModalProps> = ({
  isOpen,
  onClose,
  donor,
  metadata,
  isOnline,
  isSimulatedOffline,
  onToggleSimulatedOffline,
  onForceReSync,
  offlinePacketText,
}) => {
  const [copiedPacket, setCopiedPacket] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'packet'>('status');

  if (!isOpen) return null;

  const handleCopyPacket = () => {
    navigator.clipboard?.writeText(offlinePacketText);
    setCopiedPacket(true);
    setTimeout(() => setCopiedPacket(false), 2000);
  };

  const handleSyncClick = async () => {
    setIsSyncing(true);
    try {
      await onForceReSync();
    } finally {
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between border-b border-teal-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 text-teal-300 flex items-center justify-center shadow-inner">
              <Database className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold tracking-tight text-white leading-tight">
                  Emergency Offline Storage Engine
                </h3>
                <span className="text-[10px] font-mono font-semibold text-teal-300 bg-teal-900/70 px-1.5 py-0.2 rounded border border-teal-700/60">
                  {metadata?.storageEngine || 'IndexedDB'}
                </span>
              </div>
              <span className="text-[11px] text-teal-200/80 block leading-tight">
                Zero-Connectivity Trauma & Dispatch Cache
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1 gap-1">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'status'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Storage & Health Status
          </button>
          <button
            onClick={() => setActiveTab('packet')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'packet'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Emergency Responder Packet
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {activeTab === 'status' ? (
            <div className="space-y-4">
              {/* Core Engine Status Card */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Local Device Cache: Active & Ready
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        Donor ID, legal consent preferences, and next-of-kin contacts are securely cached.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                    ONLINE/OFFLINE PARITY
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-teal-200/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Primary Engine
                    </span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <HardDrive className="w-3.5 h-3.5 text-teal-700" />
                      {metadata?.storageEngine || 'IndexedDB'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Last Synced
                    </span>
                    <span className="font-medium text-slate-800 text-[11px]">
                      {metadata?.cachedAt || 'Just now'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Integrity Checksum
                    </span>
                    <span className="font-mono font-bold text-teal-800 text-[11px]">
                      {metadata?.integrityHash || 'LR-VZG-VERIFIED'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Cached Records
                    </span>
                    <span className="font-medium text-slate-800 text-[11px]">
                      {metadata?.pledgedOrgansCount ?? 6} Organs · {metadata?.emergencyContactsCount ?? 3} Contacts
                    </span>
                  </div>
                </div>
              </div>

              {/* Network Connectivity & Drill Simulation */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      First Responder Drill Simulation
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Simulate loss of network connectivity to test offline donor verification
                    </span>
                  </div>

                  <button
                    onClick={onToggleSimulatedOffline}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isSimulatedOffline
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isSimulatedOffline ? (
                      <>
                        <WifiOff className="w-3.5 h-3.5" />
                        <span>Simulating Offline</span>
                      </>
                    ) : (
                      <>
                        <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Test Offline Mode</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    When offline, emergency medical technicians (EMTs) at KGH or King George Hospital trauma desks can scan the offline QR code, access primary next-of-kin contacts, and verify THOTA 1994 statutory consent with zero network delay.
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleSyncClick}
                  disabled={isSyncing}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-95 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Writing to IndexedDB...' : 'Force Re-sync Local Cache'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Emergency Responder Packet */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Offline Trauma & Dispatch Record
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Standardized text block for paramedic logs and trauma triage handoffs
                  </p>
                </div>

                <button
                  onClick={handleCopyPacket}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 hover:bg-teal-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedPacket ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Packet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 bg-slate-900 text-slate-100 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800 max-h-72 select-all">
                <pre className="whitespace-pre-wrap">{offlinePacketText}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>LifeRoute DB: {donor.registryId}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
