/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { TransitMission } from '../types';
import {
  isFirebaseConfigured,
  subscribeToTransits,
  saveTransitToFirestore,
  deleteTransitFromFirestore,
} from '../services/firebase';

import { DEFAULT_TRANSITS } from '../data/defaultTransits';

const LOCAL_STORAGE_TRANSITS_KEY = 'liferoute_live_transits_data_v1';

export function useRealtimeTransits() {
  const [transits, setTransits] = useState<TransitMission[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_TRANSITS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse local transits:', e);
      }
    }
    return DEFAULT_TRANSITS;
  });

  // Save to localStorage whenever transits change locally
  const persistLocally = useCallback((items: TransitMission[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_TRANSITS_KEY, JSON.stringify(items));
        window.dispatchEvent(new CustomEvent('liferoute-transits-updated'));
      } catch (e) {
        console.warn('Failed to persist transits to storage:', e);
      }
    }
  }, []);

  // Listen to Firestore real-time updates when configured
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    let unsub: (() => void) | null = null;
    try {
      unsub = subscribeToTransits((liveItems) => {
        if (Array.isArray(liveItems)) {
          setTransits(liveItems);
          persistLocally(liveItems);
        }
      });
    } catch (err) {
      console.warn('Transit Firestore listener skipped:', err);
    }

    return () => {
      if (unsub) unsub();
    };
  }, [persistLocally]);

  // Dispatch / create a new transit mission
  const addTransit = useCallback(
    async (missionData: Omit<TransitMission, 'id' | 'createdAt'>) => {
      const newMission: TransitMission = {
        ...missionData,
        id: `TX-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
      };

      const updated = [newMission, ...transits];
      setTransits(updated);
      persistLocally(updated);

      if (isFirebaseConfigured()) {
        try {
          await saveTransitToFirestore(newMission);
        } catch (e) {
          console.warn('Could not save transit to Firestore:', e);
        }
      }
      return newMission;
    },
    [transits, persistLocally]
  );

  // Update status or telemetry
  const updateTransitStatus = useCallback(
    async (id: string, updates: Partial<TransitMission>) => {
      const updated = transits.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      setTransits(updated);
      persistLocally(updated);

      const target = updated.find((t) => t.id === id);
      if (target && isFirebaseConfigured()) {
        try {
          await saveTransitToFirestore(target);
        } catch (e) {
          console.warn('Could not update transit in Firestore:', e);
        }
      }
    },
    [transits, persistLocally]
  );

  // Delete / archive transit
  const deleteTransit = useCallback(
    async (id: string) => {
      const updated = transits.filter((t) => t.id !== id);
      setTransits(updated);
      persistLocally(updated);

      if (isFirebaseConfigured()) {
        try {
          await deleteTransitFromFirestore(id);
        } catch (e) {
          console.warn('Could not delete transit in Firestore:', e);
        }
      }
    },
    [transits, persistLocally]
  );

  return {
    transits,
    addTransit,
    updateTransitStatus,
    deleteTransit,
  };
}
