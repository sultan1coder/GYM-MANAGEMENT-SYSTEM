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
  Search,
  Filter,
  Calendar,
  Building,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Zap,
  UserX,
  UserCheck2,
  CalendarDays,
  Clock3,
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

interface SearchFilters {
  searchTerm: string;
  role: string;
  status: string;
  department: string;
  dateRange: {
    start: string;
    end: string;
  };
  lastLoginRange: {
    start: string;
    end: string;
  };
}

interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  newUsersLastMonth: number;
  userGrowthRate: number;
  roleDistribution: {
    admin: number;
    staff: number;
  };
  activityMetrics: {
    highActivity: number;
    mediumActivity: number;
    lowActivity: number;
  };
  monthlyGrowth: Array<{
    month: string;
    users: number;
    growth: number;
  }>;
  userEngagement: {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
  };
  performanceMetrics: {
    avgLoginFrequency: number;
    avgSessionDuration: number;
    taskCompletionRate: number;
  };
}

interface ActivityData {
  userId: number;
  userName: string;
  lastLogin: string;
  loginCount: number;
  sessionDuration: number;
  tasksCompleted: number;
  status: "active" | "inactive" | "suspended";
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
}

interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  parentRole?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userCount: number;
}

interface RoleHierarchy {
  id: string;
  name: string;
  level: number;
  children: RoleHierarchy[];
  permissions: string[];
  userCount: number;
}

interface PermissionAudit {
  id: string;
  userId: string;
  userName: string;
  action: "granted" | "revoked" | "modified";
  permission: string;
  role: string;
  timestamp: string;
  adminUser: string;
  reason?: string;
}

interface BulkRoleAssignment {
  userIds: number[];
  roleId: string;
  permissions: string[];
  reason: string;
}

interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number;
  preventReuse: number;
  complexityScore: number;
}

interface AccountLockout {
  maxFailedAttempts: number;
  lockoutDuration: number;
  lockoutThreshold: number;
  unlockMethod: 'automatic' | 'manual' | 'admin';
  notifyUser: boolean;
  notifyAdmin: boolean;
}

interface UserSession {
  id: string;
  userId: number;
  userName: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  loginTime: string;
  lastActivity: string;
  isActive: boolean;
  deviceType: string;
  browser: string;
  os: string;
}

interface AccessLog {
  id: string;
  userId: number;
  userName: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  timestamp: string;
  status: 'success' | 'failed' | 'blocked';
  details: string;
  riskScore: number;
}

interface IPRestriction {
  id: string;
  type: 'whitelist' | 'blacklist' | 'geolocation';
  value: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  priority: number;
}

interface SecuritySettings {
  passwordPolicy: PasswordPolicy;
  accountLockout: AccountLockout;
  sessionTimeout: number;
  mfaRequired: boolean;
  ipRestrictions: IPRestriction[];
  auditLogging: boolean;
  realTimeMonitoring: boolean;
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

