import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Camera,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Users,
  X,
} from "lucide-react";
import ProfileManager from "../components/ProfileManager";
import { isAdmin, isStaff, isMember } from "../utils/auth";
import { toast } from "react-hot-toast";
import {
  updateUserBasicProfile,
  changeUserPassword,

} from "../services/api";
import { memberAPI } from "../services/api";

const ProfileSettings = () => {
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [userType, setUserType] = useState<"staff" | "member">("staff");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    age: 18,
    role: "",
    membershiptype: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const loginState = useSelector((state: RootState) => state.loginSlice);
  const memberLoginState = useSelector(
    (state: RootState) => state.loginMemberSlice
  );

  // Determine which user type is logged in
  const isStaffUser = isStaff() || isAdmin();
  const isMemberUser = isMember();

  // Get the appropriate user data
  const user = isStaffUser
    ? loginState.data.user
    : memberLoginState.data.member;
  const isLoggedIn = isStaffUser
    ? loginState.data.isSuccess
    : memberLoginState.data.isSuccess;

  // Initialize form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        age: (user as any).age || 18,
        role: (user as any).role || "",
        membershiptype: (user as any).membershiptype || "",
      });
    }
  }, [user]);

  const openProfileManager = (type: "staff" | "member") => {
    setUserType(type);
    setShowProfileManager(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone_number && formData.phone_number.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phone_number.replace(/[\s\-\(\)]/g, ""))) {
        errors.phone_number = "Please enter a valid phone number";
      }
    }

    // Age validation for members
    if (isMemberUser && formData.age) {
      if (formData.age < 13 || formData.age > 120) {
        errors.age = "Age must be between 13 and 120";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    // Validate form before submitting
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsUpdating(true);
    try {
      // Prepare update data
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number || undefined,
        age: isMemberUser ? formData.age : undefined,
        role: isStaffUser ? formData.role : undefined,
        membershiptype: isMemberUser ? formData.membershiptype : undefined,
      };

      let response;
      if (isStaffUser) {
        response = await updateUserBasicProfile(user.id as number, updateData);
      } else {
        response = await memberAPI.updateBasicProfile(user.id as string, updateData);
      }

      if (response?.data.isSuccess) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        // TODO: Update Redux store with new user data
      } else {
        toast.error(response?.data.message || "Failed to update profile");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long!");
      return;
    }

    setIsChangingPassword(true);
    try {
      let response;
      if (isStaffUser) {
        response = await changeUserPassword(user.id as number, {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        });
      } else {
        response = await memberAPI.changePassword(user.id as string, {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        });
      }

      if (response?.data.isSuccess) {
        toast.success("Password changed successfully!");
        setShowPasswordChange(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(response?.data.message || "Failed to change password");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
            Please log in to view profile settings
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            You need to be logged in to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Profile Picture
                </CardTitle>
                <CardDescription>Update your profile picture</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative inline-block mb-4">
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt="Profile"
                      className="object-cover w-32 h-32 border-4 rounded-full border-slate-200 dark:border-slate-600"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-32 h-32 border-4 rounded-full bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                      <User className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => openProfileManager(userType)}
                  variant="outline"
                  className="w-full"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Change Picture
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      disabled={!isEditing}
                      className={`disabled:opacity-50 ${
                        validationErrors.name ? "border-red-500" : ""
                      }`}
                    />
                    {validationErrors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={!isEditing}
                      className={`disabled:opacity-50 ${
                        validationErrors.email ? "border-red-500" : ""
                      }`}
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone_number || ""}
                      onChange={(e) =>
                        handleInputChange("phone_number", e.target.value)
                      }
                      disabled={!isEditing}
                      className={`disabled:opacity-50 ${
                        validationErrors.phone_number ? "border-red-500" : ""
                      }`}
                    />
                    {validationErrors.phone_number && (
                      <p className="text-sm text-red-500 mt-1">
                        {validationErrors.phone_number}
                      </p>
                    )}
                  </div>

                  {isMemberUser && (
                    <div className="space-y-2">
                      <Label htmlFor="age" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Age
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age.toString()}
                        onChange={(e) =>
                          handleInputChange(
                            "age",
                            parseInt(e.target.value) || 18
                          )
                        }
                        disabled={!isEditing}
                        className={`disabled:opacity-50 ${
                          validationErrors.age ? "border-red-500" : ""
                        }`}
                      />
                      {validationErrors.age && (
                        <p className="text-sm text-red-500 mt-1">
                          {validationErrors.age}
                        </p>
                      )}
                    </div>
                  )}

                  {isStaffUser && (
                    <div className="space-y-2">
                      <Label htmlFor="role" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Role
                      </Label>
                      <Input
                        id="role"
                        value={formData.role}
                        disabled
                        className="disabled:opacity-50"
                      />
                    </div>
                  )}

                  {isMemberUser && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="membership"
                        className="flex items-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        Membership Type
                      </Label>
                      <Input
                        id="membership"
                        value={formData.membershiptype}
                        disabled
                        className="disabled:opacity-50"
                      />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleSaveChanges}
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      {isUpdating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Security Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Account Security
                </CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Change Password</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Update your account password
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPasswordChange(true)}
                  >
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast.success(
                        "Two-factor authentication will be implemented soon"
                      )
                    }
                  >
                    Enable
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Profile Manager Modal */}
      {showProfileManager && (
        <ProfileManager
          onClose={() => setShowProfileManager(false)}
          userType={userType}
        />
      )}

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Change Password
              </h3>
              <button
                onClick={() => setShowPasswordChange(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword}
                  className="flex-1"
                >
                  {isChangingPassword ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordChange(false)}
                  disabled={isChangingPassword}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
