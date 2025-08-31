import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";
import {
  User,
  Settings,
  Shield,
  Bell,
  Palette,
  LogOut,
  Camera,
  Save,
  Edit,
  Eye,
  EyeOff,
  Key,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Activity,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  Download,
  Trash2,
  AlertCircle,
  Database,
  Wifi,
  WifiOff,
} from "lucide-react";

// Enhanced Types
interface ProfileData {
  id: string;
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    bio: string;
    avatar: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  };
  professional: {
    role: string;
    department: string;
    employeeId: string;
    hireDate: string;
    supervisor: string;
    skills: string[];
    certifications: string[];
    performanceRating: number;
  };
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      marketing: boolean;
    };
    privacy: {
      profileVisibility: string;
      activitySharing: boolean;
      dataAnalytics: boolean;
    };
  };
  security: {
    lastPasswordChange: string;
    lastLogin: string;
    loginHistory: Array<{
      id: string;
      date: string;
      ip: string;
      device: string;
      location: string;
      success: boolean;
    }>;
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    failedLoginAttempts: number;
    accountLocked: boolean;
    securityQuestions: Array<{
      question: string;
      answer: string;
    }>;
  };
  system: {
    profileCompletion: number;
    lastSync: string;
    dataVersion: string;
    connectionStatus: "connected" | "disconnected" | "error";
  };
}

const AdminProfileManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "error"
  >("disconnected");

  // Enhanced Profile state
  const [profileData, setProfileData] = useState<ProfileData>({
    id: "",
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      bio: "",
      avatar: "",
      emailVerified: false,
      phoneVerified: false,
    },
    professional: {
      role: "",
      department: "",
      employeeId: "",
      hireDate: "",
      supervisor: "",
      skills: [],
      certifications: [],
      performanceRating: 0,
    },
    preferences: {
      language: "en",
      timezone: "UTC-5",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12-hour",
      theme: "light",
      notifications: {
        email: true,
        push: true,
        sms: false,
        marketing: false,
      },
      privacy: {
        profileVisibility: "staff",
        activitySharing: false,
        dataAnalytics: true,
      },
    },
    security: {
      lastPasswordChange: "",
      lastLogin: "",
      loginHistory: [],
      twoFactorEnabled: false,
      sessionTimeout: 30,
      failedLoginAttempts: 0,
      accountLocked: false,
      securityQuestions: [],
    },
    system: {
      profileCompletion: 0,
      lastSync: "",
      dataVersion: "",
      connectionStatus: "disconnected",
    },
  });

  // Form state for editing
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    securityQuestion1: "",
    securityAnswer1: "",
    securityQuestion2: "",
    securityAnswer2: "",
  });

  // Database connectivity check
  const checkDatabaseConnection = async () => {
    try {
      setConnectionStatus("connecting");
      const response = await api.get("/admin/profile/health");
      if (response.status === 200) {
        setConnectionStatus("connected");
        toast.success("Database connected successfully!");
      } else {
        setConnectionStatus("error");
        toast.error("Database connection failed");
      }
    } catch (error) {
      setConnectionStatus("error");
      toast.error("Database connection error");
      console.error("Database connection error:", error);
    }
  };

  // Load profile data from database
  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/admin/profile");
      if (response.data) {
        setProfileData(response.data);
        // Update edit form with current data
        setEditForm((prev) => ({
          ...prev,
          firstName: response.data.personal.firstName,
          lastName: response.data.personal.lastName,
          email: response.data.personal.email,
          phone: response.data.personal.phone,
          address: response.data.personal.address,
          bio: response.data.personal.bio,
        }));
        toast.success("Profile loaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to load profile data");
      console.error("Profile load error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save profile to database
  const handleSaveProfile = async () => {
    if (
      !editForm.firstName.trim() ||
      !editForm.lastName.trim() ||
      !editForm.email.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const updateData = {
        personal: {
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          email: editForm.email,
          phone: editForm.phone,
          address: editForm.address,
          bio: editForm.bio,
        },
      };

      const response = await api.put("/admin/profile", updateData);
      if (response.data) {
        setProfileData((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            ...updateData.personal,
          },
        }));
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Change password in database
  const handlePasswordChange = async () => {
    if (
      !editForm.currentPassword ||
      !editForm.newPassword ||
      !editForm.confirmPassword
    ) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (editForm.newPassword !== editForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (editForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.put("/admin/profile/password", {
        currentPassword: editForm.currentPassword,
        newPassword: editForm.newPassword,
      });

      if (response.data) {
        toast.success("Password changed successfully!");
        setEditForm((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
    } catch (error) {
      toast.error("Failed to change password");
      console.error("Password change error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload avatar to database
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.post("/admin/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.avatarUrl) {
        setProfileData((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            avatar: response.data.avatarUrl,
          },
        }));
        toast.success("Avatar updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload avatar");
      console.error("Avatar upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Export profile data
  const handleExportData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/admin/profile/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "profile-data.json");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Profile data exported successfully!");
    } catch (error) {
      toast.error("Failed to export profile data");
      console.error("Export error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        setIsLoading(true);
        await api.delete("/admin/profile");
        toast.success("Account deleted successfully!");
        // Redirect to login
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } catch (error) {
        toast.error("Failed to delete account");
        console.error("Account deletion error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Initialize component
  useEffect(() => {
    checkDatabaseConnection();
    loadProfileData();
  }, []);

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      profileData.personal.firstName,
      profileData.personal.lastName,
      profileData.personal.email,
      profileData.personal.phone,
      profileData.personal.address,
      profileData.personal.bio,
      profileData.professional.role,
      profileData.professional.department,
    ];

    const filledFields = fields.filter(
      (field) => field && field.trim() !== ""
    ).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="w-4 h-4 text-green-600" />;
      case "disconnected":
        return <WifiOff className="w-4 h-4 text-gray-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Database className="w-4 h-4 text-gray-600" />;
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "disconnected":
        return "bg-gray-100 text-gray-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Admin Profile Management
          </h2>
          <p className="text-gray-600">
            Manage your profile, settings, and account preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Database Connection Status */}
          <Badge className={getConnectionStatusColor()}>
            {getConnectionStatusIcon()}
            <span className="ml-2">
              {connectionStatus === "connected"
                ? "Connected"
                : connectionStatus === "disconnected"
                ? "Disconnected"
                : "Error"}
            </span>
          </Badge>

          <Button
            variant="outline"
            onClick={handleExportData}
            disabled={isLoading}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>

          <Button
            variant="outline"
            onClick={handleDeleteAccount}
            disabled={isLoading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/login")}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Profile Completion Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Profile Completion</Label>
            <span className="text-sm text-gray-600">
              {calculateProfileCompletion()}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 transition-all duration-300 bg-blue-600 rounded-full"
              style={{ width: `${calculateProfileCompletion()}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage
                        src={profileData.personal.avatar}
                        alt="Admin Avatar"
                      />
                      <AvatarFallback className="text-4xl">
                        {profileData.personal.firstName &&
                        profileData.personal.lastName
                          ? `${profileData.personal.firstName.charAt(
                              0
                            )}${profileData.personal.lastName.charAt(
                              0
                            )}`.toUpperCase()
                          : "AD"}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50">
                      <Camera className="w-4 h-4 text-gray-600" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                  <CardTitle className="text-xl">
                    {profileData.personal.firstName}{" "}
                    {profileData.personal.lastName}
                  </CardTitle>
                  <p className="text-gray-600">
                    {profileData.professional.role}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {profileData.professional.employeeId}
                  </Badge>

                  {/* Verification Status */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">
                        {profileData.personal.emailVerified
                          ? "✓ Verified"
                          : "✗ Not Verified"}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">
                        {profileData.personal.phoneVerified
                          ? "✓ Verified"
                          : "✗ Not Verified"}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="w-full"
                      disabled={isLoading}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{profileData.personal.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{profileData.personal.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="truncate">
                        {profileData.personal.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Hired: {profileData.professional.hireDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={editForm.firstName}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                firstName: e.target.value,
                              }))
                            }
                            disabled={isLoading}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={editForm.lastName}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                lastName: e.target.value,
                              }))
                            }
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={editForm.address}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={editForm.bio}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              bio: e.target.value,
                            }))
                          }
                          rows={4}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={handleSaveProfile}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Bio
                        </Label>
                        <p className="mt-1">
                          {profileData.personal.bio || "No bio added yet."}
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Skills
                        </Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profileData.professional.skills.length > 0 ? (
                            profileData.professional.skills.map(
                              (skill, index) => (
                                <Badge key={index} variant="outline">
                                  {skill}
                                </Badge>
                              )
                            )
                          ) : (
                            <p className="text-sm text-gray-500">
                              No skills added yet.
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Certifications
                        </Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profileData.professional.certifications.length >
                          0 ? (
                            profileData.professional.certifications.map(
                              (cert, index) => (
                                <Badge key={index} variant="secondary">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {cert}
                                </Badge>
                              )
                            )
                          ) : (
                            <p className="text-sm text-gray-500">
                              No certifications added yet.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Account Status
                </Label>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="text-green-800 bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Account is active and verified
                  </span>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Role & Permissions
                </Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {profileData.professional.role}
                      </p>
                      <p className="text-sm text-gray-600">
                        {profileData.professional.department}
                      </p>
                    </div>
                    <Badge variant="outline">Full Access</Badge>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  System Information
                </Label>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Last Sync:</span>
                    <span>{profileData.system.lastSync || "Never"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Version:</span>
                    <span>{profileData.system.dataVersion || "Unknown"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Database Status:</span>
                    <Badge className={getConnectionStatusColor()}>
                      {connectionStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={editForm.currentPassword}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-0 right-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={editForm.newPassword}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={editForm.confirmPassword}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-0 right-0 h-full px-3"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handlePasswordChange}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                      Changing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-xs text-gray-600">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Badge
                    className={
                      profileData.security.twoFactorEnabled
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {profileData.security.twoFactorEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">
                      Session Timeout
                    </Label>
                    <p className="text-xs text-gray-600">
                      Auto-logout after inactivity
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    {profileData.security.sessionTimeout} minutes
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">
                      Failed Login Attempts
                    </Label>
                    <p className="text-xs text-gray-600">
                      Recent failed attempts
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    {profileData.security.failedLoginAttempts}
                  </span>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Recent Login Activity
                  </Label>
                  <div className="mt-2 space-y-2">
                    {profileData.security.loginHistory
                      .slice(0, 3)
                      .map((login, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>{login.date}</span>
                            <span className="text-gray-500">
                              {login.location}
                            </span>
                          </div>
                          <div className="text-gray-500">
                            {login.device} • {login.ip}
                          </div>
                        </div>
                      ))}
                    {profileData.security.loginHistory.length === 0 && (
                      <p className="text-xs text-gray-500">
                        No login history available.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Display Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Display Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={profileData.preferences.theme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={profileData.preferences.language}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profileData.preferences.timezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">UTC-8 (PST)</SelectItem>
                      <SelectItem value="UTC-5">UTC-5 (EST)</SelectItem>
                      <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email-notifications"
                      checked={profileData.preferences.notifications.email}
                    />
                    <Label htmlFor="email-notifications">
                      Email Notifications
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="push-notifications"
                      checked={profileData.preferences.notifications.push}
                    />
                    <Label htmlFor="push-notifications">
                      Push Notifications
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms-notifications"
                      checked={profileData.preferences.notifications.sms}
                    />
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="marketing-notifications"
                      checked={profileData.preferences.notifications.marketing}
                    />
                    <Label htmlFor="marketing-notifications">
                      Marketing Communications
                    </Label>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Privacy Settings
                  </Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Profile Visibility</span>
                      <Badge variant="outline">
                        {profileData.preferences.privacy.profileVisibility}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Activity Sharing</span>
                      <Badge
                        variant={
                          profileData.preferences.privacy.activitySharing
                            ? "default"
                            : "secondary"
                        }
                      >
                        {profileData.preferences.privacy.activitySharing
                          ? "Enabled"
                          : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProfileManagement;
