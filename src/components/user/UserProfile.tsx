import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  ShieldAlert, 
  Building2, 
  Phone, 
  Mail, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Star, 
  Save 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmergencyContact, UserSavedPlace } from '../../types';

export const UserProfile: React.FC = () => {
  const { currentUser, setCurrentUser, addNotification } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);

  const [newPlaceLabel, setNewPlaceLabel] = useState('');
  const [newPlaceAddress, setNewPlaceAddress] = useState('');

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRel, setNewContactRel] = useState('');

  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser(prev => ({
      ...prev,
      name,
      email,
      phone,
    }));
    setIsSaved(true);
    addNotification('Profile Saved', 'Personal and emergency details updated.', 'system');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddPlace = () => {
    if (!newPlaceLabel.trim() || !newPlaceAddress.trim()) return;
    const newPlace: UserSavedPlace = {
      id: `sp_${Date.now()}`,
      label: newPlaceLabel,
      address: newPlaceAddress,
      lat: 28.5355,
      lng: 77.2410,
    };
    setCurrentUser(prev => ({
      ...prev,
      savedPlaces: [...prev.savedPlaces, newPlace],
    }));
    setNewPlaceLabel('');
    setNewPlaceAddress('');
  };

  const handleRemovePlace = (id: string) => {
    setCurrentUser(prev => ({
      ...prev,
      savedPlaces: prev.savedPlaces.filter(p => p.id !== id),
    }));
  };

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    const newContact: EmergencyContact = {
      name: newContactName,
      phone: newContactPhone,
      relationship: newContactRel || 'Family',
    };
    setCurrentUser(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, newContact],
    }));
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRel('');
  };

  const handleRemoveContact = (idx: number) => {
    setCurrentUser(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl space-y-6">
      
      {/* Header Profile Card */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-20 h-20 rounded-2xl object-cover ring-2 ring-amber-500/40"
        />
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="font-heading font-black text-2xl text-white">{currentUser.name}</h2>
            <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded text-xs w-fit mx-auto sm:mx-0">
              {currentUser.rating} ★ Rider Score
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            {currentUser.email} • {currentUser.phone}
          </p>
        </div>
      </div>

      {/* Edit Personal Form */}
      <form onSubmit={handleSaveProfile} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
          Personal Information:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>

        {isSaved && (
          <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
          </p>
        )}
      </form>

      {/* Saved Places */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
          Saved Favorites & Quick Addresses:
        </span>

        <div className="space-y-2">
          {currentUser.savedPlaces.map(place => (
            <div
              key={place.id}
              className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="font-bold text-xs text-white">{place.label}</span>
                  <p className="text-[11px] text-slate-400">{place.address}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemovePlace(place.id)}
                className="text-slate-500 hover:text-rose-400 p-1 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new place */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
          <input
            type="text"
            placeholder="Label (e.g. Parents House)"
            value={newPlaceLabel}
            onChange={e => setNewPlaceLabel(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs p-2 rounded-xl focus:outline-none"
          />
          <input
            type="text"
            placeholder="Complete Address"
            value={newPlaceAddress}
            onChange={e => setNewPlaceAddress(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs p-2 rounded-xl focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddPlace}
            className="py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl"
          >
            + Add Saved Place
          </button>
        </div>
      </div>

      {/* Emergency SOS Contacts */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span className="text-xs font-bold text-rose-300 uppercase tracking-wide">
            Emergency SOS Contacts (Alerted during SOS Panic):
          </span>
        </div>

        <div className="space-y-2">
          {currentUser.emergencyContacts.map((contact, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800"
            >
              <div>
                <span className="font-bold text-xs text-white">{contact.name}</span>
                <span className="text-slate-400 text-xs ml-2 font-mono">{contact.phone}</span>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded ml-2">
                  {contact.relationship}
                </span>
              </div>
              <button
                onClick={() => handleRemoveContact(idx)}
                className="text-slate-500 hover:text-rose-400 p-1 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
          <input
            type="text"
            placeholder="Contact Name"
            value={newContactName}
            onChange={e => setNewContactName(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs p-2 rounded-xl focus:outline-none"
          />
          <input
            type="tel"
            placeholder="Phone (+91)"
            value={newContactPhone}
            onChange={e => setNewContactPhone(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs p-2 rounded-xl focus:outline-none"
          />
          <input
            type="text"
            placeholder="Relation (Spouse, Brother)"
            value={newContactRel}
            onChange={e => setNewContactRel(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs p-2 rounded-xl focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddContact}
            className="py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl"
          >
            + Add Contact
          </button>
        </div>
      </div>

    </div>
  );
};
