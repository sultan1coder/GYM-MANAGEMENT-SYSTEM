import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { authAPI } from "@/services/api";
import {
  Dumbbell,
  Eye,
  EyeOff,
  Shield,
  Lock,
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Users,
  BarChart3,
  Activity,
  Settings,
  Loader2,
  Crown,
  Zap,
  Star,
} from "lucide-react";

const StaffLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "checking" | "connected" | "error"
  >("checking");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  // Check backend connection on load
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      setConnectionStatus("checking");
      const response = await fetch("http://localhost:4000/api");
      if (response.ok) {
        setConnectionStatus("connected");
      } else {
        setConnectionStatus("error");
      }
    } catch (error) {
      setConnectionStatus("error");
    }
  };

  const validateForm = () => {
    const errors = { email: "", password: "" };
    let isValid = true;

    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (connectionStatus === "error") {
      toast.error("Cannot connect to server. Please check your connection.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.loginUser(formData);

      if (response.data.isSuccess) {
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        toast.success(`Welcome back, ${response.data.user.name}!`);
        navigate("/admin/dashboard");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const getConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case "checking":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            Connecting...
          </Badge>
        );
      case "connected":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 flex items-center gap-1 border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            Online
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Offline
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Professional Navigation */}
      <header className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-white">BILKHAYR</span>
                <span className="block text-xs text-blue-200 -mt-1">
                  PREMIUM FITNESS
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              {getConnectionStatusBadge()}
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          {/* Professional Login Card */}
          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
            <CardHeader className="text-center pb-8 relative">
              {/* Premium Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-4 py-1">
                  <Crown className="w-3 h-3 mr-1" />
                  STAFF PORTAL
                </Badge>
              </div>

              <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur opacity-50 animate-pulse"></div>
                <Shield className="w-10 h-10 text-white relative z-10" />
              </div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-sm">
                Access your professional dashboard to manage
                <br />
                <span className="font-semibold text-blue-600">
                  BILKHAYR Premium Fitness
                </span>
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Professional Email
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`h-12 pl-4 pr-4 bg-gray-50 border-2 transition-all duration-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                        formErrors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200"
                      }`}
                      placeholder="Enter your professional email"
                      disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                  </div>
                  {formErrors.email && (
                    <p className="text-sm text-red-600 flex items-center gap-1 bg-red-50 p-2 rounded">
                      <AlertTriangle className="w-3 h-3" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Secure Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`h-12 pl-4 pr-12 bg-gray-50 border-2 transition-all duration-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                        formErrors.password
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200"
                      }`}
                      placeholder="Enter your secure password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-sm text-red-600 flex items-center gap-1 bg-red-50 p-2 rounded">
                      <AlertTriangle className="w-3 h-3" />
                      {formErrors.password}
                    </p>
                  )}
                </div>

                {/* Advanced Options */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked as boolean)
                      }
                      className="border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-gray-700 font-medium"
                    >
                      Keep me signed in
                    </Label>
                  </div>
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Professional Login Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                  disabled={isLoading || connectionStatus === "error"}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Access Professional Portal
                    </>
                  )}
                </Button>
              </form>

              {/* Quick Access Notice */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200 text-center">
                <h4 className="text-sm font-bold text-gray-900 mb-2">
                  🚀 Professional Access Portal
                </h4>
                <p className="text-xs text-gray-600">
                  Secure login to your professional dashboard with
                  enterprise-grade authentication
                </p>
              </div>

              {/* Professional Features Showcase */}
              <div className="space-y-4">
                <h4 className="text-center text-sm font-bold text-gray-900">
                  PROFESSIONAL MANAGEMENT SUITE
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="group p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all">
                    <Users className="w-5 h-5 text-blue-600 mb-2" />
                    <p className="text-xs font-semibold text-gray-900">
                      Member Management
                    </p>
                    <p className="text-xs text-gray-600">
                      5000+ Active Members
                    </p>
                  </div>
                  <div className="group p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:shadow-md transition-all">
                    <BarChart3 className="w-5 h-5 text-emerald-600 mb-2" />
                    <p className="text-xs font-semibold text-gray-900">
                      Analytics Pro
                    </p>
                    <p className="text-xs text-gray-600">Real-time Insights</p>
                  </div>
                  <div className="group p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-all">
                    <Activity className="w-5 h-5 text-purple-600 mb-2" />
                    <p className="text-xs font-semibold text-gray-900">
                      Live Tracking
                    </p>
                    <p className="text-xs text-gray-600">Attendance & Goals</p>
                  </div>
                  <div className="group p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-md transition-all">
                    <Settings className="w-5 h-5 text-orange-600 mb-2" />
                    <p className="text-xs font-semibold text-gray-900">
                      System Control
                    </p>
                    <p className="text-xs text-gray-600">Full Admin Access</p>
                  </div>
                </div>
              </div>

              {/* Professional Footer */}
              <div className="text-center space-y-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Need a staff account?{" "}
                  <Link
                    to="/staff/register"
                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                  >
                    Request Access
                  </Link>
                </p>
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                  <Link
                    to="/member/login"
                    className="hover:text-blue-600 transition-colors font-medium"
                  >
                    Member Portal
                  </Link>
                  <span>•</span>
                  <Link
                    to="/contact"
                    className="hover:text-blue-600 transition-colors font-medium"
                  >
                    Support Center
                  </Link>
                  <span>•</span>
                  <Link
                    to="/privacy"
                    className="hover:text-blue-600 transition-colors font-medium"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust & Security Indicators */}
          <div className="mt-8 text-center space-y-3">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-white/80">256-bit SSL</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-white/80">SOC 2 Certified</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-white/80">ISO 27001</span>
              </div>
            </div>
            <p className="text-xs text-white/60">
              Enterprise-grade security for professional gym management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
