import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Upload, FolderOpen, Heart, Settings, Users, Shield, Image, Folder } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export const Sidebar = () => {
    const { isAdmin } = useAuth();

    const menuItems = [
        {
            to: "/admin/dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard className="w-5 h-5" />,
            roles: ["admin"]
        },
        {
            to: "/admin/accountmanagement",
            label: "Account Management",
            icon: <Users className="w-5 h-5" />,
            roles: ["admin"]
        },
        {
            to: "/admin/projectmanagement",
            label: "Project Management",
            icon: <FolderOpen className="w-5 h-5" />,
            roles: ["admin"]
        },
        {
            to: "/admin/allimages",
            label: "All Images",
            icon: <Image className="w-5 h-5" />,
            roles: ["admin"]
        },
        {
            to: "/projectselection",
            label: "Project Selection",
            icon: <FolderOpen className="w-5 h-5" />,
            roles: ["user"]
        },
        {
            to: "/imageupload",
            label: "Image Upload",
            icon: <Upload className="w-5 h-5" />,
            roles: ["user"]
        },
        {
            to: "/gallery",
            label: "Gallery",
            icon: <Image className="w-5 h-5" />,
            roles: ["user"]
        }

    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-16 lg:w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300">
            
            {/* Logo */}
            <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="w-6 h-6 bg-white transform rotate-45"></div>
                    </div>
                    <span className="hidden lg:block text-xl font-bold text-gray-900">ImageDrop</span>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-2 lg:px-4 py-6 overflow-y-auto">
                <ul className="space-y-2">
                    {menuItems.map((item, index) => {
                        if (!item.roles.includes(isAdmin ? "admin" : "user")) return null;

                        return (
                            <li key={index}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
                                            : "flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    }
                                    title={item.label}
                                >
                                    {item.icon}
                                    <span className="hidden lg:block">{item.label}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer menu */}
            <div className="p-2 lg:p-4 border-t border-gray-200">
                <a
                    href="#"
                    className="flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Settings"
                >
                    <Settings className="w-5 h-5" />
                    <span className="hidden lg:block font-medium">Settings</span>
                </a>
            </div>
        </aside>
    );
};