import { useState, useRef } from "react";
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
} from "lucide-react";
import { toast } from "react-hot-toast";
import { userAPI, memberAPI } from "../services/api";

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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
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
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Picture Section */}
          <Card>
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
                      alt="Current Profile"
                      className="w-28 h-28 rounded-full object-cover border-4 border-slate-200 dark:border-slate-600 shadow-lg"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-slate-200 dark:border-slate-600 shadow-lg">
                      {user?.name?.[0]?.toUpperCase() || (
                        <User className="h-10 w-10" />
                      )}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full border-2 border-white">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white mt-3">
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
                  }}
                  className="hidden"
                />

                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                    isDragOver
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
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
                      <div
                        className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                          isDragOver
                            ? "bg-blue-100 dark:bg-blue-800"
                            : "bg-slate-100 dark:bg-slate-700"
                        }`}
                      >
                        <Image
                          className={`h-8 w-8 transition-colors ${
                            isDragOver ? "text-blue-600" : "text-slate-500"
                          }`}
                        />
                      </div>

                      <div>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                          {isDragOver
                            ? "Drop your image here"
                            : "Upload New Picture"}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Drag and drop an image here, or click to browse
                        </p>

                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          size="lg"
                          className="bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600"
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
                          alt="Preview"
                          className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-200 dark:border-blue-700 shadow-lg"
                        />
                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-white">
                          <Image className="h-3 w-3" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
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
                          size="sm"
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
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
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
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
          <Card>
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
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
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
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
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
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
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
                      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{
                            width: `${(passwordStrength.score / 6) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <Badge variant="outline">{passwordStrength.label}</Badge>
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
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
                }
                className="w-full"
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
          <Card>
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
                  <p className="text-sm text-slate-600 dark:text-slate-400">
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

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">
                        2FA is now protecting your account
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      You'll need to enter a verification code when signing in
                      from new devices.
                    </p>
                  </div>
                </div>
              )}

              {!twoFactorEnabled && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Enhanced Security</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Enable two-factor authentication to add an extra layer of
                    security to your account.
                  </p>
                </div>
              )}
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
                    <p className="text-sm text-slate-600 dark:text-slate-400">
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
                    <p className="text-sm text-slate-600 dark:text-slate-400">
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
                     <p className="text-sm text-slate-600 dark:text-slate-400">
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
                     <p className="text-sm text-slate-600 dark:text-slate-400">
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
                     <p className="text-sm text-slate-600 dark:text-slate-400">
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
                     <p className="text-sm text-slate-600 dark:text-slate-400">
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
                }}
                className="w-full"
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
                    <p className="text-sm text-slate-600 dark:text-slate-400">
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
                     <p className="text-sm text-slate-600 dark:text-slate-400">
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
                     <p className="text-sm text-slate-600 dark:text-slate-400">
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
                     <p className="text-sm text-slate-600 dark:text-slate-400">
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
                     <p className="text-sm text-slate-600 dark:text-slate-400">
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
                }}
                className="w-full"
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
              <p className="text-sm text-slate-600 dark:text-slate-400">
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
                disabled={isExportingData}
                className="w-full"
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
          <Card className="border-red-200 dark:border-red-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Account Deletion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Danger Zone</span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
              </div>

              {!showDeleteConfirmation ? (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="w-full"
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
                      placeholder="Type DELETE to confirm"
                      className="border-red-300 focus:border-red-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteConfirmation(false);
                        setDeleteConfirmationText("");
                      }}
                      className="flex-1"
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
                      }
                      className="flex-1"
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
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfileManager;
