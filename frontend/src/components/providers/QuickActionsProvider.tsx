import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  Plus,
  Eye,
  Edit,
  Trash2,
  Dumbbell,
  AlertTriangle,
  CreditCard,
  Clock,
  Settings,
  Database,
  Calendar,
  BarChart3,
  FileText,
  Upload,
  Download,
  Shield,
  Activity,
} from "lucide-react";

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category:
    | "users"
    | "equipment"
    | "payments"
    | "members"
    | "system"
    | "reports"
    | "settings";
  action: () => void;
  status?: "active" | "warning" | "error";
  count?: number;
  priority?: "high" | "medium" | "low";
  isFavorite?: boolean;
  requiresPermission?: string;
}

interface QuickActionsContextType {
  quickActions: QuickAction[];
  toggleFavorite: (actionId: string) => void;
  getActionsByCategory: (category: string) => QuickAction[];
  getFavoriteActions: () => QuickAction[];
  getHighPriorityActions: () => QuickAction[];
}

const QuickActionsContext = createContext<QuickActionsContextType | undefined>(
  undefined
);

export const useQuickActions = () => {
  const context = useContext(QuickActionsContext);
  if (!context) {
    throw new Error(
      "useQuickActions must be used within a QuickActionsProvider"
    );
  }
  return context;
};

interface QuickActionsProviderProps {
  children: ReactNode;
}

