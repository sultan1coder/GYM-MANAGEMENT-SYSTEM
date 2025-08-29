import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Users, UserCircle, ArrowRight, Dumbbell, Building2 } from "lucide-react";

const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<"staff" | "member" | null>(null);

  const handleRoleSelect = (role: "staff" | "member") => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole === "staff") {
      window.location.href = "/users/login";
    } else if (selectedRole === "member") {
      window.location.href = "/members/login";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full mb-6">
            <Dumbbell className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gym Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your login type to access the appropriate portal
          </p>
        </div>

        {/* Login Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Staff/Admin Login */}
          <div
            className={`relative p-8 bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-xl ${
              selectedRole === "staff"
                ? "border-blue-500 shadow-blue-100"
                : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => handleRoleSelect("staff")}
          >
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 transition-colors ${
                selectedRole === "staff" 
                  ? "bg-blue-100 text-blue-600" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                <UserCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Staff & Admin
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access the administrative portal for managing gym operations, 
                members, equipment, and system settings.
              </p>
              <div className="space-y-3 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>Gym Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Member Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" />
                  <span>Equipment Control</span>
                </div>
              </div>
            </div>
            
            {/* Selection Indicator */}
            {selectedRole === "staff" && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Member Login */}
          <div
            className={`relative p-8 bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-xl ${
              selectedRole === "member"
                ? "border-green-500 shadow-green-100"
                : "border-gray-200 hover:border-green-300"
            }`}
            onClick={() => handleRoleSelect("member")}
          >
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 transition-colors ${
                selectedRole === "member" 
                  ? "bg-green-100 text-green-600" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Gym Members
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access your personal member portal to view membership details, 
                track workouts, and manage your profile.
              </p>
              <div className="space-y-3 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" />
                  <span>Workout Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Profile Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>Membership Status</span>
                </div>
              </div>
            </div>
            
            {/* Selection Indicator */}
            {selectedRole === "member" && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        {selectedRole && (
          <div className="text-center mt-8">
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Continue to {selectedRole === "staff" ? "Staff" : "Member"} Login
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Additional Links */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex justify-center gap-6 text-sm">
            <Link 
              to="/users/register" 
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Staff Registration
            </Link>
            <Link 
              to="/members/register" 
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              Member Registration
            </Link>
          </div>
          <div className="text-gray-500 text-sm">
            Need help? Contact your gym administrator
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
