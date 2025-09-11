import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaDumbbell,
  FaCreditCard,
  FaClipboardList,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const sidebarItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <FaHome className="w-5 h-5" />,
  },
  {
    name: "Members",
    path: "/admin/members",
    icon: <FaUsers className="w-5 h-5" />,
  },
  {
    name: "Equipment",
    path: "/admin/equipments",
    icon: <FaDumbbell className="w-5 h-5" />,
  },
  {
    name: "Payments",
    path: "/admin/payments",
    icon: <FaCreditCard className="w-5 h-5" />,
  },
  {
    name: "Subscriptions",
    path: "/admin/subscriptions",
    icon: <FaClipboardList className="w-5 h-5" />,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: <FaCog className="w-5 h-5" />,
  },
];

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile and Desktop Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 text-gray-600 hover:text-gray-900"
      >
        {isOpen ? (
          <FaTimes className="w-6 h-6" />
        ) : (
          <FaBars className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          z-40
        `}
      >
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Gym Management</h2>
        </div>

        <nav className="mt-5">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center p-3 mx-2 rounded-lg transition-colors duration-200
                ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              {item.icon}
              <span className="ml-3 font-normal">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-30"
        />
      )}
    </>
  );
};

export default Sidebar;