export const QuickActionsProvider: React.FC<QuickActionsProviderProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const quickActions: QuickAction[] = [
    // User Management
    {
      id: "add-user",
      title: "Add New User",
      description: "Create new admin or staff account",
      icon: <Users className="w-6 h-6" />,
      category: "users",
      action: () => handleNavigate("/admin/users/new"),
      status: "active",
      priority: "medium",
      isFavorite: true,
      requiresPermission: "user.create",
    },
    {
      id: "manage-users",
      title: "Manage Users",
      description: "View and edit user accounts",
      icon: <Eye className="w-6 h-6" />,
      category: "users",
      action: () => handleNavigate("/admin/users"),
      status: "active",
      priority: "high",
      isFavorite: true,
      count: 25,
      requiresPermission: "user.read",
    },
    {
      id: "user-approvals",
      title: "Pending Approvals",
      description: "Review user registration requests",
      icon: <Clock className="w-6 h-6" />,
      category: "users",
      action: () => handleNavigate("/admin/users/approvals"),
      status: "warning",
      priority: "high",
      isFavorite: false,
      count: 3,
      requiresPermission: "user.approve",
    },

    // Equipment Management
    {
      id: "add-equipment",
      title: "Add Equipment",
      description: "Register new gym equipment",
      icon: <Plus className="w-6 h-6" />,
      category: "equipment",
      action: () => handleNavigate("/admin/equipment/new"),
      status: "active",
      priority: "medium",
      isFavorite: true,
      requiresPermission: "equipment.create",
    },
    {
      id: "equipment-status",
      title: "Equipment Status",
      description: "Monitor equipment health",
      icon: <Dumbbell className="w-6 h-6" />,
      category: "equipment",
      action: () => handleNavigate("/admin/equipment"),
      status: "active",
      priority: "high",
      isFavorite: true,
      count: 45,
      requiresPermission: "equipment.read",
    },
    {
      id: "maintenance-alerts",
      title: "Maintenance Alerts",
      description: "Equipment requiring attention",
      icon: <AlertTriangle className="w-6 h-6" />,
      category: "equipment",
      action: () => handleNavigate("/admin/equipment/maintenance"),
      status: "warning",
      priority: "high",
      isFavorite: true,
      count: 2,
      requiresPermission: "equipment.maintain",
    },

    // Payment Management
    {
      id: "create-payment",
      title: "Create Payment",
      description: "Record new payment transaction",
      icon: <Plus className="w-6 h-6" />,
      category: "payments",
      action: () => handleNavigate("/admin/payments/new"),
      status: "active",
      priority: "high",
      isFavorite: true,
      requiresPermission: "payment.create",
    },
    {
      id: "payment-overview",
      title: "Payment Overview",
      description: "View all payment records",
      icon: <CreditCard className="w-6 h-6" />,
      category: "payments",
      action: () => handleNavigate("/admin/payments"),
      status: "active",
      priority: "high",
      isFavorite: true,
      count: 89,
      requiresPermission: "payment.read",
    },
    {
      id: "pending-payments",
      title: "Pending Payments",
      description: "Review pending transactions",
      icon: <Clock className="w-6 h-6" />,
      category: "payments",
      action: () => handleNavigate("/admin/payments/pending"),
      status: "warning",
      priority: "medium",
      isFavorite: false,
      count: 12,
      requiresPermission: "payment.read",
    },

    // Member Management
    {
      id: "add-member",
      title: "Add Member",
      description: "Register new gym member",
      icon: <Plus className="w-6 h-6" />,
      category: "members",
      action: () => handleNavigate("/admin/members/new"),
      status: "active",
      priority: "high",
      isFavorite: true,
      requiresPermission: "member.create",
    },
    {
      id: "member-overview",
      title: "Member Overview",
      description: "Manage all members",
      icon: <UserCheck className="w-6 h-6" />,
      category: "members",
      action: () => handleNavigate("/admin/members"),
      status: "active",
      priority: "high",
      isFavorite: true,
      count: 150,
      requiresPermission: "member.read",
    },
    {
      id: "expiring-memberships",
      title: "Expiring Memberships",
      description: "Memberships ending soon",
      icon: <Calendar className="w-6 h-6" />,
      category: "members",
      action: () => handleNavigate("/admin/members/expiring"),
      status: "warning",
      priority: "medium",
      isFavorite: false,
      count: 8,
      requiresPermission: "member.read",
    },

    // Reports & Analytics
    {
      id: "member-reports",
      title: "Member Reports",
      description: "Generate member analytics",
      icon: <BarChart3 className="w-6 h-6" />,
      category: "reports",
      action: () => handleNavigate("/admin/reports/members"),
      status: "active",
      priority: "medium",
      isFavorite: true,
      requiresPermission: "report.read",
    },
    {
      id: "financial-reports",
      title: "Financial Reports",
      description: "View revenue and payment reports",
      icon: <FileText className="w-6 h-6" />,
      category: "reports",
      action: () => handleNavigate("/admin/reports/financial"),
      status: "active",
      priority: "high",
      isFavorite: true,
      requiresPermission: "report.financial",
    },
    {
      id: "export-data",
      title: "Export Data",
      description: "Export data to CSV/Excel",
      icon: <Download className="w-6 h-6" />,
      category: "reports",
      action: () => handleNavigate("/admin/export"),
      status: "active",
      priority: "low",
      isFavorite: false,
      requiresPermission: "data.export",
    },

    // System Management
    {
      id: "system-settings",
      title: "System Settings",
      description: "Configure gym system",
      icon: <Settings className="w-6 h-6" />,
      category: "settings",
      action: () => handleNavigate("/admin/settings"),
      status: "active",
      priority: "low",
      isFavorite: false,
      requiresPermission: "system.settings",
    },
    {
      id: "system-health",
      title: "System Health",
      description: "Monitor system performance",
      icon: <Database className="w-6 h-6" />,
      category: "system",
      action: () => handleNavigate("/admin/health"),
      status: "active",
      priority: "medium",
      isFavorite: true,
      requiresPermission: "system.monitor",
    },
    {
      id: "backup-restore",
      title: "Backup & Restore",
      description: "System backup operations",
      icon: <Database className="w-6 h-6" />,
      category: "system",
      action: () => handleNavigate("/admin/backup"),
      status: "active",
      priority: "medium",
      isFavorite: false,
      requiresPermission: "system.backup",
    },
    {
      id: "user-permissions",
      title: "User Permissions",
      description: "Manage user roles and permissions",
      icon: <Shield className="w-6 h-6" />,
      category: "settings",
      action: () => handleNavigate("/admin/permissions"),
      status: "active",
      priority: "high",
      isFavorite: true,
      requiresPermission: "user.permissions",
    },
    {
      id: "activity-logs",
      title: "Activity Logs",
      description: "View system activity logs",
      icon: <Activity className="w-6 h-6" />,
      category: "system",
      action: () => handleNavigate("/admin/logs"),
      status: "active",
      priority: "low",
      isFavorite: false,
      requiresPermission: "system.logs",
    },
  ];

  const toggleFavorite = (actionId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(actionId)) {
      newFavorites.delete(actionId);
    } else {
      newFavorites.add(actionId);
    }
    setFavorites(newFavorites);
  };

  const getActionsByCategory = (category: string) => {
    return quickActions.filter((action) => action.category === category);
  };

  const getFavoriteActions = () => {
    return quickActions.filter((action) => favorites.has(action.id));
  };

  const getHighPriorityActions = () => {
    return quickActions.filter((action) => action.priority === "high");
  };

  const value: QuickActionsContextType = {
    quickActions,
    toggleFavorite,
    getActionsByCategory,
    getFavoriteActions,
    getHighPriorityActions,
  };

  return (
    <QuickActionsContext.Provider value={value}>
      {children}
    </QuickActionsContext.Provider>
  );
};
