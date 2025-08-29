import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Building2,
  Users,
  ArrowRight,
  Dumbbell,
  Sparkles,
  Shield,
  Heart,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handlePortalSelection = (portalType: "staff" | "member") => {
    if (portalType === "staff") {
      navigate("/staff/login");
    } else {
      navigate("/member/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-indigo-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl w-full space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl mb-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <Dumbbell className="w-12 h-12" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Gym Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose your portal to access the gym management system. Staff and
            administrators can manage operations, while members can track their
            fitness journey.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>

        {/* Portal Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Staff & Admin Portal */}
          <Card
            className="shadow-2xl border-0 bg-white/90 backdrop-blur-md transform hover:scale-105 transition-all duration-500 hover:shadow-3xl group cursor-pointer"
            onClick={() => handlePortalSelection("staff")}
          >
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                <Building2 className="w-10 h-10" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
                <Sparkles className="w-7 h-7 text-blue-600" />
                Staff & Admin Portal
                <Sparkles className="w-7 h-7 text-blue-600" />
              </CardTitle>
              <p className="text-gray-600 mt-3 text-lg">
                Administrative access to manage gym operations
              </p>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Manage members and staff</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Equipment and facility management</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Payment and subscription tracking</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Reports and analytics</span>
                </div>
              </div>

              <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <span>Access Staff Portal</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </CardContent>
          </Card>

          {/* Member Portal */}
          <Card
            className="shadow-2xl border-0 bg-white/90 backdrop-blur-md transform hover:scale-105 transition-all duration-500 hover:shadow-3xl group cursor-pointer"
            onClick={() => handlePortalSelection("member")}
          >
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                <Users className="w-10 h-10" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
                <Heart className="w-7 h-7 text-green-600" />
                Member Portal
                <Heart className="w-7 h-7 text-green-600" />
              </CardTitle>
              <p className="text-gray-600 mt-3 text-lg">
                Personal access to track your fitness journey
              </p>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <Heart className="w-5 h-5 text-green-600" />
                  <span>View membership details</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Heart className="w-5 h-5 text-green-600" />
                  <span>Track workout progress</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Heart className="w-5 h-5 text-green-600" />
                  <span>Manage payments and renewals</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Heart className="w-5 h-5 text-green-600" />
                  <span>Book classes and sessions</span>
                </div>
              </div>

              <Button className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <span>Access Member Portal</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Registration Links */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-8">
            <Link
              to="/staff/register"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors duration-200 hover:underline group"
            >
              <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              Create Staff Account
            </Link>
            <span className="text-gray-400 text-xl">|</span>
            <Link
              to="/member/register"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-lg transition-colors duration-200 hover:underline group"
            >
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              Join as Member
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>
            Professional gym management solution for modern fitness facilities
          </p>
          <p>© 2024 Gym Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
