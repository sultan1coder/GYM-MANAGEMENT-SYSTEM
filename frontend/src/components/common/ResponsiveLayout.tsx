import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: "container" | "full" | "sidebar";
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className,
  variant = "container",
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "container":
        return "container mx-auto px-4 sm:px-6 lg:px-8";
      case "full":
        return "w-full px-4 sm:px-6 lg:px-8";
      case "sidebar":
        return "flex flex-col lg:flex-row gap-6";
      default:
        return "container mx-auto px-4 sm:px-6 lg:px-8";
    }
  };

  return <div className={cn(getVariantClasses(), className)}>{children}</div>;
};

export default ResponsiveLayout;
