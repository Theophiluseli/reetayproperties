import React, { useState } from 'react';
import { User } from '../../types';
import { User as UserIcon, Mail, Phone, Camera, Check } from 'lucide-react';

interface ProfilePageProps {
  user: User | null;
  onUpdateUser: (u: User) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser }) => {
  const [fullName, setFullName] = useState(user?.full_name || 'David Reetay');
  const [email, setEmail] = useState(user?.email || 'david@reetay.com');
  const [phone, setPhone] = useState(user?.phone || '+233 24 123 4567');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updated: User = {
        ...user,
        full_name: fullName,
        email,
        phone
      };
      onUpdateUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-navy-950">My Profile Settings</h1>
        <p className="text-xs text-gray-500 font-medium">Update your account details and contact information</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
        
        {/* Avatar Header */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover ring-4 ring-gold-500/30"
            />
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-navy-950 text-white flex items-center justify-center shadow-md">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-navy-950">{fullName}</h3>
            <p className="text-xs text-gray-400">Reetay VIP Guest</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-gray-100">
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Full Name</label>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-gold-600" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-transparent text-xs font-bold text-navy-950 outline-none w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Email Address</label>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gold-600" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-xs font-bold text-navy-950 outline-none w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Phone Number</label>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold-600" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent text-xs font-bold text-navy-950 outline-none w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-navy-950 text-white font-bold text-xs shadow-md flex items-center gap-2 hover:bg-navy-900 transition-all"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-gold-400" />
                <span>Profile Updated!</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
