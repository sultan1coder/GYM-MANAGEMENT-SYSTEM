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
import { authAPI } from "@/services/api";
import {
  Dumbbell,
  Eye,
  EyeOff,
  Shield,
  Lock,
  Mail,
  User,
  Phone,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Users,
  Settings,
  BarChart3,
  Activity,
  Loader2,
  UserPlus,
  Check,
  Crown,
  Award,
  Briefcase,
  Camera,
  Upload,
} from "lucide-react";

const StaffRegistration: React.FC = () => {
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
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    role: "staff",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    username: "",
    email: "",
    phone_number: "",
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
      username: "",
      email: "",
      phone_number: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
      isValid = false;
    }

    if (!formData.username.trim()) {
      errors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    if (!formData.email) {
      errors.email = "Professional email is required";
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

    if (!formData.password) {
      errors.password = "Secure password is required";
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
      toast.error("Please accept the professional terms and conditions");
      return;
    }

    if (connectionStatus === "error") {
      toast.error("Cannot connect to server. Please check your connection.");
      return;
    }

    try {
      setIsLoading(true);

      // First create the user account
      const response = await authAPI.registerUser(formData);

      if (response.data.isSuccess) {
        // If profile picture is selected, upload it
        if (profilePicture && response.data.newUser?.id) {
          try {
            const formData = new FormData();
            formData.append("profile_picture", profilePicture);

            await fetch(
              `http://localhost:4000/api/users/upload-profile-picture/${response.data.newUser.id}`,
              {
                method: "POST",
                body: formData,
              }
            );

            toast.success("Account created successfully with profile picture!");
          } catch (uploadError) {
            console.error("Profile picture upload error:", uploadError);
            toast.success(
              "Account created successfully! Profile picture upload failed, you can update it later."
            );
          }
        } else {
          toast.success("Account created successfully!");
        }

        navigate("/staff/login");
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

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "staff":
        return "General staff member with standard access";
      case "manager":
        return "Management role with advanced permissions";
      case "trainer":
        return "Certified personal trainer with member access";
      case "receptionist":
        return "Front desk operations and member services";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Professional Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Premium Navigation */}
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
                to="/staff/login" className="inline-flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-lg">
          {/* Professional Registration Card */}
          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
            <CardHeader className="text-center pb-8 relative">
              {/* Elite Staff Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold px-4 py-1">
                  <Crown className="w-3 h-3 mr-1" />
                  ELITE STAFF ACCESS
                </Badge>
              </div>

              <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur opacity-50 animate-pulse"></div>
                <Briefcase className="w-10 h-10 text-white relative z-10" />
              </div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Join Our Elite Team
              </h1>
              <p className="text-gray-600 text-sm">
                Register as staff to access the gym management system
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-gray-200">
                      <AvatarImage src={profilePicturePreview} alt="Profile" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 text-xl">
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
                    <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg">
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
                      Upload your professional photo
                    </p>
                    <p className="text-xs text-gray-500">
                      Max 5MB • JPG, PNG, GIF
                    </p>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Professional Identity
                  </h3>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name" className="text-sm font-semibold text-gray-700"
                    >
                      Full Professional Name *
                    </Label>
                    <div className="relative group">
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        } className={`h-12 pl-4 bg-gray-50 border-2 transition-all duration-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                          formErrors.name ? "border-red-500" : "border-gray-200"
                        }`}
                        placeholder="Enter your full professional name"
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

                  {/* Username */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="username" className="text-sm font-semibold text-gray-700"
                    >
                      Professional Username *
                    </Label>
                    <div className="relative group">
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        } className={`h-12 pl-4 bg-gray-50 border-2 transition-all duration-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                          formErrors.username
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="Choose a unique professional username"
                        disabled={isLoading}
                      />
                    </div>
                    {formErrors.username && (
                      <p className="text-sm text-red-600 flex items-center gap-1 bg-red-50 p-2 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        {formErrors.username}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email" className="text-sm font-semibold text-gray-700"
                    >
                      Professional Email Address *
                    </Label>
                    <div className="relative group">
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        } className={`h-12 pl-4 pr-10 bg-gray-50 border-2 transition-all duration-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                          formErrors.email
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="your.name@company.com"
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

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone_number" className="text-sm font-semibold text-gray-700"
                    >
                      Professional Contact Number
                    </Label>
                    <div className="relative group">
                      <Input
                        id="phone_number"
                        value={formData.phone_number}
                        onChange={(e) =>
                          handleInputChange("phone_number", e.target.value)
                        } className={`h-12 pl-4 pr-10 bg-gray-50 border-2 transition-all duration-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                          formErrors.phone_number
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="+1 (555) 123-4567"
                        disabled={isLoading}
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                    </div>
                    {formErrors.phone_number && (
                      <p className="text-sm text-red-600 flex items-center gap-1 bg-red-50 p-2 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        {formErrors.phone_number}
                      </p>
                    )}
                  </div>

                  {/* Professional Role */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="role" className="text-sm font-semibold text-gray-700"
                    >
                      Professional Role *
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        handleInputChange("role", value)
                      }
                    >
                      <SelectTrigger className="h-12 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="font-semibold">Staff Member</p>
                              <p className="text-xs text-gray-500">
                                General operations and member services
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="manager">
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-purple-600" />
                            <div>
                              <p className="font-semibold">Fitness Manager</p>
                              <p className="text-xs text-gray-500">
                                Advanced management and oversight
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="trainer">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-emerald-600" />
                            <div>
                              <p className="font-semibold">Personal Trainer</p>
                              <p className="text-xs text-gray-500">
                                Certified fitness professional
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="receptionist">
                          <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4 text-orange-600" />
                            <div>
                              <p className="font-semibold">
                                Reception Specialist
                              </p>
                              <p className="text-xs text-gray-500">
                                Front desk and customer service
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      {getRoleDescription(formData.role)}
                    </p>
                  </div>
                </div>

                {/* Enterprise Security */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Enterprise Security
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
                        } className={`h-12 pl-4 pr-12 bg-gray-50 border-2 transition-all duration-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                          formErrors.password
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="Create a strong professional password"
                        disabled={isLoading}
                      />
                      <button
                        type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Professional Password Strength */}
                    {formData.password && (
                      <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-700">
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
                            {getPasswordStrengthText()}
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full transition-all duration-500 ${getPasswordStrengthColor()}`}
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
                            <span>Uppercase letter</span>
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
                            <span>Special character</span>
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
                      Confirm Secure Password *
                    </Label>
                    <div className="relative group">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        } className={`h-12 pl-4 pr-12 bg-gray-50 border-2 transition-all duration-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                          formErrors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="Confirm your secure password"
                        disabled={isLoading}
                      />
                      <button
                        type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
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

                {/* Professional Terms */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) =>
                        setAcceptTerms(checked as boolean)
                      } className="mt-1 border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label
                      htmlFor="terms" className="text-sm text-gray-700 leading-6"
                    >
                      I agree to the{" "}
                      <Link
                        to="/terms" className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Professional Terms of Service
                      </Link>
                      ,{" "}
                      <Link
                        to="/privacy" className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Privacy Policy
                      </Link>
                      , and{" "}
                      <Link
                        to="/code-of-conduct" className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Staff Code of Conduct
                      </Link>
                    </Label>
                  </div>
                </div>

                {/* Professional Registration Button */}
                <Button
                  type="submit" className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold text-base shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                  disabled={
                    isLoading || connectionStatus === "error" || !acceptTerms
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Creating Professional Account...
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-3" />
                      Join BILKHAYR Elite Team
                    </>
                  )}
                </Button>
              </form>

              {/* Professional Footer */}
              <div className="text-center space-y-4 pt-6 border-t border-gray-200 mt-8">
                <p className="text-sm text-gray-600">
                  Already have a professional account?{" "}
                  <Link
                    to="/staff/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                  >
                    Sign In Here
                  </Link>
                </p>
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                  <Link
                    to="/member/register" className="hover:text-blue-600 transition-colors font-medium"
                  >
                    Member Registration
                  </Link>
                  <span>•</span>
                  <Link
                    to="/contact" className="hover:text-blue-600 transition-colors font-medium"
                  >
                    HR Support
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Trust Indicators */}
          <div className="mt-8 text-center space-y-3">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-white/80">Industry Leader</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-white/80">Secure Platform</span>
              </div>
            </div>
            <p className="text-xs text-white/60">
              Join the elite team at the most advanced fitness platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffRegistration;
