import React, { useState } from "react";
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
} from "lucide-react";

const AdminProfileManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    personal: {
      firstName: "John",
      lastName: "Admin",
      email: "admin@fitlifegym.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1985-03-15",
      gender: "male",
      address: "123 Fitness Street, Gym City, GC 12345",
      bio: "Experienced gym administrator with 8+ years in fitness management. Passionate about creating exceptional member experiences and optimizing gym operations.",
      avatar: "/avatars/admin-avatar.jpg",
    },
    professional: {
      role: "Gym Administrator",
      department: "Management",
      employeeId: "ADM001",
      hireDate: "2020-01-15",
      supervisor: "Sarah Johnson",
      skills: [
        "Gym Management",
        "Member Relations",
        "Financial Planning",
        "Staff Training",
      ],
      certifications: [
        "Fitness Management Certification",
        "CPR/AED Certified",
        "First Aid Certified",
      ],
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
      lastPasswordChange: "2024-01-01",
      lastLogin: "2024-01-15 16:30:00",
      loginHistory: [
        {
          date: "2024-01-15 16:30:00",
          ip: "192.168.1.100",
          device: "Chrome on Windows",
          location: "Gym Office",
        },
        {
          date: "2024-01-15 09:15:00",
          ip: "192.168.1.100",
          device: "Chrome on Windows",
          location: "Gym Office",
        },
        {
          date: "2024-01-14 17:45:00",
          ip: "192.168.1.100",
          device: "Chrome on Windows",
          location: "Gym Office",
        },
      ],
      twoFactorEnabled: true,
      sessionTimeout: 30,
    },
  });

  // Form state for editing
  const [editForm, setEditForm] = useState({
    firstName: profileData.personal.firstName,
    lastName: profileData.personal.lastName,
    email: profileData.personal.email,
    phone: profileData.personal.phone,
    address: profileData.personal.address,
    bio: profileData.personal.bio,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Event handlers
  const handleEditProfile = () => {
    setIsEditing(true);
    setEditForm({
      firstName: profileData.personal.firstName,
      lastName: profileData.personal.lastName,
      email: profileData.personal.email,
      phone: profileData.personal.phone,
      address: profileData.personal.address,
      bio: profileData.personal.bio,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSaveProfile = async () => {
    // Validate form
    if (
      !editForm.firstName.trim() ||
      !editForm.lastName.trim() ||
      !editForm.email.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (
      editForm.newPassword &&
      editForm.newPassword !== editForm.confirmPassword
    ) {
      toast.error("New passwords do not match");
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update profile data
    setProfileData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        bio: editForm.bio,
      },
    }));

    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleLogout = async () => {
    // Simulate logout process
    toast.success("Logging out...");
    // Here you would typically clear auth tokens and redirect to login
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Password changed successfully!");
    setEditForm((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would typically upload the file to your server
      toast.success("Avatar updated successfully!");
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="relative mx-auto w-32 h-32 mb-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage
                        src={profileData.personal.avatar}
                        alt="Admin Avatar"
                      />
                      <AvatarFallback className="text-4xl">
                        {getInitials(
                          profileData.personal.firstName,
                          profileData.personal.lastName
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50">
                      <Camera className="h-4 w-4 text-gray-600" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
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
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Button onClick={handleEditProfile} className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{profileData.personal.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{profileData.personal.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="truncate">
                        {profileData.personal.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Button onClick={handleSaveProfile}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={handleCancelEdit}>
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
                        <p className="mt-1">{profileData.personal.bio}</p>
                      </div>
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Skills
                        </Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profileData.professional.skills.map(
                            (skill, index) => (
                              <Badge key={index} variant="outline">
                                {skill}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Certifications
                        </Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profileData.professional.certifications.map(
                            (cert, index) => (
                              <Badge key={index} variant="secondary">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {cert}
                              </Badge>
                            )
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
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
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
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
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
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button onClick={handlePasswordChange} className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Display Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
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
                  <Bell className="h-5 w-5" />
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
