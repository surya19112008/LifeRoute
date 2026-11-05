/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { DonorProfile, PledgedOrgan, EmergencyContact } from '../types';
import { createBlankDonorProfile } from '../data/donorDefaults';
import {
  saveDonorToOfflineStorage,
  loadDonorFromOfflineStorage,
  clearOfflineStorage,
  OfflineCacheMetadata,
  generateEmergencyOfflinePacket,
} from '../services/donorOfflineStorage';
import {
  isFirebaseConfigured,
  subscribeToDonor,
  saveDonorToFirestore,
} from '../services/firebase';

export interface UseOfflineDonorResult {
  donor: DonorProfile;
  setDonor: React.Dispatch<React.SetStateAction<DonorProfile>>;
  isProfileRegistered: boolean;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  effectiveOnline: boolean;
  isFirebaseLive: boolean;
  firebaseStatusMsg: string;
  cachedMetadata: OfflineCacheMetadata | null;
  isStorageInitialized: boolean;
  isSaving: boolean;
  registerOrUpdateProfile: (updatedProfile: DonorProfile) => Promise<void>;
  saveConsentPreferences: (updatedOrgans: PledgedOrgan[], allowResearch: boolean) => Promise<void>;
  updateEmergencyContacts: (contacts: EmergencyContact[]) => Promise<void>;
  toggleSimulatedOffline: () => void;
  resetToDefault: () => Promise<void>;
  forceSaveToOffline: () => Promise<OfflineCacheMetadata>;
  getEmergencyOfflinePacket: () => string;
  checkFirebaseConnection: () => Promise<{ success: boolean; message: string }>;
}

