/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TransitMission } from '../types';

export const DEFAULT_TRANSITS: TransitMission[] = [
  {
    id: 'TX-9042',
    code: 'CONVOY-9042',
    organ: 'Kidneys (Dual Renal Graft)',
    status: 'In Transit · Green Corridor Active',
    origin: 'Regional Trauma Center KGH',
    destination: 'Apollo Specialty Transplant OR',
    eta: '14 min',
    temp: '4.2°C',
    urgency: 'Critical Tier 1',
    speed: '68 km/h',
    battery: '88%',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'TX-9043',
    code: 'MEDVAC-9043',
    organ: 'Heart (Cardiopulmonary)',
    status: 'Air Transit Active · Helipad En Route',
    origin: 'City Heart Institute',
    destination: 'Airport Helipad Transfer',
    eta: '12 min',
    temp: '4.0°C',
    urgency: 'Stat Priority',
    speed: '185 km/h',
    battery: '94%',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'TX-9044',
    code: 'COURIER-9044',
    organ: 'Corneal Tissue (Pair)',
    status: 'Cold-Chain Scheduled',
    origin: 'Eye Bank & Research Centre',
    destination: 'Regional Specialty Eye Hospital',
    eta: '22 min',
    temp: '5.0°C',
    urgency: 'Cold-Chain Scheduled',
    speed: '42 km/h',
    battery: '99%',
    createdAt: new Date().toISOString(),
  },
];
