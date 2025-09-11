import React from "react";
import { FaUser, FaBell, FaCog } from "react-icons/fa";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = "Dashboard",
  subtitle = "Welcome to Gym Management System",
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm mb-6 p-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      <div className="flex items-center space-x-4">
        <button
          className="text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Notifications"
        >
          <FaBell className="w-5 h-5" />
        </button>

        <button
          className="text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Settings"
        >
          <FaCog className="w-5 h-5" />
        </button>

        <button
          className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-full transition-colors"
          aria-label="Profile"
        >
          <FaUser className="w-4 h-4" />
          <span className="text-sm text-gray-700">Profile</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
