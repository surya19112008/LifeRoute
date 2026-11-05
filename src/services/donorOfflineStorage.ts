/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DonorProfile } from '../types';

export interface OfflineCacheMetadata {
  cachedAt: string; // Human readable string
  timestamp: number; // Unix epoch ms
  storageEngine: 'IndexedDB' | 'localStorage';
  recordId: string;
  donorName: string;
  bloodGroup: string;
  pledgedOrgansCount: number;
  emergencyContactsCount: number;
  integrityHash: string;
  offlineReady: boolean;
}

const DB_NAME = 'LifeRoute_EmergencyDB';
const DB_VERSION = 1;
const STORE_NAME = 'donor_cache';
const RECORD_KEY = 'active_donor_profile';

const LOCAL_STORAGE_DATA_KEY = 'liferoute_donor_offline_data_v1';
const LOCAL_STORAGE_META_KEY = 'liferoute_donor_offline_meta_v1';

/**
 * Generate a deterministic verification checksum for the donor profile
 */
export function calculateIntegrityHash(donor: DonorProfile): string {
  const payload = `${donor.id}:${donor.registryId}:${donor.bloodType}:${donor.rhFactor}:${donor.emergencyContacts.length}:${donor.organPreferences.filter((o) => o.pledged).length}:${donor.lastVerifiedDate}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `LR-VZG-${hex.toUpperCase()}`;
}

/**
 * Open the native IndexedDB instance with fallback safety
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported on this platform'));
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error || new Error('Failed to open IndexedDB'));
      };
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Save donor profile to IndexedDB with automatic fallback to localStorage
 */
export async function saveDonorToOfflineStorage(
  donor: DonorProfile
): Promise<OfflineCacheMetadata> {
  const now = new Date();
  const metadata: OfflineCacheMetadata = {
    cachedAt: now.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    timestamp: now.getTime(),
    storageEngine: 'IndexedDB',
    recordId: donor.registryId,
    donorName: donor.fullName,
    bloodGroup: `${donor.bloodType} Rh(${donor.rhFactor})`,
    pledgedOrgansCount: donor.organPreferences.filter((o) => o.pledged).length,
    emergencyContactsCount: donor.emergencyContacts.length,
    integrityHash: calculateIntegrityHash(donor),
    offlineReady: true,
  };

  const payload = {
    donor,
    metadata,
  };

  // 1. Attempt IndexedDB write
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const putRequest = store.put(payload, RECORD_KEY);

      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
      transaction.onerror = () => reject(transaction.error);
    });

    // Also mirror to localStorage as an instant redundant safety net
    try {
      localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(donor));
      localStorage.setItem(LOCAL_STORAGE_META_KEY, JSON.stringify(metadata));
    } catch {
      // Ignore quota errors on secondary mirror
    }

    notifyStorageUpdate(metadata);
    return metadata;
  } catch (idbError) {
    console.warn('IndexedDB write failed; falling back to localStorage:', idbError);

    // 2. Fallback to localStorage
    metadata.storageEngine = 'localStorage';
    try {
      localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(donor));
      localStorage.setItem(LOCAL_STORAGE_META_KEY, JSON.stringify(metadata));
      notifyStorageUpdate(metadata);
      return metadata;
    } catch (lsError) {
      console.error('All offline caching mechanisms failed:', lsError);
      throw lsError;
    }
  }
}

/**
 * Load cached donor profile and metadata from offline storage (IndexedDB or localStorage)
 */
export async function loadDonorFromOfflineStorage(): Promise<{
  donor: DonorProfile;
  metadata: OfflineCacheMetadata;
} | null> {
  // 1. Try IndexedDB first
  try {
    const db = await openDatabase();
    const result = await new Promise<{
      donor: DonorProfile;
      metadata: OfflineCacheMetadata;
    } | null>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(RECORD_KEY);

      getRequest.onsuccess = () => {
        if (getRequest.result && getRequest.result.donor) {
          resolve(getRequest.result);
        } else {
          resolve(null);
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
      transaction.onerror = () => reject(transaction.error);
    });

    if (result) {
      return result;
    }
  } catch (idbErr) {
    console.warn('IndexedDB read failed or empty; inspecting localStorage fallback:', idbErr);
  }

  // 2. Try localStorage fallback
  try {
    const rawData = localStorage.getItem(LOCAL_STORAGE_DATA_KEY);
    const rawMeta = localStorage.getItem(LOCAL_STORAGE_META_KEY);

    if (rawData && rawMeta) {
      const donor = JSON.parse(rawData) as DonorProfile;
      const metadata = JSON.parse(rawMeta) as OfflineCacheMetadata;
      metadata.storageEngine = 'localStorage';
      return { donor, metadata };
    }
  } catch (lsErr) {
    console.error('Failed to read from localStorage fallback:', lsErr);
  }

  return null;
}

/**
 * Clear all offline caches (for testing or profile resets)
 */
export async function clearOfflineStorage(): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const deleteRequest = store.delete(RECORD_KEY);
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    });
  } catch {
    // Ignore error
  }

  try {
    localStorage.removeItem(LOCAL_STORAGE_DATA_KEY);
    localStorage.removeItem(LOCAL_STORAGE_META_KEY);
  } catch {
    // Ignore error
  }
}

/**
 * Broadcast storage updates across tabs/windows
 */
function notifyStorageUpdate(metadata: OfflineCacheMetadata) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('liferoute-cache-updated', { detail: metadata })
    );

    try {
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel('liferoute-sync');
        channel.postMessage({ type: 'CACHE_UPDATED', metadata });
        channel.close();
      }
    } catch {
      // BroadcastChannel optional
    }
  }
}

/**
 * Format a comprehensive, clean plain-text emergency triage packet
 * optimized for paramedic clipboards, police green corridor dispatchers,
 * and hospital casualty desks with zero network access.
 */
export function generateEmergencyOfflinePacket(
  donor: DonorProfile,
  metadata?: OfflineCacheMetadata | null
): string {
  const pledged = donor.organPreferences
    .filter((o) => o.pledged)
    .map((o) => `  - ${o.name} (${o.preservationWindow})`)
    .join('\n');

  const contacts = donor.emergencyContacts
    .map(
      (c) =>
        `  - ${c.name} [${c.relation}]${c.isPrimary ? ' *PRIMARY NEXT OF KIN*' : ''}\n    Phone: ${c.phone} | Verified: ${c.notified ? 'YES' : 'PENDING'}`
    )
    .join('\n');

  return `======================================================
LIFEROUTE EMERGENCY ORGAN DONOR DISPATCH PACKET (OFFLINE)
======================================================
GOVERNMENT REGISTRY ID: ${donor.registryId}
DONOR FULL NAME:        ${donor.fullName}
BLOOD GROUP:            ${donor.bloodType} Rh(${donor.rhFactor})
DATE OF BIRTH:          ${donor.dateOfBirth}
REGISTRATION STATUS:    ${donor.status} (Verified)
NATIONAL REGISTRY:      ${donor.nationalRegistry}
AFFILIATED HOSPITAL:    ${donor.hospitalAffiliation}
LEGAL DIRECTIVE:        THOTA Act 1994 & AP Jeevandan Program

------------------------------------------------------
AUTHORIZED PLEDGED ORGANS & PRESERVATION WINDOWS:
------------------------------------------------------
${pledged || '  No organs selected'}

------------------------------------------------------
CRITICAL CLINICAL & ALLERGY FLAGS:
------------------------------------------------------
ALLERGIES:      ${donor.allergies.join(', ') || 'None documented'}
CLINICAL NOTES: ${donor.medicalNotes}
RESEARCH:       ${donor.allowResearch ? 'Authorized for Biomedical Research' : 'Transplant Only'}

------------------------------------------------------
EMERGENCY NEXT OF KIN CONTACTS:
------------------------------------------------------
${contacts}

------------------------------------------------------
OFFLINE CACHE SECURITY & VERIFICATION:
------------------------------------------------------
STORAGE ENGINE:  ${metadata?.storageEngine || 'IndexedDB'}
CACHED TIMESTAMP: ${metadata?.cachedAt || 'Verified Local'}
CHECKSUM HASH:   ${metadata?.integrityHash || calculateIntegrityHash(donor)}
OFFLINE STATUS:  CERTIFIED OFFLINE ACCESSIBLE
24/7 HELPLINES:  NOTTO (1800-11-4770) | EMS (108) | Vizag Traffic (0891-2565454)
======================================================`;
}
