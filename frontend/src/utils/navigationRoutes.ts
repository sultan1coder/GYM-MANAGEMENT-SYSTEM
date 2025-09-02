import {
  Users,
  UserPlus,
  Dumbbell,
  CreditCard,
  Calendar,
  BarChart3,
  Settings,
  Shield,
  Activity,
  FileText,
  Database,
  Bell,
  Mail,
  Smartphone,
} from "lucide-react";

export interface NavigationRoute {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: any;
  category: string;
  badge?: string;
  isImplemented: boolean;
  requiresPermission?: string;
  subRoutes?: NavigationRoute[];
}

export const navigationRoutes: NavigationRoute[] = [
  // User Management
  {
    id: "user-management",
    title: "User Management",
    description: "Manage admin and staff accounts",
    path: "/admin/users",
    icon: Users,
    category: "Administration",
    badge: "25 users",
    isImplemented: true,
    requiresPermission: "user.read",
    subRoutes: [
      {
        id: "user-list",
        title: "All Users",
        description: "View all users",
        path: "/admin/users",
        icon: Users,
        category: "Administration",
        isImplemented: true,
      },
      {
        id: "user-create",
        title: "Add User",
        description: "Create new user",
        path: "/admin/users/create",
        icon: UserPlus,
        category: "Administration",
        isImplemented: true,
      },
      {
        id: "user-roles",
        title: "User Roles",
        description: "Manage user roles",
        path: "/admin/users/roles",
        icon: Shield,
        category: "Administration",
        isImplemented: false, // TODO: Implement
      },
    ],
  },

  // Member Management
  {
    id: "member-management",
    title: "Member Management",
    description: "Manage gym members and memberships",
    path: "/admin/members",
    icon: Users,
    category: "Members",
    badge: "150+ members",
    isImplemented: true,
    requiresPermission: "member.read",
    subRoutes: [
      {
        id: "member-list",
        title: "All Members",
        description: "View all members",
        path: "/admin/members",
        icon: Users,
        category: "Members",
        isImplemented: true,
      },
      {
        id: "member-register",
        title: "Register Member",
        description: "Add new member",
        path: "/members/register",
        icon: UserPlus,
        category: "Members",
        isImplemented: true,
      },
      {
        id: "member-import",
        title: "Import Members",
        description: "Bulk import members",
        path: "/admin/members/import",
        icon: Database,
        category: "Members",
        isImplemented: false, // TODO: Create import page
      },
    ],
  },

  // Equipment Management
  {
    id: "equipment-management",
    title: "Equipment Management",
    description: "Monitor and maintain gym equipment",
    path: "/admin/equipments",
    icon: Dumbbell,
    category: "Operations",
    badge: "45 items",
    isImplemented: true,
    requiresPermission: "equipment.read",
    subRoutes: [
      {
        id: "equipment-list",
        title: "All Equipment",
        description: "View all equipment",
        path: "/admin/equipments",
        icon: Dumbbell,
        category: "Operations",
        isImplemented: true,
      },
      {
        id: "equipment-add",
        title: "Add Equipment",
        description: "Add new equipment",
        path: "/admin/equipments/add",
        icon: UserPlus,
        category: "Operations",
        isImplemented: true,
      },
      {
        id: "equipment-maintenance",
        title: "Maintenance Schedule",
        description: "Equipment maintenance",
        path: "/admin/equipments/maintenance",
        icon: Settings,
        category: "Operations",
        isImplemented: false, // TODO: Create maintenance page
      },
    ],
  },

  // Payment Management
  {
    id: "payment-management",
    title: "Payment Management",
    description: "Handle payments and subscriptions",
    path: "/admin/payments",
    icon: CreditCard,
    category: "Finance",
    badge: "Active",
    isImplemented: true,
    requiresPermission: "payment.read",
    subRoutes: [
      {
        id: "payment-list",
        title: "All Payments",
        description: "View all payments",
        path: "/admin/payments",
        icon: CreditCard,
        category: "Finance",
        isImplemented: true,
      },
      {
        id: "payment-create",
        title: "Create Payment",
        description: "Record new payment",
        path: "/admin/payments/create",
        icon: UserPlus,
        category: "Finance",
        isImplemented: true,
      },
      {
        id: "payment-reports",
        title: "Payment Reports",
        description: "Financial reports",
        path: "/admin/payments/reports",
        icon: BarChart3,
        category: "Finance",
        isImplemented: true,
      },
    ],
  },

  // Attendance Tracking
  {
    id: "attendance-tracking",
    title: "Attendance Tracking",
    description: "Monitor member check-ins and activity",
    path: "/admin/attendance",
    icon: Calendar,
    category: "Operations",
    badge: "Real-time",
    isImplemented: false, // TODO: Implement attendance system
    requiresPermission: "attendance.read",
  },

  // Reports & Analytics
  {
    id: "reports-analytics",
    title: "Reports & Analytics",
    description: "View detailed reports and insights",
    path: "/admin/reports",
    icon: BarChart3,
    category: "Analytics",
    badge: "Updated",
    isImplemented: true,
    requiresPermission: "report.read",
    subRoutes: [
      {
        id: "reports-dashboard",
        title: "Analytics Dashboard",
        description: "Main analytics view",
        path: "/admin/reports",
        icon: BarChart3,
        category: "Analytics",
        isImplemented: true,
      },
      {
        id: "reports-members",
        title: "Member Reports",
        description: "Member analytics",
        path: "/admin/reports/members",
        icon: Users,
        category: "Analytics",
        isImplemented: false, // TODO: Create member reports page
      },
      {
        id: "reports-financial",
        title: "Financial Reports",
        description: "Revenue analytics",
        path: "/admin/reports/financial",
        icon: CreditCard,
        category: "Analytics",
        isImplemented: false, // TODO: Create financial reports page
      },
    ],
  },

  // System Settings
  {
    id: "system-settings",
    title: "System Settings",
    description: "Configure system preferences",
    path: "/admin/settings",
    icon: Settings,
    category: "Administration",
    badge: "Config",
    isImplemented: false, // TODO: Create settings page
    requiresPermission: "system.settings",
    subRoutes: [
      {
        id: "settings-general",
        title: "General Settings",
        description: "System configuration",
        path: "/admin/settings/general",
        icon: Settings,
        category: "Administration",
        isImplemented: false,
      },
      {
        id: "settings-notifications",
        title: "Notifications",
        description: "Notification settings",
        path: "/admin/settings/notifications",
        icon: Bell,
        category: "Administration",
        isImplemented: false,
      },
      {
        id: "settings-integrations",
        title: "Integrations",
        description: "Third-party integrations",
        path: "/admin/settings/integrations",
        icon: Database,
        category: "Administration",
        isImplemented: false,
      },
    ],
  },

  // System Health
  {
    id: "system-health",
    title: "System Health",
    description: "Monitor system performance",
    path: "/admin/health",
    icon: Activity,
    category: "Operations",
    badge: "Live",
    isImplemented: false, // TODO: Create dedicated health page
    requiresPermission: "system.monitor",
  },

  // Backup & Restore
  {
    id: "backup-restore",
    title: "Backup & Restore",
    description: "System backup operations",
    path: "/admin/backup",
    icon: Database,
    category: "Administration",
    badge: "Critical",
    isImplemented: false, // TODO: Create backup page
    requiresPermission: "system.backup",
  },

  // Communication Center
  {
    id: "communication-center",
    title: "Communication Center",
    description: "Manage member communications",
    path: "/admin/communications",
    icon: Mail,
    category: "Communication",
    badge: "New",
    isImplemented: false, // TODO: Create communication center
    requiresPermission: "communication.manage",
    subRoutes: [
      {
        id: "comm-email",
        title: "Email Campaigns",
        description: "Email marketing",
        path: "/admin/communications/email",
        icon: Mail,
        category: "Communication",
        isImplemented: false,
      },
      {
        id: "comm-sms",
        title: "SMS Notifications",
        description: "Text messaging",
        path: "/admin/communications/sms",
        icon: Smartphone,
        category: "Communication",
        isImplemented: false,
      },
      {
        id: "comm-templates",
        title: "Message Templates",
        description: "Communication templates",
        path: "/admin/communications/templates",
        icon: FileText,
        category: "Communication",
        isImplemented: false,
      },
    ],
  },
];

// Utility functions
export const getImplementedRoutes = () =>
  navigationRoutes.filter((route) => route.isImplemented);
export const getUnimplementedRoutes = () =>
  navigationRoutes.filter((route) => !route.isImplemented);
export const getRoutesByCategory = (category: string) =>
  navigationRoutes.filter((route) => route.category === category);
export const getRouteById = (id: string): NavigationRoute | undefined => {
  for (const route of navigationRoutes) {
    if (route.id === id) return route;
    if (route.subRoutes) {
      const subRoute = route.subRoutes.find((sub) => sub.id === id);
      if (subRoute) return subRoute;
    }
  }
  return undefined;
};

// Route validation
export const validateRoute = (path: string): boolean => {
  const allRoutes = navigationRoutes.flatMap((route) => [
    route,
    ...(route.subRoutes || []),
  ]);

  const matchingRoute = allRoutes.find((route) => route.path === path);
  return matchingRoute?.isImplemented || false;
};

export default navigationRoutes;
