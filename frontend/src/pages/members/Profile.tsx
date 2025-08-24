import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { memberAPI } from "@/services/api";
import { Member } from "@/types/members/memberLogin";
import { toast } from "react-hot-toast";
import ProfilePictureManager from "@/components/ProfilePictureManager";
import EmailVerification from "@/components/EmailVerification";
import {
  User,
  Calendar,
  CreditCard,
  Camera,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  LogOut,
  ArrowLeft,
  Edit,
  Camera as CameraIcon,
  Activity,
  Users,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutMember } from "@/redux/slices/members/loginSlice";
import { logout as logoutUser } from "@/redux/slices/auth/loginSlice";

const MemberProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user data from Redux (either member or staff)
  const member = useSelector((state: any) => state.loginMemberSlice?.data?.member);
  const user = useSelector((state: any) => state.loginSlice?.data?.user);
  const memberLoading = useSelector((state: any) => state.loginMemberSlice?.loading);
  const userLoading = useSelector((state: any) => state.loginSlice?.loading);

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    age: 18,
    membershiptype: "MONTHLY" as "MONTHLY" | "DAILY",
    password: "",
    confirmPassword: "",
    profile_picture: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const membershipTypes = [
    {
      value: "MONTHLY",
      label: "Monthly Membership",
      description: "Full month access",
    },
    { value: "DAILY", label: "Daily Pass", description: "Single day access" },
  ];

  const ageOptions = Array.from({ length: 83 }, (_, i) => i + 18); // 18 to 100

  // Determine if current user is a member or staff
  const currentUser = member || user;
  const isLoading = memberLoading || userLoading;

  // Set profile picture when currentUser changes
  useEffect(() => {
    if (currentUser?.profile_picture) {
      setProfilePicture(currentUser.profile_picture);
    }
  }, [currentUser]);
  const isMember = !!member;
  const isStaff = !!user;

  // Initialize form data when component mounts
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone_number: currentUser.phone_number || "",
        age: currentUser.age || 18,
        membershiptype: currentUser.membershiptype || "MONTHLY",
        password: "",
        confirmPassword: "",
        profile_picture: currentUser.profile_picture || "",
      });
    }
  }, [currentUser]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (
      formData.phone_number &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone_number.replace(/\s/g, ""))
    ) {
      errors.phone_number = "Please enter a valid phone number";
    }

    if (formData.age < 18 || formData.age > 100) {
      errors.age = "Age must be between 18 and 100";
    }

    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleUpdateProfile = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      setIsUpdating(true);

      // Prepare update data (exclude password if not changed)
      const updateData: Partial<Member> = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number || null,
        age: formData.age,
        membershiptype: formData.membershiptype,
      };

      // Only include password if it was changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      // Only include profile picture if it was changed
      if (formData.profile_picture !== currentUser?.profile_picture) {
        updateData.profile_picture = formData.profile_picture || null;
      }

      let response;
      if (isMember) {
        response = await memberAPI.updateMember(currentUser.id, updateData);
      } else if (isStaff) {
        // For staff users, we would need a user update API
        toast.error("Staff profile updates not implemented yet");
        return;
      }

      if (response?.data.isSuccess) {
        toast.success("Profile updated successfully!");
        // Refresh user data or update Redux state
        setIsEditing(false);
        // Clear password fields
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      } else {
        toast.error(response?.data.message || "Failed to update profile");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    if (isMember) {
      dispatch(logoutMember());
    } else if (isStaff) {
      dispatch(logoutUser());
    }
    navigate("/");
  };

  const handleProfilePictureChange = (pictureUrl: string | null) => {
    setProfilePicture(pictureUrl || "");
    setFormData((prev) => ({ ...prev, profile_picture: pictureUrl || "" }));
  };

  const resetForm = () => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone_number: currentUser.phone_number || "",
        age: currentUser.age || 18,
        membershiptype: currentUser.membershiptype || "MONTHLY",
        password: "",
        confirmPassword: "",
        profile_picture: currentUser.profile_picture || "",
      });
    }
    setValidationErrors({});
    setIsEditing(false);
  };

  // Show loading state while Redux state is initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Not Authenticated
            </h3>
            <p className="text-gray-600 mb-4">
              Please log in to view your profile.
            </p>
            <Button onClick={() => navigate("/")}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="mx-auto space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate(-1)} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                My Profile
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Member Navigation */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                to="/members/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-600"
              >
                <Users className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/members/profile"
                className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 transition-colors border-b-2 border-green-600"
              >
                <User className="h-4 w-4" />
                My Profile
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Clock className="h-4 w-4" />
              <span>Welcome back! You're logged in as a member.</span>
            </div>
          </div>
        </div>

        {/* Profile Overview Card */}
        <Card className="bg-white border-0 shadow-lg dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt={currentUser.name}
                      className="object-cover w-20 h-20 rounded-full"
                    />
                  ) : (
                    <User className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <Button
                  onClick={() => setShowProfileManager(true)}
                  size="sm"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-blue-600 hover:bg-blue-700"
                >
                  <CameraIcon className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {currentUser.name}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {isMember ? "Gym Member" : "Staff Member"} •{" "}
                  {currentUser.email}
                </CardDescription>
              </div>
              <div className="ml-auto">
                <Badge
                  variant="secondary"
                  className={`${
                    currentUser.membershiptype === "MONTHLY"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  }`}
                >
                  {currentUser.membershiptype === "MONTHLY" ? (
                    <Calendar className="w-3 h-3 mr-1" />
                  ) : (
                    <Clock className="w-3 h-3 mr-1" />
                  )}
                  {currentUser.membershiptype} Membership
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentUser.age}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Age
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentUser.email}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Email
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentUser.phone_number || "Not provided"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Phone
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Member Since
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="bg-white border-0 shadow-lg dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Profile Information
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {isEditing
                ? "Update your profile information"
                : "View your profile details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!isEditing}
                    className={validationErrors.name ? "border-red-500" : ""}
                    placeholder="Enter full name"
                  />
                  {validationErrors.name && (
                    <p className="text-sm text-red-600">
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                    className={validationErrors.email ? "border-red-500" : ""}
                    placeholder="Enter email address"
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-red-600">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) =>
                      handleInputChange("phone_number", e.target.value)
                    }
                    disabled={!isEditing}
                    className={
                      validationErrors.phone_number ? "border-red-500" : ""
                    }
                    placeholder="Enter phone number"
                  />
                  {validationErrors.phone_number && (
                    <p className="text-sm text-red-600">
                      {validationErrors.phone_number}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Select
                    value={formData.age.toString()}
                    onValueChange={(value) =>
                      handleInputChange("age", parseInt(value))
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger
                      className={validationErrors.age ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      {ageOptions.map((age) => (
                        <SelectItem key={age} value={age.toString()}>
                          {age} years old
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.age && (
                    <p className="text-sm text-red-600">
                      {validationErrors.age}
                    </p>
                  )}
                </div>
              </div>

              {/* Membership & Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Membership & Security
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="membershiptype">Membership Type *</Label>
                  <Select
                    value={formData.membershiptype}
                    onValueChange={(value: "MONTHLY" | "DAILY") =>
                      handleInputChange("membershiptype", value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select membership type" />
                    </SelectTrigger>
                    <SelectContent>
                      {membershipTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-gray-500">
                              {type.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isEditing && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        New Password (leave blank to keep current)
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className={
                            validationErrors.password ? "border-red-500" : ""
                          }
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {validationErrors.password && (
                        <p className="text-sm text-red-600">
                          {validationErrors.password}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          className={
                            validationErrors.confirmPassword
                              ? "border-red-500"
                              : ""
                          }
                          placeholder="Confirm new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                      {validationErrors.confirmPassword && (
                        <p className="text-sm text-red-600">
                          {validationErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="profile_picture">Profile Picture URL</Label>
                  <Input
                    id="profile_picture"
                    value={formData.profile_picture}
                    onChange={(e) =>
                      handleInputChange("profile_picture", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="Enter profile picture URL"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <>
                <Separator className="my-6" />

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Profile
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white border-0 shadow-lg dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Common actions and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => navigate("/members/dashboard")}
                variant="outline"
                className="h-20 flex-col gap-2"
              >
                <Activity className="w-6 h-6" />
                <span>Members Dashboard</span>
              </Button>

              <Button
                onClick={() => setShowProfileManager(true)}
                variant="outline"
                className="h-20 flex-col gap-2"
              >
                <Camera className="w-6 h-6" />
                <span>Change Photo</span>
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="h-20 flex-col gap-2 border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-6 h-6" />
                <span>Logout</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Email Verification */}
        <Card className="bg-white border-0 shadow-lg dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Email Verification
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Verify your email address to access all features
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <EmailVerification
              email={currentUser?.email || ""}
              isVerified={currentUser?.email_verified || false}
              onVerificationComplete={() => {
                // In a real app, this would update the user state
                toast.success("Email verification status updated!");
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Profile Picture Manager */}
      <ProfilePictureManager
        currentPicture={profilePicture}
        onPictureChange={handleProfilePictureChange}
        isOpen={showProfileManager}
        onClose={() => setShowProfileManager(false)}
        memberName={currentUser?.name}
      />
    </div>
  );
};

export default MemberProfile;
