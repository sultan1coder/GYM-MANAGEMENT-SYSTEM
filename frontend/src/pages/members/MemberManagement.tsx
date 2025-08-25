import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Users,
  Plus,
  Settings,
  BarChart3,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Upload,
  Download,
  TrendingUp,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import MemberList from "../../components/MemberList";
import SimpleMemberDisplay from "../../components/SimpleMemberDisplay";
import { Member } from "../../types/members/memberAll";
import { useMemberRemove, useMemberStats } from "../../hooks/member";
import { searchMembers, bulkImportMembers } from "../../services/api";
import toast from "react-hot-toast";

const MemberManagement: React.FC = () => {
  const navigate = useNavigate();
  const { handleRemove, isLoading: isDeleting } = useMemberRemove();
  const {
    stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useMemberStats();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBulkImportDialog, setShowBulkImportDialog] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // Advanced search state
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: "",
    status: "all" as "all" | "active" | "inactive",
    membershipType: "all",
    ageMin: "",
    ageMax: "",
    dateRangeStart: "",
    dateRangeEnd: "",
    city: "",
    state: "",
  });

  // Handle member selection (view details)
  const handleMemberSelect = (member: Member) => {
    navigate(`/members/single/${member.id}`);
  };

  // Handle member edit
  const handleMemberEdit = (member: Member) => {
    navigate(`/members/update/${member.id}`);
  };

  // Handle member delete
  const handleMemberDelete = (member: Member) => {
    setMemberToDelete(member);
    setShowDeleteDialog(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (memberToDelete) {
      try {
        await handleRemove(memberToDelete.id);
        setShowDeleteDialog(false);
        setMemberToDelete(null);
        refetchStats(); // Refresh stats after deletion
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  // Handle bulk import
  const handleBulkImport = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to import");
      return;
    }

    setIsImporting(true);
    try {
      const response = await bulkImportMembers(selectedFile);
      if (response.isSuccess) {
        toast.success(
          `Import completed! ${response.data.success.length} members imported successfully.`
        );
        setShowBulkImportDialog(false);
        setSelectedFile(null);
        refetchStats(); // Refresh stats after import
      } else {
        toast.error("Import failed");
      }
    } catch (error) {
      toast.error("Import failed");
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
    }
  };

  // Handle advanced search
  const handleAdvancedSearch = async () => {
    try {
      const params = {
        searchTerm: searchFilters.searchTerm || undefined,
        status:
          searchFilters.status !== "all" ? searchFilters.status : undefined,
        membershipType:
          searchFilters.membershipType !== "all"
            ? searchFilters.membershipType
            : undefined,
        ageMin: searchFilters.ageMin
          ? parseInt(searchFilters.ageMin)
          : undefined,
        ageMax: searchFilters.ageMax
          ? parseInt(searchFilters.ageMax)
          : undefined,
        dateRangeStart: searchFilters.dateRangeStart || undefined,
        dateRangeEnd: searchFilters.dateRangeEnd || undefined,
        city: searchFilters.city || undefined,
        state: searchFilters.state || undefined,
      };

      // Remove undefined values
      Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key]
      );

      const response = await searchMembers(params);
      if (response.isSuccess) {
        toast.success(`Found ${response.data.members.length} members`);
        // TODO: Update member list with search results
      }
    } catch (error) {
      toast.error("Search failed");
      console.error("Search error:", error);
    }
  };

  // Clear search filters
  const clearFilters = () => {
    setSearchFilters({
      searchTerm: "",
      status: "all",
      membershipType: "all",
      ageMin: "",
      ageMax: "",
      dateRangeStart: "",
      dateRangeEnd: "",
      city: "",
      state: "",
    });
  };

  // Download CSV template
  const downloadTemplate = () => {
    const headers = [
      "name",
      "email",
      "phone_number",
      "age",
      "membershiptype",
      "street",
      "city",
      "state",
      "zipCode",
      "emergencyName",
      "emergencyPhone",
    ];

    const sampleData = [
      "John Doe",
      "john@example.com",
      "123-456-7890",
      "25",
      "MONTHLY",
      "123 Main St",
      "New York",
      "NY",
      "10001",
      "Jane Doe",
      "098-765-4321",
    ];

    const csvContent = [headers.join(","), sampleData.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "member_import_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Member Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all gym members, view statistics, and perform bulk operations
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/members/register")}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Member
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowBulkImportDialog(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            <Search className="h-4 w-4 mr-2" />
            Advanced Search
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/members/dashboard")}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </div>

      {/* Advanced Search Panel */}
      {showAdvancedSearch && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Advanced Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="searchTerm">Search</Label>
                <Input
                  id="searchTerm"
                  placeholder="Name, email, or phone..."
                  value={searchFilters.searchTerm}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      searchTerm: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={searchFilters.status}
                  onValueChange={(value) =>
                    setSearchFilters({
                      ...searchFilters,
                      status: value as "all" | "active" | "inactive",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="membershipType">Membership Type</Label>
                <Select
                  value={searchFilters.membershipType}
                  onValueChange={(value) =>
                    setSearchFilters({
                      ...searchFilters,
                      membershipType: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="DAILY">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ageMin">Min Age</Label>
                <Input
                  id="ageMin"
                  type="number"
                  placeholder="Min age"
                  value={searchFilters.ageMin}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      ageMin: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="ageMax">Max Age</Label>
                <Input
                  id="ageMax"
                  type="number"
                  placeholder="Max age"
                  value={searchFilters.ageMax}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      ageMax: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="dateRangeStart">Start Date</Label>
                <Input
                  id="dateRangeStart"
                  type="date"
                  value={searchFilters.dateRangeStart}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      dateRangeStart: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="dateRangeEnd">End Date</Label>
                <Input
                  id="dateRangeEnd"
                  type="date"
                  value={searchFilters.dateRangeEnd}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      dateRangeEnd: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={searchFilters.city}
                  onChange={(e) =>
                    setSearchFilters({ ...searchFilters, city: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="State"
                  value={searchFilters.state}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      state: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleAdvancedSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? "Loading..." : stats?.totalMembers || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Members
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? "Loading..." : stats?.activeMembers || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Verification
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "Loading..." : stats?.pendingVerification || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Members awaiting email verification
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Cities</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading
                ? "Loading..."
                : stats?.topCities && stats.topCities.length > 0
                ? stats.topCities[0]?.count || 0
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsLoading
                ? "Loading..."
                : stats?.topCities && stats.topCities.length > 0
                ? `${stats.topCities[0]?.city || "Unknown"}, ${
                    stats.topCities[0]?.state || "Unknown"
                  }`
                : "No city data available"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Loading State for Stats */}
      {statsLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">
                Loading member statistics...
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Statistics */}
      {stats && !statsLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Top Cities
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.topCities && stats.topCities.length > 0 ? (
                <div className="space-y-2">
                  {stats.topCities.map((city, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm">
                        {city?.city || "Unknown"}, {city?.state || "Unknown"}
                      </span>
                      <span className="text-sm font-medium">
                        {city?.count || 0} members
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    No city data available yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Recent Registrations (7 days)</span>
                  <span className="text-sm font-medium">
                    {stats.recentRegistrations || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Age</span>
                  <span className="text-sm font-medium">
                    {stats.averageAge || 0} years
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Stats Available */}
      {!stats && !statsLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-4">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                No member statistics available. Start by adding some members to
                see analytics.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Demonstration Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Feature Demonstration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Simple Member Display</h3>
              <p className="text-sm text-gray-600 mb-4">
                This shows how to add basic member fetching to any component
                using the{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  useMemberGetAll
                </code>{" "}
                hook.
              </p>
              <SimpleMemberDisplay />
            </div>

            <div>
              <h3 className="font-semibold mb-3">Advanced Features</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Advanced Search & Filtering</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Real-time Statistics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Bulk Import (CSV/Excel)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Pagination & Sorting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Export to CSV</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Member Status Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Location-based filtering</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Email verification system</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Address management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Emergency contact tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Medical information storage</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Member List with All Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Complete Member Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MemberList
            showActions={true}
            onMemberSelect={handleMemberSelect}
            onMemberEdit={handleMemberEdit}
            onMemberDelete={handleMemberDelete}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{memberToDelete?.name}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Member"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog
        open={showBulkImportDialog}
        onOpenChange={setShowBulkImportDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Bulk Import Members
            </DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file to import multiple members at once.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: CSV, Excel (.xlsx, .xls). Max size: 10MB
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Required Columns:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• name (required)</li>
                  <li>• email (required)</li>
                  <li>• phone_number (required)</li>
                  <li>• age (required)</li>
                  <li>• membershiptype (required) - MONTHLY or DAILY</li>
                  <li>• street, city, state, zipCode (optional)</li>
                  <li>• emergencyName, emergencyPhone (optional)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Sample Data Format:</h4>
                <div className="text-xs bg-gray-50 p-2 rounded">
                  name,email,phone_number,age,membershiptype,street,city,state,zipCode,emergencyName,emergencyPhone
                  <br />
                  John Doe,john@example.com,123-456-7890,25,MONTHLY,123 Main
                  St,New York,NY,10001,Jane Doe,098-765-4321
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowBulkImportDialog(false)}
              disabled={isImporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkImport}
              disabled={!selectedFile || isImporting}
            >
              {isImporting ? "Importing..." : "Import Members"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberManagement;
