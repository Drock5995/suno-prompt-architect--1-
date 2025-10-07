import React from 'react';
import { View } from '../types';
import { CreateIcon, LibraryIcon, UploadIcon, LogoIcon, CloseIcon } from './icons/Icons';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, setIsOpen }) => {
  const navItems = [
    { view: View.CREATE, label: 'Create New', icon: <CreateIcon /> },
    { view: View.LIBRARY, label: 'My Library', icon: <LibraryIcon /> },
    { view: View.UPLOAD, label: 'Upload Song', icon: <UploadIcon /> },
  ];

  return (
    <aside className={`absolute md:relative top-0 left-0 h-full w-64 bg-black p-6 flex-flex-col space-y-8 z-20 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <LogoIcon />
          <h1 className="text-2xl font-bold text-white">Suno Architect</h1>
        </div>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-spotify-gray-100 hover:text-white">
          <CloseIcon />
        </button>
      </div>
      <nav className="mt-8">
        <ul>
          {navItems.map((item) => (
            <li key={item.view}>
              <button
                onClick={() => setActiveView(item.view)}
                className={`flex items-center space-x-4 w-full text-left p-2 rounded-md transition-colors duration-200 ${
                  activeView === item.view
                    ? 'bg-spotify-gray-300 text-white'
                    : 'text-spotify-gray-100 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-semibold">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
