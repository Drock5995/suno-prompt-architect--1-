import React from 'react';
import { MenuIcon } from './icons/Icons';
import { Session } from '../types';
import UserDisplay from './UserDisplay';

interface HeaderProps {
    onMenuClick: () => void;
    onSettingsClick: () => void;
    session: Session;
    onTogglePublicMode?: () => void;
    isAdminPublicMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onSettingsClick, session, onTogglePublicMode, isAdminPublicMode }) => {
    return (
        <header className="bg-gradient-to-r from-spotify-gray-500 to-spotify-gray-400 p-4 flex justify-between items-center h-[60px] flex-shrink-0 z-10 relative shadow-lg backdrop-blur-sm bg-opacity-95 animate-slide-up">
            <button onClick={onMenuClick} className="text-spotify-gray-100 hover:text-white md:hidden transition-all duration-200 hover:scale-110 hover:bg-spotify-gray-300 p-2 rounded-md" aria-label="Open menu">
                <MenuIcon />
            </button>
            {onTogglePublicMode && (
                <button
                    onClick={onTogglePublicMode}
                    className="text-spotify-gray-100 hover:text-white transition-all duration-200 hover:scale-110 hover:bg-spotify-gray-300 p-2 rounded-md ml-2"
                    aria-label={isAdminPublicMode ? "Back to Admin" : "View Public"}
                >
                    {isAdminPublicMode ? "Back to Admin" : "View Public"}
                </button>
            )}
            <div className="flex-1"></div>
            <UserDisplay user={session.user} onSettingsClick={onSettingsClick} />
        </header>
    )
}

export default Header;