import React, { useState, useMemo } from "react";
import { useMemberGetAll } from "../hooks/member";
import { Member } from "../types/members/memberAll";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Search,
  Download,
  Trash2,
  Edit,
  Eye,
  Users,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertTriangle,
} from "lucide-react";
import Spinner from "./Spinner";

interface MemberListProps {
  showActions?: boolean;
  onMemberSelect?: (member: Member) => void;
  onMemberEdit?: (member: Member) => void;
  onMemberDelete?: (member: Member) => void;
}

const MemberList: React.FC<MemberListProps> = ({
  showActions = true,
  onMemberSelect,
  onMemberEdit,
  onMemberDelete,
}) => {
  const { members, isLoading, error, refetch } = useMemberGetAll();

  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [membershipFilter, setMembershipFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered and sorted members
  const filteredMembers = useMemo(() => {
    let filtered = members || [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.phone_number?.includes(searchTerm) ||
          member.address?.city
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          member.address?.state
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        filtered = filtered.filter((member) => member.email_verified);
      } else if (statusFilter === "inactive") {
        filtered = filtered.filter((member) => !member.email_verified);
      }
    }

    // Membership filter
    if (membershipFilter !== "all") {
      filtered = filtered.filter(
        (member) => member.membershiptype === membershipFilter
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "email":
          aValue = a.email;
          bValue = b.email;
          break;
        case "age":
          aValue = a.age;
          bValue = b.age;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [members, searchTerm, statusFilter, membershipFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export functionality
  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Age",
      "Membership Type",
      "Status",
      "City",
      "State",
      "Join Date",
      "Emergency Contact",
      "Has Medical Info",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredMembers.map((member) =>
        [
          member.name,
          member.email,
          member.phone_number || "",
          member.age,
          member.membershiptype,
          member.email_verified ? "Active" : "Inactive",
          member.address?.city || "",
          member.address?.state || "",
          new Date(member.createdAt).toLocaleDateString(),
          member.emergency_contact
            ? `${member.emergency_contact.name} (${member.emergency_contact.relationship})`
            : "",
          member.medical_info ? "Yes" : "No",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `members-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Bulk actions
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set()
  );

  const toggleMemberSelection = (memberId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const selectAllMembers = () => {
    if (selectedMembers.size === paginatedMembers.length) {
      setSelectedMembers(new Set());
    } else {
      setSelectedMembers(new Set(paginatedMembers.map((m) => m.id)));
    }
  };

  const bulkDelete = () => {
    if (selectedMembers.size > 0 && onMemberDelete) {
      // In a real app, you'd show a confirmation dialog
      selectedMembers.forEach((id) => {
        const member = members.find((m) => m.id === id);
        if (member) onMemberDelete(member);
      });
      setSelectedMembers(new Set());
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
            <p>Error loading members: {error}</p>
            <Button onClick={refetch} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Member Management
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={refetch}>Refresh</Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={membershipFilter}
              onValueChange={setMembershipFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Membership" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="DAILY">Daily</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="age">Age</SelectItem>
                <SelectItem value="createdAt">Join Date</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "↑" : "↓"} Sort
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {showActions && selectedMembers.size > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedMembers.size} member(s) selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={selectAllMembers}>
                  {selectedMembers.size === paginatedMembers.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
                <Button variant="destructive" onClick={bulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Members ({filteredMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No members found matching your criteria.
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedMembers.map((member) => (
                <div
                  key={member.id}
                  className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                    selectedMembers.has(member.id)
                      ? "bg-blue-50 border-blue-200"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {showActions && (
                        <input
                          type="checkbox"
                          checked={selectedMembers.has(member.id)}
                          onChange={() => toggleMemberSelection(member.id)}
                          className="h-4 w-4 text-blue-600"
                        />
                      )}

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {member.name}
                          </h3>
                          <Badge
                            variant={
                              member.email_verified ? "default" : "secondary"
                            }
                          >
                            {member.email_verified ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">
                            {member.membershiptype}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {member.email}
                          </div>
                          {member.phone_number && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {member.phone_number}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Age: {member.age}
                          </div>
                          {member.address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {member.address.city}, {member.address.state}
                            </div>
                          )}
                        </div>

                        {/* Additional Member Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-500 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Join Date:</span>
                            {new Date(member.createdAt).toLocaleDateString()}
                          </div>
                          {member.emergency_contact && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Emergency:</span>
                              {member.emergency_contact.name} (
                              {member.emergency_contact.relationship})
                            </div>
                          )}
                          {member.Subscription &&
                            member.Subscription.length > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Plan:</span>
                                {member.Subscription[0]?.plan?.name || "Active"}
                              </div>
                            )}
                        </div>

                        {/* Medical Info Preview */}
                        {member.medical_info && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                            <Heart className="h-3 w-3" />
                            <span>
                              Goals:{" "}
                              {member.medical_info.fitness_goals
                                ?.slice(0, 2)
                                .join(", ") || "Not specified"}
                            </span>
                            {member.medical_info.health_conditions &&
                              member.medical_info.health_conditions.length >
                                0 && (
                                <span>
                                  • Conditions:{" "}
                                  {member.medical_info.health_conditions
                                    .slice(0, 2)
                                    .join(", ")}
                                </span>
                              )}
                          </div>
                        )}

                        {/* Recent Activity Preview */}
                        {(member.attendance && member.attendance.length > 0) ||
                        (member.payments && member.payments.length > 0) ? (
                          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-medium">
                              Recent Activity:
                            </span>
                            {member.attendance &&
                              member.attendance.length > 0 && (
                                <span>
                                  Last visit:{" "}
                                  {new Date(
                                    member.attendance[0].date
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            {member.payments && member.payments.length > 0 && (
                              <span>
                                • Last payment: ${member.payments[0].amount}
                              </span>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {showActions && (
                      <div className="flex gap-2">
                        {onMemberSelect && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onMemberSelect(member)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onMemberEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onMemberEdit(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onMemberDelete && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onMemberDelete(member)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredMembers.length)}{" "}
                of {filteredMembers.length} members
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-1">
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
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MemberList;
