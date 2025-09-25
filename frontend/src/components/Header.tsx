import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Settings,
  User,
  Menu,
  X,
  LogOut,
  Keyboard,
  HelpCircle,
  Home,
  Search,
} from "lucide-react";
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
import NotificationPanel from "@/components/common/NotificationPanel";
import KeyboardShortcutsHelp from "@/components/common/KeyboardShortcutsHelp";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutUser } from "@/redux/slices/auth/loginSlice";
import { logout as logoutMember } from "@/redux/slices/members/loginSlice";
import { toast } from "react-hot-toast";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

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
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

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
    <header
      className={`sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200 backdrop-blur-sm bg-white/95 transition-all duration-300 ${
        isMenuOpen ? "hidden" : "block"
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Brand & Navigation */}
          <div className="flex items-center space-x-6">
            {/* Menu Toggle Button - Always Visible */}
            {onMenuToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuToggle}
                className="hover:bg-gray-100 border border-gray-200"
                title={isMenuOpen ? "Close Sidebar" : "Open Sidebar"}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}

            {/* Brand/Title Section */}
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 hidden sm:block">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Breadcrumbs - Desktop */}
            {showBreadcrumbs && (
              <div className="hidden lg:block">
                <BreadcrumbNav />
              </div>
            )}
          </div>

          {/* Center Section - Search */}
          {showSearch && (
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <GlobalSearch
                  placeholder="Search members, payments, equipment..."
                  className="pl-10 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Right Section - Actions & Profile */}
          <div className="flex items-center space-x-1">
            {/* Mobile Search */}
            {showSearch && (
              <div className="md:hidden mr-2">
                <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Home Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/dashboard")}
              className="hover:bg-gray-100 transition-colors"
              title="Go to Dashboard"
            >
              <Home className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <NotificationPanel />

            {/* Keyboard Shortcuts Help */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowKeyboardHelp(true)}
              title="Keyboard Shortcuts (Ctrl+?)"
              className="hover:bg-gray-100 transition-colors"
            >
              <Keyboard className="h-5 w-5" />
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/settings")}
              className="hover:bg-gray-100 transition-colors"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 transition-colors rounded-lg"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-gray-200">
                    <AvatarImage src={currentUser?.profile_picture} />
                    <AvatarFallback className="bg-blue-500 text-white font-semibold">
                      {currentUser?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {currentUser?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isMember ? "Member" : "Administrator"}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 shadow-xl border-gray-200"
              >
                <DropdownMenuLabel className="px-4 py-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {currentUser?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentUser?.email}
                    </p>
                    <Badge variant="secondary" className="w-fit mt-1">
                      {isMember ? "Member" : "Administrator"}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleProfileClick}
                  className="px-4 py-2 hover:bg-gray-50"
                >
                  <User className="mr-3 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/admin/settings")}
                  className="px-4 py-2 hover:bg-gray-50"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  <span>System Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Breadcrumbs */}
        {showBreadcrumbs && (
          <div className="pb-4 md:hidden border-t border-gray-200 pt-4">
            <BreadcrumbNav />
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Help Dialog */}
      <KeyboardShortcutsHelp
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />
    </header>
  );
};

export default Header;
