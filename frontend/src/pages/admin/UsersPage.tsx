import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import Header from "../../components/Header";
import { useSidebar } from "../../contexts/SidebarContext";

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, toggleSidebar } = useSidebar();

  const handleAddNewUser = () => {
    navigate("/staff/register");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Menu Toggle */}
      <Header
        title="User Management"
        subtitle="Manage admin and staff accounts"
        onMenuToggle={toggleSidebar}
        isMenuOpen={isOpen}
        showSearch={true}
        showBreadcrumbs={true}
      />

      <div
        className={`max-w-7xl mx-auto space-y-6 transition-all duration-300 ${
          isOpen ? "p-6" : "p-6"
        }`}
      >
        {/* Quick Actions */}
        <div className="flex items-center justify-end">
          <Button onClick={handleAddNewUser}>
            <Plus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search users..." className="pl-10" />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">Admin User</td>
                    <td className="p-3">admin@gym.com</td>
                    <td className="p-3">
                      <Badge variant="default">Admin</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="default">Active</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">Staff Member</td>
                    <td className="p-3">staff@gym.com</td>
                    <td className="p-3">
                      <Badge variant="secondary">Staff</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="default">Active</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersPage;
