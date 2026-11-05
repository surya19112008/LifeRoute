import React, { useState } from 'react';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  Wifi,
  Signal,
  Battery,
  Shield,
  Heart,
  QrCode,
  Share2,
  WifiOff,
  Database,
} from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  onQuickQR: () => void;
  onQuickDownload: () => void;
  isOnline?: boolean;
  onToggleOffline?: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  onQuickQR,
  onQuickDownload,
  isOnline = true,
  onToggleOffline,
}) => {
  const [deviceMode, setDeviceMode] = useState<'device' | 'fluid'>('device');
  const [currentTime] = useState('09:41');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4">
      {/* Desktop Helper Toolbar (Hidden on small screens) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-4xl mb-4 px-2">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-800">LifeRoute Mobile Applet</span>
          <span className="text-slate-400">·</span>
          <span>Emergency Organ Transit & Citizen Donor Registry</span>
        </div>

        {/* Viewport mode toggle & fast test triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={onQuickQR}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-teal-800 text-xs font-semibold hover:bg-teal-50 flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-teal-600" />
            <span>Emergency QR</span>
          </button>

          <button
            onClick={onQuickDownload}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Download Card</span>
          </button>

          {onToggleOffline && (
            <button
              onClick={onToggleOffline}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors ${
                !isOnline
                  ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Test offline IndexedDB availability for emergency responders"
            >
              {!isOnline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>Offline Active</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Drill Offline</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setDeviceMode('device')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                deviceMode === 'device'
                  ? 'bg-teal-50 text-teal-800'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="View in Mobile Screen Shell"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Shell</span>
            </button>
            <button
              onClick={() => setDeviceMode('fluid')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                deviceMode === 'fluid'
                  ? 'bg-teal-50 text-teal-800'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Expand to Full Width"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Width</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          deviceMode === 'device'
            ? 'sm:max-w-[420px] sm:rounded-[44px] sm:border-[9px] sm:border-slate-800 sm:shadow-2xl sm:shadow-slate-900/20 sm:overflow-hidden bg-slate-50 relative'
            : 'max-w-3xl sm:rounded-3xl sm:border border-slate-200 bg-slate-50 shadow-sm relative'
        }`}
      >
        {/* Realistic Mobile Status Bar (Visible in device mode or native) */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-6 pt-3 pb-2 flex items-center justify-between text-slate-900 border-b border-slate-100 select-none">
          {/* Left Time */}
          <span className="text-xs font-bold font-mono tracking-tight">
            {currentTime}
          </span>

          {/* Dynamic Island Pill (In Device Mode) */}
          {deviceMode === 'device' && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-black text-white rounded-full text-[10px] shadow-sm animate-pulse-subtle">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-medium text-[9px] text-slate-200">
                LifeRoute Active
              </span>
            </div>
          )}

          {/* Right Status Icons */}
          <div className="flex items-center gap-1.5 text-slate-700">
            <Signal className="w-3.5 h-3.5" />
            {!isOnline ? (
              <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-700 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300">
                <WifiOff className="w-2.5 h-2.5 text-amber-700" />
                <span>OFFLINE</span>
              </span>
            ) : (
              <Wifi className="w-3.5 h-3.5" />
            )}
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Child Screen Body */}
        <div className="min-h-[80vh] sm:min-h-[780px] flex flex-col justify-between">
          {children}
        </div>

        {/* Home Indicator Bar for iOS feel in device mode */}
        {deviceMode === 'device' && (
          <div className="hidden sm:flex justify-center pb-2 pt-1 bg-white">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
