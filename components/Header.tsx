import React from 'react';
import { MenuIcon } from './icons/Icons';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    return (
        <header className="bg-spotify-gray-500 p-4 md:hidden">
            <button onClick={onMenuClick} className="text-spotify-gray-100 hover:text-white">
                <MenuIcon />
            </button>
        </header>
    )
}

export default Header;