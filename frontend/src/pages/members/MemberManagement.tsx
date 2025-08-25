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
    searchTerm: '',
    membershipType: 'all',
    ageMin: '',
    ageMax: '',
    dateRangeStart: '',
    dateRangeEnd: '',
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
        membershipType: searchFilters.membershipType !== 'all' ? searchFilters.membershipType : undefined,
        ageMin: searchFilters.ageMin ? parseInt(searchFilters.ageMin) : undefined,
        ageMax: searchFilters.ageMax ? parseInt(searchFilters.ageMax) : undefined,
        dateRangeStart: searchFilters.dateRangeStart || undefined,
        dateRangeEnd: searchFilters.dateRangeEnd || undefined,
      };

      // Remove undefined values
      Object.keys(params).forEach(key => 
        params[key] === undefined && delete params[key]
      );

      const response = await searchMembers(params);
      if (response.isSuccess) {
        toast.success(`Found ${response.data.members.length} members`);
        // TODO: Update member list with search results
      }
    } catch (error) {
      toast.error('Search failed');
      console.error('Search error:', error);
    }
  };

  // Clear search filters
  const clearFilters = () => {
    setSearchFilters({
      searchTerm: '',
      membershipType: 'all',
      ageMin: '',
      ageMax: '',
      dateRangeStart: '',
      dateRangeEnd: '',
    });
  };

  // Download CSV template
  const downloadTemplate = () => {
    // Only include fields that exist in the current Prisma schema
    const headers = ['name', 'email', 'phone_number', 'age', 'membershiptype'];
    const sampleData = ['John Doe', 'john@example.com', '+1234567890', '25', 'MONTHLY'];
    
    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'member-import-template.csv';
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="searchTerm">Search Term</Label>
                <Input
                  id="searchTerm"
                  placeholder="Name, email, phone..."
                  value={searchFilters.searchTerm}
                  onChange={(e) => setSearchFilters({...searchFilters, searchTerm: e.target.value})}
                />
              </div>
              {/* Remove status filter since email_verified doesn't exist in current schema */}
              {/* <div>
                <Label htmlFor="status">Status</Label>
                <Select value={searchFilters.status} onValueChange={(value) => setSearchFilters({...searchFilters, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
              <div>
                <Label htmlFor="membershipType">Membership Type</Label>
                <Select value={searchFilters.membershipType} onValueChange={(value) => setSearchFilters({...searchFilters, membershipType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="DAILY">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ageMin">Age Range</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    value={searchFilters.ageMin}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        ageMin: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Max"
                    value={searchFilters.ageMax}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        ageMax: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="dateRangeStart">Date Range</Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={searchFilters.dateRangeStart}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        dateRangeStart: e.target.value,
                      })
                    }
                  />
                  <Input
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
              </div>
              {/* Remove city and state filters */}
              {/* <div>
                <Label htmlFor="city">City</Label>
                <Input
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
                  placeholder="State"
                  value={searchFilters.state}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      state: e.target.value,
                    })
                  }
                />
              </div> */}
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
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? 'Loading...' : 'N/A'}
                </p>
                <p className="text-xs text-gray-500">Not available in current schema</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? "Loading..." : `${stats?.growthRate || 0}%`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Statistics */}
      {stats && (
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
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{city.city}, {city.state}</span>
                      <span className="text-sm font-medium">{city.count} members</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    City data not available in current schema
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
                    {stats.recentRegistrations}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Age</span>
                  <span className="text-sm font-medium">
                    {stats.averageAge} years
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-500">Location-based filtering (requires schema update)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-500">Email verification system (requires schema update)</span>
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
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Required Columns:</h4>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• name (required)</li>
                <li>• email (required)</li>
                <li>• phone_number (required)</li>
                <li>• age (required, 13-100)</li>
                <li>• membershiptype (required: MONTHLY or DAILY)</li>
                {/* Remove fields that don't exist in current schema */}
                {/* <li>• street, city, state, zipCode (optional)</li>
                <li>• emergencyName, emergencyPhone (optional)</li> */}
              </ul>
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
