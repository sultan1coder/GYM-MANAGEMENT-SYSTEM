import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";
import {
  User,
  Settings,
  Shield,
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
  CheckCircle,
  Download,
  Trash2,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  department: string;
  employeeId: string;
  hireDate: string;
}

const AdminProfileManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "error" | "connecting"
  >("disconnected");

  const [profileData, setProfileData] = useState<ProfileData>({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    avatar: "",
    department: "Administration",
    employeeId: "",
    hireDate: new Date().toISOString().split("T")[0],
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Get current user ID from localStorage
  const getCurrentUserId = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      return user.id;
    }
    return null;
  };

  // Backend connectivity check
  const checkBackendConnection = async () => {
    try {
      setConnectionStatus("connecting");
      const response = await api.get("");
      if (response.status === 200) {
        setConnectionStatus("connected");
        // Removed duplicate toast - connection status is shown in UI badge
      } else {
        setConnectionStatus("error");
      }
    } catch (error) {
      setConnectionStatus("error");
      console.error("Backend connection error:", error);
    }
  };

  // Load profile data from database
  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      const userId = getCurrentUserId();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const userResponse = await api.get(`/users/single/${userId}`);
      if (userResponse.data?.data) {
        const user = userResponse.data.data;
        const profileInfo = {
          id: userId,
          name: user.name || "",
          email: user.email || "",
          phone: user.phone_number || "",
          role: user.role || "Admin",
          avatar: user.profile_picture || "",
          department: "Administration",
          employeeId: userId.toString(),
          hireDate: user.created_at
            ? new Date(user.created_at).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        };

        setProfileData(profileInfo);
        setEditForm({
          name: profileInfo.name,
          email: profileInfo.email,
          phone: profileInfo.phone,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        // Profile loads silently - no need for success toast on every page load
      }
    } catch (error) {
      console.error("Profile load error:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  // Save profile to database
  const handleSaveProfile = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const userId = getCurrentUserId();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const updateData = {
        name: editForm.name,
        email: editForm.email,
        phone_number: editForm.phone,
      };

      const response = await api.put(`/users/update/${userId}`, updateData);
      if (response.data?.data) {
        setProfileData((prev) => ({
          ...prev,
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
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

  // Change password
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
      const userId = getCurrentUserId();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const response = await api.put(`/users/change-password/${userId}`, {
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

  // Upload avatar
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const userId = getCurrentUserId();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const formData = new FormData();
      formData.append("profile_picture", file);

      const response = await api.post(
        `/users/upload-profile-picture/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.data?.profile_picture) {
        setProfileData((prev) => ({
          ...prev,
          avatar: response.data.data.profile_picture,
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

  // Initialize component
  useEffect(() => {
    checkBackendConnection();
    loadProfileData();
  }, []);

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="w-4 h-4 text-green-600" />;
      case "connecting":
        return (
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        );
      case "disconnected":
        return <WifiOff className="w-4 h-4 text-gray-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "connecting":
        return "bg-blue-100 text-blue-800";
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
            Manage your profile and account settings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getConnectionStatusColor()}>
            {getConnectionStatusIcon()}
            <span className="ml-2">
              {connectionStatus === "connected"
                ? "Backend Connected"
                : connectionStatus === "connecting"
                ? "Connecting..."
                : connectionStatus === "disconnected"
                ? "Backend Disconnected"
                : "Backend Error"}
            </span>
          </Badge>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab} className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
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
                        src={profileData.avatar}
                        alt="Admin Avatar"
                      />
                      <AvatarFallback className="text-4xl">
                        {profileData.name
                          ? profileData.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "AD"}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50">
                      <Camera className="w-4 h-4 text-gray-600" />
                      <input
                        type="file" className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                  <CardTitle className="text-xl">{profileData.name}</CardTitle>
                  <p className="text-gray-600">{profileData.role}</p>
                  <Badge variant="secondary" className="mt-2">
                    ID: {profileData.employeeId}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Button
                      onClick={() => setIsEditing(true)} className="w-full"
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
                      <span>{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{profileData.phone || "Not provided"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Joined: {profileData.hireDate}</span>
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
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          disabled={isLoading}
                        />
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
                          Role
                        </Label>
                        <p className="mt-1">{profileData.role}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Department
                        </Label>
                        <p className="mt-1">{profileData.department}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Employee ID
                        </Label>
                        <p className="mt-1">{profileData.employeeId}</p>
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
                      <p className="font-medium">{profileData.role}</p>
                      <p className="text-sm text-gray-600">
                        {profileData.department}
                      </p>
                    </div>
                    <Badge variant="outline">Full Access</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
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
                    size="sm" className="absolute top-0 right-0 h-full px-3"
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
                <Input
                  id="confirmPassword"
                  type="password"
                  value={editForm.confirmPassword}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handlePasswordChange} className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                    Changing...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProfileManagement;
