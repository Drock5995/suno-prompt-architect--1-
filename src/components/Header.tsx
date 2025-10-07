import React from 'react';
import { MenuIcon } from './icons/Icons';
import { Session } from '../types';
import UserDisplay from './UserDisplay';

interface HeaderProps {
    onMenuClick: () => void;
    onSettingsClick: () => void;
    session: Session;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onSettingsClick, session }) => {
    return (
        <header className="bg-spotify-gray-500 p-4 flex justify-between items-center h-[60px] flex-shrink-0 z-10 relative shadow-md">
            <button onClick={onMenuClick} className="text-spotify-gray-100 hover:text-white md:hidden">
                <MenuIcon />
            </button>
            <div className="flex-1"></div> 
            <UserDisplay user={session.user} onSettingsClick={onSettingsClick} />
        </header>
    )
}

export default Header;