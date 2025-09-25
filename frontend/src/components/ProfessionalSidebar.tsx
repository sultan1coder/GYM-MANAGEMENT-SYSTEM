import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  UserPlus,
  UserCheck,
  Dumbbell,
  Wrench,
  CreditCard,
  DollarSign,
  Clock,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Building2,
  Calendar,
  Activity,
  Shield,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutUser } from "@/redux/slices/auth/loginSlice";
import { logout as logoutMember } from "@/redux/slices/members/loginSlice";
import { toast } from "react-hot-toast";
import { useSidebar } from "@/contexts/SidebarContext";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  badge?: string;
  children?: MenuItem[];
}

interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

const ProfessionalSidebar: React.FC = () => {
  const { isOpen, toggleSidebar, closeSidebar } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  const dispatch = useDispatch();

  // Get user data from Redux
  const user = useSelector((state: any) => state.loginSlice.data.user);
  const member = useSelector(
    (state: any) => state.loginMemberSlice.data.member
  );
  const currentUser = user || member;
  const isMember = !!member;

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleLogout = () => {
    if (isMember) {
      dispatch(logoutMember());
    } else {
      dispatch(logoutUser());
    }
    toast.success("Logged out successfully");
  };

  // Professional menu structure with dropdowns and sub-dropdowns
  const menuSections: MenuSection[] = [
    {
      id: "dashboard",
      title: "Overview",
      items: [
        {
          id: "dashboard-main",
          label: "Dashboard",
          icon: <Home className="w-5 h-5" />,
          path: "/admin/dashboard",
        },
      ],
    },
    {
      id: "members",
      title: "Member Management",
      items: [
        {
          id: "members-overview",
          label: "All Members",
          icon: <Users className="w-5 h-5" />,
          path: "/admin/members",
          badge: "245",
        },
        {
          id: "member-actions",
          label: "Member Actions",
          icon: <UserPlus className="w-5 h-5" />,
          children: [
            {
              id: "new-member",
              label: "Add New Member",
              icon: <UserPlus className="w-4 h-4" />,
              path: "/admin/members/new",
            },
            {
              id: "expiring-members",
              label: "Expiring Members",
              icon: <Clock className="w-4 h-4" />,
              path: "/admin/members/expiring",
              badge: "12",
            },
            {
              id: "member-approvals",
              label: "Pending Approvals",
              icon: <UserCheck className="w-4 h-4" />,
              path: "/admin/users/approvals",
              badge: "3",
            },
          ],
        },
      ],
    },
    {
      id: "equipment",
      title: "Equipment & Facilities",
      items: [
        {
          id: "equipment-overview",
          label: "Equipment List",
          icon: <Dumbbell className="w-5 h-5" />,
          path: "/admin/equipments",
        },
        {
          id: "equipment-management",
          label: "Equipment Management",
          icon: <Wrench className="w-5 h-5" />,
          children: [
            {
              id: "add-equipment",
              label: "Add Equipment",
              icon: <Dumbbell className="w-4 h-4" />,
              path: "/admin/equipment/new",
            },
            {
              id: "maintenance",
              label: "Maintenance Schedule",
              icon: <Wrench className="w-4 h-4" />,
              path: "/admin/equipment/maintenance",
            },
          ],
        },
      ],
    },
    {
      id: "financial",
      title: "Financial Management",
      items: [
        {
          id: "payments-overview",
          label: "Payments",
          icon: <CreditCard className="w-5 h-5" />,
          path: "/admin/payments",
        },
        {
          id: "subscriptions",
          label: "Subscriptions",
          icon: <DollarSign className="w-5 h-5" />,
          path: "/admin/subscriptions",
        },
        {
          id: "financial-actions",
          label: "Financial Actions",
          icon: <DollarSign className="w-5 h-5" />,
          children: [
            {
              id: "new-payment",
              label: "Record Payment",
              icon: <CreditCard className="w-4 h-4" />,
              path: "/admin/payments/new",
            },
            {
              id: "pending-payments",
              label: "Pending Payments",
              icon: <Clock className="w-4 h-4" />,
              path: "/admin/payments/pending",
              badge: "8",
            },
          ],
        },
      ],
    },
    {
      id: "operations",
      title: "Operations",
      items: [
        {
          id: "attendance",
          label: "Attendance",
          icon: <Calendar className="w-5 h-5" />,
          path: "/admin/attendance",
        },
        {
          id: "workouts",
          label: "Workout Plans",
          icon: <Activity className="w-5 h-5" />,
          path: "/admin/workouts",
        },
      ],
    },
    {
      id: "reports",
      title: "Reports & Analytics",
      items: [
        {
          id: "reports-overview",
          label: "All Reports",
          icon: <BarChart3 className="w-5 h-5" />,
          path: "/admin/reports",
        },
        {
          id: "report-categories",
          label: "Report Categories",
          icon: <FileText className="w-5 h-5" />,
          children: [
            {
              id: "member-reports",
              label: "Member Reports",
              icon: <Users className="w-4 h-4" />,
              path: "/admin/reports/members",
            },
            {
              id: "financial-reports",
              label: "Financial Reports",
              icon: <DollarSign className="w-4 h-4" />,
              path: "/admin/reports/financial",
            },
            {
              id: "export-data",
              label: "Export Data",
              icon: <FileText className="w-4 h-4" />,
              path: "/admin/export",
            },
          ],
        },
      ],
    },
    {
      id: "system",
      title: "System",
      items: [
        {
          id: "settings",
          label: "Settings",
          icon: <Settings className="w-5 h-5" />,
          path: "/admin/settings",
        },
        {
          id: "user-management",
          label: "User Management",
          icon: <Shield className="w-5 h-5" />,
          children: [
            {
              id: "all-users",
              label: "All Users",
              icon: <Users className="w-4 h-4" />,
              path: "/admin/users",
            },
            {
              id: "add-user",
              label: "Add User",
              icon: <UserPlus className="w-4 h-4" />,
              path: "/admin/users/new",
            },
          ],
        },
      ],
    },
  ];

  const isItemActive = (item: MenuItem): boolean => {
    if (item.path && location.pathname === item.path) return true;
    if (item.children) {
      return item.children.some(
        (child) => child.path && location.pathname === child.path
      );
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = isItemActive(item);

    return (
      <div key={item.id}>
        <div
          className={cn(
            "flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer group",
            level === 0 ? "mx-2" : "mx-4",
            isActive
              ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          )}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else if (item.path) {
              // Navigation will be handled by Link
            }
          }}
        >
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                "flex-shrink-0",
                isActive
                  ? "text-blue-600"
                  : "text-gray-500 group-hover:text-gray-700"
              )}
            >
              {item.icon}
            </div>
            {item.path ? (
              <Link
                to={item.path}
                className="flex-1 text-sm font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {item.label}
              </Link>
            ) : (
              <span className="flex-1 text-sm font-medium">{item.label}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {item.badge && (
              <Badge variant="secondary" className="text-xs">
                {item.badge}
              </Badge>
            )}
            {hasChildren && (
              <div className="text-gray-400">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sub-menu items */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen w-80 bg-white shadow-xl border-r border-gray-200 transition-all duration-300 ease-in-out z-40 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Gym Management
                </h2>
                <p className="text-sm text-gray-500">Professional Dashboard</p>
              </div>
            </div>
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSidebar}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 min-h-0 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          <nav className="px-2 space-y-6">
            {menuSections.map((section) => (
              <div key={section.id}>
                <h3 className="px-4 mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => renderMenuItem(item))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Profile & Actions - Fixed */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="flex items-center mb-4 space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full">
              <span className="text-sm font-semibold text-white">
                {currentUser?.name?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {isMember ? "Member" : "Administrator"}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="justify-start w-full text-gray-700 hover:bg-gray-100"
              onClick={() => {
                /* Navigate to help */
              }}
            >
              <HelpCircle className="w-4 h-4 mr-3" />
              Help & Support
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start w-full text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
        />
      )}
    </>
  );
};

export default ProfessionalSidebar;
