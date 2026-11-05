export type OrganId = 'heart' | 'kidneys' | 'cornea' | 'liver' | 'lungs' | 'pancreas' | 'tissue';

export interface PledgedOrgan {
  id: OrganId;
  name: string;
  category: 'Major Organ' | 'Tissue';
  pledged: boolean;
  preservationWindow: string;
  transplantUtility: string;
  clinicalNote?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  notified: boolean;
  acknowledgedDate?: string;
  isPrimary: boolean;
}

export interface DonorProfile {
  id: string;
  registryId: string;
  fullName: string;
  preferredName: string;
  bloodType: string;
  rhFactor: 'Positive' | 'Negative';
  avatarUrl: string;
  dateOfBirth: string;
  registeredDate: string;
  lastVerifiedDate: string;
  status: 'Registered Donor' | 'Pending Verification' | 'Suspended';
  nationalRegistry: string;
  organPreferences: PledgedOrgan[];
  emergencyContacts: EmergencyContact[];
  allergies: string[];
  medicalNotes: string;
  allowResearch: boolean;
  hospitalAffiliation: string;
}

export interface TransitMission {
  id: string;
  code: string;
  organ: string;
  status: string;
  origin: string;
  destination: string;
  eta: string;
  temp: string;
  urgency: string;
  speed: string;
  donorRegistryId?: string;
  createdAt?: string;
  battery?: string;
  lat?: number;
  lng?: number;
}

export interface ActivityNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'security' | 'transit' | 'registry' | 'family' | 'system';
  read: boolean;
}
