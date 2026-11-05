/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WifiOff, Database, ShieldAlert, Phone, QrCode, FileText, ChevronRight } from 'lucide-react';
import { OfflineCacheMetadata } from '../services/donorOfflineStorage';

interface OfflineEmergencyBannerProps {
  isSimulated: boolean;
  metadata: OfflineCacheMetadata | null;
  onOpenQR: () => void;
  onOpenCacheInspector: () => void;
  onCallPrimaryContact?: () => void;
  primaryContactName?: string;
}

export const OfflineEmergencyBanner: React.FC<OfflineEmergencyBannerProps> = ({
  isSimulated,
  metadata,
  onOpenQR,
  onOpenCacheInspector,
  onCallPrimaryContact,
  primaryContactName,
}) => {
  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white px-3.5 py-2.5 sm:px-4 shadow-md sticky top-0 z-40 border-b border-amber-500/40 animate-in slide-in-from-top-2 duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Left: Offline Status & Storage Indicator */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 text-white flex items-center justify-center shrink-0">
            <WifiOff className="w-4 h-4 text-amber-200" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-black tracking-wide uppercase text-white leading-tight">
                Emergency Offline Mode
              </span>
              <span className="text-[10px] bg-amber-950/80 text-amber-200 px-1.5 py-0.5 rounded font-mono font-semibold border border-amber-400/40">
                {metadata?.storageEngine || 'IndexedDB'} Cached
              </span>
              {isSimulated && (
                <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded font-semibold uppercase">
                  Drill / Test
                </span>
              )}
            </div>
            <p className="text-[11px] text-amber-100/90 truncate leading-tight mt-0.5">
              Serving verified digital card & contacts without internet
            </p>
          </div>
        </div>

        {/* Right: Emergency Responders Quick Actions */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          <button
            onClick={onOpenQR}
            className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
            title="Scan Offline QR Code"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-200" />
            <span>Offline QR</span>
          </button>

          <button
            onClick={onOpenCacheInspector}
            className="px-2.5 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-amber-50 active:scale-95 text-xs font-bold flex items-center gap-1 transition-all shadow-xs"
            title="Inspect Offline Security & Cache Packet"
          >
            <Database className="w-3.5 h-3.5 text-amber-700" />
            <span>Cache Info</span>
          </button>
        </div>
      </div>
    </div>
  );
};
