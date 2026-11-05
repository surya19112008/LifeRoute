/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  getDocFromServer,
  Unsubscribe,
} from 'firebase/firestore';
import { DonorProfile, TransitMission, ActivityNotification } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

import bundledConfig from '../../firebase-applet-config.json';

const LOCAL_STORAGE_KEY = 'liferoute_firebase_client_config';

// Clear any previously persisted Firebase configuration per user request
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function getStoredFirebaseConfig(): FirebaseOptions | null {
  // 1. Check user override in localStorage
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.projectId && parsed.apiKey) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse stored Firebase config:', err);
    }
  }

  // 2. Check Vite env variables
  if (import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_API_KEY) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
    };
  }

  // 3. Bundled config
  if (bundledConfig && (bundledConfig as any).projectId && (bundledConfig as any).apiKey) {
    return bundledConfig as FirebaseOptions;
  }

  return null;
}

export function storeFirebaseConfig(config: FirebaseOptions): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('liferoute_firebase_config_updated'));
  }
}

export function removeStoredFirebaseConfig(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('liferoute_firebase_config_updated'));
  }
}

let activeApp: FirebaseApp | null = null;
let activeDb: Firestore | null = null;

export function initFirebase(): { app: FirebaseApp | null; db: Firestore | null } {
  const config = getStoredFirebaseConfig();
  if (!config || !config.projectId || !config.apiKey) {
    activeApp = null;
    activeDb = null;
    return { app: null, db: null };
  }

  try {
    if (getApps().length > 0) {
      activeApp = getApp();
    } else {
      activeApp = initializeApp(config);
    }
    activeDb = getFirestore(activeApp);
    return { app: activeApp, db: activeDb };
  } catch (err) {
    console.error('Failed to initialize Firebase instance:', err);
    activeApp = null;
    activeDb = null;
    return { app: null, db: null };
  }
}

export function isFirebaseConfigured(): boolean {
  return !!getStoredFirebaseConfig();
}

export async function testFirebaseConnection(): Promise<{ success: boolean; message: string }> {
  const { db } = initFirebase();
  if (!db) {
    return {
      success: false,
      message: 'Firebase is not yet configured. Please add your Firebase project credentials.',
    };
  }

  const testPath = 'test/connection';
  try {
    await getDocFromServer(doc(db, testPath));
    return {
      success: true,
      message: 'Successfully connected to Firebase Cloud Firestore! Real-time sync is active.',
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      return {
        success: false,
        message: 'Could not reach Firestore: Client is offline or database rules blocked ping.',
      };
    }
    // Check permission or other responses
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('permission-denied') || msg.includes('Missing or insufficient permissions')) {
      // Missing doc or rule read test - database is live and reachable!
      return {
        success: true,
        message: 'Reachable: Firebase Firestore cluster responded. Database is active.',
      };
    }
    return {
      success: false,
      message: `Firebase connection error: ${msg}`,
    };
  }
}

export async function testWriteToFirestore(): Promise<{ success: boolean; message: string }> {
  const { db } = initFirebase();
  if (!db) {
    return { success: false, message: 'Firebase is not initialized.' };
  }
  try {
    const pingDoc = doc(db, 'system_pings', 'connection_test');
    await setDoc(pingDoc, {
      appName: 'LifeRoute Organ Donor Network',
      connectedAt: new Date().toISOString(),
      status: 'Connected Live',
      testMessage: 'Hello from LifeRoute! Your Firestore NoSQL database is connected and syncing perfectly.',
    });
    return {
      success: true,
      message: 'Verified! Successfully wrote a live document into collection "system_pings" in your Firebase console.',
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('permission-denied') || msg.includes('Missing or insufficient permissions')) {
      return {
        success: false,
        message: 'Database reachable, but writes blocked by Firestore Security Rules. Go to Firebase Console > Firestore Database > Rules tab, allow read/write, and click Publish.',
      };
    }
    return { success: false, message: `Write error: ${msg}` };
  }
}

// ----------------------------------------------------
// Realtime Data Subscriptions & Mutations
// ----------------------------------------------------

export function subscribeToDonor(
  donorId: string,
  onUpdate: (donor: DonorProfile | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const { db } = initFirebase();
  if (!db || !donorId) {
    return () => {};
  }

  const docPath = `donors/${donorId}`;
  return onSnapshot(
    doc(db, 'donors', donorId),
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as DonorProfile);
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      console.warn('Donor subscription listener error:', err);
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.GET, docPath);
    }
  );
}

export async function saveDonorToFirestore(donor: DonorProfile): Promise<void> {
  const { db } = initFirebase();
  if (!db) return;

  const docPath = `donors/${donor.id}`;
  try {
    await setDoc(doc(db, 'donors', donor.id), {
      ...donor,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
  }
}

export function subscribeToTransits(
  onUpdate: (transits: TransitMission[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const { db } = initFirebase();
  if (!db) {
    return () => {};
  }

  const colPath = 'transits';
  const q = query(collection(db, colPath));
  return onSnapshot(
    q,
    (snap) => {
      const items: TransitMission[] = [];
      snap.forEach((d) => {
        items.push(d.data() as TransitMission);
      });
      onUpdate(items);
    },
    (err) => {
      console.warn('Transits subscription listener error:', err);
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.LIST, colPath);
    }
  );
}

export async function saveTransitToFirestore(mission: TransitMission): Promise<void> {
  const { db } = initFirebase();
  if (!db) return;

  const docPath = `transits/${mission.id}`;
  try {
    await setDoc(doc(db, 'transits', mission.id), mission);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
  }
}

export async function deleteTransitFromFirestore(id: string): Promise<void> {
  const { db } = initFirebase();
  if (!db) return;

  const docPath = `transits/${id}`;
  try {
    await deleteDoc(doc(db, 'transits', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, docPath);
  }
}

export function subscribeToNotifications(
  onUpdate: (notifications: ActivityNotification[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const { db } = initFirebase();
  if (!db) {
    return () => {};
  }

  const colPath = 'notifications';
  const q = query(collection(db, colPath));
  return onSnapshot(
    q,
    (snap) => {
      const items: ActivityNotification[] = [];
      snap.forEach((d) => {
        items.push(d.data() as ActivityNotification);
      });
      onUpdate(items);
    },
    (err) => {
      console.warn('Notifications subscription listener error:', err);
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.LIST, colPath);
    }
  );
}

export async function addNotificationToFirestore(notification: ActivityNotification): Promise<void> {
  const { db } = initFirebase();
  if (!db) return;

  const docPath = `notifications/${notification.id}`;
  try {
    await setDoc(doc(db, 'notifications', notification.id), notification);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
  }
}
