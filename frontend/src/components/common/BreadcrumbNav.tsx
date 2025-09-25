import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronRight,
  Home,
  Users,
  Dumbbell,
  CreditCard,
  Settings,
  FileText,
  Calendar,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbNavProps {
  className?: string;
  customItems?: BreadcrumbItem[];
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  className,
  customItems,
}) => {
  const location = useLocation();

  // Icon mapping for different routes
  const getIconForPath = (path: string) => {
    if (path.includes("/dashboard")) return <Home className="w-4 h-4" />;
    if (path.includes("/members")) return <Users className="w-4 h-4" />;
    if (path.includes("/equipments") || path.includes("/equipment"))
      return <Dumbbell className="w-4 h-4" />;
    if (path.includes("/payments")) return <CreditCard className="w-4 h-4" />;
    if (path.includes("/attendance")) return <Activity className="w-4 h-4" />;
    if (path.includes("/reports")) return <FileText className="w-4 h-4" />;
    if (path.includes("/settings")) return <Settings className="w-4 h-4" />;
    if (path.includes("/subscriptions"))
      return <Calendar className="w-4 h-4" />;
    return null;
  };

  // Generate breadcrumb items from current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;

    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always start with home
    breadcrumbs.push({
      label: "Home",
      href: "/",
      icon: <Home className="w-4 h-4" />,
    });

    // Build breadcrumbs from path segments
    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Skip certain segments that don't need breadcrumbs
      if (["admin", "auth"].includes(segment)) return;

      // Convert segment to readable label
      let label = segment;
      if (segment === "dashboard") label = "Dashboard";
      else if (segment === "members") label = "Members";
      else if (segment === "equipments" || segment === "equipment")
        label = "Equipment";
      else if (segment === "payments") label = "Payments";
      else if (segment === "attendance") label = "Attendance";
      else if (segment === "reports") label = "Reports";
      else if (segment === "settings") label = "Settings";
      else if (segment === "subscriptions") label = "Subscriptions";
      else if (segment === "profile") label = "Profile";
      else if (segment === "login") label = "Login";
      else if (segment === "register") label = "Register";
      else if (segment === "new") label = "New";
      else if (segment === "edit") label = "Edit";
      else if (segment === "manage") label = "Manage";
      else if (segment === "all") label = "All";
      else if (segment === "single") label = "Details";
      else if (segment === "update") label = "Update";
      else if (segment === "expiring") label = "Expiring";
      else if (segment === "pending") label = "Pending";
      else if (segment === "maintenance") label = "Maintenance";
      else if (segment === "financial") label = "Financial";
      else if (segment === "health") label = "Health";
      else if (segment === "backup") label = "Backup";
      else if (segment === "permissions") label = "Permissions";
      else if (segment === "logs") label = "Logs";
      else if (segment === "analytics") label = "Analytics";
      else if (segment === "communications") label = "Communications";
      else if (segment === "notifications") label = "Notifications";
      else {
        // Capitalize first letter and replace hyphens with spaces
        label =
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      }

      // Don't add href for the last segment (current page)
      const isLast = index === pathSegments.length - 1;

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        icon: getIconForPath(currentPath),
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav
      className={cn(
        "flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400",
        className
      )}
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />}
          <div className="flex items-center space-x-1">
            {item.icon && (
              <span className="text-gray-500 dark:text-gray-400">
                {item.icon}
              </span>
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 dark:text-white font-semibold">
                {item.label}
              </span>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNav;
