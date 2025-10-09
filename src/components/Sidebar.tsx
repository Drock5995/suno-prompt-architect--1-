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
    { view: View.LIBRARY, label: 'My Library', icon: <LibraryIcon /> },
    { view: View.CREATE, label: 'Suno Prompting API', icon: <CreateIcon /> },
    { view: View.UPLOAD, label: 'Upload Song', icon: <UploadIcon /> },
  ];

  return (
    <aside className={`absolute md:relative top-0 left-0 h-full w-64 bg-gradient-to-b from-spotify-gray-500 to-spotify-gray-400 p-6 flex flex-col space-y-8 z-20 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-all duration-500 ease-in-out shadow-2xl`}>
      <div className="flex items-center justify-between animate-slide-up">
        <div className="flex items-center space-x-3 group">
          <div className="animate-bounce-subtle">
            <LogoIcon />
          </div>
          <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-spotify-gray-100 bg-clip-text text-transparent">Suno Architect</h1>
        </div>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-spotify-gray-100 hover:text-white transition-colors duration-200 hover:scale-110" aria-label="Close sidebar">
          <CloseIcon />
        </button>
      </div>
      <nav className="mt-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li key={item.view} className="animate-slide-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
              <button
                onClick={() => setActiveView(item.view)}
                className={`flex items-center space-x-4 w-full text-left p-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  activeView === item.view
                    ? 'bg-spotify-green text-black shadow-glow'
                    : 'text-spotify-gray-100 hover:text-white hover:bg-spotify-gray-300'
                }`}
              >
                <div className={`transition-transform duration-200 ${activeView === item.view ? 'scale-110' : ''}`}>
                  {item.icon}
                </div>
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
