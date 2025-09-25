import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Users,
  Dumbbell,
  CreditCard,
  Activity,
  Settings,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  className?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
      badge: null,
    },
    {
      name: "Members",
      href: "/admin/members",
      icon: Users,
      badge: null,
    },
    {
      name: "Equipment",
      href: "/admin/equipments",
      icon: Dumbbell,
      badge: null,
    },
    {
      name: "Payments",
      href: "/admin/payments",
      icon: CreditCard,
      badge: null,
    },
    {
      name: "Attendance",
      href: "/admin/attendance",
      icon: Activity,
      badge: null,
    },
    {
      name: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
      badge: null,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      badge: null,
    },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  const isActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  return (
    <div className={cn("lg:hidden", className)}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="text-left">Gym Management</SheetTitle>
          </SheetHeader>

          <nav className="mt-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-12",
                    isActive(item.href) && "bg-primary/10 text-primary"
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </nav>

          {/* Mobile-specific actions */}
          <div className="mt-8 pt-6 border-t">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  navigate("/admin/members/register");
                  setIsOpen(false);
                }}
              >
                <Users className="mr-3 h-4 w-4" />
                Add Member
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  navigate("/admin/equipments");
                  setIsOpen(false);
                }}
              >
                <Dumbbell className="mr-3 h-4 w-4" />
                Manage Equipment
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
