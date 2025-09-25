import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Camera,
  Upload,
  X,
  User,
  Image,
  Trash2,
  CheckCircle,
  AlertCircle,
  Lock,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Download,
  Smartphone,
  Settings,
  AlertTriangle,
  Save,
  RefreshCw,
  CreditCard,
  QrCode,
  ChevronRight,
  Star,
  Search,
  Sun,
  Moon,
  Command,
  WifiOff,
  ShieldCheck,
  FileText,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { userAPI, memberAPI } from "../services/api";
import DigitalMembershipCard from "./DigitalMembershipCard";

interface ProfileManagerProps {
  onClose: () => void;
  userType: "staff" | "member";
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
  label: string;
}

interface AuditLog {
  id: string;
  timestamp: Date;
  action: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed" | "warning";
  details: string;
  severity: "low" | "medium" | "high" | "critical";
}

interface ValidationError {
  field: string;
  message: string;
  type: "error" | "warning" | "info";
  timestamp: Date;
}

const EnhancedProfileManager = ({ onClose, userType }: ProfileManagerProps) => {
  // Profile Picture States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Management States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Two-Factor Authentication States
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<
    "sms" | "email" | "app"
  >("app");

  // Notification Preferences States
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
    updates: true,
    security: true,
  });

  // Privacy Settings States
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showAge: true,
    allowMessages: true,
    showOnlineStatus: true,
  });

  // Account Deletion States
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Data Export States
  const [isExportingData, setIsExportingData] = useState(false);
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "pdf">(
    "json"
  );

  // Membership & Subscription States
  const [membershipPlans] = useState([
    {
      id: 1,
      name: "Basic Plan",
      price: 29.99,
      duration: "monthly",
      features: [
        "Access to gym equipment",
        "Basic classes",
        "Locker room access",
      ],
      popular: false,
    },
    {
      id: 2,
      name: "Premium Plan",
      price: 49.99,
      duration: "monthly",
      features: [
        "All Basic features",
        "Premium classes",
        "Personal trainer",
        "Spa access",
      ],
      popular: true,
    },
    {
      id: 3,
      name: "Elite Plan",
      price: 79.99,
      duration: "monthly",
      features: [
        "All Premium features",
        "24/7 access",
        "Guest passes",
        "Nutrition consultation",
      ],
      popular: false,
    },
  ]);

  const [currentMembership] = useState({
    plan: "Premium Plan",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    status: "active",
    autoRenew: true,
    nextBilling: "2024-02-15",
  });

  const [paymentHistory] = useState([
    {
      id: 1,
      date: "2024-01-15",
      amount: 49.99,
      method: "Credit Card",
      status: "completed",
      description: "Premium Plan - Monthly",
    },
    {
      id: 2,
      date: "2023-12-15",
      amount: 49.99,
      method: "Credit Card",
      status: "completed",
      description: "Premium Plan - Monthly",
    },
    {
      id: 3,
      date: "2023-11-15",
      amount: 49.99,
      method: "Credit Card",
      status: "completed",
      description: "Premium Plan - Monthly",
    },
  ]);

  const [billingInfo] = useState({
    address: {
      street: "123 Fitness Street",
      city: "Gym City",
      state: "CA",
      zipCode: "90210",
      country: "USA",
    },
    paymentMethods: [
      {
        id: 1,
        type: "credit_card",
        last4: "4242",
        brand: "Visa",
        expiry: "12/25",
        isDefault: true,
      },
    ],
  });

  const [showMembershipCard, setShowMembershipCard] = useState(false);

  // Gym Information
  const [gymInfo] = useState({
    name: "Elite Fitness Center",
    address: "123 Fitness Street, Gym City, CA 90210",
    phone: "+1 (555) 123-4567",
    email: "info@elitefitness.com",
    website: "www.elitefitness.com",
  });

  // User Experience States
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isOffline, setIsOffline] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [focusedSection, setFocusedSection] = useState<string | null>(null);

  // Security & Validation States
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [showSecurityLogs, setShowSecurityLogs] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [securityScore, setSecurityScore] = useState(85);

  const loginState = useSelector((state: RootState) =>
    userType === "staff" ? state.loginSlice : state.loginMemberSlice
  );

  const user =
    userType === "staff"
      ? (loginState.data as any).user
      : (loginState.data as any).member;

  // Password Strength Calculator
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score += 1;
    else feedback.push("At least 8 characters");

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("Include lowercase letters");

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("Include uppercase letters");

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push("Include numbers");

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push("Include special characters");

    if (password.length >= 12) score += 1;

    let color = "bg-red-500";
    let label = "Very Weak";

    if (score >= 2) {
      color = "bg-orange-500";
      label = "Weak";
    }
    if (score >= 3) {
      color = "bg-yellow-500";
      label = "Fair";
    }
    if (score >= 4) {
      color = "bg-blue-500";
      label = "Good";
    }
    if (score >= 5) {
      color = "bg-green-500";
      label = "Strong";
    }
    if (score >= 6) {
      color = "bg-emerald-500";
      label = "Very Strong";
    }

    return { score, feedback, color, label };
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  // Search suggestions data
  const searchSuggestionsData = [
    "Profile Picture",
    "Password",
    "Two-Factor Authentication",
    "Security & Validation",
    "Notifications",
    "Privacy Settings",
    "Data Export",
    "Account Deletion",
    "Membership",
    "Payment History",
    "Billing Information",
    "Subscription Plans",
  ];

  // Generate search suggestions
  const generateSearchSuggestions = (query: string) => {
    if (query.length < 2) return [];
    return searchSuggestionsData
      .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const suggestions = generateSearchSuggestions(value);
    setSearchSuggestions(suggestions);
    setShowSearchSuggestions(suggestions.length > 0);
    setSelectedSuggestionIndex(-1);
  };

  // Handle keyboard navigation in search
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < searchSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0) {
        const selected = searchSuggestions[selectedSuggestionIndex];
        setSearchQuery(selected);
        setShowSearchSuggestions(false);
        // Scroll to section
        scrollToSection(selected);
      }
    } else if (e.key === "Escape") {
      setShowSearchSuggestions(false);
      setSearchQuery("");
    }
  };

  // Scroll to section function
  const scrollToSection = (sectionName: string) => {
    const sectionMap: { [key: string]: string } = {
      "Profile Picture": "profile-picture",
      Password: "password-management",
      "Two-Factor Authentication": "two-factor",
      "Security & Validation": "security-validation",
      Notifications: "notifications",
      "Privacy Settings": "privacy-settings",
      "Data Export": "data-export",
      "Account Deletion": "account-deletion",
      Membership: "membership",
      "Payment History": "payment-history",
      "Billing Information": "billing-info",
      "Subscription Plans": "subscription-plans",
    };

    const sectionId = sectionMap[sectionName];
    if (sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setFocusedSection(sectionId);
        setTimeout(() => setFocusedSection(null), 2000);
      }
    }
  };

  // Keyboard shortcuts handler
  const handleKeyboardShortcuts = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "k":
          e.preventDefault();
          document.getElementById("search-input")?.focus();
          break;
        case "d":
          e.preventDefault();
          setIsDarkMode((prev) => !prev);
          break;
        case "h":
          e.preventDefault();
          setShowKeyboardShortcuts(true);
          break;
        case "Escape":
          setShowKeyboardShortcuts(false);
          break;
      }
    }
  };

  // Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Keyboard shortcuts effect
  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardShortcuts);
    return () =>
      document.removeEventListener("keydown", handleKeyboardShortcuts);
  }, []);

  // Security & Validation Functions
  const sanitizeInput = (input: string): string => {
    // Remove potentially dangerous characters and scripts
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
      .trim();
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const logAuditEvent = (
    action: string,
    details: string,
    status: "success" | "failed" | "warning",
    severity: "low" | "medium" | "high" | "critical" = "low"
  ) => {
    const auditLog: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action,
      userId: user?.id || "unknown",
      ipAddress: "127.0.0.1", // In real app, get from request
      userAgent: navigator.userAgent,
      status,
      details,
      severity,
    };

    setAuditLogs((prev) => [auditLog, ...prev.slice(0, 99)]); // Keep last 100 logs
    console.log("Audit Log:", auditLog);
  };

  const handleRateLimit = (action: string): boolean => {
    const now = new Date();

    // Check if user is locked out
    if (isLocked && lockoutTime) {
      const lockoutDuration = 30 * 60 * 1000; // 30 minutes
      if (now.getTime() - lockoutTime.getTime() < lockoutDuration) {
        const remainingTime = Math.ceil(
          (lockoutDuration - (now.getTime() - lockoutTime.getTime())) / 60000
        );
        toast.error(
          `Account temporarily locked. Try again in ${remainingTime} minutes.`
        );
        return false;
      } else {
        setIsLocked(false);
        setLockoutTime(null);
        setLoginAttempts(0);
      }
    }

    // Increment login attempts
    if (action === "login") {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockoutTime(now);
        logAuditEvent(
          "Account Locked",
          "Too many failed login attempts",
          "warning",
          "high"
        );
        toast.error(
          "Account locked due to too many failed attempts. Try again in 30 minutes."
        );
        return false;
      }
    }

    return true;
  };

  const calculateSecurityScore = (): number => {
    let score = 100;

    // Password strength impact
    if (passwordStrength.score < 3) score -= 20;
    else if (passwordStrength.score < 4) score -= 10;

    // 2FA impact
    if (!twoFactorEnabled) score -= 15;

    // Recent password change
    const lastChange = new Date(); // In real app, get from user data
    const daysSinceChange =
      (Date.now() - lastChange.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceChange > 90) score -= 10;

    // Failed login attempts impact
    if (loginAttempts > 0) score -= Math.min(loginAttempts * 2, 10);

    return Math.max(0, score);
  };

  // Update security score when relevant states change
  useEffect(() => {
    setSecurityScore(calculateSecurityScore());
  }, [passwordStrength.score, twoFactorEnabled, loginAttempts]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Enhanced Profile Management
                </h2>
                <p className="text-blue-100 text-sm">
                  Manage your profile, security, and preferences
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Offline Indicator */}
              {isOffline && (
                <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 rounded-lg border border-yellow-300/30">
                  <WifiOff className="h-4 w-4 text-yellow-300" />
                  <span className="text-sm text-yellow-200">Offline</span>
                </div>
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode((prev) => !prev)} className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                title="Toggle dark mode (Ctrl/Cmd + D)"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Keyboard Shortcuts Help */}
              <button
                onClick={() => setShowKeyboardShortcuts(true)} className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                title="Keyboard shortcuts (Ctrl/Cmd + H)"
              >
                <Command className="h-5 w-5" />
              </button>

              {/* Close Button */}
              <button
                onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                title="Close (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200" />
              <Input
                id="search-input"
                type="text"
                placeholder="Search features... (Ctrl/Cmd + K)"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() =>
                  setShowSearchSuggestions(searchQuery.length >= 2)
                } className="pl-10 pr-4 bg-white/10 border-white/20 text-white placeholder-blue-200 focus:bg-white/20 focus:border-white/40"
              />
            </div>

            {/* Search Suggestions Dropdown */}
            {showSearchSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setShowSearchSuggestions(false);
                      scrollToSection(suggestion);
                    }} className={`w-full px-4 py-3 text-left hover:bg-gray-100${
                      index === selectedSuggestionIndex
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">
                        {suggestion}
                      </span>
                      {index === selectedSuggestionIndex && (
                        <span className="ml-auto text-xs text-gray-500">
                          Press Enter
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Picture Section */}
          <Card
            id="profile-picture" className={`transition-all duration-300 ${
              focusedSection === "profile-picture"
                ? "ring-2 ring-blue-500 shadow-lg"
                : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Profile Picture */}
              <div className="text-center">
                <div className="relative inline-block">
                  {user?.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt="Current Profile" className="w-28 h-28 rounded-full object-cover border-4 border-slate-200"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-slate-100">
                      <User className="h-10 w-10 text-slate-400" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full border-2 border-white">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  {user?.name}
                </p>
              </div>

              {/* File Upload Area */}
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      if (!file.type.startsWith("image/")) {
                        toast.error("Please select an image file");
                        return;
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error("File size must be less than 5MB");
                        return;
                      }
                      setSelectedFile(file);
                      const url = URL.createObjectURL(file);
                      setPreviewUrl(url);
                    }
                  }} className="hidden"
                />

                <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                    isDragOver
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-300"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      const file = files[0];
                      if (!file.type.startsWith("image/")) {
                        toast.error("Please select an image file");
                        return;
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error("File size must be less than 5MB");
                        return;
                      }
                      setSelectedFile(file);
                      const url = URL.createObjectURL(file);
                      setPreviewUrl(url);
                    }
                  }}
                >
                  {!selectedFile ? (
                    <div className="space-y-4">
                      <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                          isDragOver
                            ? "bg-blue-100"
                            : "bg-slate-100"
                        }`}
                      >
                        <Image className={`h-8 w-8 transition-colors ${
                            isDragOver ? "text-blue-600" : "text-slate-500"
                          }`}
                        />
                      </div>

                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {isDragOver
                            ? "Drop your image here"
                            : "Upload New Picture"}
                        </p>
                        <p className="text-slate-600">
                          Drag and drop an image here, or click to browse
                        </p>

                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          size="lg" className="bg-white"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        <img
                          src={previewUrl!}
                          alt="Preview" className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-200"
                        />
                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-white">
                          <Image className="h-3 w-3" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="font-medium text-slate-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB •{" "}
                          {selectedFile.type.split("/")[1].toUpperCase()}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                          variant="outline"
                          size="sm" className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                        <Button
                          onClick={async () => {
                            if (!selectedFile || !user) return;
                            setIsUploading(true);
                            try {
                              await new Promise((resolve) =>
                                setTimeout(resolve, 2000)
                              );
                              const mockImageUrl = `https://via.placeholder.com/400x400/6366f1/ffffff?text=${encodeURIComponent(
                                user.name
                              )}`;
                              if (userType === "staff") {
                                await userAPI.updateProfilePicture(
                                  user.id,
                                  mockImageUrl
                                );
                              } else {
                                await memberAPI.updateProfilePicture(
                                  user.id,
                                  mockImageUrl
                                );
                              }
                              toast.success(
                                "Profile picture updated successfully!"
                              );
                              onClose();
                            } catch (error) {
                              toast.error("Failed to upload profile picture");
                            } finally {
                              setIsUploading(false);
                            }
                          }}
                          disabled={isUploading}
                          size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                        >
                          {isUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Camera className="h-4 w-4 mr-2" />
                              Upload Picture
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Management Section */}
          <Card
            id="password-management" className={`transition-all duration-300 ${
              focusedSection === "password-management"
                ? "ring-2 ring-blue-500 shadow-lg"
                : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Password Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPasswords.current ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPasswords.new ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-2">
                  <Label>Password Strength</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200">
                        <div className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{
                            width: `${(passwordStrength.score / 6) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <Badge variant="outline">{passwordStrength.label}</Badge>
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-sm text-slate-600">
                        <p className="font-medium mb-1">
                          To improve your password:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          {passwordStrength.feedback.map((feedback, index) => (
                            <li key={index}>{feedback}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button
                onClick={async () => {
                  if (newPassword !== confirmPassword) {
                    toast.error("New passwords don't match");
                    return;
                  }
                  if (passwordStrength.score < 3) {
                    toast.error("Password is too weak");
                    return;
                  }
                  setIsChangingPassword(true);
                  try {
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                    toast.success("Password changed successfully!");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  } catch (error) {
                    toast.error("Failed to change password");
                  } finally {
                    setIsChangingPassword(false);
                  }
                }}
                disabled={
                  isChangingPassword ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword
                } className="w-full"
              >
                {isChangingPassword ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication Section */}
          <Card
            id="two-factor" className={`transition-all duration-300 ${
              focusedSection === "two-factor"
                ? "ring-2 ring-blue-500 shadow-lg"
                : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-sm text-slate-600">
                    {twoFactorEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={async (checked: boolean) => {
                    if (checked) {
                      try {
                        await new Promise((resolve) =>
                          setTimeout(resolve, 2000)
                        );
                        setTwoFactorEnabled(true);
                        toast.success(
                          "Two-factor authentication enabled successfully!"
                        );
                      } catch (error) {
                        toast.error("Failed to setup 2FA");
                      }
                    } else {
                      try {
                        await new Promise((resolve) =>
                          setTimeout(resolve, 1000)
                        );
                        setTwoFactorEnabled(false);
                        toast.success("Two-factor authentication disabled");
                      } catch (error) {
                        toast.error("Failed to disable 2FA");
                      }
                    }
                  }}
                />
              </div>

              {twoFactorEnabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Authentication Method</Label>
                    <Select
                      value={twoFactorMethod}
                      onValueChange={(value: any) => setTwoFactorMethod(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="app">
                          Authenticator App (Recommended)
                        </SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-green-50">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">
                        2FA is now protecting your account
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      You'll need to enter a verification code when signing in
                      from new devices.
                    </p>
                  </div>
                </div>
              )}

              {!twoFactorEnabled && (
                <div className="bg-blue-50">
                  <div className="flex items-center gap-2 text-blue-800">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Enhanced Security</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Enable two-factor authentication to add an extra layer of
                    security to your account.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security & Validation Section */}
          <Card
            id="security-validation" className={`transition-all duration-300 ${
              focusedSection === "security-validation"
                ? "ring-2 ring-blue-500 shadow-lg"
                : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Security & Validation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Security Score */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg text-blue-900">
                    Security Score
                  </h3>
                  <Badge
                    variant="outline" className={`${
                      securityScore >= 80
                        ? "bg-green-100 text-green-800"
                        : securityScore >= 60
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {securityScore}/100
                  </Badge>
                </div>

                <div className="w-full bg-gray-200">
                  <div className={`h-3 rounded-full transition-all duration-500 ${
                      securityScore >= 80
                        ? "bg-green-500"
                        : securityScore >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${securityScore}%` }}
                  ></div>
                </div>

                <p className="text-sm text-blue-700">
                  {securityScore >= 80
                    ? "Excellent security! Your account is well protected."
                    : securityScore >= 60
                    ? "Good security, but there's room for improvement."
                    : "Your account security needs attention. Please review the recommendations below."}
                </p>
              </div>

              {/* Input Validation */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Input Validation</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-email">Test Email Validation</Label>
                    <Input
                      id="test-email"
                      type="email"
                      placeholder="Enter email to test"
                      onChange={(e) => {
                        const email = sanitizeInput(e.target.value);
                        if (email && !validateEmail(email)) {
                          setValidationErrors((prev) => [
                            ...prev,
                            {
                              field: "email",
                              message: "Invalid email format",
                              type: "error",
                              timestamp: new Date(),
                            },
                          ]);
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-phone">Test Phone Validation</Label>
                    <Input
                      id="test-phone"
                      type="tel"
                      placeholder="Enter phone to test"
                      onChange={(e) => {
                        const phone = sanitizeInput(e.target.value);
                        if (phone && !validatePhone(phone)) {
                          setValidationErrors((prev) => [
                            ...prev,
                            {
                              field: "phone",
                              message: "Invalid phone format",
                              type: "error",
                              timestamp: new Date(),
                            },
                          ]);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Validation Errors Display */}
                {validationErrors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600">
                      Validation Errors
                    </h4>
                    <div className="space-y-2">
                      {validationErrors.slice(-5).map((error, index) => (
                        <div
                          key={index} className="flex items-center gap-2 p-2 bg-red-50"
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-700">
                            {error.field}: {error.message}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setValidationErrors([])} className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Clear Errors
                    </Button>
                  </div>
                )}
              </div>

              {/* Rate Limiting & Security */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Security Status</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50">
                      <div>
                        <p className="font-medium">Login Attempts</p>
                        <p className="text-sm text-gray-600">
                          {loginAttempts}/5 attempts
                        </p>
                      </div>
                      <Badge
                        variant={
                          loginAttempts >= 3 ? "destructive" : "secondary"
                        }
                      >
                        {loginAttempts >= 5
                          ? "Locked"
                          : loginAttempts >= 3
                          ? "Warning"
                          : "Safe"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50">
                      <div>
                        <p className="font-medium">Account Status</p>
                        <p className="text-sm text-gray-600">
                          {isLocked ? "Temporarily Locked" : "Active"}
                        </p>
                      </div>
                      <Badge variant={isLocked ? "destructive" : "default"}>
                        {isLocked ? "Locked" : "Active"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50">
                      <div>
                        <p className="font-medium">2FA Status</p>
                        <p className="text-sm text-gray-600">
                          {twoFactorEnabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                      <Badge
                        variant={twoFactorEnabled ? "default" : "secondary"}
                      >
                        {twoFactorEnabled ? "Protected" : "Vulnerable"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50">
                      <div>
                        <p className="font-medium">Password Age</p>
                        <p className="text-sm text-gray-600">
                          Last changed: Recently
                        </p>
                      </div>
                      <Badge variant="default">Current</Badge>
                    </div>
                  </div>
                </div>

                {/* Test Security Features */}
                <div className="space-y-3">
                  <h4 className="font-medium">Test Security Features</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (handleRateLimit("login")) {
                          toast.success("Login attempt allowed");
                          logAuditEvent(
                            "Login Attempt",
                            "Successful login test",
                            "success",
                            "low"
                          );
                        }
                      }}
                      disabled={isLocked}
                    >
                      Test Login
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        logAuditEvent(
                          "Security Test",
                          "Manual security test triggered",
                          "success",
                          "low"
                        );
                        toast.success("Security test logged");
                      }}
                    >
                      Log Test Event
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSecurityLogs(true)}
                    >
                      View Audit Logs
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-slate-600">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications((prev) => ({
                        ...prev,
                        email: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-slate-600">
                      Receive updates via SMS
                    </p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications((prev) => ({ ...prev, sms: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-slate-600">
                      Receive push notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications((prev) => ({
                        ...prev,
                        push: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-slate-600">
                      Receive promotional content
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications((prev) => ({
                        ...prev,
                        marketing: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Updates</p>
                    <p className="text-sm text-slate-600">
                      Receive system notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.updates}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications((prev) => ({
                        ...prev,
                        updates: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Security Alerts</p>
                    <p className="text-sm text-slate-600">
                      Receive security notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.security}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications((prev) => ({
                        ...prev,
                        security: checked,
                      }))
                    }
                  />
                </div>
              </div>

              <Button
                onClick={async () => {
                  try {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    toast.success("Notification preferences saved!");
                  } catch (error) {
                    toast.error("Failed to save preferences");
                  }
                }} className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Notification Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <Select
                  value={privacySettings.profileVisibility}
                  onValueChange={(value) =>
                    setPrivacySettings((prev) => ({
                      ...prev,
                      profileVisibility: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      Public - Anyone can see your profile
                    </SelectItem>
                    <SelectItem value="members">
                      Members Only - Only gym members can see
                    </SelectItem>
                    <SelectItem value="private">
                      Private - Only you can see
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Email Address</p>
                    <p className="text-sm text-slate-600">
                      Display email in profile
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.showEmail}
                    onCheckedChange={(checked: boolean) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        showEmail: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Phone Number</p>
                    <p className="text-sm text-slate-600">
                      Display phone in profile
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.showPhone}
                    onCheckedChange={(checked: boolean) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        showPhone: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Age</p>
                    <p className="text-sm text-slate-600">
                      Display age in profile
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.showAge}
                    onCheckedChange={(checked: boolean) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        showAge: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allow Messages</p>
                    <p className="text-sm text-slate-600">
                      Receive messages from others
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.allowMessages}
                    onCheckedChange={(checked: boolean) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        allowMessages: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Online Status</p>
                    <p className="text-sm text-slate-600">
                      Display when you're online
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.showOnlineStatus}
                    onCheckedChange={(checked: boolean) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        showOnlineStatus: checked,
                      }))
                    }
                  />
                </div>
              </div>

              <Button
                onClick={async () => {
                  try {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    toast.success("Privacy settings saved!");
                  } catch (error) {
                    toast.error("Failed to save privacy settings");
                  }
                }} className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>

          {/* Data Export Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Data Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Download a copy of your personal data including profile
                information, settings, and preferences.
              </p>

              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select
                  value={exportFormat}
                  onValueChange={(value: any) => setExportFormat(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON (Recommended)</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={async () => {
                  setIsExportingData(true);
                  try {
                    await new Promise((resolve) => setTimeout(resolve, 2000));

                    // Create mock data export
                    const exportData = {
                      user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        profile_picture: user.profile_picture,
                        created_at: user.createdAt,
                        updated_at: user.updatedAt,
                      },
                      settings: {
                        notifications,
                        privacy: privacySettings,
                        two_factor: twoFactorEnabled,
                      },
                    };

                    if (exportFormat === "json") {
                      const blob = new Blob(
                        [JSON.stringify(exportData, null, 2)],
                        { type: "application/json" }
                      );
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `user-data-${
                        new Date().toISOString().split("T")[0]
                      }.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    } else if (exportFormat === "csv") {
                      // Convert to CSV format
                      const csvContent = `Name,Email,Profile Picture,Created At\n${
                        user.name
                      },${user.email},${user.profile_picture || "N/A"},${
                        user.createdAt
                      }`;
                      const blob = new Blob([csvContent], { type: "text/csv" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `user-data-${
                        new Date().toISOString().split("T")[0]
                      }.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }

                    toast.success("Data exported successfully!");
                  } catch (error) {
                    toast.error("Failed to export data");
                  } finally {
                    setIsExportingData(false);
                  }
                }}
                disabled={isExportingData} className="w-full"
              >
                {isExportingData ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Exporting Data...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Account Deletion Section */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Account Deletion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Danger Zone</span>
                </div>
                <p className="text-sm text-red-700">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
              </div>

              {!showDeleteConfirmation ? (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirmation(true)} className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete My Account
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="delete-confirmation">
                      Type "DELETE" to confirm account deletion
                    </Label>
                    <Input
                      id="delete-confirmation"
                      value={deleteConfirmationText}
                      onChange={(e) =>
                        setDeleteConfirmationText(e.target.value)
                      }
                      placeholder="Type DELETE to confirm" className="border-red-300 focus:border-red-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteConfirmation(false);
                        setDeleteConfirmationText("");
                      }} className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        if (deleteConfirmationText !== "DELETE") {
                          toast.error("Please type DELETE to confirm");
                          return;
                        }
                        setIsDeletingAccount(true);
                        try {
                          await new Promise((resolve) =>
                            setTimeout(resolve, 2000)
                          );
                          toast.success("Account deleted successfully");
                          onClose();
                        } catch (error) {
                          toast.error("Failed to delete account");
                        } finally {
                          setIsDeletingAccount(false);
                        }
                      }}
                      disabled={
                        deleteConfirmationText !== "DELETE" || isDeletingAccount
                      } className="flex-1"
                    >
                      {isDeletingAccount ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Deleting Account...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Permanently Delete Account
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Membership & Subscription Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Membership & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Membership Status */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg text-blue-900">
                    Current Membership
                  </h3>
                  <Badge
                    variant="outline" className="bg-green-100 text-green-800"
                  >
                    {currentMembership.status === "active"
                      ? "Active"
                      : "Inactive"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-blue-700">
                      Plan
                    </p>
                    <p className="font-medium text-blue-900">
                      {currentMembership.plan}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">
                      Next Billing
                    </p>
                    <p className="font-medium text-blue-900">
                      {currentMembership.nextBilling}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">
                      Auto-Renew
                    </p>
                    <p className="font-medium text-blue-900">
                      {currentMembership.autoRenew ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowMembershipCard(true)}
                    variant="outline"
                    size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    View Membership Card
                  </Button>
                  <Button
                    onClick={() =>
                      toast.success("Plan change functionality coming soon!")
                    }
                    variant="outline"
                    size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Change Plan
                  </Button>
                </div>
              </div>

              {/* Subscription Plans */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Available Plans</h3>
                  <Button
                    onClick={() =>
                      toast.success("Plan management coming soon!")
                    }
                    variant="outline"
                    size="sm"
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    View All Plans
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {membershipPlans.map((plan) => (
                    <div
                      key={plan.id} className={`relative border rounded-lg p-4 transition-all ${
                        plan.popular
                          ? "border-purple-300 bg-purple-50"
                          : "border-gray-200"
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-purple-600 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            Most Popular
                          </Badge>
                        </div>
                      )}

                      <div className="text-center space-y-3">
                        <h4 className="font-semibold text-lg">{plan.name}</h4>
                        <div className="text-3xl font-bold text-blue-600">
                          ${plan.price}
                          <span className="text-sm font-normal text-gray-600">
                            /month
                          </span>
                        </div>

                        <ul className="text-sm text-gray-600">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <Button
                          onClick={() =>
                            toast.success("Plan selection coming soon!")
                          } className={`w-full ${
                            plan.popular
                              ? "bg-purple-600 hover:bg-purple-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          Select Plan
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment History */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Payment History</h3>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Statement
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50">
                    <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
                      <div>Date</div>
                      <div>Description</div>
                      <div>Amount</div>
                      <div>Method</div>
                      <div>Status</div>
                    </div>
                  </div>

                  <div className="divide-y">
                    {paymentHistory.map((payment) => (
                      <div
                        key={payment.id} className="px-4 py-3 hover:bg-gray-50"
                      >
                        <div className="grid grid-cols-5 gap-4 text-sm">
                          <div className="text-gray-600">
                            {new Date(payment.date).toLocaleDateString()}
                          </div>
                          <div className="text-gray-900">
                            {payment.description}
                          </div>
                          <div className="font-medium text-gray-900">
                            ${payment.amount}
                          </div>
                          <div className="text-gray-600">
                            {payment.method}
                          </div>
                          <div>
                            <Badge
                              variant={
                                payment.status === "completed"
                                  ? "default"
                                  : "secondary"
                              } className={
                                payment.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : ""
                              }
                            >
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Billing Information</h3>
                  <Button
                    onClick={() =>
                      toast.success("Billing update functionality coming soon!")
                    }
                    variant="outline"
                    size="sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Update Billing
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Billing Address */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">
                      Billing Address
                    </h4>
                    <div className="bg-gray-50">
                      <p className="text-sm text-gray-600">
                        {billingInfo.address.street}
                      </p>
                      <p className="text-sm text-gray-600">
                        {billingInfo.address.city}, {billingInfo.address.state}{" "}
                        {billingInfo.address.zipCode}
                      </p>
                      <p className="text-sm text-gray-600">
                        {billingInfo.address.country}
                      </p>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">
                      Payment Methods
                    </h4>
                    <div className="space-y-3">
                      {billingInfo.paymentMethods.map((method) => (
                        <div
                          key={method.id} className="flex items-center justify-between bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {method.brand} •••• {method.last4}
                              </p>
                              <p className="text-sm text-gray-600">
                                Expires {method.expiry}
                              </p>
                            </div>
                          </div>
                          {method.isDefault && (
                            <Badge variant="outline" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Digital Membership Card Modal */}
          {showMembershipCard && (
            <DigitalMembershipCard
              onClose={() => setShowMembershipCard(false)}
              member={{
                name: user?.name || "Member",
                id: user?.id || "MEM001",
                plan: currentMembership.plan,
                startDate: currentMembership.startDate,
                endDate: currentMembership.endDate,
                status: currentMembership.status,
                profilePicture: user?.profile_picture,
              }}
              gymInfo={gymInfo}
            />
          )}

          {/* Keyboard Shortcuts Modal */}
          {showKeyboardShortcuts && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-3xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <Command className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">
                          Keyboard Shortcuts
                        </h2>
                        <p className="text-blue-100 text-sm">
                          Navigate faster with keyboard shortcuts
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowKeyboardShortcuts(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-gray-900">
                        Navigation
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            Search features
                          </span>
                          <kbd className="px-2 py-1 bg-gray-100">
                            Ctrl/Cmd + K
                          </kbd>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            Toggle dark mode
                          </span>
                          <kbd className="px-2 py-1 bg-gray-100">
                            Ctrl/Cmd + D
                          </kbd>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            Show shortcuts
                          </span>
                          <kbd className="px-2 py-1 bg-gray-100">
                            Ctrl/Cmd + H
                          </kbd>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            Close modal
                          </span>
                          <kbd className="px-2 py-1 bg-gray-100">
                            Esc
                          </kbd>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-gray-900">
                        Search Navigation
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            Move down
                          </span>
                          <kbd className="px-2 py-1 bg-gray-100">
                            ↓
                          </kbd>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            Move up
                          </span>
                          <kbd className="px-2 py-1 bg-gray-100">
                            ↑
                          </kbd>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            Select
                          </span>
                          <kbd className="px-2 py-1 bg-gray-100">
                            Enter
                          </kbd>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            Clear search
                          </span>
                          <kbd className="px-2 py-1 bg-gray-100">
                            Esc
                          </kbd>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Command className="h-5 w-5" />
                      <span className="font-medium">Pro Tip</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Use these shortcuts to navigate the profile manager more
                      efficiently. All shortcuts work globally when the modal is
                      open.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Offline Support Modal */}
          {isOffline && (
            <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg border border-yellow-400 z-40">
              <div className="flex items-center gap-2">
                <WifiOff className="h-5 w-5" />
                <div>
                  <p className="font-medium">You're offline</p>
                  <p className="text-sm text-yellow-100">
                    Some features may be limited
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Audit Logs Modal */}
          {showSecurityLogs && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white">
                <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white rounded-t-3xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">
                          Security Audit Logs
                        </h2>
                        <p className="text-orange-100 text-sm">
                          Monitor all security-related activities
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowSecurityLogs(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Log Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50">
                      <div className="text-2xl font-bold text-green-600">
                        {
                          auditLogs.filter((log) => log.status === "success")
                            .length
                        }
                      </div>
                      <div className="text-sm text-gray-600">
                        Successful
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50">
                      <div className="text-2xl font-bold text-red-600">
                        {
                          auditLogs.filter((log) => log.status === "failed")
                            .length
                        }
                      </div>
                      <div className="text-sm text-gray-600">
                        Failed
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50">
                      <div className="text-2xl font-bold text-yellow-600">
                        {
                          auditLogs.filter((log) => log.status === "warning")
                            .length
                        }
                      </div>
                      <div className="text-sm text-gray-600">
                        Warnings
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50">
                      <div className="text-2xl font-bold text-blue-600">
                        {
                          auditLogs.filter(
                            (log) =>
                              log.severity === "high" ||
                              log.severity === "critical"
                          ).length
                        }
                      </div>
                      <div className="text-sm text-gray-600">
                        High Risk
                      </div>
                    </div>
                  </div>

                  {/* Log Filters */}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAuditLogs([])}
                    >
                      Clear Logs
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const testLogs: AuditLog[] = [
                          {
                            id: "1",
                            timestamp: new Date(),
                            action: "Login Attempt",
                            userId: user?.id || "unknown",
                            ipAddress: "192.168.1.100",
                            userAgent: navigator.userAgent,
                            status: "success",
                            details: "Successful login from new device",
                            severity: "low",
                          },
                          {
                            id: "2",
                            timestamp: new Date(Date.now() - 300000),
                            action: "Password Change",
                            userId: user?.id || "unknown",
                            ipAddress: "192.168.1.100",
                            userAgent: navigator.userAgent,
                            status: "success",
                            details: "Password updated successfully",
                            severity: "medium",
                          },
                          {
                            id: "3",
                            timestamp: new Date(Date.now() - 600000),
                            action: "Failed Login",
                            userId: user?.id || "unknown",
                            ipAddress: "203.0.113.45",
                            userAgent: "Mozilla/5.0 (Unknown)",
                            status: "failed",
                            details: "Invalid credentials from suspicious IP",
                            severity: "high",
                          },
                        ];
                        setAuditLogs(testLogs);
                        toast.success("Sample audit logs loaded");
                      }}
                    >
                      Load Sample Data
                    </Button>
                  </div>

                  {/* Logs Table */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Recent Activity</h3>

                    {auditLogs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No audit logs available</p>
                        <p className="text-sm">
                          Security events will appear here as they occur
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {auditLogs.map((log) => (
                          <div
                            key={log.id} className={`p-4 rounded-lg border ${
                              log.severity === "critical"
                                ? "bg-red-50"
                                : log.severity === "high"
                                ? "bg-orange-50"
                                : log.severity === "medium"
                                ? "bg-yellow-50"
                                : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge
                                    variant={
                                      log.status === "success"
                                        ? "default"
                                        : log.status === "failed"
                                        ? "destructive"
                                        : "secondary"
                                    }
                                  >
                                    {log.status}
                                  </Badge>
                                  <Badge
                                    variant="outline" className={
                                      log.severity === "critical"
                                        ? "border-red-500 text-red-700"
                                        : log.severity === "high"
                                        ? "border-orange-500 text-orange-700"
                                        : log.severity === "medium"
                                        ? "border-yellow-500 text-yellow-700"
                                        : "border-gray-500 text-gray-700"
                                    }
                                  >
                                    {log.severity}
                                  </Badge>
                                </div>

                                <h4 className="font-medium text-gray-900">
                                  {log.action}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {log.details}
                                </p>

                                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {log.timestamp.toLocaleString()}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {log.userId}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Shield className="h-3 w-3" />
                                    {log.ipAddress}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Security Recommendations */}
                  <div className="bg-blue-50">
                    <div className="flex items-center gap-2 text-blue-800">
                      <ShieldCheck className="h-5 w-5" />
                      <span className="font-medium">
                        Security Recommendations
                      </span>
                    </div>
                    <ul className="text-sm text-blue-700">
                      <li>
                        • Monitor failed login attempts and suspicious IP
                        addresses
                      </li>
                      <li>• Review high-severity events immediately</li>
                      <li>
                        • Keep audit logs for compliance and security analysis
                      </li>
                      <li>• Set up alerts for critical security events</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfileManager;
