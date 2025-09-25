import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Settings, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GlobalSearch from "@/components/common/GlobalSearch";
import BreadcrumbNav from "@/components/common/BreadcrumbNav";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutUser } from "@/redux/slices/auth/loginSlice";
import { logout as logoutMember } from "@/redux/slices/members/loginSlice";
import { toast } from "react-hot-toast";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showBreadcrumbs?: boolean;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title = "Dashboard",
  subtitle = "Welcome to Gym Management System",
  showSearch = true,
  showBreadcrumbs = true,
  onMenuToggle,
  isMenuOpen = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notifications] = useState(3); // Mock notification count

  // Get user data from Redux
  const user = useSelector((state: any) => state.loginSlice.data.user);
  const member = useSelector(
    (state: any) => state.loginMemberSlice.data.member
  );
  const currentUser = user || member;
  const isMember = !!member;

  const handleLogout = () => {
    if (isMember) {
      dispatch(logoutMember());
    } else {
      dispatch(logoutUser());
    }
    navigate("/");
    toast.success("Logged out successfully");
  };

  const handleProfileClick = () => {
    if (isMember) {
      navigate("/members/profile");
    } else {
      navigate("/admin/settings");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            {onMenuToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuToggle}
                className="lg:hidden"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}

            {/* Title Section */}
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              {showBreadcrumbs && (
                <BreadcrumbNav className="hidden sm:block mt-1" />
              )}
            </div>
          </div>

          {/* Center Section - Global Search */}
          {showSearch && (
            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <GlobalSearch placeholder="Search members, payments, equipment..." />
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search */}
            {showSearch && (
              <div className="md:hidden">
                <GlobalSearch className="w-32" />
              </div>
            )}

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-4 text-center text-sm text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No new notifications</p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser?.profile_picture} />
                    <AvatarFallback>
                      {currentUser?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {currentUser?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isMember ? "Member" : "Admin"}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {currentUser?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentUser?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Breadcrumbs */}
        {showBreadcrumbs && (
          <div className="pb-4 md:hidden">
            <BreadcrumbNav />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
