import React, { createContext, useContext, useEffect, useState } from "react";
import {
  FOCUS_VISIBLE,
  MOTION_PREFERENCES,
  HIGH_CONTRAST,
} from "@/utils/accessibility";

interface AccessibilityContextType {
  // Motion preferences
  prefersReducedMotion: boolean;

  // High contrast mode
  highContrastEnabled: boolean;

  // Focus management
  focusVisible: boolean;

  // Screen reader announcements
  announce: (message: string, priority?: "polite" | "assertive") => void;

  // Keyboard navigation
  isKeyboardUser: boolean;

  // Color scheme preferences
  colorScheme: "light" | "dark" | "auto";

  // Font size preferences
  fontSize: "small" | "medium" | "large";

  // Update preferences
  updateFontSize: (size: "small" | "medium" | "large") => void;
  updateColorScheme: (scheme: "light" | "dark" | "auto") => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [highContrastEnabled, setHighContrastEnabled] = useState(false);
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const [colorScheme, setColorScheme] = useState<"light" | "dark" | "auto">(
    "auto"
  );
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );

  // Initialize accessibility features
  useEffect(() => {
    // Check motion preferences
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    // Check high contrast preferences
    const contrastQuery = window.matchMedia("(prefers-contrast: high)");
    setHighContrastEnabled(contrastQuery.matches);

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setHighContrastEnabled(e.matches);
    };
    contrastQuery.addEventListener("change", handleContrastChange);

    // Initialize focus visible polyfill
    const cleanupFocusVisible = FOCUS_VISIBLE.init();

    // Detect keyboard usage
    const handleKeyDown = () => {
      setIsKeyboardUser(true);
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("mousedown", handleMouseDown, true);

    // Load saved preferences
    const savedColorScheme = localStorage.getItem(
      "accessibility-color-scheme"
    ) as "light" | "dark" | "auto" | null;
    const savedFontSize = localStorage.getItem("accessibility-font-size") as
      | "small"
      | "medium"
      | "large"
      | null;

    if (savedColorScheme) {
      setColorScheme(savedColorScheme);
    }

    if (savedFontSize) {
      setFontSize(savedFontSize);
    }

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      contrastQuery.removeEventListener("change", handleContrastChange);
      cleanupFocusVisible();
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("mousedown", handleMouseDown, true);
    };
  }, []);

  // Apply accessibility preferences to document
  useEffect(() => {
    const html = document.documentElement;

    // Apply motion preferences
    if (prefersReducedMotion) {
      html.classList.add("reduce-motion");
    } else {
      html.classList.remove("reduce-motion");
    }

    // Apply high contrast
    if (highContrastEnabled) {
      html.classList.add("high-contrast");
    } else {
      html.classList.remove("high-contrast");
    }

    // Apply font size
    html.classList.remove("font-small", "font-medium", "font-large");
    html.classList.add(`font-${fontSize}`);

    // Apply color scheme
    if (colorScheme === "auto") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      html.classList.toggle("dark", prefersDark);
    } else {
      html.classList.toggle("dark", colorScheme === "dark");
    }
  }, [prefersReducedMotion, highContrastEnabled, fontSize, colorScheme]);

  const announce = (
    message: string,
    priority: "polite" | "assertive" = "polite"
  ) => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const updateFontSize = (size: "small" | "medium" | "large") => {
    setFontSize(size);
    localStorage.setItem("accessibility-font-size", size);
    announce(`Font size changed to ${size}`);
  };

  const updateColorScheme = (scheme: "light" | "dark" | "auto") => {
    setColorScheme(scheme);
    localStorage.setItem("accessibility-color-scheme", scheme);
    announce(`Color scheme changed to ${scheme}`);
  };

  const value: AccessibilityContextType = {
    prefersReducedMotion,
    highContrastEnabled,
    focusVisible: true, // This is handled by the focus-visible polyfill
    announce,
    isKeyboardUser,
    colorScheme,
    fontSize,
    updateFontSize,
    updateColorScheme,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Accessibility settings component
export const AccessibilitySettings: React.FC = () => {
  const { fontSize, colorScheme, updateFontSize, updateColorScheme, announce } =
    useAccessibility();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Accessibility Settings</h3>

      <div className="space-y-3">
        <div>
          <label htmlFor="font-size" className="block text-sm font-medium mb-2">
            Font Size
          </label>
          <select
            id="font-size"
            value={fontSize}
            onChange={(e) =>
              updateFontSize(e.target.value as "small" | "medium" | "large")
            } className="w-full p-2 border rounded-md"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="color-scheme" className="block text-sm font-medium mb-2"
          >
            Color Scheme
          </label>
          <select
            id="color-scheme"
            value={colorScheme}
            onChange={(e) =>
              updateColorScheme(e.target.value as "light" | "dark" | "auto")
            } className="w-full p-2 border rounded-md"
          >
            <option value="auto">Auto (System)</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
    </div>
  );
};
