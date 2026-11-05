import React from 'react';
import { CreditCard, Activity, Truck, Heart, User } from 'lucide-react';

export type NavTab = 'card' | 'tracker' | 'transit' | 'pledge' | 'profile';

interface BottomNavBarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    { id: 'card' as NavTab, label: 'Donor Card', icon: CreditCard },
    { id: 'tracker' as NavTab, label: 'Tracker', icon: Activity },
    { id: 'transit' as NavTab, label: 'Transit', icon: Truck },
    { id: 'pledge' as NavTab, label: 'Pledges', icon: Heart },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-2 sm:px-3">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center rounded-xl transition-all ${
                isActive
                  ? 'text-teal-700 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-lg transition-transform ${
                  isActive ? 'bg-teal-50 text-teal-700 scale-105' : ''
                }`}
              >
                <Icon
                  className={`w-4.5 h-4.5 ${
                    isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap truncate max-w-full px-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
