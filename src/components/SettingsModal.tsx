import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      const storedApiKey = localStorage.getItem('suno_api_key') || '';
      setApiKey(storedApiKey);
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('suno_api_key', apiKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-spotify-gray-400 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="suno-api-key" className="block text-sm font-medium text-spotify-gray-100">Suno API Key</label>
            <input
              id="suno-api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Suno API key"
              className="w-full mt-1 p-2 bg-spotify-gray-300 border border-spotify-gray-200 rounded-md focus:ring-spotify-green focus:border-spotify-green"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-spotify-gray-300 text-white py-2 px-4 rounded-full hover:bg-spotify-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-spotify-green text-black font-bold py-2 px-4 rounded-full hover:bg-green-400 transition duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
