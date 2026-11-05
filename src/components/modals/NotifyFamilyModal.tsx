import React, { useState } from 'react';
import {
  X,
  Users,
  CheckCircle2,
  Send,
  MessageCircle,
  Mail,
  Share2,
  Heart,
  Phone,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { DonorProfile, EmergencyContact } from '../../types';

interface NotifyFamilyModalProps {
  donor: DonorProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateContacts: (contacts: EmergencyContact[]) => void;
}

export const NotifyFamilyModal: React.FC<NotifyFamilyModalProps> = ({
  donor,
  isOpen,
  onClose,
  onUpdateContacts,
}) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>(donor.emergencyContacts || []);
  const [sentStatus, setSentStatus] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('Parent');
  const [newPhone, setNewPhone] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setContacts(donor.emergencyContacts || []);
    }
  }, [isOpen, donor.emergencyContacts]);

  if (!isOpen) return null;

  const handleSendNotification = (contactName: string, channel: 'sms' | 'whatsapp' | 'email') => {
    setSentStatus(`Pledge notification & legal decision sent to ${contactName} via ${channel.toUpperCase()}!`);
    setTimeout(() => setSentStatus(null), 3000);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newContact: EmergencyContact = {
      id: `ec_${Date.now()}`,
      name: newName,
      relation: newRelation,
      phone: newPhone,
      isPrimary: false,
      notified: true,
      acknowledgedDate: 'Pending Acceptance',
    };

    const updated = [...contacts, newContact];
    setContacts(updated);
    onUpdateContacts(updated);
    setNewName('');
    setNewPhone('');
    setShowAddForm(false);
    setSentStatus(`Added ${newName} and dispatched automated LifeRoute verification SMS.`);
    setTimeout(() => setSentStatus(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Family & Next-of-Kin Notification
              </h3>
              <p className="text-xs text-slate-500">
                Ensure loved ones know and honor your donation decision
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300/70 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {sentStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{sentStatus}</span>
            </div>
          )}

          {/* Reassurance Callout */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/50 border border-emerald-100 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              Why telling your family is critical
            </span>
            <p className="text-[12px] leading-relaxed">
              In clinical emergencies, hospital coordinators always consult your next of kin. When family members have received your LifeRoute pledge briefing in advance, 95%+ of families immediately support the donor's wishes with zero hesitation.
            </p>
          </div>

          {/* Contact List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Designated Family Contacts ({contacts.length})
              </span>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddForm ? 'Close Form' : 'Add Contact'}</span>
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddContact} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-slate-900 block">
                  Add Emergency Next-of-Kin
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className="p-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                  <select
                    value={newRelation}
                    onChange={(e) => setNewRelation(e.target.value)}
                    className="p-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Adult Child">Adult Child</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="Phone Number (e.g., +1 555-0192)"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    required
                    className="flex-1 p-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800"
                  >
                    Save & Inform
                  </button>
                </div>
              </form>
            )}

            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                      {contact.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {contact.name}
                        </span>
                        {contact.isPrimary && (
                          <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 block">
                        {contact.relation} · <span className="font-mono">{contact.phone}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Informed
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {contact.acknowledgedDate}
                    </span>
                  </div>
                </div>

                {/* Instant share channels */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">Resend pledge summary:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSendNotification(contact.name, 'sms')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium flex items-center gap-1 transition-colors"
                      title="Send SMS"
                    >
                      <MessageCircle className="w-3 h-3 text-slate-600" />
                      <span>SMS</span>
                    </button>
                    <button
                      onClick={() => handleSendNotification(contact.name, 'whatsapp')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-medium flex items-center gap-1 transition-colors"
                      title="Send via WhatsApp"
                    >
                      <Share2 className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleSendNotification(contact.name, 'email')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium flex items-center gap-1 transition-colors"
                      title="Send via Email"
                    >
                      <Mail className="w-3 h-3 text-slate-600" />
                      <span>Email</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sample prefilled text preview */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-slate-700 block">
              Sample message sent to your loved ones:
            </span>
            <p className="text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-200/60 leading-relaxed text-[11px]">
              "Dear Suresh, I have officially registered as an organ donor on LifeRoute under the AP Jeevandan & NOTTO Program (ID #{donor.registryId}) affiliated with KGH Visakhapatnam. In an emergency, please support my pledge to donate Heart, Kidneys, and Corneas to give someone a second chance at life. You are listed as my primary emergency contact. Access my verified donor card at liferoute.in/card/{donor.registryId}"
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
