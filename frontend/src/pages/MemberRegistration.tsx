import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";
import { memberAPI } from "@/services/api";
import {
  Dumbbell,
  Eye,
  EyeOff,
  User,
  Lock,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Activity,
  Target,
  CreditCard,
  Heart,
  Loader2,
  UserPlus,
  Check,
  Crown,
  Trophy,
  Camera,
  Timer,
} from "lucide-react";

const MemberRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "checking" | "connected" | "error"
  >("checking");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] =
    useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    age: "",
    password: "",
    confirmPassword: "",
    membershiptype: "MONTHLY",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone_number: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  // Check backend connection on load
  useEffect(() => {
    checkBackendConnection();
  }, []);

  // Calculate password strength
  useEffect(() => {
    calculatePasswordStrength(formData.password);
  }, [formData.password]);

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

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "bg-red-500";
    if (passwordStrength < 50) return "bg-yellow-500";
    if (passwordStrength < 75) return "bg-blue-500";
    return "bg-emerald-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Weak";
    if (passwordStrength < 50) return "Fair";
    if (passwordStrength < 75) return "Good";
    return "Strong";
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Profile picture must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      setProfilePicture(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      phone_number: "",
      age: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
      isValid = false;
    }

    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (
      formData.phone_number &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone_number.replace(/\s/g, ""))
    ) {
      errors.phone_number = "Please enter a valid phone number";
      isValid = false;
    }

    if (!formData.age) {
      errors.age = "Age is required";
      isValid = false;
    } else if (parseInt(formData.age) < 16 || parseInt(formData.age) > 100) {
      errors.age = "Age must be between 16 and 100";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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

    if (!acceptTerms) {
      toast.error("Please accept the membership terms and conditions");
      return;
    }

    if (connectionStatus === "error") {
      toast.error("Cannot connect to server. Please check your connection.");
      return;
    }

    try {
      setIsLoading(true);
      const registrationData = {
        ...formData,
        age: parseInt(formData.age),
        phone_number: formData.phone_number || undefined,
      };

      const response = await memberAPI.registerMember(registrationData);

      if (response.data.isSuccess) {
        // If profile picture is selected, upload it
        if (profilePicture && response.data.newMember?.id) {
          try {
            const formData = new FormData();
            formData.append("profile_picture", profilePicture);

            await fetch(
              `http://localhost:4000/api/members/upload-profile-picture/${response.data.newMember.id}`,
              {
                method: "POST",
                body: formData,
              }
            );

            toast.success(
              "🎉 Welcome to BILKHAYR Premium! Your account has been created with profile picture!"
            );
          } catch (uploadError) {
            console.error("Profile picture upload error:", uploadError);
            toast.success(
              "🎉 Welcome to BILKHAYR Premium! Your account has been created. You can add a profile picture later."
            );
          }
        } else {
          toast.success(
            "🎉 Welcome to BILKHAYR Premium! Your account has been created successfully."
          );
        }

        navigate("/member/login");
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
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

  const getMembershipTypeDescription = (type: string) => {
    switch (type) {
      case "MONTHLY":
        return "Full access to all facilities, classes, and premium features";
      case "DAILY":
        return "Single day access to basic gym facilities";
      default:
        return "";
    }
  };

  const getMembershipPrice = (type: string) => {
    switch (type) {
      case "MONTHLY":
        return "$89/month";
      case "DAILY":
        return "$25/day";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
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
        <div className="w-full max-w-lg">
          {/* Premium Member Registration Card */}
          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
            <CardHeader className="text-center pb-8 relative">
              {/* Premium Member Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-white font-bold px-6 py-1">
                  <Trophy className="w-3 h-3 mr-1" />
                  PREMIUM MEMBERSHIP
                </Badge>
              </div>

              <div className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full blur opacity-50 animate-pulse"></div>
                <Heart className="w-12 h-12 text-white relative z-10" />
              </div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Transform Your Life
              </h1>
              <p className="text-gray-600 text-sm">
                Join the premium fitness revolution at BILKHAYR Premium Fitness
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-emerald-200">
                      <AvatarImage src={profilePicturePreview} alt="Profile" />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-cyan-100 text-emerald-600 text-xl">
                        {formData.name ? (
                          formData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        ) : (
                          <User className="w-8 h-8" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file" className="hidden"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">
                      Add your profile photo
                    </p>
                    <p className="text-xs text-gray-500">
                      Max 5MB • JPG, PNG, GIF
                    </p>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    Personal Information
                  </h3>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name" className="text-sm font-semibold text-gray-700"
                    >
                      Full Name *
                    </Label>
                    <div className="relative group">
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        } className={`h-12 pl-4 bg-gray-50 border-2 transition-all duration-300 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${
                          formErrors.name ? "border-red-500" : "border-gray-200"
                        }`}
                        placeholder="Enter your full name"
                        disabled={isLoading}
                      />
                    </div>
                    {formErrors.name && (
                      <p className="text-sm text-red-600 flex items-center gap-1 bg-red-50 p-2 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email" className="text-sm font-semibold text-gray-700"
                    >
                      Email Address *
                    </Label>
                    <div className="relative group">
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        } className={`h-12 pl-4 pr-10 bg-gray-50 border-2 transition-all duration-300 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${
                          formErrors.email
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="your.email@example.com"
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

                  <div className="grid grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone_number" className="text-sm font-semibold text-gray-700"
                      >
                        Phone Number
                      </Label>
                      <div className="relative group">
                        <Input
                          id="phone_number"
                          value={formData.phone_number}
                          onChange={(e) =>
                            handleInputChange("phone_number", e.target.value)
                          } className={`h-12 pl-4 pr-10 bg-gray-50 border-2 transition-all duration-300 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${
                            formErrors.phone_number
                              ? "border-red-500"
                              : "border-gray-200"
                          }`}
                          placeholder="Phone"
                          disabled={isLoading}
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                        </div>
                      </div>
                      {formErrors.phone_number && (
                        <p className="text-sm text-red-600 flex items-center gap-1 bg-red-50 p-2 rounded">
                          <AlertTriangle className="w-3 h-3" />
                          {formErrors.phone_number}
                        </p>
                      )}
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="age" className="text-sm font-semibold text-gray-700"
                      >
                        Age *
                      </Label>
                      <div className="relative group">
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) =>
                            handleInputChange("age", e.target.value)
                          } className={`h-12 pl-4 pr-10 bg-gray-50 border-2 transition-all duration-300 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${
                            formErrors.age
                              ? "border-red-500"
                              : "border-gray-200"
                          }`}
                          placeholder="Age"
                          min="16"
                          max="100"
                          disabled={isLoading}
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                        </div>
                      </div>
                      {formErrors.age && (
                        <p className="text-sm text-red-600 flex items-center gap-1 bg-red-50 p-2 rounded">
                          <AlertTriangle className="w-3 h-3" />
                          {formErrors.age}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Premium Membership Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                    <Crown className="w-5 h-5 text-emerald-600" />
                    Premium Membership Plan
                  </h3>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">
                      Choose Your Premium Experience *
                    </Label>

                    <div className="grid gap-3">
                      {/* Monthly Premium */}
                      <div className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          formData.membershiptype === "MONTHLY"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-25"
                        }`}
                        onClick={() =>
                          handleInputChange("membershiptype", "MONTHLY")
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-600 rounded-lg">
                              <Trophy className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">
                                Premium Monthly
                              </p>
                              <p className="text-sm text-gray-600">
                                Unlimited access to everything
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-emerald-600 text-lg">
                              $89
                            </p>
                            <p className="text-xs text-gray-500">/month</p>
                          </div>
                        </div>
                        {formData.membershiptype === "MONTHLY" && (
                          <div className="absolute -top-2 -right-2">
                            <Badge className="bg-emerald-600 text-white">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              SELECTED
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Daily Pass */}
                      <div className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          formData.membershiptype === "DAILY"
                            ? "border-cyan-500 bg-cyan-50"
                            : "border-gray-200 hover:border-cyan-300 hover:bg-cyan-25"
                        }`}
                        onClick={() =>
                          handleInputChange("membershiptype", "DAILY")
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-600 rounded-lg">
                              <Timer className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">
                                Daily Pass
                              </p>
                              <p className="text-sm text-gray-600">
                                Perfect for trying us out
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-cyan-600 text-lg">
                              $25
                            </p>
                            <p className="text-xs text-gray-500">/day</p>
                          </div>
                        </div>
                        {formData.membershiptype === "DAILY" && (
                          <div className="absolute -top-2 -right-2">
                            <Badge className="bg-cyan-600 text-white">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              SELECTED
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Setup */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                    <Lock className="w-5 h-5 text-emerald-600" />
                    Account Security
                  </h3>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password" className="text-sm font-semibold text-gray-700"
                    >
                      Secure Password *
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
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="Create a strong password"
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

                    {/* Premium Password Strength */}
                    {formData.password && (
                      <div className="space-y-3 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-700">
                            Security Level:
                          </span>
                          <Badge
                            variant={
                              passwordStrength < 50
                                ? "destructive"
                                : passwordStrength < 75
                                ? "secondary"
                                : "default"
                            } className={
                              passwordStrength >= 75
                                ? "bg-emerald-100 text-emerald-800"
                                : ""
                            }
                          >
                            <Lock className="w-3 h-3 mr-1" />
                            {getPasswordStrengthText()}
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className={`h-3 rounded-full transition-all duration-500 ${getPasswordStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                          ></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Check className={`w-3 h-3 ${
                                formData.password.length >= 8
                                  ? "text-emerald-500"
                                  : "text-gray-300"
                              }`}
                            />
                            <span>8+ characters</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Check className={`w-3 h-3 ${
                                /[A-Z]/.test(formData.password)
                                  ? "text-emerald-500"
                                  : "text-gray-300"
                              }`}
                            />
                            <span>Uppercase</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Check className={`w-3 h-3 ${
                                /[0-9]/.test(formData.password)
                                  ? "text-emerald-500"
                                  : "text-gray-300"
                              }`}
                            />
                            <span>Number</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Check className={`w-3 h-3 ${
                                /[^A-Za-z0-9]/.test(formData.password)
                                  ? "text-emerald-500"
                                  : "text-gray-300"
                              }`}
                            />
                            <span>Special char</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {formErrors.password && (
                      <p className="text-sm text-red-600 flex items-center gap-1 bg-red-50 p-2 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        {formErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700"
                    >
                      Confirm Password *
                    </Label>
                    <div className="relative group">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        } className={`h-12 pl-4 pr-12 bg-gray-50 border-2 transition-all duration-300 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${
                          formErrors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="Confirm your password"
                        disabled={isLoading}
                      />
                      <button
                        type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-emerald-600 transition-colors"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="text-sm text-red-600 flex items-center gap-1 bg-red-50 p-2 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        {formErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Premium Terms */}
                <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 p-4 rounded-xl border border-emerald-200">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) =>
                        setAcceptTerms(checked as boolean)
                      } className="mt-1 border-2 border-gray-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <Label
                      htmlFor="terms" className="text-sm text-gray-700 leading-6"
                    >
                      I agree to the{" "}
                      <Link
                        to="/terms" className="text-emerald-600 hover:text-emerald-800 font-bold"
                      >
                        Premium Membership Terms
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy" className="text-emerald-600 hover:text-emerald-800 font-bold"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>

                {/* Premium Registration Button */}
                <Button
                  type="submit" className="w-full h-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-bold text-base shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                  disabled={
                    isLoading || connectionStatus === "error" || !acceptTerms
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Creating Your Premium Account...
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 mr-3" />
                      Start My Fitness Journey
                    </>
                  )}
                </Button>
              </form>

              {/* Professional Footer */}
              <div className="text-center space-y-4 pt-6 border-t border-gray-200 mt-8">
                <p className="text-sm text-gray-600">
                  Already a premium member?{" "}
                  <Link
                    to="/member/login" className="text-emerald-600 hover:text-emerald-800 font-bold transition-colors"
                  >
                    Access Your Dashboard
                  </Link>
                </p>
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                  <Link
                    to="/staff/register" className="hover:text-emerald-600 transition-colors font-medium"
                  >
                    Staff Careers
                  </Link>
                  <span>•</span>
                  <Link
                    to="/contact" className="hover:text-emerald-600 transition-colors font-medium"
                  >
                    Premium Support
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Trust Indicators */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-1">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-white/90 font-semibold">
                  Award Winning
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-sm text-white/90 font-semibold">
                  5000+ Members
                </span>
              </div>
            </div>
            <p className="text-sm text-white/70 font-medium">
              Join the most trusted premium fitness platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberRegistration;
