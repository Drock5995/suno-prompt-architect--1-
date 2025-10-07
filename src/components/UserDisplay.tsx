import React from 'react';
import { User } from '../types';
import { supabase } from '../services/supabaseClient';
import { SettingsIcon } from './icons/Icons';

interface UserDisplayProps {
  user: User;
  onSettingsClick: () => void;
}

const UserDisplay: React.FC<UserDisplayProps> = ({ user, onSettingsClick }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex items-center space-x-4">
      <button onClick={onSettingsClick} className="text-spotify-gray-100 hover:text-white">
        <SettingsIcon />
      </button>
      <span className="text-white text-sm hidden sm:block" title={user.email}>{user.email}</span>
      <button
        onClick={handleLogout}
        className="bg-spotify-gray-300 text-white text-sm font-semibold py-2 px-4 rounded-full hover:bg-spotify-gray-200 transition-colors"
      >
        Log Out
      </button>
    </div>
  );
};

export default UserDisplay;