/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DonorProfile, PledgedOrgan, EmergencyContact, TransitMission } from './types';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { DigitalDonorCard } from './components/DigitalDonorCard';
import { StatusTracker } from './components/StatusTracker';
import { QuickActionsGrid } from './components/QuickActionsGrid';
import { EmergencySupportBanner } from './components/EmergencySupportBanner';
import { BottomNavBar, NavTab } from './components/BottomNavBar';

// Views
import { StatusTrackerView } from './components/views/StatusTrackerView';
import { TransitHubView } from './components/views/TransitHubView';
import { PledgeRegistryView } from './components/views/PledgeRegistryView';
import { ProfileView } from './components/views/ProfileView';

// Modals
import { EmergencyQRModal } from './components/modals/EmergencyQRModal';
import { ConsentPreferencesModal } from './components/modals/ConsentPreferencesModal';
import { NotifyFamilyModal } from './components/modals/NotifyFamilyModal';
import { DownloadCardModal } from './components/modals/DownloadCardModal';
import { EmergencyProtocolModal } from './components/modals/EmergencyProtocolModal';
import { OrganDetailModal } from './components/modals/OrganDetailModal';
import { TransitTrackerModal } from './components/modals/TransitTrackerModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { LifeRouteAssistantModal, LifeRouteAssistantFAB } from './components/LifeRouteAssistantModal';
import { OfflineCacheModal } from './components/modals/OfflineCacheModal';
import { OfflineEmergencyBanner } from './components/OfflineEmergencyBanner';
import { RegisterDonorModal } from './components/modals/RegisterDonorModal';
import { useOfflineDonor } from './hooks/useOfflineDonor';
import { PhoneCall, X } from 'lucide-react';

