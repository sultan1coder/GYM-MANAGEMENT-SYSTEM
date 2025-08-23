import { useState } from "react";
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
} from "lucide-react";
import ProfileManager from "../components/ProfileManager";
import { isAdmin, isStaff, isMember } from "../utils/auth";
import { toast } from "react-hot-toast";

const ProfileSettings = () => {
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [userType, setUserType] = useState<"staff" | "member">("staff");
  const [isEditing, setIsEditing] = useState(false);

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

  const openProfileManager = (type: "staff" | "member") => {
    setUserType(type);
    setShowProfileManager(true);
  };

  const handleSaveChanges = () => {
    // TODO: Implement actual profile update logic
    toast.success("Profile updated successfully!");
    setIsEditing(false);
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
                    <div className="flex items-center justify-center w-32 h-32 text-4xl font-bold text-white border-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 border-slate-200 dark:border-slate-600">
                      {user.name?.[0]?.toUpperCase() || (
                        <User className="w-12 h-12" />
                      )}
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
                      defaultValue={user.name}
                      disabled={!isEditing}
                      className="disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user.email}
                      disabled={!isEditing}
                      className="disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      defaultValue={user.phone_number || "Not provided"}
                      disabled={!isEditing}
                      className="disabled:opacity-50"
                    />
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
                        defaultValue={
                          isMemberUser && "age" in user
                            ? user.age?.toString()
                            : ""
                        }
                        disabled={!isEditing}
                        className="disabled:opacity-50"
                      />
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
                        defaultValue={
                          isStaffUser && "role" in user ? user.role : ""
                        }
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
                        defaultValue={
                          isMemberUser && "membershiptype" in user
                            ? user.membershiptype
                            : ""
                        }
                        disabled
                        className="disabled:opacity-50"
                      />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSaveChanges} className="flex-1">
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
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
                  <Button variant="outline" size="sm">
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
                  <Button variant="outline" size="sm">
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
    </div>
  );
};

export default ProfileSettings;
