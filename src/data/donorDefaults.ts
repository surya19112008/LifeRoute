import { PledgedOrgan, DonorProfile } from '../types';

export const STANDARD_ORGANS: PledgedOrgan[] = [
  {
    id: 'heart',
    name: 'Heart',
    category: 'Major Organ',
    pledged: false,
    preservationWindow: '4–6 hours',
    transplantUtility: 'Cardiovascular failure & end-stage cardiomyopathy',
    clinicalNote: 'High emergency transit priority via Police Green Corridor',
  },
  {
    id: 'kidneys',
    name: 'Kidneys',
    category: 'Major Organ',
    pledged: false,
    preservationWindow: '24–36 hours',
    transplantUtility: 'Can save up to two patients with end-stage renal disease',
    clinicalNote: 'Dual renal graft retrieval capability',
  },
  {
    id: 'cornea',
    name: 'Cornea',
    category: 'Tissue',
    pledged: false,
    preservationWindow: 'Up to 14 days',
    transplantUtility: 'Restores sight via regional eye bank processing',
    clinicalNote: 'Ocular tissue retrieval authorized post-cardiac cessation',
  },
  {
    id: 'liver',
    name: 'Liver',
    category: 'Major Organ',
    pledged: false,
    preservationWindow: '8–12 hours',
    transplantUtility: 'Split-liver capability for adult & pediatric recipients',
    clinicalNote: 'Optimal machine perfusion transit protocol',
  },
  {
    id: 'lungs',
    name: 'Lungs',
    category: 'Major Organ',
    pledged: false,
    preservationWindow: '6–8 hours',
    transplantUtility: 'Pulmonary fibrosis and end-stage respiratory transplant',
    clinicalNote: 'Ex-vivo lung perfusion compatibility with airport green corridor',
  },
  {
    id: 'pancreas',
    name: 'Pancreas',
    category: 'Major Organ',
    pledged: false,
    preservationWindow: '12–18 hours',
    transplantUtility: 'Type 1 diabetes combined kidney-pancreas transplant',
    clinicalNote: 'Subject to updated donor consent',
  },
  {
    id: 'tissue',
    name: 'Skin & Bone Tissue',
    category: 'Tissue',
    pledged: false,
    preservationWindow: 'Up to 5 years (Cryopreserved)',
    transplantUtility: 'Severe burn grafting and reconstructive orthopedic oncology',
    clinicalNote: 'Regional tissue bank cryopreservation protocol',
  },
];

export const createBlankDonorProfile = (): DonorProfile => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);

  return {
    id: `donor_${Date.now()}`,
    registryId: `NOTTO-LR-${randomSuffix}`,
    fullName: '',
    preferredName: '',
    bloodType: 'O+',
    rhFactor: 'Positive',
    avatarUrl: '',
    dateOfBirth: '',
    registeredDate: dateStr,
    lastVerifiedDate: dateStr,
    status: 'Pending Verification',
    nationalRegistry: `NOTTO National Organ Registry #${randomSuffix}`,
    hospitalAffiliation: '',
    allergies: [],
    medicalNotes: 'Authorized under first-person anatomical gift declaration.',
    allowResearch: false,
    emergencyContacts: [],
    organPreferences: STANDARD_ORGANS.map((organ) => ({ ...organ })),
  };
};
