/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Heart,
  Droplet,
  Building2,
  AlertTriangle,
  Phone,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { DonorProfile, EmergencyContact, PledgedOrgan } from '../../types';
import { STANDARD_ORGANS } from '../../data/donorDefaults';

interface RegisterDonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDonor: DonorProfile;
  onSaveProfile: (profile: DonorProfile) => void;
}

export const RegisterDonorModal: React.FC<RegisterDonorModalProps> = ({
  isOpen,
  onClose,
  currentDonor,
  onSaveProfile,
}) => {
  const [fullName, setFullName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [rhFactor, setRhFactor] = useState<'Positive' | 'Negative'>('Positive');
  const [nationalRegistry, setNationalRegistry] = useState('');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [allergiesText, setAllergiesText] = useState('');
  const [allowResearch, setAllowResearch] = useState(true);

  // Emergency Contacts
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // Organ Pledges
  const [organs, setOrgans] = useState<PledgedOrgan[]>([]);

  useEffect(() => {
    if (isOpen) {
      setFullName(currentDonor.fullName || '');
      setPreferredName(currentDonor.preferredName || '');
      setDateOfBirth(currentDonor.dateOfBirth || '1995-05-15');
      setBloodType(currentDonor.bloodType || 'O+');
      setRhFactor(currentDonor.rhFactor || 'Positive');
      setNationalRegistry(
        currentDonor.nationalRegistry ||
          `National Organ & Tissue Transplant Organization (NOTTO) #${currentDonor.registryId}`
      );
      setHospitalAffiliation(
        currentDonor.hospitalAffiliation || 'Apollo Health City / Regional Trauma Center'
      );
      setMedicalNotes(
        currentDonor.medicalNotes ||
          'Authorized under legal First-Person Consent declaration. Organ preservation protocol verified.'
      );
      setAllergiesText(currentDonor.allergies?.join(', ') || 'No known drug allergies (NKDA)');
      setAllowResearch(currentDonor.allowResearch ?? true);
      setContacts(currentDonor.emergencyContacts?.length ? [...currentDonor.emergencyContacts] : []);

      // If organs already exist, use them, otherwise use standard catalogue
      if (currentDonor.organPreferences?.length > 0) {
        setOrgans(currentDonor.organPreferences.map((o) => ({ ...o })));
      } else {
        setOrgans(STANDARD_ORGANS.map((o) => ({ ...o, pledged: true })));
      }
    }
  }, [isOpen, currentDonor]);

  if (!isOpen) return null;

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    const newContact: EmergencyContact = {
      id: `ec_${Date.now()}`,
      name: newContactName.trim(),
      relation: newContactRelation.trim() || 'Next of Kin',
      phone: newContactPhone.trim(),
      isPrimary: contacts.length === 0,
      notified: true,
      acknowledgedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
    };
    setContacts([...contacts, newContact]);
    setNewContactName('');
    setNewContactRelation('');
    setNewContactPhone('');
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const toggleOrgan = (organId: string) => {
    setOrgans(
      organs.map((o) => (o.id === organId ? { ...o, pledged: !o.pledged } : o))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const allergiesArray = allergiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updated: DonorProfile = {
      ...currentDonor,
      fullName: fullName.trim(),
      preferredName: preferredName.trim() || fullName.trim().split(' ')[0],
      dateOfBirth: dateOfBirth.trim(),
      bloodType,
      rhFactor,
      nationalRegistry: nationalRegistry.trim(),
      hospitalAffiliation: hospitalAffiliation.trim(),
      medicalNotes: medicalNotes.trim(),
      allergies: allergiesArray,
      allowResearch,
      status: 'Registered Donor',
      emergencyContacts: contacts,
      organPreferences: organs,
      lastVerifiedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
    };

    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {currentDonor.fullName ? 'Edit Donor Medical Record' : 'Register Official Donor Card'}
              </h3>
              <p className="text-[11px] text-teal-300">
                Live National Organ Pledge Registry & Emergency Directives
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 text-slate-700 text-xs">
          {/* Identity Fields */}
          <div className="space-y-3">
            <span className="font-bold text-slate-900 uppercase tracking-wide text-[10px] block">
              1. Donor Identification
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Maya Chen / David Ross"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-teal-600 text-xs font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Preferred / Badge Name
                </label>
                <input
                  type="text"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  placeholder="e.g. Maya"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-teal-600 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Date of Birth
                </label>
                <input
                  type="text"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  placeholder="YYYY-MM-DD or Oct 18, 1994"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-teal-600 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Blood & Clinical Parameters */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-900 uppercase tracking-wide text-[10px] block">
              2. Clinical Parameters & Blood Group
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Blood Group
                </label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-teal-600 text-xs font-bold"
                >
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Rh Factor
                </label>
                <select
                  value={rhFactor}
                  onChange={(e) => setRhFactor(e.target.value as 'Positive' | 'Negative')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-teal-600 text-xs"
                >
                  <option value="Positive">Positive (+)</option>
                  <option value="Negative">Negative (-)</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Hospital / Trauma Center Affiliation
                </label>
                <input
                  type="text"
                  value={hospitalAffiliation}
                  onChange={(e) => setHospitalAffiliation(e.target.value)}
                  placeholder="e.g. Regional Trauma Hospital / Medical Institute"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-teal-600 text-xs"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Allergies (comma-separated)
                </label>
                <input
                  type="text"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  placeholder="e.g. Penicillin, Latex-safe, Sulfa"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-teal-600 text-xs"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Advance Directives & Medical Notes
                </label>
                <textarea
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-teal-600 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Organ Consent Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 uppercase tracking-wide text-[10px] block">
                3. Anatomical Gifts Pledged
              </span>
              <span className="text-[10px] text-teal-700 font-semibold">
                {organs.filter((o) => o.pledged).length} of {organs.length} authorized
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {organs.map((organ) => (
                <div
                  key={organ.id}
                  onClick={() => toggleOrgan(organ.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    organ.pledged
                      ? 'bg-teal-50/70 border-teal-300 text-teal-950 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <span className="text-xs">{organ.name}</span>
                  <input
                    type="checkbox"
                    checked={organ.pledged}
                    onChange={() => {}}
                    className="w-4 h-4 accent-teal-700 pointer-events-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="research-checkbox"
                checked={allowResearch}
                onChange={(e) => setAllowResearch(e.target.checked)}
                className="w-4 h-4 accent-teal-700"
              />
              <label htmlFor="research-checkbox" className="text-[11px] text-slate-700">
                Authorize non-transplant biomedical research & clinical education
              </label>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-900 uppercase tracking-wide text-[10px] block">
              4. Emergency Next of Kin Contacts
            </span>

            {contacts.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">
                        {c.name} ({c.relation})
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{c.phone}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveContact(c.id)}
                      className="p-1 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-600 block">Add Next of Kin</span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Relation (e.g. Spouse)"
                  value={newContactRelation}
                  onChange={(e) => setNewContactRelation(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddContact}
                className="w-full py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-semibold text-xs flex items-center justify-center gap-1 hover:bg-teal-100"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Emergency Contact</span>
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Issue Verified Donor Card</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
