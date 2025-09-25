import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { memberAPI } from "@/services/api";
import {
  Dumbbell,
  Eye,
  EyeOff,
  User,
  Lock,
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Activity,
  CreditCard,
  Target,
  Loader2,
  Heart,
  Trophy,
  Zap,
  Star,
  Play,
} from "lucide-react";

const MemberLogin: React.FC = () => {
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
      const response = await memberAPI.loginMember(formData);

      if (response.data.isSuccess) {
        // Store token and member data
        localStorage.setItem("memberToken", response.data.token);
        localStorage.setItem(
          "memberData",
          JSON.stringify(response.data.member)
        );

        if (rememberMe) {
          localStorage.setItem("rememberMember", "true");
        }

        // Dispatch custom login event to trigger authentication checks
        const loginEvent = new Event("userLogin");
        window.dispatchEvent(loginEvent);

        toast.success(
          `Welcome back, ${response.data.member.name}! Ready to crush your goals?`
        );

        // Add a small delay to ensure the toast is visible
        setTimeout(() => {
          navigate("/members/dashboard");
        }, 100);
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Member login error:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 relative overflow-hidden">
      {/* Professional Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Premium Navigation */}
      <header className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 p-2 rounded-lg">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-white">BILKHAYR</span>
                <span className="block text-xs text-emerald-200 -mt-1">
                  PREMIUM FITNESS
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              {getConnectionStatusBadge()}
              <Link
                to="/" className="inline-flex items-center gap-2 text-emerald-300 hover:text-white transition-colors"
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
          {/* Professional Member Login Card */}
          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
            <CardHeader className="text-center pb-8 relative">
              {/* Premium Member Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-white font-semibold px-4 py-1">
                  <Trophy className="w-3 h-3 mr-1" />
                  MEMBER PORTAL
                </Badge>
              </div>

              <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full blur opacity-50 animate-pulse"></div>
                <Heart className="w-10 h-10 text-white relative z-10" />
              </div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Welcome Back, Champion
              </h1>
              <p className="text-gray-600 text-sm">
                Continue your fitness journey with
                <br />
                <span className="font-semibold text-emerald-600">
                  BILKHAYR Premium Fitness
                </span>
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Member Email
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      } className={`h-12 pl-4 pr-4 bg-gray-50 border-2 transition-all duration-300 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${
                        formErrors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200"
                      }`}
                      placeholder="Enter your member email"
                      disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
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
                    htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      } className={`h-12 pl-4 pr-12 bg-gray-50 border-2 transition-all duration-300 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${
                        formErrors.password
                          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200"
                      }`}
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-emerald-600 transition-colors"
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
                      } className="border-2 border-gray-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <Label
                      htmlFor="remember" className="text-sm text-gray-700 font-medium"
                    >
                      Keep me signed in
                    </Label>
                  </div>
                  <Link
                    to="/members/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Professional Login Button */}
                <Button
                  type="submit" className="w-full h-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                  disabled={isLoading || connectionStatus === "error"}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing you in...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Access My Fitness Hub
                    </>
                  )}
                </Button>
              </form>

              {/* Member Welcome Notice */}
              <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 p-4 rounded-xl border border-emerald-200 text-center">
                <h4 className="text-sm font-bold text-gray-900 mb-2">
                  💎 Premium Member Access
                </h4>
                <p className="text-xs text-gray-600">
                  Access your personal fitness dashboard with advanced tracking
                  and goal management
                </p>
              </div>

              {/* Premium Member Features */}
              <div className="space-y-4">
                <h4 className="text-center text-sm font-bold text-gray-900">
                  YOUR FITNESS COMMAND CENTER
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="group p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:shadow-md transition-all">
                    <Activity className="w-5 h-5 text-emerald-600 mb-2" />
                    <p className="text-xs font-semibold text-gray-900">
                      Smart Tracking
                    </p>
                    <p className="text-xs text-gray-600">
                      AI-Powered Analytics
                    </p>
                  </div>
                  <div className="group p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl border border-cyan-200 hover:shadow-md transition-all">
                    <Target className="w-5 h-5 text-cyan-600 mb-2" />
                    <p className="text-xs font-semibold text-gray-900">
                      Goal Mastery
                    </p>
                    <p className="text-xs text-gray-600">Personalized Plans</p>
                  </div>
                  <div className="group p-3 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border border-teal-200 hover:shadow-md transition-all">
                    <Calendar className="w-5 h-5 text-teal-600 mb-2" />
                    <p className="text-xs font-semibold text-gray-900">
                      Live Scheduling
                    </p>
                    <p className="text-xs text-gray-600">Book Classes & PTs</p>
                  </div>
                  <div className="group p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-all">
                    <CreditCard className="w-5 h-5 text-purple-600 mb-2" />
                    <p className="text-xs font-semibold text-gray-900">
                      Premium Billing
                    </p>
                    <p className="text-xs text-gray-600">Seamless Payments</p>
                  </div>
                </div>
              </div>

              {/* Member Success Stats */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                <h4 className="text-center text-sm font-bold text-gray-900 mb-3">
                  JOIN 5000+ SUCCESS STORIES
                </h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-emerald-600">98%</p>
                    <p className="text-xs text-gray-600">Goal Achievement</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-cyan-600">4.9★</p>
                    <p className="text-xs text-gray-600">Member Rating</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-600">24/7</p>
                    <p className="text-xs text-gray-600">Online Support</p>
                  </div>
                </div>
              </div>

              {/* Professional Footer */}
              <div className="text-center space-y-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  New to BILKHAYR Premium?{" "}
                  <Link
                    to="/member/register" className="text-emerald-600 hover:text-emerald-800 font-semibold transition-colors"
                  >
                    Start Your Journey
                  </Link>
                </p>
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                  <Link
                    to="/staff/login" className="hover:text-emerald-600 transition-colors font-medium"
                  >
                    Staff Portal
                  </Link>
                  <span>•</span>
                  <Link
                    to="/contact" className="hover:text-emerald-600 transition-colors font-medium"
                  >
                    Support
                  </Link>
                  <span>•</span>
                  <Link
                    to="/virtual-classes" className="hover:text-emerald-600 transition-colors font-medium"
                  >
                    Online Classes
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust & Premium Indicators */}
          <div className="mt-8 text-center space-y-3">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-white/80">Award Winning</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-xs text-white/80">5000+ Members</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-white/80">4.9/5 Rating</span>
              </div>
            </div>
            <p className="text-xs text-white/60">
              Premium online fitness experience trusted by professionals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberLogin;
