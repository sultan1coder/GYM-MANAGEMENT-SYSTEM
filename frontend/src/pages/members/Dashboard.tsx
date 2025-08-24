import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  FileSpreadsheet,
  Ban,
  Clock3,
  Shield,
  Timer,
  Loader2,
  FileText,
} from "lucide-react";
import { Member } from "@/types";

function MemberDashboard() {
  const { members, isLoading, error, refetch } = useMemberGetAll();
  const { handleRemove } = useMemberRemove();

  const [searchTerm, setSearchTerm] = useState("");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [statusFilter] = useState("all");
  const [expiryFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Sorting state
  const [sortField, setSortField] = useState<keyof Member>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Bulk actions state
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  
  // Advanced filters state
  const [dateRangeFilter] = useState("all");
  const [minAgeFilter] = useState("");
  const [maxAgeFilter] = useState("");

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

  // Enhanced member filtering with status and expiry
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

      const matchesAge = (() => {
        if (ageFilter === "all") return true;
        if (ageFilter === "18-25") return member.age >= 18 && member.age <= 25;
        if (ageFilter === "26-35") return member.age >= 26 && member.age <= 35;
        if (ageFilter === "36-50") return member.age >= 36 && member.age <= 50;
        if (ageFilter === "50+") return member.age >= 50;
        return true;
      })();

      const matchesStatus = (() => {
        if (statusFilter === "all") return true;
        if (statusFilter === "active") return getMemberStatus(member) === "active";
        if (statusFilter === "expired") return getMemberStatus(member) === "expired";
        if (statusFilter === "expiring") return getMemberStatus(member) === "expiring";
        return true;
      })();

      const matchesExpiry = (() => {
        if (expiryFilter === "all") return true;
        if (expiryFilter === "expired") return isMembershipExpired(member);
        if (expiryFilter === "expiring") return isMembershipExpiring(member);
        if (expiryFilter === "active") return !isMembershipExpired(member);
        return true;
      })();

      const matchesDateRange = (() => {
        if (dateRangeFilter === "all") return true;
        const joinDate = new Date(member.createdAt);
        const now = new Date();
        const daysSinceJoin = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dateRangeFilter === "7days") return daysSinceJoin <= 7;
        if (dateRangeFilter === "30days") return daysSinceJoin <= 30;
        if (dateRangeFilter === "90days") return daysSinceJoin <= 90;
        if (dateRangeFilter === "1year") return daysSinceJoin <= 365;
        return true;
      })();

      const matchesAgeRange = (() => {
        if (!minAgeFilter && !maxAgeFilter) return true;
        const minAge = minAgeFilter ? parseInt(minAgeFilter) : 0;
        const maxAge = maxAgeFilter ? parseInt(maxAgeFilter) : 999;
        return member.age >= minAge && member.age <= maxAge;
      })();

      return matchesSearch && matchesMembership && matchesAge && matchesStatus && matchesExpiry && matchesDateRange && matchesAgeRange;
    }) || [];

  // Sorting function
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const aValue = a[sortField as keyof Member];
    const bValue = b[sortField as keyof Member];
    
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === "asc" 
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }
    
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMembers = sortedMembers.slice(startIndex, endIndex);

  // Helper functions for member status and expiry
  const getMemberStatus = (member: Member) => {
    if (isMembershipExpired(member)) return "expired";
    if (isMembershipExpiring(member)) return "expiring";
    return "active";
  };

  const isMembershipExpired = (member: Member) => {
    // Mock expiry logic - in real app, this would check actual expiry dates
    const joinDate = new Date(member.createdAt);
    const now = new Date();
    const monthsSinceJoin = (now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (member.membershiptype === "MONTHLY") {
      return monthsSinceJoin > 1; // Expired after 1 month
    } else {
      return monthsSinceJoin > 0.1; // Daily pass expires after ~3 days
    }
  };

  const isMembershipExpiring = (member: Member) => {
    // Mock expiring logic - in real app, this would check actual expiry dates
    const joinDate = new Date(member.createdAt);
    const now = new Date();
    const daysSinceJoin = (now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (member.membershiptype === "MONTHLY") {
      return daysSinceJoin >= 25 && daysSinceJoin <= 30; // Expiring in last 5 days
    } else {
      return daysSinceJoin >= 0 && daysSinceJoin <= 1; // Daily pass expires same day
    }
  };

  const getDaysUntilExpiry = (member: Member) => {
    const joinDate = new Date(member.createdAt);
    const now = new Date();
    const daysSinceJoin = (now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (member.membershiptype === "MONTHLY") {
      return Math.max(0, 30 - daysSinceJoin);
    } else {
      return Math.max(0, 1 - daysSinceJoin);
    }
  };

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedMembers.length === paginatedMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(paginatedMembers.map(member => member.id));
    }
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedMembers.length === 0) return;
    
    try {
      setIsBulkDeleting(true);
      // In a real app, you would call the API for bulk delete
      await Promise.all(selectedMembers.map(id => handleRemove(id)));
      setSelectedMembers([]);
      setShowBulkDeleteDialog(false);
      toast.success(`${selectedMembers.length} members deleted successfully!`);
    } catch (error) {
      toast.error("Failed to delete some members");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedMembers.length === 0) return;
    
    try {
      // In a real app, you would call the API for bulk status update
      toast.success(`${selectedMembers.length} members status updated to ${status}!`);
      setSelectedMembers([]);
    } catch (error) {
      toast.error("Failed to update some members status");
    }
  };

  // Export functions
  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Age", "Membership Type", "Status", "Join Date", "Expiry Date"];
    const csvContent = [
      headers.join(","),
      ...sortedMembers.map(member => [
        member.name,
        member.email,
        member.phone_number || "",
        member.age,
        member.membershiptype,
        getMemberStatus(member),
        new Date(member.createdAt).toLocaleDateString(),
        getDaysUntilExpiry(member) > 0 ? `${getDaysUntilExpiry(member)} days` : "Expired"
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `members-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Members exported to CSV successfully!");
  };

  const exportToPDF = () => {
    // In a real app, you would use a PDF library like jsPDF
    toast.success("PDF export functionality would be implemented with a PDF library!");
  };

  // Sorting handlers
  const handleSort = (field: keyof Member) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof Member) => {
    if (sortField !== field) return <ChevronsUpDown className="w-4 h-4" />;
    return sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };



  // Calculate statistics
  const totalMembers = members?.length || 0;
  const filteredTotal = filteredMembers.length;
  const monthlyMembers =
    filteredMembers.filter((m) => m.membershiptype === "MONTHLY").length || 0;
  const dailyMembers =
    filteredMembers.filter((m) => m.membershiptype === "DAILY").length || 0;


  // Status statistics
  const activeMembers = filteredMembers.filter(m => getMemberStatus(m) === "active").length;
  const expiredMembers = filteredMembers.filter(m => getMemberStatus(m) === "expired").length;
  const expiringMembers = filteredMembers.filter(m => getMemberStatus(m) === "expiring").length;

  // Age distribution
  const ageGroups = {
    "18-25": filteredMembers.filter((m) => m.age >= 18 && m.age <= 25).length || 0,
    "26-35": filteredMembers.filter((m) => m.age >= 26 && m.age <= 35).length || 0,
    "36-50": filteredMembers.filter((m) => m.age >= 36 && m.age <= 50).length || 0,
    "50+": filteredMembers.filter((m) => m.age > 50).length || 0,
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

        {/* Enhanced Statistics Cards */}
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
                  <p className="text-xs text-blue-200 mt-1">
                    {filteredTotal} filtered
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
                    Active Members
                  </p>
                  <p className="text-2xl font-bold">
                    {isRefreshing ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      activeMembers
                    )}
                  </p>
                  <p className="text-xs text-green-200 mt-1">
                    {monthlyMembers} monthly • {dailyMembers} daily
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-100">
                    Expiring Soon
                  </p>
                  <p className="text-2xl font-bold">
                    {isRefreshing ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      expiringMembers
                    )}
                  </p>
                  <p className="text-xs text-yellow-200 mt-1">
                    Needs attention
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="text-white border-0 shadow-lg bg-gradient-to-r from-red-500 to-red-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-100">
                    Expired Members
                  </p>
                  <p className="text-2xl font-bold">
                    {isRefreshing ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      expiredMembers
                    )}
                  </p>
                  <p className="text-xs text-red-200 mt-1">
                    Requires renewal
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-200" />
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
                  {filteredTotal} members found • Showing {startIndex + 1}-{Math.min(endIndex, filteredTotal)} of {filteredTotal}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                {/* Bulk Actions */}
                {selectedMembers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="px-3 py-1">
                      {selectedMembers.length} selected
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Bulk Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Bulk Operations</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleBulkStatusUpdate("active")}>
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          Mark as Active
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkStatusUpdate("expired")}>
                          <Ban className="w-4 h-4 mr-2 text-yellow-600" />
                          Mark as Expired
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowBulkDeleteDialog(true)}>
                          <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                          Delete Selected
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
                
                {/* Export Buttons */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={exportToCSV}>
                      <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
                      Export to CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportToPDF}>
                      <FileText className="w-4 h-4 mr-2 text-red-600" />
                      Export to PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
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
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    <Checkbox
                      checked={selectedMembers.length === paginatedMembers.length && paginatedMembers.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </TableHead>
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
                  <TableHead 
                    className="px-6 py-4 font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      Status
                      {getSortIcon("createdAt")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="px-6 py-4 font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-gray-500" />
                      Expiry
                      {getSortIcon("createdAt")}
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-right text-gray-900 dark:text-white">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMembers.map((member) => (
                  <TableRow
                    key={member.id}
                    className="transition-colors border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:border-gray-700"
                  >
                    <TableCell className="px-6 py-4">
                      <Checkbox
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => handleSelectMember(member.id)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </TableCell>
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
                    <TableCell className="px-6 py-4">
                      <Badge
                        className={`${
                          getMemberStatus(member) === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
                            : getMemberStatus(member) === "expiring"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800"
                        } px-3 py-1 text-xs font-medium`}
                      >
                        {getMemberStatus(member) === "active" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : getMemberStatus(member) === "expiring" ? (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {getMemberStatus(member).charAt(0).toUpperCase() + getMemberStatus(member).slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {getDaysUntilExpiry(member) > 0 ? (
                          <span className="flex items-center gap-1">
                            <Clock3 className="w-3 h-3 text-blue-600" />
                            {getDaysUntilExpiry(member)} days
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600">
                            <XCircle className="w-3 h-3" />
                            Expired
                          </span>
                        )}
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
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredTotal)} of {filteredTotal} results
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Bulk Delete Confirmation Dialog */}
        <Dialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Confirm Bulk Delete
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to delete {selectedMembers.length} selected members?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowBulkDeleteDialog(false)}
                disabled={isBulkDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={isBulkDeleting}
              >
                {isBulkDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete {selectedMembers.length} Members
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
