import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMemberGetAll, useMemberRemove } from "@/hooks/member";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  MoreVertical,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  RefreshCw,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  MapPin,
  CreditCard,
  Dumbbell,
  Settings,
  Download,
  Share2,
} from "lucide-react";

function MemberDashboard() {
  const { members, isLoading, error, refetch } = useMemberGetAll();
  const { handleRemove } = useMemberRemove();

  const [searchTerm, setSearchTerm] = useState("");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Enhanced refresh function
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refetch();
      setLastRefreshed(new Date());
      toast.success("Member data refreshed successfully!");
    } catch (error) {
      toast.error("Failed to refresh member data");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter members based on search and filters
  const filteredMembers =
    members?.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.phone_number &&
          member.phone_number.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesMembership =
        membershipFilter === "all" ||
        member.membershiptype === membershipFilter;

      let matchesAge = true;
      if (ageFilter !== "all") {
        const [minAge, maxAge] = ageFilter.split("-").map(Number);
        if (maxAge) {
          matchesAge = member.age >= minAge && member.age <= maxAge;
        } else {
          matchesAge = member.age >= minAge;
        }
      }

      return matchesSearch && matchesMembership && matchesAge;
    }) || [];

  // Calculate statistics
  const totalMembers = members?.length || 0;
  const monthlyMembers =
    members?.filter((m) => m.membershiptype === "MONTHLY").length || 0;
  const dailyMembers =
    members?.filter((m) => m.membershiptype === "DAILY").length || 0;
  const averageAge = members?.length
    ? Math.round(members.reduce((sum, m) => sum + m.age, 0) / members.length)
    : 0;

  // Age distribution
  const ageGroups = {
    "18-25": members?.filter((m) => m.age >= 18 && m.age <= 25).length || 0,
    "26-35": members?.filter((m) => m.age >= 26 && m.age <= 35).length || 0,
    "36-50": members?.filter((m) => m.age >= 36 && m.age <= 50).length || 0,
    "50+": members?.filter((m) => m.age > 50).length || 0,
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await handleRemove(id);
        await refetch();
        toast.success("Member deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete member");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Members
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Retrying..." : "Try Again"}
            </Button>
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
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Members Management
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              View and manage all gym members in your system
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50"
              title="Refresh member data (Ctrl+R or F5)"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Link to="/members/register">
              <Button className="shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </Link>
          </div>
        </div>

        {/* Last Updated Info */}
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastRefreshed.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Total members: {totalMembers}</span>
            {isRefreshing && (
              <div className="flex items-center gap-2 text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Updating...</span>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">
                    Total Members
                  </p>
                  <p className="text-2xl font-bold">
                    {isRefreshing ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      totalMembers
                    )}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">
                    Monthly Members
                  </p>
                  <p className="text-2xl font-bold">
                    {isRefreshing ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      monthlyMembers
                    )}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-100">
                    Daily Passes
                  </p>
                  <p className="text-2xl font-bold">
                    {isRefreshing ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      dailyMembers
                    )}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-100">
                    Average Age
                  </p>
                  <p className="text-2xl font-bold">
                    {isRefreshing ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      averageAge
                    )}
                  </p>
                </div>
                <User className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Age Distribution */}
        <Card className="bg-white border-0 shadow-lg dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Age Distribution
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Member age groups breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(ageGroups).map(([range, count]) => (
                <div key={range} className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {range} years
                  </div>
                  <div className="text-xs text-gray-500">
                    {totalMembers > 0
                      ? Math.round((count / totalMembers) * 100)
                      : 0}
                    %
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card className="bg-white border-0 shadow-lg dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                  <Input
                    placeholder="Search members by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-0 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600"
                  />
                </div>
              </div>
              <Select
                value={membershipFilter}
                onValueChange={(value: string) => setMembershipFilter(value)}
              >
                <SelectTrigger className="w-48 border-0 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600">
                  <SelectValue placeholder="All Memberships" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Memberships</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="DAILY">Daily</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={ageFilter}
                onValueChange={(value: string) => setAgeFilter(value)}
              >
                <SelectTrigger className="w-48 border-0 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600">
                  <SelectValue placeholder="All Ages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="18-25">18-25 years</SelectItem>
                  <SelectItem value="26-35">26-35 years</SelectItem>
                  <SelectItem value="36-50">36-50 years</SelectItem>
                  <SelectItem value="50-">50+ years</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="border-gray-300 hover:bg-gray-50"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Members Table */}
        <Card className="overflow-hidden bg-white border-0 shadow-lg dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Members List
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {filteredMembers.length} members found
                </CardDescription>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="border-gray-300 hover:bg-gray-50"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      Member
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      Contact
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Membership
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      Age
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Joined
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-right text-gray-900 dark:text-white">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow
                    key={member.id}
                    className="transition-colors border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:border-gray-700"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
                          {member.profile_picture ? (
                            <img
                              src={member.profile_picture}
                              alt={member.name}
                              className="object-cover w-10 h-10 rounded-md"
                            />
                          ) : (
                            <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            <Link
                              to={`/members/single/${member.id}`}
                              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {member.name}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            ID: {member.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-900 dark:text-white">
                            {member.email}
                          </span>
                        </div>
                        {member.phone_number && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {member.phone_number}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge
                        className={`${
                          member.membershiptype === "MONTHLY"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                        } px-3 py-1 text-xs font-medium`}
                      >
                        {member.membershiptype === "MONTHLY" ? (
                          <Calendar className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {member.membershiptype}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {member.age} years old
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel className="font-semibold">
                            Member Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/members/single/${member.id}`}
                              className="cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2 text-blue-600" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/members/update/${member.id}`}
                              className="cursor-pointer"
                            >
                              <Edit className="w-4 h-4 mr-2 text-green-600" />
                              Edit Member
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(member.id, member.name)}
                            className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <CardContent className="p-16 text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
                <Users className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                No members found
              </h3>
              <p className="max-w-md mx-auto mb-6 text-lg text-gray-600 dark:text-gray-400">
                {searchTerm || membershipFilter !== "all" || ageFilter !== "all"
                  ? "Try adjusting your filters or search terms to find what you're looking for."
                  : "No members have been added to your system yet."}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  variant="outline"
                  className="px-6 py-3 text-lg font-semibold border-gray-300 hover:bg-gray-50"
                >
                  <RefreshCw
                    className={`w-5 h-5 mr-2 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  {isRefreshing ? "Refreshing..." : "Refresh Data"}
                </Button>
                {!searchTerm &&
                  membershipFilter === "all" &&
                  ageFilter === "all" && (
                    <Link to="/members/register">
                      <Button className="px-6 py-3 text-lg font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl">
                        <Plus className="w-5 h-5 mr-2" />
                        Add First Member
                      </Button>
                    </Link>
                  )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default MemberDashboard;
