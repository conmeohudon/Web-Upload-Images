import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Header = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 
                           flex items-center px-6 z-20">
            
            {/* Logo */}
            <Link
                to={isAuthenticated ? (isAdmin ? "/admin" : "/") : "/login"}
                className="text-xl font-bold text-gray-900 flex items-center gap-2"
            >
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-white rotate-45"></div>
                </div>
                <span>Upload Images</span>
            </Link>

            {/* Search bar
            <div className="flex-1 flex justify-center px-6">
                <div className="relative w-full max-w-xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search your images..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 
                                  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div> */}

            {/* Right buttons */}
            <div className="flex items-center gap-4 ml-auto">
                {/* Bell */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <Bell className="w-5 h-5 text-gray-600" />
                </button>

                <span className="text-black font-semibold">
                    {user?.username}
                </span>


                {/* Logout */}
                {isAuthenticated && (
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 
                                   rounded-lg transition-colors text-gray-700 font-medium"
                    >
                        <LogOut className="w-5 h-5 text-gray-600" />
                        <span>Sign Out</span>
                    </button>
                )}
            </div>
        </header>
    );
};
