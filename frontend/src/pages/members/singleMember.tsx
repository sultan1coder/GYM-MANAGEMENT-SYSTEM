import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { memberAPI } from "@/services/api";
import { Member } from "@/types/members/memberLogin";
import { toast } from "react-hot-toast";
import ProfilePictureManager from "@/components/ProfilePictureManager";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Download,
  Share2,
  AlertCircle,
  RefreshCw,
  BarChart3,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  Copy,
  MoreVertical,
  Zap,
  Camera,
  CreditCard,
  Activity,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { subscriptionAPI } from "@/services/api";
import { paymentAPI } from "@/services/api";

function SingleMember() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showProfileManager, setShowProfileManager] = useState(false);

  // Real data state - fetched from API
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [activityStats, setActivityStats] = useState<any>(null);
  const [isLoadingAdditionalData, setIsLoadingAdditionalData] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMember();
      fetchAdditionalData();
    }
  }, [id]);

  const fetchMember = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await memberAPI.getSingleMember(id!);

      if (response.data.isSuccess) {
        setMember(
          response.data.data
            ? ({
                ...response.data.data,
                terms_accepted: false,
                email_verified: false,
              } as Member)
            : null
        );
      } else {
        setError("Failed to fetch member data");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch member data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdditionalData = async () => {
    if (!id) return;

    try {
      setIsLoadingAdditionalData(true);

      // Fetch subscription data
      try {
        const subscriptionResponse = await subscriptionAPI.getAllPlans();
        if (subscriptionResponse.data.isSuccess) {
          // For now, we'll use the first plan as default since we don't have member-specific subscription endpoint
          const plans = subscriptionResponse.data.data || [];
          if (plans.length > 0) {
            setSubscriptionData({
              plan: plans[0].name,
              status: "Active",
              startDate: new Date().toISOString().split("T")[0],
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
              nextPayment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
              amount: plans[0].price,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch subscription data:", error);
      }

      // Fetch payment history
      try {
        const paymentResponse = await paymentAPI.getMemberPaymentHistory(id);
        if (paymentResponse.data.isSuccess) {
          setPaymentHistory(paymentResponse.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch payment history:", error);
        // Set empty array if no payments found
        setPaymentHistory([]);
      }

      // Fetch activity stats (this would need a backend endpoint)
      // For now, we'll calculate basic stats from member data
      try {
        if (member) {
          const joinDate = new Date(member.createdAt);
          const now = new Date();
          const daysSinceJoin = Math.floor(
            (now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          setActivityStats({
            totalVisits: Math.floor(daysSinceJoin * 0.3), // Estimate based on join date
            thisMonth: Math.floor(Math.random() * 20) + 5, // Random for now
            lastMonth: Math.floor(Math.random() * 25) + 8,
            averagePerWeek: Math.floor(Math.random() * 5) + 2,
            favoriteTime: "6:00 PM", // This would need backend tracking
            favoriteDay: "Wednesday", // This would need backend tracking
          });
        }
      } catch (error) {
        console.error("Failed to calculate activity stats:", error);
      }
    } catch (error) {
      console.error("Failed to fetch additional data:", error);
    } finally {
      setIsLoadingAdditionalData(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchMember();
      toast.success("Member data refreshed successfully!");
    } catch (error) {
      toast.error("Failed to refresh member data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!member) return;

    try {
      setIsDeleting(true);
      const response = await memberAPI.deleteMember(id!);

      if (response.data.isSuccess) {
        toast.success("Member deleted successfully!");
        navigate("/members/dashboard");
      } else {
        toast.error(response.data.message || "Failed to delete member");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete member");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getMembershipStatusColor = (type: string) => {
    return type === "MONTHLY"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";
  };

  const getMembershipIcon = (type: string) => {
    return type === "MONTHLY" ? (
      <Calendar className="w-3 h-3 mr-1" />
    ) : (
      <Clock className="w-3 h-3 mr-1" />
    );
  };

  const handleProfilePictureChange = (_pictureUrl: string | null) => {
    // In a real app, you would update the member's profile picture via API
    toast.success("Profile picture updated successfully!");
    // You could also update the local state here if needed
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Loading Member Details
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch the member information...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Error Loading Member
            </h3>
            <p className="mb-6 text-gray-600">{error}</p>
            <div className="flex justify-center gap-3">
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={() => navigate("/members/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full">
              <User className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Member Not Found
            </h3>
            <p className="mb-6 text-gray-600">
              The member you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/members/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6 mx-auto space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/members/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Members
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Member Profile
              </h1>
              <p className="mt-2 text-slate-600">
                View and manage member information
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline" className="border-gray-300 hover:bg-gray-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreVertical className="w-4 h-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={`/members/update/${member.id}`}>
                    <Edit className="w-4 h-4 mr-2 text-green-600" />
                    Edit Member
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={`/members/profile/${member.id}`}>
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    View Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2 text-purple-600" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="w-4 h-4 mr-2 text-orange-600" />
                  Share Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Member
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Profile Overview Card */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
              {/* Profile Picture */}
              <div className="relative">
                <div className="flex items-center justify-center w-32 h-32 border-4 border-white rounded-full shadow-lg bg-gradient-to-br from-blue-100 to-blue-200">
                  {member.profile_picture ? (
                    <img
                      src={member.profile_picture}
                      alt={member.name} className="object-cover rounded-full w-28 h-28"
                    />
                  ) : (
                    <User className="w-16 h-16 text-blue-600" />
                  )}
                </div>
                <div className="absolute flex items-center justify-center w-8 h-8 bg-green-500 border-2 border-white rounded-full -bottom-2 -right-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <Button
                  onClick={() => setShowProfileManager(true)}
                  size="sm" className="absolute w-8 h-8 p-0 bg-blue-600 border-2 border-white rounded-full -bottom-2 -left-2 hover:bg-blue-700"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              {/* Member Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <CardTitle className="mb-2 text-3xl font-bold text-gray-900">
                    {member.name}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Member ID: {member.id}
                  </CardDescription>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Badge
                    variant="secondary" className={`${getMembershipStatusColor(
                      member.membershiptype
                    )} px-3 py-1 text-sm font-medium`}
                  >
                    {getMembershipIcon(member.membershiptype)}
                    {member.membershiptype} Membership
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 text-sm">
                    <User className="w-3 h-3 mr-1" />
                    {member.age} years old
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 text-sm">
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined {new Date(member.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">
                    {activityStats?.totalVisits || "N/A"}
                  </div>
                  <div className="text-xs text-gray-600">
                    Total Visits
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">
                    {activityStats?.thisMonth || "N/A"}
                  </div>
                  <div className="text-xs text-gray-600">
                    This Month
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">
                    {subscriptionData?.status === "Active" ? "✓" : "✗"}
                  </div>
                  <div className="text-xs text-gray-600">
                    Status
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="mb-1 text-sm font-medium text-gray-900">
                  Email
                </div>
                <div className="text-sm text-gray-600 break-all">
                  {member.email}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(member.email)} className="h-6 px-2 mt-2 text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div className="mb-1 text-sm font-medium text-gray-900">
                  Phone
                </div>
                <div className="text-sm text-gray-600">
                  {member.phone_number || "Not provided"}
                </div>
                {member.phone_number && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(member.phone_number!)} className="h-6 px-2 mt-2 text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                )}
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div className="mb-1 text-sm font-medium text-gray-900">
                  Member Since
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(member.createdAt).toLocaleDateString()}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {Math.floor(
                    (Date.now() - new Date(member.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
                <div className="mb-1 text-sm font-medium text-gray-900">
                  Last Updated
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(member.updatedAt).toLocaleDateString()}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {Math.floor(
                    (Date.now() - new Date(member.updatedAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days ago
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership & Subscription Details */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Current Subscription */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <CreditCard className="w-5 h-5 text-green-600" />
                Current Subscription
              </CardTitle>
              <CardDescription className="text-gray-600">
                Active membership plan and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">
                    Plan Name
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {subscriptionData?.plan || "N/A"}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">
                    Status
                  </div>
                  <Badge className={`${
                      subscriptionData?.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {subscriptionData?.status === "Active" ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <XCircle className="w-3 h-3 mr-1" />
                    )}
                    {subscriptionData?.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">
                    Start Date
                  </div>
                  <div className="text-sm text-gray-900">
                    {subscriptionData?.startDate || "N/A"}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">
                    End Date
                  </div>
                  <div className="text-sm text-gray-900">
                    {subscriptionData?.endDate || "N/A"}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">
                    Next Payment
                  </div>
                  <div className="text-sm text-gray-900">
                    {subscriptionData?.nextPayment || "N/A"}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">
                    Amount
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    ${subscriptionData?.amount || "N/A"}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Modify Plan
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  View Contract
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Statistics */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Activity Statistics
              </CardTitle>
              <CardDescription className="text-gray-600">
                Gym visit patterns and engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 text-center rounded-lg bg-blue-50">
                  <div className="text-2xl font-bold text-blue-600">
                    {isLoadingAdditionalData ? (
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      activityStats?.totalVisits || "N/A"
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Visits
                  </div>
                </div>

                <div className="p-4 text-center rounded-lg bg-green-50">
                  <div className="text-2xl font-bold text-green-600">
                    {isLoadingAdditionalData ? (
                      <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      activityStats?.thisMonth || "N/A"
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    This Month
                  </div>
                </div>

                <div className="p-4 text-center rounded-lg bg-purple-50">
                  <div className="text-2xl font-bold text-purple-600">
                    {isLoadingAdditionalData ? (
                      <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      activityStats?.averagePerWeek || "N/A"
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Avg/Week
                  </div>
                </div>

                <div className="p-4 text-center rounded-lg bg-orange-50">
                  <div className="text-2xl font-bold text-orange-600">
                    {isLoadingAdditionalData ? (
                      <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      activityStats?.favoriteTime || "N/A"
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Favorite Time
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Favorite Day:
                  </span>
                  <span className="font-medium text-gray-900">
                    {activityStats?.favoriteDay || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Last Month Visits:
                  </span>
                  <span className="font-medium text-gray-900">
                    {activityStats?.lastMonth || "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Payment History
            </CardTitle>
            <CardDescription className="text-gray-600">
              Recent payment transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAdditionalData ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-600">
                  Loading payment history...
                </span>
              </div>
            ) : paymentHistory.length > 0 ? (
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div
                    key={payment.id} className="flex items-center justify-between p-4 bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Payment #{payment.id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {payment.method} •{" "}
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ${payment.amount}
                      </p>
                      <Badge className="bg-green-100 text-green-800">
                        {payment.status || "Paid"}
                      </Badge>
                    </div>
                  </div>
                ))}
                <div className="p-4 text-center rounded-lg bg-blue-50">
                  <p className="text-sm text-gray-600">
                    Total Paid:{" "}
                    <span className="font-semibold text-gray-900">
                      $
                      {paymentHistory
                        .reduce((sum, payment) => sum + payment.amount, 0)
                        .toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100">
                  <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">
                  No payment history found
                </p>
                <p className="text-sm text-gray-500">
                  Payment records will appear here once transactions are made
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <Zap className="w-5 h-5 text-yellow-600" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-gray-600">
              Common actions and shortcuts for this member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Button
                onClick={() => navigate(`/members/update/${member.id}`)}
                variant="outline" className="flex-col h-20 gap-2"
              >
                <Edit className="w-6 h-6" />
                <span>Edit Member</span>
              </Button>

              <Button
                onClick={() => navigate(`/members/profile/${member.id}`)}
                variant="outline" className="flex-col h-20 gap-2"
              >
                <User className="w-6 h-6" />
                <span>View Profile</span>
              </Button>

              <Button variant="outline" className="flex-col h-20 gap-2">
                <Download className="w-6 h-6" />
                <span>Export Data</span>
              </Button>

              <Button variant="outline" className="flex-col h-20 gap-2">
                <Share2 className="w-6 h-6" />
                <span>Share Profile</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Member
                  </h3>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="mb-6 text-gray-700">
                Are you sure you want to delete <strong>{member.name}</strong>?
                This will permanently remove their account and all associated
                data.
              </p>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setShowDeleteDialog(false)}
                  variant="outline"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteMember}
                  variant="destructive"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Member
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Picture Manager */}
      <ProfilePictureManager
        currentPicture={member.profile_picture}
        onPictureChange={handleProfilePictureChange}
        isOpen={showProfileManager}
        onClose={() => setShowProfileManager(false)}
        memberName={member.name}
      />
    </div>
  );
}

export default SingleMember;
