import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Calendar,
  CreditCard,
  Activity,
  Clock,
  Phone,
  Mail,
  Camera,
  Settings,
  LogOut,
  Users,
  Dumbbell,
  Award,
  Target,
} from "lucide-react";
import { logout as logoutMember } from "@/redux/slices/members/loginSlice";
import { logout as logoutUser } from "@/redux/slices/auth/loginSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

const MemberDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user data from Redux (either member or staff)
  const member = useSelector(
    (state: any) => state.loginMemberSlice.data.member
  );
  const user = useSelector((state: any) => state.loginSlice.data.user);

  // Determine if current user is a member or staff
  const currentUser = member || user;
  const isMember = !!member;
  const isStaff = !!user;

  // Redirect if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate("/members/login");
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    if (isMember) {
      dispatch(logoutMember());
    } else if (isStaff) {
      dispatch(logoutUser());
    }
    navigate("/");
    toast.success("Logged out successfully");
  };

  const getMembershipStatus = () => {
    if (!currentUser?.createdAt) return "Unknown";

    const joinDate = new Date(currentUser.createdAt);
    const now = new Date();
    const monthsSinceJoin =
      (now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

    if (currentUser.membershiptype === "MONTHLY") {
      if (monthsSinceJoin > 1) return "Expired";
      if (monthsSinceJoin >= 0.8) return "Expiring Soon";
      return "Active";
    } else {
      if (monthsSinceJoin > 0.1) return "Expired";
      return "Active";
    }
  };

  const getMembershipStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Expiring Soon":
        return "bg-yellow-100 text-yellow-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysUntilExpiry = () => {
    if (!currentUser?.createdAt) return 0;

    const joinDate = new Date(currentUser.createdAt);
    const now = new Date();
    const daysSinceJoin =
      (now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24);

    if (currentUser.membershiptype === "MONTHLY") {
      return Math.max(0, 30 - daysSinceJoin);
    } else {
      return Math.max(0, 1 - daysSinceJoin);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back, {currentUser.name}! 👋
            </h1>
            <p className="mt-2 text-slate-600">
              Your personal gym dashboard and membership overview
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleLogout}
              variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Member Navigation */}
        <div className="bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                to="/members/dashboard" className="flex items-center gap-2 px-4 py-2 text-slate-700"
              >
                <Users className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/members/profile" className="flex items-center gap-2 px-4 py-2 text-slate-700"
              >
                <User className="h-4 w-4" />
                My Profile
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="h-4 w-4" />
              <span>Welcome back! You're logged in as a member.</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">
                    Membership Status
                  </p>
                  <p className="text-lg font-bold">{getMembershipStatus()}</p>
                </div>
                <div className="p-2 bg-white/20 rounded-xl">
                  <Award className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">
                    Membership Type
                  </p>
                  <p className="text-lg font-bold">
                    {currentUser.membershiptype}
                  </p>
                </div>
                <div className="p-2 bg-white/20 rounded-xl">
                  <CreditCard className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-100">
                    Days Until Expiry
                  </p>
                  <p className="text-lg font-bold">{getDaysUntilExpiry()}</p>
                </div>
                <div className="p-2 bg-white/20 rounded-xl">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-100">
                    Member Since
                  </p>
                  <p className="text-lg font-bold">
                    {new Date(currentUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-2 bg-white/20 rounded-xl">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
                      {currentUser.profile_picture ? (
                        <img
                          src={currentUser.profile_picture}
                          alt={currentUser.name} className="object-cover w-16 h-16 rounded-full"
                        />
                      ) : (
                        <User className="w-10 h-10 text-blue-600" />
                      )}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {currentUser.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {isMember ? "Gym Member" : "Staff Member"} •{" "}
                      {currentUser.email}
                    </CardDescription>
                  </div>
                  <div className="ml-auto">
                    <Badge
                      variant="secondary" className={getMembershipStatusColor(
                        getMembershipStatus()
                      )}
                    >
                      {getMembershipStatus()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Email
                        </p>
                        <p className="text-sm text-gray-600">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Phone
                        </p>
                        <p className="text-sm text-gray-600">
                          {currentUser.phone_number || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Age
                        </p>
                        <p className="text-sm text-gray-600">
                          {currentUser.age} years
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Member Since
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(currentUser.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Common actions and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Link to="/members/profile">
                    <Button
                      variant="outline" className="w-full h-12 flex-col gap-2"
                    >
                      <User className="w-5 h-5" />
                      <span>Edit Profile</span>
                    </Button>
                  </Link>

                  <Button
                    variant="outline" className="w-full h-12 flex-col gap-2"
                    onClick={() => toast.success("Feature coming soon!")}
                  >
                    <Camera className="w-5 h-5" />
                    <span>Change Photo</span>
                  </Button>

                  <Button
                    variant="outline" className="w-full h-12 flex-col gap-2"
                    onClick={() => toast.success("Feature coming soon!")}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Membership Info */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Membership Details
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Your current membership information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Type
                    </span>
                    <Badge variant="outline">
                      {currentUser.membershiptype}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Status
                    </span>
                    <Badge className={getMembershipStatusColor(
                        getMembershipStatus()
                      )}
                    >
                      {getMembershipStatus()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Expires In
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {getDaysUntilExpiry()} days
                    </span>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <Button
                      variant="outline" className="w-full"
                      onClick={() =>
                        toast.success("Renewal feature coming soon!")
                      }
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Renew Membership
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your latest gym activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50">
                <div className="p-2 bg-blue-100">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Profile Updated
                  </p>
                  <p className="text-sm text-gray-600">
                    Your profile information was recently updated
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date().toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50">
                <div className="p-2 bg-green-100">
                  <Dumbbell className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Membership Active
                  </p>
                  <p className="text-sm text-gray-600">
                    Your membership is currently active and valid
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date().toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50">
                <div className="p-2 bg-purple-100">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Welcome to the Gym
                  </p>
                  <p className="text-sm text-gray-600">
                    You've successfully joined our gym community
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDashboard;
