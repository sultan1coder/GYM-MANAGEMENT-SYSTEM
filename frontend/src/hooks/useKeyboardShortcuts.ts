import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category: string;
}

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { addNotification, showToast } = useNotifications();

  const shortcuts: KeyboardShortcut[] = [
    // Navigation shortcuts
    {
      key: "h",
      ctrlKey: true,
      action: () => navigate("/"),
      description: "Go to Home",
      category: "Navigation",
    },
    {
      key: "m",
      ctrlKey: true,
      action: () => navigate("/admin/members"),
      description: "Go to Members",
      category: "Navigation",
    },
    {
      key: "e",
      ctrlKey: true,
      action: () => navigate("/admin/equipments"),
      description: "Go to Equipment",
      category: "Navigation",
    },
    {
      key: "p",
      ctrlKey: true,
      action: () => navigate("/admin/payments"),
      description: "Go to Payments",
      category: "Navigation",
    },
    {
      key: "a",
      ctrlKey: true,
      action: () => navigate("/admin/attendance"),
      description: "Go to Attendance",
      category: "Navigation",
    },
    {
      key: "r",
      ctrlKey: true,
      action: () => navigate("/admin/reports"),
      description: "Go to Reports",
      category: "Navigation",
    },
    {
      key: "s",
      ctrlKey: true,
      action: () => navigate("/admin/settings"),
      description: "Go to Settings",
      category: "Navigation",
    },

    // Quick actions
    {
      key: "n",
      ctrlKey: true,
      action: () => {
        const currentPath = window.location.pathname;
        if (currentPath.includes("/members")) {
          navigate("/admin/members/register");
        } else if (currentPath.includes("/equipments")) {
          navigate("/admin/equipments/new");
        } else if (currentPath.includes("/payments")) {
          navigate("/admin/payments/new");
        } else {
          showToast("Use Ctrl+N on specific pages to create new items", "info");
        }
      },
      description: "Create New Item",
      category: "Actions",
    },
    {
      key: "f",
      ctrlKey: true,
      action: () => {
        // Focus the global search
        const searchInput = document.querySelector(
          'input[placeholder*="Search"]'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      description: "Focus Search",
      category: "Actions",
    },
    {
      key: "k",
      ctrlKey: true,
      action: () => {
        // Open command palette (if implemented)
        showToast("Command palette not yet implemented", "info");
      },
      description: "Open Command Palette",
      category: "Actions",
    },

    // Data operations
    {
      key: "s",
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        // Save current form or data
        const saveButton = document.querySelector(
          'button[type="submit"]'
        ) as HTMLButtonElement;
        if (saveButton) {
          saveButton.click();
        } else {
          showToast("No save action available on this page", "info");
        }
      },
      description: "Save Changes",
      category: "Data",
    },
    {
      key: "e",
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        // Export data
        const exportButton = document.querySelector(
          'button[aria-label*="Export"], button:has-text("Export")'
        ) as HTMLButtonElement;
        if (exportButton) {
          exportButton.click();
        } else {
          showToast("No export option available on this page", "info");
        }
      },
      description: "Export Data",
      category: "Data",
    },
    {
      key: "i",
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        // Import data
        const importButton = document.querySelector(
          'button[aria-label*="Import"], button:has-text("Import")'
        ) as HTMLButtonElement;
        if (importButton) {
          importButton.click();
        } else {
          showToast("No import option available on this page", "info");
        }
      },
      description: "Import Data",
      category: "Data",
    },

    // UI shortcuts
    {
      key: "?",
      action: () => {
        // Show keyboard shortcuts help
        addNotification({
          type: "info",
          title: "Keyboard Shortcuts",
          message: "Press Ctrl+? to see all available shortcuts",
          persistent: true,
        });
      },
      description: "Show Help",
      category: "UI",
    },
    {
      key: "Escape",
      action: () => {
        // Close modals, dropdowns, etc.
        const modal = document.querySelector('[role="dialog"]') as HTMLElement;
        const dropdown = document.querySelector(
          '[data-state="open"]'
        ) as HTMLElement;

        if (modal) {
          const closeButton = modal.querySelector(
            'button[aria-label="Close"], button:has-text("Close")'
          ) as HTMLButtonElement;
          if (closeButton) closeButton.click();
        } else if (dropdown) {
          dropdown.click(); // Close dropdown
        }
      },
      description: "Close Modal/Dropdown",
      category: "UI",
    },
    {
      key: "d",
      ctrlKey: true,
      action: () => {
        // Toggle dark mode
        const html = document.documentElement;
        const isDark = html.classList.contains("dark");
        html.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "light" : "dark");
        showToast(`Switched to ${isDark ? "light" : "dark"} mode`, "success");
      },
      description: "Toggle Dark Mode",
      category: "UI",
    },

    // Refresh and reload
    {
      key: "r",
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        window.location.reload();
      },
      description: "Hard Refresh",
      category: "System",
    },
    {
      key: "F5",
      action: () => {
        window.location.reload();
      },
      description: "Refresh Page",
      category: "System",
    },
  ];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.contentEditable === "true"
      ) {
        return;
      }

      const pressedShortcut = shortcuts.find((shortcut) => {
        return (
          shortcut.key.toLowerCase() === event.key.toLowerCase() &&
          !!shortcut.ctrlKey === event.ctrlKey &&
          !!shortcut.altKey === event.altKey &&
          !!shortcut.shiftKey === event.shiftKey &&
          !!shortcut.metaKey === event.metaKey
        );
      });

      if (pressedShortcut) {
        event.preventDefault();
        pressedShortcut.action();
      }
    },
    [shortcuts, navigate, addNotification, showToast]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    shortcuts,
    getShortcutsByCategory: (category: string) =>
      shortcuts.filter((shortcut) => shortcut.category === category),
  };
};
