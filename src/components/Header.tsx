import React from 'react';
import { ShieldCheck, Bell, Activity, Bot, UserPlus, User } from 'lucide-react';
import { DonorProfile } from '../types';

interface HeaderProps {
  donor: DonorProfile;
  onOpenNotifications: () => void;
  onOpenTransitHub: () => void;
  onOpenAssistant?: () => void;
  onOpenRegister?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  donor,
  onOpenNotifications,
  onOpenTransitHub,
  onOpenAssistant,
  onOpenRegister,
}) => {
  const isRegistered = !!(donor.fullName && donor.fullName.trim().length > 0);

  return (
    <header className="pt-2 pb-4">
      {/* Top Utility Row */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          {/* Subtle brand mark with gentle pulse */}
          <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-600 shadow-xs">
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 leading-none">
              LifeRoute
            </span>
            <span className="text-[11px] font-medium text-slate-400 leading-tight">
              Emergency Organ Network
            </span>
          </div>
        </div>

        {/* Action icons with accessible 44px hitboxes */}
        <div className="flex items-center gap-1">

          {onOpenAssistant && (
            <button
              onClick={onOpenAssistant}
              aria-label="Open LifeRoute AI Assistant"
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-teal-700 bg-teal-50/80 hover:bg-teal-100 hover:text-teal-900 transition-colors border border-teal-200/50 cursor-pointer"
              title="LifeRoute AI Assistant"
            >
              <Bot className="w-5 h-5 text-teal-700" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            </button>
          )}

          <button
            onClick={onOpenTransitHub}
            aria-label="View Active Transit Network"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Live Transit Corridor"
          >
            <Activity className="w-5 h-5 text-teal-600" />
          </button>

          <button
            onClick={onOpenNotifications}
            aria-label="View Emergency Notifications"
            className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-teal-600 ring-2 ring-white" />
          </button>
        </div>
      </div>

      {/* Hero Header Welcome Banner */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>{isRegistered ? 'Welcome back,' : 'Welcome to LifeRoute,'}</span>
            <span className="text-slate-800 font-semibold">
              {donor.preferredName || donor.fullName || 'Citizen Donor'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            {isRegistered ? 'Donor Dashboard' : 'Official Organ Registry'}
          </h1>
        </div>

        {/* Registered Donor Badge Status with verified shield */}
        {isRegistered ? (
          <div
            onClick={onOpenRegister}
            className="flex items-center gap-1.5 bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-1.5 rounded-xl shadow-2xs cursor-pointer hover:bg-emerald-100 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-emerald-800 leading-tight">
                {donor.status}
              </span>
              <span className="text-[9px] font-mono text-emerald-600/90 leading-tight">
                Verified ID
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenRegister}
            className="flex items-center gap-1 bg-teal-700 hover:bg-teal-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register ID</span>
          </button>
        )}
      </div>
    </header>
  );
};