export function useOfflineDonor(): UseOfflineDonorResult {
  const [donor, setDonor] = useState<DonorProfile>(() => createBlankDonorProfile());
  const [cachedMetadata, setCachedMetadata] = useState<OfflineCacheMetadata | null>(null);
  const [isStorageInitialized, setIsStorageInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFirebaseLive, setIsFirebaseLive] = useState(false);
  const [firebaseStatusMsg, setFirebaseStatusMsg] = useState('');

  // Network Connectivity
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);

  const isHydrating = useRef(true);

  // 1. Listen to real network connectivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. Initial hydration from IndexedDB / localStorage
  useEffect(() => {
    let isMounted = true;

    async function hydrateCache() {
      try {
        const cached = await loadDonorFromOfflineStorage();
        if (cached && cached.donor && isMounted) {
          setDonor(cached.donor);
          setCachedMetadata(cached.metadata);
        } else if (isMounted) {
          // If no cache exists, initialize with a clean blank template
          const blank = createBlankDonorProfile();
          const meta = await saveDonorToOfflineStorage(blank);
          if (isMounted) {
            setDonor(blank);
            setCachedMetadata(meta);
          }
        }
      } catch (err) {
        console.error('Failed to initialize offline cache:', err);
      } finally {
        if (isMounted) {
          setIsStorageInitialized(true);
          isHydrating.current = false;
        }
      }
    }

    hydrateCache();

    // Cross-tab sync listener
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<OfflineCacheMetadata>;
      if (customEvent.detail) {
        setCachedMetadata(customEvent.detail);
      }
    };
    window.addEventListener('liferoute-cache-updated', handleSync);

    return () => {
      isMounted = false;
      window.removeEventListener('liferoute-cache-updated', handleSync);
    };
  }, []);

  // 3. Local real-time mode active
  const checkFirebaseConnection = useCallback(async () => {
    setIsFirebaseLive(false);
    const msg = 'Local real-time mode active.';
    setFirebaseStatusMsg(msg);
    return { success: false, message: msg };
  }, []);

  useEffect(() => {
    checkFirebaseConnection();

    const handleConfigChange = () => {
      checkFirebaseConnection();
    };
    window.addEventListener('liferoute_firebase_config_updated', handleConfigChange);
    return () => {
      window.removeEventListener('liferoute_firebase_config_updated', handleConfigChange);
    };
  }, [checkFirebaseConnection]);

  // Real-time Firestore subscription to active donor
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const primaryTargetId = donor.id || 'donor_live_main';
    let unsub: (() => void) | null = null;
    try {
      unsub = subscribeToDonor(
        primaryTargetId,
        (liveDonor) => {
          if (liveDonor && liveDonor.fullName) {
            setDonor(liveDonor);
            saveDonorToOfflineStorage(liveDonor).then((m) => setCachedMetadata(m));
          } else if (!liveDonor && primaryTargetId !== 'donor_live_main') {
            // Also listen to donor_live_main
            subscribeToDonor('donor_live_main', (fallbackDoc) => {
              if (fallbackDoc && fallbackDoc.fullName) {
                setDonor(fallbackDoc);
                saveDonorToOfflineStorage(fallbackDoc).then((m) => setCachedMetadata(m));
              }
            });
          }
        },
        (err) => {
          console.warn('Realtime donor sync listener paused:', err.message);
        }
      );
    } catch (e) {
      console.warn('Could not establish real-time donor listener:', e);
    }

    return () => {
      if (unsub) unsub();
    };
  }, [donor.id, isFirebaseLive]);

  // 4. Register or Update full Profile
  const registerOrUpdateProfile = useCallback(
    async (updatedProfile: DonorProfile) => {
      setIsSaving(true);
      const profileToSave: DonorProfile = {
        ...updatedProfile,
        lastVerifiedDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
      };

      setDonor(profileToSave);

      try {
        const meta = await saveDonorToOfflineStorage(profileToSave);
        setCachedMetadata(meta);

        if (isFirebaseConfigured()) {
          await saveDonorToFirestore(profileToSave);
        }
      } catch (err) {
        console.error('Failed to persist profile:', err);
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  // 5. Save consent preferences
  const saveConsentPreferences = useCallback(
    async (updatedOrgans: PledgedOrgan[], allowResearch: boolean) => {
      setIsSaving(true);
      const updatedDonor: DonorProfile = {
        ...donor,
        organPreferences: updatedOrgans,
        allowResearch,
        lastVerifiedDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
      };

      setDonor(updatedDonor);

      try {
        const meta = await saveDonorToOfflineStorage(updatedDonor);
        setCachedMetadata(meta);

        if (isFirebaseConfigured()) {
          await saveDonorToFirestore(updatedDonor);
        }
      } catch (err) {
        console.error('Failed to persist consent preferences:', err);
      } finally {
        setIsSaving(false);
      }
    },
    [donor]
  );

  // 6. Update emergency contacts
  const updateEmergencyContacts = useCallback(
    async (contacts: EmergencyContact[]) => {
      setIsSaving(true);
      const updatedDonor: DonorProfile = {
        ...donor,
        emergencyContacts: contacts,
      };

      setDonor(updatedDonor);

      try {
        const meta = await saveDonorToOfflineStorage(updatedDonor);
        setCachedMetadata(meta);

        if (isFirebaseConfigured()) {
          await saveDonorToFirestore(updatedDonor);
        }
      } catch (err) {
        console.error('Failed to persist emergency contacts:', err);
      } finally {
        setIsSaving(false);
      }
    },
    [donor]
  );

  // 7. Force save current state to offline storage
  const forceSaveToOffline = useCallback(async (): Promise<OfflineCacheMetadata> => {
    setIsSaving(true);
    try {
      const meta = await saveDonorToOfflineStorage(donor);
      setCachedMetadata(meta);
      return meta;
    } finally {
      setIsSaving(false);
    }
  }, [donor]);

  // 8. Reset to default blank state and wipe storage
  const resetToDefault = useCallback(async () => {
    setIsSaving(true);
    try {
      await clearOfflineStorage();
      const blank = createBlankDonorProfile();
      const meta = await saveDonorToOfflineStorage(blank);
      setDonor(blank);
      setCachedMetadata(meta);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // 9. Toggle offline simulation
  const toggleSimulatedOffline = useCallback(() => {
    setIsSimulatedOffline((prev) => !prev);
  }, []);

  // 10. Generate emergency offline packet
  const getEmergencyOfflinePacket = useCallback(() => {
    return generateEmergencyOfflinePacket(donor, cachedMetadata);
  }, [donor, cachedMetadata]);

  const effectiveOnline = isOnline && !isSimulatedOffline;
  const isProfileRegistered = !!(donor.fullName && donor.fullName.trim().length > 0);

  return {
    donor,
    setDonor,
    isProfileRegistered,
    isOnline,
    isSimulatedOffline,
    effectiveOnline,
    isFirebaseLive,
    firebaseStatusMsg,
    cachedMetadata,
    isStorageInitialized,
    isSaving,
    registerOrUpdateProfile,
    saveConsentPreferences,
    updateEmergencyContacts,
    toggleSimulatedOffline,
    resetToDefault,
    forceSaveToOffline,
    getEmergencyOfflinePacket,
    checkFirebaseConnection,
  };
}
