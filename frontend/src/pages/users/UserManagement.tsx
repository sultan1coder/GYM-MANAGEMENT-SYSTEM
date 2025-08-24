import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  UserPlus,
  Users,
  FileSpreadsheet,
  Mail,
  Download,
  Upload,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useUserGetAll } from "@/hooks/user";
import {
  createUserByAdmin,
  bulkImportUsers,
  getUserTemplates,
  inviteUser,
} from "@/services/api";

interface UserTemplate {
  name: string;
  role: string;
  permissions: string[];
  description: string;
}

interface BulkImportResult {
  success: any[];
  errors: any[];
}

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showInviteUser, setShowInviteUser] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<UserTemplate | null>(
    null
  );
  const [bulkImportFile, setBulkImportFile] = useState<File | null>(null);
  const [importResults, setImportResults] = useState<BulkImportResult | null>(
    null
  );
  const [isImporting, setIsImporting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const { users, isLoading, error, refetch } = useUserGetAll();

  const userTemplates: UserTemplate[] = [
    {
      name: "Administrator",
      role: "admin",
      permissions: ["all"],
      description: "Full system access with user management capabilities",
    },
    {
      name: "Staff Manager",
      role: "staff",
      permissions: [
        "member_management",
        "equipment_management",
        "payment_management",
      ],
      description: "Can manage members, equipment, and payments",
    },
    {
      name: "Receptionist",
      role: "staff",
      permissions: ["member_management", "payment_management"],
      description: "Can manage members and handle payments",
    },
    {
      name: "Trainer",
      role: "staff",
      permissions: ["member_management"],
      description: "Can view and manage member profiles",
    },
  ];

  const createUserFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      username: "",
      phone_number: "",
      password: "",
      role: "staff",
    },
    validationSchema: yup.object({
      name: yup.string().required("Name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      username: yup.string().required("Username is required"),
      phone_number: yup.string().required("Phone number is required"),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      role: yup.string().required("Role is required"),
    }),
    onSubmit: async (values) => {
      try {
        await createUserByAdmin(values);
        toast.success("User created successfully!");
        setShowCreateUser(false);
        createUserFormik.resetForm();
        refetch();
      } catch (error) {
        toast.error("Failed to create user");
      }
    },
  });

  const inviteUserFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      username: "",
      phone_number: "",
      role: "staff",
    },
    validationSchema: yup.object({
      name: yup.string().required("Name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      username: yup.string().required("Username is required"),
      phone_number: yup.string().required("Phone number is required"),
      role: yup.string().required("Role is required"),
    }),
    onSubmit: async (values) => {
      try {
        await inviteUser(values);
        toast.success("Invitation sent successfully!");
        setShowInviteUser(false);
        inviteUserFormik.resetForm();
        refetch();
      } catch (error) {
        toast.error("Failed to send invitation");
      }
    },
  });

  const handleBulkImport = async () => {
    if (!bulkImportFile) {
      toast.error("Please select a file");
      return;
    }

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", bulkImportFile);

      const response = await bulkImportUsers(formData);
      setImportResults({
        success: response.data || [],
        errors: [],
      });
      toast.success("Bulk import completed!");
      setBulkImportFile(null);
      refetch();
    } catch (error) {
      toast.error("Failed to import users");
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      "name,email,username,phone_number,password,role\nJohn Doe,john@example.com,johndoe,+1234567890,password123,staff\nJane Smith,jane@example.com,janesmith,+1234567891,password123,staff";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_import_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "staff":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    totalUsers: users?.length || 0,
    admins: users?.filter((u) => u.role === "admin").length || 0,
    staff: users?.filter((u) => u.role === "staff").length || 0,
    activeUsers: users?.filter((u) => u.created_at).length || 0,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">
            Manage staff users, roles, and permissions
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowCreateUser(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create User
          </Button>
          <Button onClick={() => setShowBulkImport(true)} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
          <Button onClick={() => setShowInviteUser(true)} variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Administrators
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.staff}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="templates">User Templates</TabsTrigger>
          <TabsTrigger value="bulk-import">Bulk Import</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Manage existing users and their roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">{error}</div>
              ) : users && users.length > 0 ? (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getRoleColor(user.role || "staff")}>
                          {user.role || "staff"}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserDetails(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  No users found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Role Templates</CardTitle>
              <CardDescription>
                Predefined user role configurations for quick setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userTemplates.map((template) => (
                  <Card
                    key={template.name}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {template.name}
                        <Badge className={getRoleColor(template.role)}>
                          {template.role}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Permissions:</h4>
                        <div className="flex flex-wrap gap-2">
                          {template.permissions.map((permission) => (
                            <Badge
                              key={permission}
                              variant="secondary"
                              className="text-xs"
                            >
                              {permission}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          className="w-full mt-4"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk User Import</CardTitle>
              <CardDescription>
                Import multiple users from CSV or Excel files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Download Template</h3>
                  <p className="text-sm text-gray-600">
                    Get the CSV template with the correct format
                  </p>
                </div>
                <Button onClick={downloadTemplate} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">Upload File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) =>
                      setBulkImportFile(e.target.files?.[0] || null)
                    }
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Supported formats: CSV, Excel (.xlsx, .xls). Max size: 5MB
                  </p>
                </div>

                {bulkImportFile && (
                  <div className="flex items-center space-x-2">
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">
                      {bulkImportFile.name} selected
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setBulkImportFile(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <Button
                  onClick={handleBulkImport}
                  disabled={!bulkImportFile || isImporting}
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Import Users
                    </>
                  )}
                </Button>
              </div>

              {importResults && (
                <div className="space-y-4">
                  <Separator />
                  <h3 className="font-medium">Import Results</h3>

                  {importResults.success.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">
                          {importResults.success.length} users imported
                          successfully
                        </span>
                      </div>
                      <div className="space-y-2">
                        {importResults.success.map((user) => (
                          <div key={user.id} className="text-sm text-green-700">
                            ✓ {user.name} ({user.email}) - {user.role}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {importResults.errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-800">
                          {importResults.errors.length} errors encountered
                        </span>
                      </div>
                      <div className="space-y-2">
                        {importResults.errors.map((error, index) => (
                          <div key={index} className="text-sm text-red-700">
                            ✗ Row {error.row}: {error.error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Invitations</CardTitle>
              <CardDescription>
                Send email invitations to new users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-600">
                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No pending invitations</p>
                <p className="text-sm">Invite new users to get started</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create User Dialog */}
      <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new staff member to the system
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createUserFormik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...createUserFormik.getFieldProps("name")}
                  className={
                    createUserFormik.touched.name &&
                    createUserFormik.errors.name
                      ? "border-red-500"
                      : ""
                  }
                />
                {createUserFormik.touched.name &&
                  createUserFormik.errors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {createUserFormik.errors.name}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...createUserFormik.getFieldProps("email")}
                  className={
                    createUserFormik.touched.email &&
                    createUserFormik.errors.email
                      ? "border-red-500"
                      : ""
                  }
                />
                {createUserFormik.touched.email &&
                  createUserFormik.errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {createUserFormik.errors.email}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...createUserFormik.getFieldProps("username")}
                  className={
                    createUserFormik.touched.username &&
                    createUserFormik.errors.username
                      ? "border-red-500"
                      : ""
                  }
                />
                {createUserFormik.touched.username &&
                  createUserFormik.errors.username && (
                    <p className="text-sm text-red-600 mt-1">
                      {createUserFormik.errors.username}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  {...createUserFormik.getFieldProps("phone_number")}
                  className={
                    createUserFormik.touched.phone_number &&
                    createUserFormik.errors.phone_number
                      ? "border-red-500"
                      : ""
                  }
                />
                {createUserFormik.touched.phone_number &&
                  createUserFormik.errors.phone_number && (
                    <p className="text-sm text-red-600 mt-1">
                      {createUserFormik.errors.phone_number}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...createUserFormik.getFieldProps("password")}
                  className={
                    createUserFormik.touched.password &&
                    createUserFormik.errors.password
                      ? "border-red-500"
                      : ""
                  }
                />
                {createUserFormik.touched.password &&
                  createUserFormik.errors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {createUserFormik.errors.password}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={createUserFormik.values.role}
                  onValueChange={(value) =>
                    createUserFormik.setFieldValue("role", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateUser(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createUserFormik.isSubmitting}>
                {createUserFormik.isSubmitting ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog open={showInviteUser} onOpenChange={setShowInviteUser}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Send an email invitation to a new user
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={inviteUserFormik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invite-name">Full Name</Label>
                <Input
                  id="invite-name"
                  {...inviteUserFormik.getFieldProps("name")}
                  className={
                    inviteUserFormik.touched.name &&
                    inviteUserFormik.errors.name
                      ? "border-red-500"
                      : ""
                  }
                />
                {inviteUserFormik.touched.name &&
                  inviteUserFormik.errors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {inviteUserFormik.errors.name}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  {...inviteUserFormik.getFieldProps("email")}
                  className={
                    inviteUserFormik.touched.email &&
                    inviteUserFormik.errors.email
                      ? "border-red-500"
                      : ""
                  }
                />
                {inviteUserFormik.touched.email &&
                  inviteUserFormik.errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {inviteUserFormik.errors.email}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="invite-username">Username</Label>
                <Input
                  id="invite-username"
                  {...inviteUserFormik.getFieldProps("username")}
                  className={
                    inviteUserFormik.touched.username &&
                    inviteUserFormik.errors.username
                      ? "border-red-500"
                      : ""
                  }
                />
                {inviteUserFormik.touched.username &&
                  inviteUserFormik.errors.username && (
                    <p className="text-sm text-red-600 mt-1">
                      {inviteUserFormik.errors.username}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="invite-phone_number">Phone Number</Label>
                <Input
                  id="invite-phone_number"
                  {...inviteUserFormik.getFieldProps("phone_number")}
                  className={
                    inviteUserFormik.touched.phone_number &&
                    inviteUserFormik.errors.phone_number
                      ? "border-red-500"
                      : ""
                  }
                />
                {inviteUserFormik.touched.phone_number &&
                  inviteUserFormik.errors.phone_number && (
                    <p className="text-sm text-red-600 mt-1">
                      {inviteUserFormik.errors.phone_number}
                    </p>
                  )}
              </div>
              <div className="col-span-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select
                  value={inviteUserFormik.values.role}
                  onValueChange={(value) =>
                    inviteUserFormik.setFieldValue("role", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowInviteUser(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={inviteUserFormik.isSubmitting}>
                {inviteUserFormik.isSubmitting
                  ? "Sending..."
                  : "Send Invitation"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Template Selection Dialog */}
      <Dialog
        open={!!selectedTemplate}
        onOpenChange={() => setSelectedTemplate(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Use Template: {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Permissions</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTemplate?.permissions.map((permission) => (
                  <Badge key={permission} variant="secondary">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setSelectedTemplate(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // TODO: Implement template application
                  setSelectedTemplate(null);
                  setShowCreateUser(true);
                }}
              >
                Apply Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Name
                  </Label>
                  <p className="text-lg font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Username
                  </Label>
                  <p className="text-lg font-medium">{selectedUser.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Email
                  </Label>
                  <p className="text-lg font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Phone Number
                  </Label>
                  <p className="text-lg font-medium">
                    {selectedUser.phone_number}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Role
                  </Label>
                  <Badge className={getRoleColor(selectedUser.role || "staff")}>
                    {selectedUser.role || "staff"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Status
                  </Label>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Created At
                </Label>
                <p className="text-sm text-gray-600">
                  {selectedUser.created_at
                    ? new Date(selectedUser.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Last Updated
                </Label>
                <p className="text-sm text-gray-600">
                  {selectedUser.updated_at
                    ? new Date(selectedUser.updated_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowUserDetails(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setShowUserDetails(false);
                // TODO: Implement edit functionality
              }}
            >
              Edit User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