  // Search and filtering state
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: "",
    role: "",
    status: "",
    department: "",
    dateRange: { start: "", end: "" },
    lastLoginRange: { start: "", end: "" },
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  // Analytics state
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(
    null
  );
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState("30d");
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // Role & Permission Management state
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roleHierarchy, setRoleHierarchy] = useState<RoleHierarchy[]>([]);
  const [permissionAudits, setPermissionAudits] = useState<PermissionAudit[]>(
    []
  );
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showBulkRoleAssignment, setShowBulkRoleAssignment] = useState(false);
  const [showPermissionAudit, setShowPermissionAudit] = useState(false);
  const [selectedRole, setSelectedRole] = useState<CustomRole | null>(null);
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null);

  // Security & Access Control state
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [ipRestrictions, setIpRestrictions] = useState<IPRestriction[]>([]);
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);
  const [showSessionManagement, setShowSessionManagement] = useState(false);
  const [showAccessLogs, setShowAccessLogs] = useState(false);
  const [showIPRestrictions, setShowIPRestrictions] = useState(false);
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);
  const [securityTimeRange, setSecurityTimeRange] = useState("24h");

  const { users, isLoading, error, refetch } = useUserGetAll();

  // Apply filters whenever users or filters change
  useEffect(() => {
    if (users) {
      const filtered = users.filter((user) => {
        // Search term filter (name, email, username)
        if (searchFilters.searchTerm) {
          const searchLower = searchFilters.searchTerm.toLowerCase();
          const matchesSearch =
            user.name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.username?.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }

        // Role filter
        if (searchFilters.role && user.role !== searchFilters.role) {
          return false;
        }

        // Status filter (using created_at as a proxy for active status)
        if (searchFilters.status) {
          const userStatus = user.created_at ? "active" : "inactive";
          if (userStatus !== searchFilters.status) {
            return false;
          }
        }

        // Department filter (using role as a proxy for department)
        if (
          searchFilters.department &&
          user.role !== searchFilters.department
        ) {
          return false;
        }

        // Date range filter (creation date)
        if (searchFilters.dateRange.start && user.created_at) {
          const userDate = new Date(user.created_at);
          const startDate = new Date(searchFilters.dateRange.start);
          if (userDate < startDate) return false;
        }
        if (searchFilters.dateRange.end && user.created_at) {
          const userDate = new Date(user.created_at);
          const endDate = new Date(searchFilters.dateRange.end);
          if (userDate > endDate) return false;
        }

        // Last login range filter (using updated_at as a proxy for last activity)
        if (searchFilters.lastLoginRange.start && user.updated_at) {
          const userDate = new Date(user.updated_at);
          const startDate = new Date(searchFilters.lastLoginRange.start);
          if (userDate < startDate) return false;
        }
        if (searchFilters.lastLoginRange.end && user.updated_at) {
          const userDate = new Date(user.updated_at);
          const endDate = new Date(searchFilters.lastLoginRange.end);
          if (userDate > endDate) return false;
        }

        return true;
      });
      setFilteredUsers(filtered);
    }
  }, [users, searchFilters]);

  // Calculate analytics when users change
  useEffect(() => {
    if (users) {
      calculateUserAnalytics();
      generateActivityData();
    }
  }, [users]);

  // Initialize role and permission data
  useEffect(() => {
    setPermissions(mockPermissions);
    setCustomRoles(mockCustomRoles);
    setRoleHierarchy(mockRoleHierarchy);
    setPermissionAudits(mockPermissionAudits);
  }, []);

  // Initialize security and access control data
  useEffect(() => {
    setSecuritySettings(mockSecuritySettings);
    setUserSessions(mockUserSessions);
    setAccessLogs(mockAccessLogs);
    setIpRestrictions(mockIPRestrictions);
  }, []);

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

  // Mock permissions data
  const mockPermissions: Permission[] = [
    // User Management
    {
      id: "user_create",
      name: "Create Users",
      description: "Create new user accounts",
      category: "User Management",
      resource: "users",
      action: "create",
    },
    {
      id: "user_read",
      name: "View Users",
      description: "View user information and profiles",
      category: "User Management",
      resource: "users",
      action: "read",
    },
    {
      id: "user_update",
      name: "Update Users",
      description: "Modify user information and settings",
      category: "User Management",
      resource: "users",
      action: "update",
    },
    {
      id: "user_delete",
      name: "Delete Users",
      description: "Remove user accounts",
      category: "User Management",
      resource: "users",
      action: "delete",
    },

    // Member Management
    {
      id: "member_create",
      name: "Create Members",
      description: "Create new member accounts",
      category: "Member Management",
      resource: "members",
      action: "create",
    },
    {
      id: "member_read",
      name: "View Members",
      description: "View member information and profiles",
      category: "Member Management",
      resource: "members",
      action: "read",
    },
    {
      id: "member_update",
      name: "Update Members",
      description: "Modify member information",
      category: "Member Management",
      resource: "members",
      action: "update",
    },
    {
      id: "member_delete",
      name: "Delete Members",
      description: "Remove member accounts",
      category: "Member Management",
      resource: "members",
      action: "delete",
    },

    // Equipment Management
    {
      id: "equipment_create",
      name: "Create Equipment",
      description: "Add new equipment to inventory",
      category: "Equipment Management",
      resource: "equipment",
      action: "create",
    },
    {
      id: "equipment_read",
      name: "View Equipment",
      description: "View equipment information and status",
      category: "Equipment Management",
      resource: "equipment",
      action: "read",
    },
    {
      id: "equipment_update",
      name: "Update Equipment",
      description: "Modify equipment information",
      category: "Equipment Management",
      resource: "equipment",
      action: "update",
    },
    {
      id: "equipment_delete",
      name: "Delete Equipment",
      description: "Remove equipment from inventory",
      category: "Equipment Management",
      resource: "equipment",
      action: "delete",
    },

    // Payment Management
    {
      id: "payment_create",
      name: "Create Payments",
      description: "Process new payments",
      category: "Payment Management",
      resource: "payments",
      action: "create",
    },
    {
      id: "payment_read",
      name: "View Payments",
      description: "View payment information and history",
      category: "Payment Management",
      resource: "payments",
      action: "read",
    },
    {
      id: "payment_update",
      name: "Update Payments",
      description: "Modify payment information",
      category: "Payment Management",
      resource: "payments",
      action: "update",
    },
    {
      id: "payment_delete",
      name: "Delete Payments",
      description: "Remove payment records",
      category: "Payment Management",
      resource: "payments",
      action: "delete",
    },

    // Subscription Management
    {
      id: "subscription_create",
      name: "Create Subscriptions",
      description: "Create new subscription plans",
      category: "Subscription Management",
      resource: "subscriptions",
      action: "create",
    },
    {
      id: "subscription_read",
      name: "View Subscriptions",
      description: "View subscription information",
      category: "Subscription Management",
      resource: "subscriptions",
      action: "read",
    },
    {
      id: "subscription_update",
      name: "Update Subscriptions",
      description: "Modify subscription plans",
      category: "Subscription Management",
      resource: "subscriptions",
      action: "update",
    },
    {
      id: "subscription_delete",
      name: "Delete Subscriptions",
      description: "Remove subscription plans",
      category: "Subscription Management",
      resource: "subscriptions",
      action: "delete",
    },

    // Analytics & Reporting
    {
      id: "analytics_read",
      name: "View Analytics",
      description: "Access system analytics and reports",
      category: "Analytics",
      resource: "analytics",
      action: "read",
    },
    {
      id: "reports_generate",
      name: "Generate Reports",
      description: "Create and export reports",
      category: "Analytics",
      resource: "reports",
      action: "create",
    },

    // System Administration
    {
      id: "system_config",
      name: "System Configuration",
      description: "Modify system settings and configuration",
      category: "System Admin",
      resource: "system",
      action: "update",
    },
    {
      id: "backup_restore",
      name: "Backup & Restore",
      description: "Perform system backup and restore operations",
      category: "System Admin",
      resource: "system",
      action: "admin",
    },
  ];

  // Mock custom roles data
  const mockCustomRoles: CustomRole[] = [
    {
      id: "role_1",
      name: "Senior Manager",
      description: "Advanced management role with extended permissions",
      permissions: [
        "user_create",
        "user_read",
        "user_update",
        "member_create",
        "member_read",
        "member_update",
        "equipment_create",
        "equipment_read",
        "equipment_update",
        "payment_create",
        "payment_read",
        "payment_update",
        "analytics_read",
        "reports_generate",
      ],
      parentRole: "admin",
      isActive: true,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      userCount: 3,
    },
    {
      id: "role_2",
      name: "Equipment Specialist",
      description: "Specialized role for equipment management",
      permissions: [
        "equipment_create",
        "equipment_read",
        "equipment_update",
        "equipment_delete",
        "analytics_read",
      ],
      parentRole: "staff",
      isActive: true,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-15",
      userCount: 2,
    },
    {
      id: "role_3",
      name: "Member Services",
      description: "Focused on member management and support",
      permissions: [
        "member_create",
        "member_read",
        "member_update",
        "payment_create",
        "payment_read",
        "subscription_read",
      ],
      parentRole: "staff",
      isActive: true,
      createdAt: "2024-01-05",
      updatedAt: "2024-01-10",
      userCount: 5,
    },
    {
      id: "role_4",
      name: "Financial Controller",
      description: "Financial management and payment processing",
      permissions: [
        "payment_create",
        "payment_read",
        "payment_update",
        "payment_delete",
        "subscription_create",
        "subscription_read",
        "subscription_update",
        "analytics_read",
        "reports_generate",
      ],
      parentRole: "staff",
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-05",
      userCount: 2,
    },
  ];

  // Mock role hierarchy data
  const mockRoleHierarchy: RoleHierarchy[] = [
    {
      id: "admin",
      name: "Administrator",
      level: 1,
      children: [
        {
          id: "role_1",
          name: "Senior Manager",
          level: 2,
          children: [
            {
              id: "role_2",
              name: "Equipment Specialist",
              level: 3,
              children: [],
              permissions: [
                "equipment_create",
                "equipment_read",
                "equipment_update",
                "equipment_delete",
                "analytics_read",
              ],
              userCount: 2,
            },
            {
              id: "role_3",
              name: "Member Services",
              level: 3,
              children: [],
              permissions: [
                "member_create",
                "member_read",
                "member_update",
                "payment_create",
                "payment_read",
                "subscription_read",
              ],
              userCount: 5,
            },
          ],
          permissions: [
            "user_create",
            "user_read",
            "user_update",
            "member_create",
            "member_read",
            "member_update",
            "equipment_create",
            "equipment_read",
            "equipment_update",
            "payment_create",
            "payment_read",
            "payment_update",
            "analytics_read",
            "reports_generate",
          ],
          userCount: 3,
        },
      ],
      permissions: ["all"],
      userCount: 1,
    },
    {
      id: "staff",
      name: "Staff",
      level: 2,
      children: [
        {
          id: "role_4",
          name: "Financial Controller",
          level: 3,
          children: [],
          permissions: [
            "payment_create",
            "payment_read",
            "payment_update",
            "payment_delete",
            "subscription_create",
            "subscription_read",
            "subscription_update",
            "analytics_read",
            "reports_generate",
          ],
          userCount: 2,
        },
      ],
      permissions: [
        "member_management",
        "equipment_management",
        "payment_management",
      ],
      userCount: 8,
    },
  ];

  // Mock permission audit data
  const mockPermissionAudits: PermissionAudit[] = [
    {
      id: "audit_1",
      userId: "user_1",
      userName: "John Doe",
      action: "granted",
      permission: "user_create",
      role: "Senior Manager",
      timestamp: "2024-01-20T10:30:00Z",
      adminUser: "admin@example.com",
      reason: "Promotion to senior management",
    },
    {
      id: "audit_2",
      userId: "user_2",
      userName: "Jane Smith",
      action: "revoked",
      permission: "payment_delete",
      role: "Staff",
      timestamp: "2024-01-19T14:15:00Z",
      adminUser: "admin@example.com",
      reason: "Security policy update",
    },
    {
      id: "audit_3",
      userId: "user_3",
      userName: "Mike Johnson",
      action: "modified",
      permission: "equipment_management",
      role: "Equipment Specialist",
      timestamp: "2024-01-18T09:45:00Z",
      adminUser: "admin@example.com",
      reason: "Role refinement",
    },
  ];

  // Mock security settings data
  const mockSecuritySettings: SecuritySettings = {
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90,
      preventReuse: 5,
      complexityScore: 8
    },
    accountLockout: {
      maxFailedAttempts: 5,
      lockoutDuration: 30,
      lockoutThreshold: 3,
      unlockMethod: 'automatic',
      notifyUser: true,
      notifyAdmin: true
    },
    sessionTimeout: 480,
    mfaRequired: true,
    ipRestrictions: [],
    auditLogging: true,
    realTimeMonitoring: true
  };

  // Mock user sessions data
  const mockUserSessions: UserSession[] = [
    {
      id: "session_1",
      userId: 1,
      userName: "John Doe",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "New York, NY, USA",
      loginTime: "2024-01-20T08:00:00Z",
      lastActivity: "2024-01-20T14:30:00Z",
      isActive: true,
      deviceType: "Desktop",
      browser: "Chrome 120.0",
      os: "Windows 11"
    },
    {
      id: "session_2",
      userId: 2,
      userName: "Jane Smith",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      location: "Los Angeles, CA, USA",
      loginTime: "2024-01-20T09:15:00Z",
      lastActivity: "2024-01-20T13:45:00Z",
      isActive: true,
      deviceType: "Mobile",
      browser: "Safari 17.0",
      os: "iOS 17.0"
    },
    {
      id: "session_3",
      userId: 3,
      userName: "Mike Johnson",
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      location: "Chicago, IL, USA",
      loginTime: "2024-01-20T07:30:00Z",
      lastActivity: "2024-01-20T12:20:00Z",
      isActive: false,
      deviceType: "Desktop",
      browser: "Firefox 121.0",
      os: "macOS 12.0"
    },
    {
      id: "session_4",
      userId: 4,
      userName: "Sarah Wilson",
      ipAddress: "203.45.67.89",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "London, UK",
      loginTime: "2024-01-20T06:00:00Z",
      lastActivity: "2024-01-20T11:30:00Z",
      isActive: true,
      deviceType: "Desktop",
      browser: "Edge 120.0",
      os: "Windows 10"
    }
  ];

  // Mock access logs data
  const mockAccessLogs: AccessLog[] = [
    {
      id: "log_1",
      userId: 1,
      userName: "John Doe",
      action: "login",
      resource: "authentication",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "New York, NY, USA",
      timestamp: "2024-01-20T08:00:00Z",
      status: "success",
      details: "Successful login from trusted IP",
      riskScore: 2
    },
    {
      id: "log_2",
      userId: 2,
      userName: "Jane Smith",
      action: "failed_login",
      resource: "authentication",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      location: "Los Angeles, CA, USA",
      timestamp: "2024-01-20T09:15:00Z",
      status: "failed",
      details: "Invalid password attempt",
      riskScore: 5
    },
    {
      id: "log_3",
      userId: 3,
      userName: "Mike Johnson",
      action: "access_denied",
      resource: "admin_panel",
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      location: "Chicago, IL, USA",
      timestamp: "2024-01-20T10:30:00Z",
      status: "blocked",
      details: "Insufficient permissions for admin access",
      riskScore: 8
    },
    {
      id: "log_4",
      userId: 4,
      userName: "Sarah Wilson",
      action: "data_export",
      resource: "member_data",
      ipAddress: "203.45.67.89",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "London, UK",
      timestamp: "2024-01-20T11:45:00Z",
      status: "success",
      details: "Exported member data to CSV",
      riskScore: 3
    },
    {
      id: "log_5",
      userId: 1,
      userName: "John Doe",
      action: "role_modification",
      resource: "user_management",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "New York, NY, USA",
      timestamp: "2024-01-20T12:00:00Z",
      status: "success",
      details: "Modified user role permissions",
      riskScore: 4
    }
  ];

  // Mock IP restrictions data
  const mockIPRestrictions: IPRestriction[] = [
    {
      id: "ip_1",
      type: "whitelist",
      value: "192.168.1.0/24",
      description: "Office network - trusted IP range",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      createdBy: "admin@example.com",
      priority: 1
    },
    {
      id: "ip_2",
      type: "blacklist",
      value: "203.45.67.89",
      description: "Suspicious IP - multiple failed attempts",
      isActive: true,
      createdAt: "2024-01-15T00:00:00Z",
      createdBy: "admin@example.com",
      priority: 2
    },
    {
      id: "ip_3",
      type: "geolocation",
      value: "US,CA,UK",
      description: "Allowed countries for access",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      createdBy: "admin@example.com",
      priority: 3
    },
    {
      id: "ip_4",
      type: "blacklist",
      value: "10.0.0.0/8",
      description: "Blocked private network range",
      isActive: false,
      createdAt: "2024-01-10T00:00:00Z",
      createdBy: "admin@example.com",
      priority: 4
    }
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

  // Role & Permission Management helper functions
  const getPermissionCategoryColor = (category: string) => {
    switch (category) {
      case "User Management":
        return "bg-blue-100 text-blue-800";
      case "Member Management":
        return "bg-green-100 text-green-800";
      case "Equipment Management":
        return "bg-purple-100 text-purple-800";
      case "Payment Management":
        return "bg-yellow-100 text-yellow-800";
      case "Subscription Management":
        return "bg-indigo-100 text-indigo-800";
      case "Analytics":
        return "bg-pink-100 text-pink-800";
      case "System Admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPermissionActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return "➕";
      case "read":
        return "👁️";
      case "update":
        return "✏️";
      case "delete":
        return "🗑️";
      case "admin":
        return "⚙️";
      default:
        return "🔧";
    }
  };

  const getPermissionDescription = (permissionId: string) => {
    const permission = permissions.find((p) => p.id === permissionId);
    return permission ? permission.description : "Unknown permission";
  };

  const getRolePermissions = (roleId: string) => {
    const role = customRoles.find((r) => r.id === roleId);
    return role ? role.permissions : [];
  };

  const getInheritedPermissions = (roleId: string) => {
    const role = customRoles.find((r) => r.id === roleId);
    if (!role?.parentRole) return [];

    const parentRole = customRoles.find((r) => r.name === role.parentRole);
    return parentRole ? parentRole.permissions : [];
  };

  const hasPermission = (roleId: string, permissionId: string) => {
    const rolePermissions = getRolePermissions(roleId);
    const inheritedPermissions = getInheritedPermissions(roleId);
    return (
      rolePermissions.includes(permissionId) ||
      inheritedPermissions.includes(permissionId)
    );
  };

  const getRoleHierarchyLevel = (roleId: string) => {
    const findLevel = (
      roles: RoleHierarchy[],
      targetId: string,
      currentLevel: number = 1
    ): number => {
      for (const role of roles) {
        if (role.id === targetId) return currentLevel;
        const childLevel = findLevel(role.children, targetId, currentLevel + 1);
        if (childLevel > 0) return childLevel;
      }
      return 0;
    };
    return findLevel(roleHierarchy, roleId);
  };

  // Security & Access Control helper functions
  const getRiskScoreColor = (riskScore: number) => {
    if (riskScore <= 3) return "bg-green-100 text-green-800";
    if (riskScore <= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getRiskScoreLabel = (riskScore: number) => {
    if (riskScore <= 3) return "Low";
    if (riskScore <= 6) return "Medium";
    return "High";
  };

  const getSessionStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  const getDeviceTypeIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "desktop":
        return "💻";
      case "mobile":
        return "📱";
      case "tablet":
        return "📱";
      default:
        return "🖥️";
    }
  };

  const getActionStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "blocked":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIPRestrictionTypeColor = (type: string) => {
    switch (type) {
      case "whitelist":
        return "bg-green-100 text-green-800";
      case "blacklist":
        return "bg-red-100 text-red-800";
      case "geolocation":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatSessionDuration = (loginTime: string, lastActivity: string) => {
    const login = new Date(loginTime);
    const last = new Date(lastActivity);
    const diffMs = last.getTime() - login.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800";
    if (score >= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getPasswordStrengthLabel = (score: number) => {
    if (score >= 8) return "Strong";
    if (score >= 6) return "Moderate";
    return "Weak";
  };

  const clearFilters = () => {
    setSearchFilters({
      searchTerm: "",
      role: "",
      status: "",
      department: "",
      dateRange: { start: "", end: "" },
      lastLoginRange: { start: "", end: "" },
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchFilters.searchTerm) count++;
    if (searchFilters.role) count++;
    if (searchFilters.status) count++;
    if (searchFilters.department) count++;
    if (searchFilters.dateRange.start || searchFilters.dateRange.end) count++;
    if (searchFilters.lastLoginRange.start || searchFilters.lastLoginRange.end)
      count++;
    return count;
  };

  const generateSearchSuggestions = (searchTerm: string) => {
    if (!searchTerm || !users) return [];

    const suggestions: string[] = [];
    const searchLower = searchTerm.toLowerCase();

    users.forEach((user) => {
      if (
        user.name?.toLowerCase().includes(searchLower) &&
        !suggestions.includes(user.name)
      ) {
        suggestions.push(user.name);
      }
      if (
        user.email?.toLowerCase().includes(searchLower) &&
        !suggestions.includes(user.email)
      ) {
        suggestions.push(user.email);
      }
      if (
        user.username?.toLowerCase().includes(searchLower) &&
        !suggestions.includes(user.username)
      ) {
        suggestions.push(user.username);
      }
    });

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  };

  // Calculate user analytics
  const calculateUserAnalytics = () => {
    if (!users) return;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const activeUsers = users.filter(
      (user) => user.created_at && new Date(user.created_at) > thirtyDaysAgo
    ).length;
    const inactiveUsers = users.length - activeUsers;

    const newUsersThisMonth = users.filter(
      (user) => user.created_at && new Date(user.created_at) > thirtyDaysAgo
    ).length;

    const newUsersLastMonth = users.filter(
      (user) =>
        user.created_at &&
        new Date(user.created_at) > sixtyDaysAgo &&
        new Date(user.created_at) <= thirtyDaysAgo
    ).length;

    const userGrowthRate =
      newUsersLastMonth > 0
        ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100
        : newUsersThisMonth > 0
        ? 100
        : 0;

    const roleDistribution = {
      admin: users.filter((user) => user.role === "admin").length,
      staff: users.filter((user) => user.role === "staff").length,
    };

    // Generate mock monthly growth data for the last 6 months
    const monthlyGrowth = Array.from({ length: 6 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      const baseUsers = Math.max(users.length - i * 2, 1);
      const userCount = baseUsers + Math.floor(Math.random() * 5);
      const growth = i === 0 ? 0 : Math.floor(Math.random() * 20) - 10;

      return { month: monthName, users: userCount, growth };
    }).reverse();

    // Mock activity metrics
    const activityMetrics = {
      highActivity: Math.floor(activeUsers * 0.3),
      mediumActivity: Math.floor(activeUsers * 0.5),
      lowActivity:
        activeUsers -
        Math.floor(activeUsers * 0.3) -
        Math.floor(activeUsers * 0.5),
    };

    // Mock user engagement
    const userEngagement = {
      dailyActive: Math.floor(activeUsers * 0.7),
      weeklyActive: Math.floor(activeUsers * 0.9),
      monthlyActive: activeUsers,
    };

    // Mock performance metrics
    const performanceMetrics = {
      avgLoginFrequency: Math.floor(Math.random() * 5) + 3, // 3-7 logins per week
      avgSessionDuration: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
      taskCompletionRate: Math.floor(Math.random() * 20) + 80, // 80-100%
    };

    setUserAnalytics({
      totalUsers: users.length,
      activeUsers,
      inactiveUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      userGrowthRate,
      roleDistribution,
      activityMetrics,
      monthlyGrowth,
      userEngagement,
      performanceMetrics,
    });
  };

  // Generate mock activity data
  const generateActivityData = () => {
    if (!users) return;

    const mockActivityData: ActivityData[] = users.map((user) => ({
      userId: user.id,
      userName: user.name || "Unknown User",
      lastLogin: user.updated_at
        ? new Date(user.updated_at).toLocaleDateString()
        : "Never",
      loginCount: Math.floor(Math.random() * 50) + 1,
      sessionDuration: Math.floor(Math.random() * 120) + 15,
      tasksCompleted: Math.floor(Math.random() * 100) + 10,
      status: user.created_at ? "active" : "inactive",
    }));

    setActivityData(mockActivityData);
  };

  const stats = {
    totalUsers: filteredUsers.length || users?.length || 0,
    admins:
      filteredUsers.filter((u) => u.role === "admin").length ||
      users?.filter((u) => u.role === "admin").length ||
      0,
    staff:
      filteredUsers.filter((u) => u.role === "staff").length ||
      users?.filter((u) => u.role === "staff").length ||
      0,
    activeUsers:
      filteredUsers.filter((u) => u.created_at).length ||
      users?.filter((u) => u.created_at).length ||
      0,
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
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="roles-permissions">
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="security">Security & Access</TabsTrigger>
          <TabsTrigger value="templates">User Templates</TabsTrigger>
          <TabsTrigger value="bulk-import">Bulk Import</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filter Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search & Filter Users
              </CardTitle>
              <CardDescription>
                Find users by name, email, username, role, status, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Search */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Users</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search by name, email, or username..."
                      value={searchFilters.searchTerm}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSearchFilters((prev) => ({
                          ...prev,
                          searchTerm: value,
                        }));
                        if (value.length > 1) {
                          const suggestions = generateSearchSuggestions(value);
                          setSearchSuggestions(suggestions);
                          setShowSearchSuggestions(suggestions.length > 0);
                        } else {
                          setShowSearchSuggestions(false);
                        }
                      }}
                      onFocus={() => {
                        if (searchFilters.searchTerm.length > 1) {
                          const suggestions = generateSearchSuggestions(
                            searchFilters.searchTerm
                          );
                          setSearchSuggestions(suggestions);
                          setShowSearchSuggestions(suggestions.length > 0);
                        }
                      }}
                      onBlur={() => {
                        // Delay hiding suggestions to allow clicking on them
                        setTimeout(() => setShowSearchSuggestions(false), 200);
                      }}
                      className="pl-10"
                    />

                    {/* Search Suggestions */}
                    {showSearchSuggestions && searchSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                        {searchSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                            onClick={() => {
                              setSearchFilters((prev) => ({
                                ...prev,
                                searchTerm: suggestion,
                              }));
                              setShowSearchSuggestions(false);
                            }}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Tip: Use quotes for exact matches, e.g., "john@email.com"
                  </p>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Advanced Filters
                    {getActiveFiltersCount() > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="role-filter">Role</Label>
                    <Select
                      value={searchFilters.role}
                      onValueChange={(value) =>
                        setSearchFilters((prev) => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All roles</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status-filter">Status</Label>
                    <Select
                      value={searchFilters.status}
                      onValueChange={(value) =>
                        setSearchFilters((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="department-filter">Department/Team</Label>
                    <Select
                      value={searchFilters.department}
                      onValueChange={(value) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          department: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All departments</SelectItem>
                        <SelectItem value="admin">Administration</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date-start">Created From</Label>
                    <Input
                      id="date-start"
                      type="date"
                      value={searchFilters.dateRange.start}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          dateRange: {
                            ...prev.dateRange,
                            start: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="date-end">Created To</Label>
                    <Input
                      id="date-end"
                      type="date"
                      value={searchFilters.dateRange.end}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, end: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="last-activity-start">
                      Last Activity From
                    </Label>
                    <Input
                      id="last-activity-start"
                      type="date"
                      value={searchFilters.lastLoginRange.start}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          lastLoginRange: {
                            ...prev.lastLoginRange,
                            start: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="last-activity-end">Last Activity To</Label>
                    <Input
                      id="last-activity-end"
                      type="date"
                      value={searchFilters.lastLoginRange.end}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          lastLoginRange: {
                            ...prev.lastLoginRange,
                            end: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Clear Filters
                    </Button>
                    <Button
                      onClick={() => setShowAdvancedFilters(false)}
                      variant="ghost"
                    >
                      Hide Filters
                    </Button>
                  </div>
                </div>
              )}

              {/* Active Filter Chips */}
              {getActiveFiltersCount() > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Active Filters:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchFilters.searchTerm && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        Search: "{searchFilters.searchTerm}"
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-600"
                          onClick={() =>
                            setSearchFilters((prev) => ({
                              ...prev,
                              searchTerm: "",
                            }))
                          }
                        />
                      </Badge>
                    )}
                    {searchFilters.role && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        Role: {searchFilters.role}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-600"
                          onClick={() =>
                            setSearchFilters((prev) => ({ ...prev, role: "" }))
                          }
                        />
                      </Badge>
                    )}
                    {searchFilters.status && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        Status: {searchFilters.status}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-600"
                          onClick={() =>
                            setSearchFilters((prev) => ({
                              ...prev,
                              status: "",
                            }))
                          }
                        />
                      </Badge>
                    )}
                    {searchFilters.department && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        Department: {searchFilters.department}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-600"
                          onClick={() =>
                            setSearchFilters((prev) => ({
                              ...prev,
                              department: "",
                            }))
                          }
                        />
                      </Badge>
                    )}
                    {(searchFilters.dateRange.start ||
                      searchFilters.dateRange.end) && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        Created: {searchFilters.dateRange.start || "any"} -{" "}
                        {searchFilters.dateRange.end || "any"}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-600"
                          onClick={() =>
                            setSearchFilters((prev) => ({
                              ...prev,
                              dateRange: { start: "", end: "" },
                            }))
                          }
                        />
                      </Badge>
                    )}
                    {(searchFilters.lastLoginRange.start ||
                      searchFilters.lastLoginRange.end) && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        Last Activity:{" "}
                        {searchFilters.lastLoginRange.start || "any"} -{" "}
                        {searchFilters.lastLoginRange.end || "any"}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-600"
                          onClick={() =>
                            setSearchFilters((prev) => ({
                              ...prev,
                              lastLoginRange: { start: "", end: "" },
                            }))
                          }
                        />
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Results Summary */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm text-gray-600">
                  Showing {filteredUsers.length} of {users?.length || 0} users
                  {getActiveFiltersCount() > 0 && (
                    <span className="ml-2 text-blue-600">(filtered)</span>
                  )}
                </div>
                {getActiveFiltersCount() > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

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
              ) : users && users.length > 0 && filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <div>
                    <p>No users match your current filters</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Try adjusting your search criteria or clearing some
                      filters
                    </p>
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="mt-3"
                    >
                      Clear all filters
                    </Button>
                  </div>
                </div>
              ) : filteredUsers && filteredUsers.length > 0 ? (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
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
                  {getActiveFiltersCount() > 0 ? (
                    <div>
                      <p>No users match your current filters</p>
                      <Button
                        variant="link"
                        onClick={clearFilters}
                        className="text-blue-600 hover:text-blue-700 mt-2"
                      >
                        Clear all filters
                      </Button>
                    </div>
                  ) : (
                    "No users found"
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                User Analytics & Reporting
              </h3>
              <p className="text-gray-600">
                Comprehensive insights into user activity, growth, and
                performance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={analyticsTimeRange}
                onValueChange={setAnalyticsTimeRange}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  calculateUserAnalytics();
                  generateActivityData();
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userAnalytics?.totalUsers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userAnalytics?.userGrowthRate ? (
                    <span
                      className={
                        userAnalytics.userGrowthRate >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {userAnalytics.userGrowthRate >= 0 ? "+" : ""}
                      {userAnalytics.userGrowthRate.toFixed(1)}% from last month
                    </span>
                  ) : (
                    "No previous data"
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userAnalytics?.activeUsers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userAnalytics
                    ? `${(
                        (userAnalytics.activeUsers / userAnalytics.totalUsers) *
                        100
                      ).toFixed(1)}% of total`
                    : "0%"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  New This Month
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userAnalytics?.newUsersThisMonth || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userAnalytics?.newUsersLastMonth
                    ? `vs ${userAnalytics.newUsersLastMonth} last month`
                    : "No previous data"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Login Frequency
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userAnalytics?.performanceMetrics?.avgLoginFrequency || 0}
                </div>
                <p className="text-xs text-muted-foreground">logins per week</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Role Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Role Distribution
                </CardTitle>
                <CardDescription>Breakdown of users by role</CardDescription>
              </CardHeader>
              <CardContent>
                {userAnalytics ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Administrators</span>
                      </div>
                      <span className="font-medium">
                        {userAnalytics.roleDistribution.admin}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Staff Members</span>
                      </div>
                      <span className="font-medium">
                        {userAnalytics.roleDistribution.staff}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-blue-500 h-2 rounded-full"
                        style={{
                          width: `${
                            userAnalytics.roleDistribution.admin > 0
                              ? (userAnalytics.roleDistribution.admin /
                                  userAnalytics.totalUsers) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Loading analytics...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Growth Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  User Growth Trend
                </CardTitle>
                <CardDescription>Monthly user growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                {userAnalytics?.monthlyGrowth ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Growth Rate</span>
                      <span className="font-medium">
                        {userAnalytics.monthlyGrowth[
                          userAnalytics.monthlyGrowth.length - 1
                        ]?.growth || 0}
                        %
                      </span>
                    </div>
                    <div className="space-y-2">
                      {userAnalytics.monthlyGrowth.map((month, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{month.month}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{month.users}</span>
                            <span
                              className={`text-xs ${
                                month.growth >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {month.growth >= 0 ? "+" : ""}
                              {month.growth}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Loading growth data...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Activity Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Activity Levels
                </CardTitle>
                <CardDescription>User activity distribution</CardDescription>
              </CardHeader>
              <CardContent>
                {userAnalytics ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">High Activity</span>
                      <span className="font-medium text-green-600">
                        {userAnalytics.activityMetrics.highActivity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Medium Activity</span>
                      <span className="font-medium text-yellow-600">
                        {userAnalytics.activityMetrics.mediumActivity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Low Activity</span>
                      <span className="font-medium text-red-600">
                        {userAnalytics.activityMetrics.lowActivity}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Loading activity data...
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>User productivity indicators</CardDescription>
              </CardHeader>
              <CardContent>
                {userAnalytics ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Session Duration</span>
                      <span className="font-medium">
                        {userAnalytics.performanceMetrics.avgSessionDuration}{" "}
                        min
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Task Completion</span>
                      <span className="font-medium">
                        {userAnalytics.performanceMetrics.taskCompletionRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Engagement Score</span>
                      <span className="font-medium">
                        {Math.round(
                          (userAnalytics.performanceMetrics.avgLoginFrequency /
                            7) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Loading performance data...
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  User Engagement
                </CardTitle>
                <CardDescription>
                  Daily, weekly, and monthly active users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userAnalytics ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Daily Active</span>
                      <span className="font-medium text-blue-600">
                        {userAnalytics.userEngagement.dailyActive}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly Active</span>
                      <span className="font-medium text-green-600">
                        {userAnalytics.userEngagement.weeklyActive}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Monthly Active</span>
                      <span className="font-medium text-purple-600">
                        {userAnalytics.userEngagement.monthlyActive}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Loading engagement data...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* User Activity Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock3 className="w-5 h-5" />
                User Activity Tracking
              </CardTitle>
              <CardDescription>
                Detailed user activity and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activityData.length > 0 ? (
                <div className="space-y-4">
                  {activityData.map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{user.userName}</h3>
                          <p className="text-sm text-gray-600">
                            Last login: {user.lastLogin}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{user.loginCount}</div>
                          <div className="text-gray-500">Logins</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">
                            {user.sessionDuration} min
                          </div>
                          <div className="text-gray-500">Avg Session</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">
                            {user.tasksCompleted}
                          </div>
                          <div className="text-gray-500">Tasks</div>
                        </div>
                        <Badge
                          className={
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Loading activity data...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles-permissions" className="space-y-6">
          {/* Roles & Permissions Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Role & Permission Management
              </h3>
              <p className="text-gray-600">
                Create custom roles, manage permissions, and establish role
                hierarchy
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowCreateRole(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Custom Role
              </Button>
              <Button
                onClick={() => setShowBulkRoleAssignment(true)}
                variant="outline"
              >
                <Users className="w-4 h-4 mr-2" />
                Bulk Role Assignment
              </Button>
              <Button
                onClick={() => setShowPermissionAudit(true)}
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                Permission Audit
              </Button>
            </div>
          </div>

          {/* Custom Roles Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {customRoles.map((role) => (
              <Card key={role.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {role.name}
                        <Badge
                          className={
                            role.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {role.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {role.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingRole(role)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRole(role)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <span>Users: {role.userCount}</span>
                    <span>
                      Created: {new Date(role.createdAt).toLocaleDateString()}
                    </span>
                    {role.parentRole && <span>Parent: {role.parentRole}</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">
                      Permissions ({role.permissions.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.slice(0, 5).map((permissionId) => (
                        <Badge
                          key={permissionId}
                          variant="secondary"
                          className="text-xs"
                          title={getPermissionDescription(permissionId)}
                        >
                          {getPermissionActionIcon(
                            getPermissionDescription(permissionId)
                              .split(" ")[0]
                              .toLowerCase()
                          )}{" "}
                          {permissionId}
                        </Badge>
                      ))}
                      {role.permissions.length > 5 && (
                        <Badge variant="secondary" className="text-xs">
                          +{role.permissions.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Role Hierarchy Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Role Hierarchy
              </CardTitle>
              <CardDescription>
                Visual representation of role inheritance and structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {roleHierarchy.map((rootRole) => (
                  <div key={rootRole.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800 font-medium">
                          Level {rootRole.level}
                        </Badge>
                        <span className="font-semibold text-lg">
                          {rootRole.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          ({rootRole.userCount} users)
                        </span>
                      </div>
                    </div>
                    {rootRole.children.length > 0 && (
                      <div className="ml-8 space-y-3">
                        {rootRole.children.map((childRole) => (
                          <div key={childRole.id} className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-green-100 text-green-800 font-medium">
                                  Level {childRole.level}
                                </Badge>
                                <span className="font-medium">
                                  {childRole.name}
                                </span>
                                <span className="text-sm text-gray-600">
                                  ({childRole.userCount} users)
                                </span>
                              </div>
                            </div>
                            {childRole.children.length > 0 && (
                              <div className="ml-8 space-y-2">
                                {childRole.children.map((grandChildRole) => (
                                  <div
                                    key={grandChildRole.id}
                                    className="flex items-center gap-3"
                                  >
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-purple-100 text-purple-800 font-medium">
                                        Level {grandChildRole.level}
                                      </Badge>
                                      <span className="font-medium">
                                        {grandChildRole.name}
                                      </span>
                                      <span className="text-sm text-gray-600">
                                        ({grandChildRole.userCount} users)
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Permissions Library */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Permissions Library
              </CardTitle>
              <CardDescription>
                Complete list of available permissions organized by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Array.from(new Set(permissions.map((p) => p.category))).map(
                  (category) => (
                    <div key={category} className="space-y-3">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Badge className={getPermissionCategoryColor(category)}>
                          {category}
                        </Badge>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {permissions
                          .filter((p) => p.category === category)
                          .map((permission) => (
                            <div
                              key={permission.id}
                              className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">
                                    {permission.name}
                                  </h4>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {permission.description}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-xs ml-2"
                                >
                                  {permission.action}
                                </Badge>
                              </div>
                              <div className="mt-2 text-xs text-gray-500">
                                Resource: {permission.resource}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security & Access Control Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Security & Access Control</h3>
              <p className="text-gray-600">Manage password policies, account security, session monitoring, and access controls</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowSecuritySettings(true)} className="bg-blue-600 hover:bg-blue-700">
                <Edit className="w-4 h-4 mr-2" />
                Security Settings
              </Button>
              <Button onClick={() => setShowSessionManagement(true)} variant="outline">
                <Clock className="w-4 h-4 mr-2" />
                Session Management
              </Button>
              <Button onClick={() => setShowAccessLogs(true)} variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Access Logs
              </Button>
              <Button onClick={() => setShowIPRestrictions(true)} variant="outline">
                <Building className="w-4 h-4 mr-2" />
                IP Restrictions
              </Button>
            </div>
          </div>

          {/* Security Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userSessions.filter(s => s.isActive).length}</div>
                <p className="text-xs text-muted-foreground">
                  {userSessions.length} total sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Password Strength</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securitySettings?.passwordPolicy.complexityScore || 0}/10</div>
                <Badge className={getPasswordStrengthColor(securitySettings?.passwordPolicy.complexityScore || 0)}>
                  {getPasswordStrengthLabel(securitySettings?.passwordPolicy.complexityScore || 0)}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accessLogs.filter(log => log.status === 'failed').length}</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">IP Restrictions</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ipRestrictions.filter(ip => ip.isActive).length}</div>
                <p className="text-xs text-muted-foreground">Active rules</p>
              </CardContent>
            </Card>
          </div>

          {/* Password Policy & Account Security */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Password Policy
                </CardTitle>
                <CardDescription>Current password requirements and complexity rules</CardDescription>
              </CardHeader>
              <CardContent>
                {securitySettings ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Minimum Length</Label>
                        <p className="text-lg font-medium">{securitySettings.passwordPolicy.minLength} characters</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Complexity Score</Label>
                        <Badge className={getPasswordStrengthColor(securitySettings.passwordPolicy.complexityScore)}>
                          {securitySettings.passwordPolicy.complexityScore}/10
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Requirements:</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 ${securitySettings.passwordPolicy.requireUppercase ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className="text-sm">Uppercase letters (A-Z)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 ${securitySettings.passwordPolicy.requireLowercase ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className="text-sm">Lowercase letters (a-z)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 ${securitySettings.passwordPolicy.requireNumbers ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className="text-sm">Numbers (0-9)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 ${securitySettings.passwordPolicy.requireSpecialChars ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className="text-sm">Special characters (!@#$%^&*)</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Max Age</Label>
                        <p>{securitySettings.passwordPolicy.maxAge} days</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Prevent Reuse</Label>
                        <p>Last {securitySettings.passwordPolicy.preventReuse} passwords</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">Loading security settings...</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Account Lockout
                </CardTitle>
                <CardDescription>Failed login attempt handling and lockout policies</CardDescription>
              </CardHeader>
              <CardContent>
                {securitySettings ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Max Failed Attempts</Label>
                        <p className="text-lg font-medium">{securitySettings.accountLockout.maxFailedAttempts}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Lockout Duration</Label>
                        <p className="text-lg font-medium">{securitySettings.accountLockout.lockoutDuration} minutes</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Lockout Settings:</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Threshold: {securitySettings.accountLockout.lockoutThreshold} attempts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Unlock: {securitySettings.accountLockout.unlockMethod}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 ${securitySettings.accountLockout.notifyUser ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className="text-sm">Notify user on lockout</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 ${securitySettings.accountLockout.notifyAdmin ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className="text-sm">Notify admin on lockout</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm">
                      <Label className="text-sm font-medium text-gray-600">Session Timeout</Label>
                      <p>{Math.floor(securitySettings.sessionTimeout / 60)} minutes</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">Loading account lockout settings...</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Active Sessions Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>Monitor current user sessions and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userSessions.filter(s => s.isActive).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {session.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{session.userName}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{getDeviceTypeIcon(session.deviceType)} {session.deviceType}</span>
                          <span>•</span>
                          <span>{session.browser}</span>
                          <span>•</span>
                          <span>{session.os}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{session.ipAddress}</div>
                        <div className="text-gray-500">IP Address</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{session.location}</div>
                        <div className="text-gray-500">Location</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{formatSessionDuration(session.loginTime, session.lastActivity)}</div>
                        <div className="text-gray-500">Duration</div>
                      </div>
                      <Badge className={getSessionStatusColor(session.isActive)}>
                        {session.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Access Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Recent Access Activity
              </CardTitle>
              <CardDescription>Latest user actions and security events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accessLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {log.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{log.userName}</span>
                          <Badge className={getActionStatusColor(log.status)}>
                            {log.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {log.action} • {log.resource} • {log.ipAddress}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{log.location}</div>
                        <div className="text-gray-500">Location</div>
                      </div>
                      <div className="text-center">
                        <Badge className={getRiskScoreColor(log.riskScore)}>
                          {getRiskScoreLabel(log.riskScore)} Risk
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* IP Restrictions Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                IP Access Controls
              </CardTitle>
              <CardDescription>Current IP whitelist, blacklist, and geolocation restrictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ipRestrictions.filter(ip => ip.isActive).map((restriction) => (
                  <div key={restriction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge className={getIPRestrictionTypeColor(restriction.type)}>
                        {restriction.type}
                      </Badge>
                      <div>
                        <h3 className="font-medium">{restriction.value}</h3>
                        <p className="text-sm text-gray-600">{restriction.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium">Priority {restriction.priority}</div>
                        <div className="text-gray-500">Priority</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{restriction.createdBy}</div>
                        <div className="text-gray-500">Created By</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(restriction.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

      {/* Create Custom Role Dialog */}
      <Dialog open={showCreateRole} onOpenChange={setShowCreateRole}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Custom Role</DialogTitle>
            <DialogDescription>
              Define a new role with specific permissions and hierarchy
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  placeholder="e.g., Senior Manager, Equipment Specialist"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="parentRole">Parent Role</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select parent role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    {customRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="roleDescription">Description</Label>
              <Textarea
                id="roleDescription"
                placeholder="Describe the role's purpose and responsibilities..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Permissions</Label>
              <div className="mt-2 space-y-4">
                {Array.from(new Set(permissions.map((p) => p.category))).map(
                  (category) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">
                        {category}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {permissions
                          .filter((p) => p.category === category)
                          .map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={permission.id}
                                className="rounded border-gray-300"
                              />
                              <Label
                                htmlFor={permission.id}
                                className="text-sm"
                              >
                                {permission.name}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowCreateRole(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Custom role created successfully!");
                setShowCreateRole(false);
              }}
            >
              Create Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Role Assignment Dialog */}
      <Dialog
        open={showBulkRoleAssignment}
        onOpenChange={setShowBulkRoleAssignment}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Role Assignment</DialogTitle>
            <DialogDescription>
              Assign roles and permissions to multiple users at once
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="bulkRole">Select Role</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a role to assign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  {customRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Select Users</Label>
              <div className="mt-2 max-h-60 overflow-y-auto space-y-2">
                {users?.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`user-${user.id}`}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={`user-${user.id}`} className="text-sm">
                      {user.name} ({user.email})
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="bulkReason">Reason for Assignment</Label>
              <Textarea
                id="bulkReason"
                placeholder="Document the reason for this role assignment..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowBulkRoleAssignment(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Bulk role assignment completed successfully!");
                setShowBulkRoleAssignment(false);
              }}
            >
              Assign Roles
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Permission Audit Dialog */}
      <Dialog open={showPermissionAudit} onOpenChange={setShowPermissionAudit}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Permission Audit Trail</DialogTitle>
            <DialogDescription>
              Complete history of permission changes and role assignments
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="auditSearch">Search Audit Log</Label>
                <Input
                  id="auditSearch"
                  placeholder="Search by user, permission, or action..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="auditFilter">Filter by Action</Label>
                <Select>
                  <SelectTrigger className="mt-1 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="granted">Granted</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                    <SelectItem value="modified">Modified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {permissionAudits.map((audit) => (
                  <div key={audit.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={
                              audit.action === "granted"
                                ? "bg-green-100 text-green-800"
                                : audit.action === "revoked"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {audit.action.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{audit.userName}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-600">
                            {audit.permission}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Role: {audit.role} • Admin: {audit.adminUser}
                        </div>
                        {audit.reason && (
                          <div className="text-sm text-gray-500 mt-1">
                            Reason: {audit.reason}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(audit.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowPermissionAudit(false)}
            >
              Close
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Audit Log
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Details Dialog */}
      <Dialog open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Role Details: {selectedRole?.name}</DialogTitle>
            <DialogDescription>
              Detailed information about permissions and inheritance
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Role Name
                  </Label>
                  <p className="text-lg font-medium">{selectedRole.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Status
                  </Label>
                  <Badge
                    className={
                      selectedRole.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {selectedRole.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Parent Role
                  </Label>
                  <p className="text-lg font-medium">
                    {selectedRole.parentRole || "None"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Users Assigned
                  </Label>
                  <p className="text-lg font-medium">
                    {selectedRole.userCount}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Description
                </Label>
                <p className="text-gray-600">{selectedRole.description}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Permissions ({selectedRole.permissions.length})
                </Label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedRole.permissions.map((permissionId) => (
                    <div
                      key={permissionId}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="text-sm">{permissionId}</span>
                      <Badge variant="outline" className="text-xs">
                        {getPermissionDescription(permissionId)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRole.parentRole && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Inherited Permissions
                    </Label>
                    <div className="mt-2 text-sm text-gray-600">
                      This role inherits permissions from:{" "}
                      <strong>{selectedRole.parentRole}</strong>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  Created:{" "}
                  {new Date(selectedRole.createdAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>
                  Updated:{" "}
                  {new Date(selectedRole.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setSelectedRole(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setEditingRole(selectedRole);
                setSelectedRole(null);
              }}
            >
              Edit Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Security Settings Dialog */}
      <Dialog open={showSecuritySettings} onOpenChange={setShowSecuritySettings}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Security Settings Configuration</DialogTitle>
            <DialogDescription>
              Configure password policies, account lockout, and security features
            </DialogDescription>
          </DialogHeader>
          {securitySettings && (
            <div className="space-y-6">
              {/* Password Policy Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Password Policy</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minLength">Minimum Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={securitySettings.passwordPolicy.minLength}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="complexityScore">Complexity Score</Label>
                    <Input
                      id="complexityScore"
                      type="number"
                      min="1"
                      max="10"
                      value={securitySettings.passwordPolicy.complexityScore}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Password Requirements</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="requireUppercase"
                        checked={securitySettings.passwordPolicy.requireUppercase}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="requireUppercase">Require Uppercase</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="requireLowercase"
                        checked={securitySettings.passwordPolicy.requireLowercase}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="requireLowercase">Require Lowercase</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="requireNumbers"
                        checked={securitySettings.passwordPolicy.requireNumbers}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="requireNumbers">Require Numbers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="requireSpecialChars"
                        checked={securitySettings.passwordPolicy.requireSpecialChars}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxAge">Maximum Age (days)</Label>
                    <Input
                      id="maxAge"
                      type="number"
                      value={securitySettings.passwordPolicy.maxAge}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preventReuse">Prevent Reuse (last N passwords)</Label>
                    <Input
                      id="preventReuse"
                      type="number"
                      value={securitySettings.passwordPolicy.preventReuse}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Account Lockout Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Lockout</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxFailedAttempts">Maximum Failed Attempts</Label>
                    <Input
                      id="maxFailedAttempts"
                      type="number"
                      value={securitySettings.accountLockout.maxFailedAttempts}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                    <Input
                      id="lockoutDuration"
                      type="number"
                      value={securitySettings.accountLockout.lockoutDuration}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lockoutThreshold">Lockout Threshold</Label>
                    <Input
                      id="lockoutThreshold"
                      type="number"
                      value={securitySettings.accountLockout.lockoutThreshold}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unlockMethod">Unlock Method</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="admin">Admin Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Notifications</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="notifyUser"
                        checked={securitySettings.accountLockout.notifyUser}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="notifyUser">Notify User on Lockout</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="notifyAdmin"
                        checked={securitySettings.accountLockout.notifyAdmin}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="notifyAdmin">Notify Admin on Lockout</Label>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* General Security Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">General Security</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={Math.floor(securitySettings.sessionTimeout / 60)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="mfaRequired"
                      checked={securitySettings.mfaRequired}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="mfaRequired">Require Multi-Factor Authentication</Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Monitoring</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="auditLogging"
                        checked={securitySettings.auditLogging}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="auditLogging">Enable Audit Logging</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="realTimeMonitoring"
                        checked={securitySettings.realTimeMonitoring}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="realTimeMonitoring">Enable Real-Time Monitoring</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowSecuritySettings(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success("Security settings updated successfully!");
              setShowSecuritySettings(false);
            }}>
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Session Management Dialog */}
      <Dialog open={showSessionManagement} onOpenChange={setShowSessionManagement}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Session Management</DialogTitle>
            <DialogDescription>
              Monitor and manage active user sessions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={securityTimeRange} onValueChange={setSecurityTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last hour</SelectItem>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => {
                  // Refresh sessions
                }}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                {userSessions.length} total sessions
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {userSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {session.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{session.userName}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{getDeviceTypeIcon(session.deviceType)} {session.deviceType}</span>
                          <span>•</span>
                          <span>{session.browser}</span>
                          <span>•</span>
                          <span>{session.os}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{session.ipAddress}</div>
                        <div className="text-gray-500">IP Address</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{session.location}</div>
                        <div className="text-gray-500">Location</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{formatSessionDuration(session.loginTime, session.lastActivity)}</div>
                        <div className="text-gray-500">Duration</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{new Date(session.loginTime).toLocaleTimeString()}</div>
                        <div className="text-gray-500">Login Time</div>
                      </div>
                      <Badge className={getSessionStatusColor(session.isActive)}>
                        {session.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSession(session)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Terminate session
                            toast.success(`Session terminated for ${session.userName}`);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowSessionManagement(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Sessions
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Access Logs Dialog */}
      <Dialog open={showAccessLogs} onOpenChange={setShowAccessLogs}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Access Logs & Security Events</DialogTitle>
            <DialogDescription>
              Comprehensive view of user actions, security events, and access patterns
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="logSearch">Search Logs</Label>
                <Input
                  id="logSearch"
                  placeholder="Search by user, action, resource, or IP..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="logStatus">Filter by Status</Label>
                <Select>
                  <SelectTrigger className="mt-1 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="logRisk">Filter by Risk</Label>
                <Select>
                  <SelectTrigger className="mt-1 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {accessLogs.map((log) => (
                  <div key={log.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{log.userName}</span>
                          <Badge className={getActionStatusColor(log.status)}>
                            {log.status.toUpperCase()}
                          </Badge>
                          <Badge className={getRiskScoreColor(log.riskScore)}>
                            {getRiskScoreLabel(log.riskScore)} Risk
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Action:</strong> {log.action} • <strong>Resource:</strong> {log.resource}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>IP:</strong> {log.ipAddress} • <strong>Location:</strong> {log.location}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {log.details}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 text-right">
                        <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                        <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowAccessLogs(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* IP Restrictions Dialog */}
      <Dialog open={showIPRestrictions} onOpenChange={setShowIPRestrictions}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>IP Access Control Management</DialogTitle>
            <DialogDescription>
              Configure IP whitelist, blacklist, and geolocation restrictions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Current IP Restrictions</h3>
              <Button onClick={() => {
                // Add new IP restriction
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Restriction
              </Button>
            </div>

            <div className="space-y-4">
              {ipRestrictions.map((restriction) => (
                <div key={restriction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Badge className={getIPRestrictionTypeColor(restriction.type)}>
                      {restriction.type}
                    </Badge>
                    <div>
                      <h3 className="font-medium">{restriction.value}</h3>
                      <p className="text-sm text-gray-600">{restriction.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium">Priority {restriction.priority}</div>
                      <div className="text-gray-500">Priority</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{restriction.createdBy}</div>
                      <div className="text-gray-500">Created By</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(restriction.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Edit restriction
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Toggle active status
                          toast.success(`IP restriction ${restriction.isActive ? 'deactivated' : 'activated'}`);
                        }}
                      >
                        {restriction.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowIPRestrictions(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Rules
            </Button>
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