export default function App() {
  const {
    donor,
    setDonor,
    isProfileRegistered,
    isOnline,
    isSimulatedOffline,
    effectiveOnline,
    cachedMetadata,
    isStorageInitialized,
    isSaving,
    registerOrUpdateProfile,
    saveConsentPreferences,
    updateEmergencyContacts,
    toggleSimulatedOffline,
    forceSaveToOffline,
    getEmergencyOfflinePacket,
  } = useOfflineDonor();

  const [activeTab, setActiveTab] = useState<NavTab>('card');

  // Modals state
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);
  const [isTransitModalOpen, setIsTransitModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isCacheModalOpen, setIsCacheModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const [selectedOrgan, setSelectedOrgan] = useState<PledgedOrgan | null>(null);
  const [selectedTransitMission, setSelectedTransitMission] = useState<TransitMission | null>(null);

  // Google Maps Quota Handling (Tier 2)
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  React.useEffect(() => {
    const handler = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handler);
    return () => window.removeEventListener('gmp-quota-exceeded', handler);
  }, []);

  // Active Simulated Call Banner
  const [activeCallTarget, setActiveCallTarget] = useState<string | null>(null);

  const handleCall = (phone: string) => {
    setActiveCallTarget(phone);
    setTimeout(() => {
      setActiveCallTarget(null);
    }, 4500);
  };

  const handleSaveConsentPreferences = (
    updatedOrgans: PledgedOrgan[],
    allowResearch: boolean
  ) => {
    saveConsentPreferences(updatedOrgans, allowResearch);
  };

  const handleUpdateContacts = (contacts: EmergencyContact[]) => {
    updateEmergencyContacts(contacts);
  };

  const pledgedCount = (donor.organPreferences || []).filter((o) => o.pledged).length;
  const familyNotifiedCount = (donor.emergencyContacts || []).filter((c) => c.notified).length;

  return (
    <MobileFrame
      onQuickQR={() => setIsQRModalOpen(true)}
      onQuickDownload={() => setIsDownloadModalOpen(true)}
      isOnline={effectiveOnline}
      onToggleOffline={toggleSimulatedOffline}
    >
      {/* Emergency Offline Responder Banner */}
      {!effectiveOnline && (
        <OfflineEmergencyBanner
          isSimulated={isSimulatedOffline}
          metadata={cachedMetadata}
          onOpenQR={() => setIsQRModalOpen(true)}
          onOpenCacheInspector={() => setIsCacheModalOpen(true)}
        />
      )}

      {/* Google Maps Quota Warning Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Active Call Simulation Toast */}
      {activeCallTarget && (
        <div className="fixed top-12 left-4 right-4 sm:absolute sm:top-14 sm:left-6 sm:right-6 z-50 p-3 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center justify-between animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center animate-pulse">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block">
                Calling {activeCallTarget}...
              </span>
              <span className="text-[10px] text-emerald-300 block">
                Emergency Priority Audio Channel
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveCallTarget(null)}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Tab Content */}
      <div className="flex-1 p-4 sm:p-5 pb-6 space-y-4 overflow-y-auto">
        {activeTab === 'card' && (
          <div className="space-y-4">
            {/* Hero Header */}
            <Header
              donor={donor}
              onOpenNotifications={() => setIsNotificationsModalOpen(true)}
              onOpenTransitHub={() => setActiveTab('transit')}
              onOpenAssistant={() => setIsAssistantOpen(true)}
              onOpenRegister={() => setIsRegisterModalOpen(true)}
            />

            {/* Digital Donor Card */}
            <DigitalDonorCard
              donor={donor}
              onShowQR={() => setIsQRModalOpen(true)}
              onSelectOrgan={(organ) => setSelectedOrgan(organ)}
              onContactCall={handleCall}
              onOpenRegister={() => setIsRegisterModalOpen(true)}
              onOpenCacheInspector={() => setIsCacheModalOpen(true)}
              isOffline={!effectiveOnline}
              storageEngine={cachedMetadata?.storageEngine || 'IndexedDB'}
            />

            {/* Status Tracker Widget */}
            <StatusTracker
              donor={donor}
              onOpenDetailedTracker={() => setActiveTab('tracker')}
              onOpenTransitHub={() => {
                setSelectedTransitMission(null);
                setIsTransitModalOpen(true);
              }}
              onOpenQR={() => setIsQRModalOpen(true)}
            />

            {/* Quick Actions Grid */}
            <QuickActionsGrid
              pledgedCount={pledgedCount}
              totalOrgans={donor.organPreferences?.length || 0}
              familyNotifiedCount={familyNotifiedCount}
              totalFamily={donor.emergencyContacts?.length || 0}
              onOpenConsent={() => setIsConsentModalOpen(true)}
              onOpenNotifyFamily={() => setIsNotifyModalOpen(true)}
              onOpenDownloadCard={() => setIsDownloadModalOpen(true)}
            />

            {/* Emergency Support Banner */}
            <EmergencySupportBanner
              onOpenProtocol={() => setIsProtocolModalOpen(true)}
              onOpenTransitHub={() => setActiveTab('transit')}
            />
          </div>
        )}

        {activeTab === 'tracker' && (
          <StatusTrackerView
            donor={donor}
            onOpenQR={() => setIsQRModalOpen(true)}
            onOpenTransitPodModal={() => {
              setSelectedTransitMission(null);
              setIsTransitModalOpen(true);
            }}
          />
        )}

        {activeTab === 'transit' && (
          <TransitHubView
            onOpenLiveTracker={(mission) => {
              setSelectedTransitMission(mission || null);
              setIsTransitModalOpen(true);
            }}
            onOpenProtocol={() => setIsProtocolModalOpen(true)}
          />
        )}

        {activeTab === 'pledge' && (
          <PledgeRegistryView
            donor={donor}
            onOpenConsentModal={() => setIsConsentModalOpen(true)}
            onSelectOrgan={(organ) => setSelectedOrgan(organ)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            donor={donor}
            onOpenNotifyFamily={() => setIsNotifyModalOpen(true)}
            onOpenDownloadCard={() => setIsDownloadModalOpen(true)}
            onEmergencyCall={handleCall}
            onOpenRegister={() => setIsRegisterModalOpen(true)}
            onOpenCacheInspector={() => setIsCacheModalOpen(true)}
            metadata={cachedMetadata}
          />
        )}
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* Interactive Modals & Drawers */}
      <EmergencyQRModal
        donor={donor}
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onEmergencyCall={handleCall}
        isOffline={!effectiveOnline}
        metadata={cachedMetadata}
      />

      <ConsentPreferencesModal
        donor={donor}
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
        onSavePreferences={handleSaveConsentPreferences}
      />

      <NotifyFamilyModal
        donor={donor}
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        onUpdateContacts={handleUpdateContacts}
      />

      <DownloadCardModal
        donor={donor}
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      <EmergencyProtocolModal
        isOpen={isProtocolModalOpen}
        onClose={() => setIsProtocolModalOpen(false)}
        onOpenTransitHub={() => {
          setSelectedTransitMission(null);
          setIsTransitModalOpen(true);
        }}
      />

      <OrganDetailModal
        organ={selectedOrgan}
        onClose={() => setSelectedOrgan(null)}
        onOpenTransitHub={() => {
          setSelectedTransitMission(null);
          setIsTransitModalOpen(true);
        }}
      />

      <TransitTrackerModal
        isOpen={isTransitModalOpen}
        onClose={() => setIsTransitModalOpen(false)}
        mission={selectedTransitMission}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        donor={donor}
      />

      {/* Emergency Offline Storage Inspector Modal */}
      <OfflineCacheModal
        isOpen={isCacheModalOpen}
        onClose={() => setIsCacheModalOpen(false)}
        donor={donor}
        metadata={cachedMetadata}
        isOnline={isOnline}
        isSimulatedOffline={isSimulatedOffline}
        onToggleSimulatedOffline={toggleSimulatedOffline}
        onForceReSync={async () => {
          await forceSaveToOffline();
        }}
        offlinePacketText={getEmergencyOfflinePacket()}
      />

      {/* Register/Edit Donor Profile Modal */}
      <RegisterDonorModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        currentDonor={donor}
        onSaveProfile={async (updated) => {
          await registerOrUpdateProfile(updated);
        }}
      />

      {/* Floating AI Assistant FAB & Interactive Drawer Modal */}
      <LifeRouteAssistantFAB
        isOpen={isAssistantOpen}
        onClick={() => setIsAssistantOpen(true)}
      />

      <LifeRouteAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onOpenLiveTracker={() => {
          setIsAssistantOpen(false);
          setActiveTab('transit');
        }}
        onOpenConsent={() => {
          setIsAssistantOpen(false);
          setIsConsentModalOpen(true);
        }}
        onOpenQR={() => {
          setIsAssistantOpen(false);
          setIsQRModalOpen(true);
        }}
      />
    </MobileFrame>
  );
}
