// Accessibility utilities and helpers

export const ARIA_LABELS = {
  // Navigation
  mainNavigation: "Main navigation",
  breadcrumb: "Breadcrumb navigation",
  search: "Search",
  userMenu: "User menu",
  notifications: "Notifications",

  // Actions
  add: "Add new item",
  edit: "Edit item",
  delete: "Delete item",
  save: "Save changes",
  cancel: "Cancel action",
  close: "Close",
  open: "Open",
  expand: "Expand",
  collapse: "Collapse",

  // Data
  table: "Data table",
  row: "Table row",
  column: "Table column",
  sort: "Sort column",
  filter: "Filter data",
  pagination: "Pagination",

  // Forms
  form: "Form",
  required: "Required field",
  optional: "Optional field",
  error: "Error message",
  success: "Success message",
  loading: "Loading",

  // Modals
  modal: "Modal dialog",
  dialog: "Dialog",
  alert: "Alert",
  confirmation: "Confirmation dialog",

  // Charts
  chart: "Chart",
  dataPoint: "Data point",
  legend: "Chart legend",
  axis: "Chart axis",

  // Media
  image: "Image",
  video: "Video",
  audio: "Audio",
  play: "Play",
  pause: "Pause",
  stop: "Stop",
  volume: "Volume control",

  // Status
  online: "Online",
  offline: "Offline",
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  completed: "Completed",
  failed: "Failed",
  warning: "Warning",
  error: "Error",
  info: "Information",
  success: "Success",
} as const;

export const KEYBOARD_NAVIGATION = {
  // Arrow keys for navigation
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",

  // Tab navigation
  TAB: "Tab",
  SHIFT_TAB: "Shift+Tab",

  // Enter and Space for activation
  ENTER: "Enter",
  SPACE: " ",

  // Escape for closing
  ESCAPE: "Escape",

  // Home and End for navigation
  HOME: "Home",
  END: "End",

  // Page navigation
  PAGE_UP: "PageUp",
  PAGE_DOWN: "PageDown",
} as const;

export const FOCUS_MANAGEMENT = {
  // Focus trap for modals
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener("keydown", handleTabKey);

    return () => {
      element.removeEventListener("keydown", handleTabKey);
    };
  },

  // Focus first focusable element
  focusFirst: (element: HTMLElement) => {
    const focusableElement = element.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;

    if (focusableElement) {
      focusableElement.focus();
    }
  },

  // Focus last focusable element
  focusLast: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const lastElement = focusableElements[focusableElements.length - 1];
    if (lastElement) {
      lastElement.focus();
    }
  },
};

export const SCREEN_READER = {
  // Announce to screen readers
  announce: (message: string, priority: "polite" | "assertive" = "polite") => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Hide element from screen readers
  hideFromScreenReader: (element: HTMLElement) => {
    element.setAttribute("aria-hidden", "true");
  },

  // Show element to screen readers
  showToScreenReader: (element: HTMLElement) => {
    element.removeAttribute("aria-hidden");
  },
};

export const COLOR_CONTRAST = {
  // Check if color combination meets WCAG standards
  checkContrast: (
    foreground: string,
    background: string,
    level: "AA" | "AAA" = "AA"
  ) => {
    // This is a simplified version - in production, use a proper contrast checking library
    const getLuminance = (color: string) => {
      const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
      const [r, g, b] = rgb.map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const fgLuminance = getLuminance(foreground);
    const bgLuminance = getLuminance(background);
    const contrast =
      (Math.max(fgLuminance, bgLuminance) + 0.05) /
      (Math.min(fgLuminance, bgLuminance) + 0.05);

    const requiredContrast = level === "AA" ? 4.5 : 7;
    return contrast >= requiredContrast;
  },
};

export const MOTION_PREFERENCES = {
  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  // Apply motion based on user preference
  applyMotion: (element: HTMLElement, animationClass: string) => {
    if (!MOTION_PREFERENCES.prefersReducedMotion()) {
      element.classList.add(animationClass);
    }
  },
};

export const KEYBOARD_SHORTCUTS = {
  // Register keyboard shortcuts with proper accessibility
  register: (shortcut: string, callback: () => void, element?: HTMLElement) => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === shortcut && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        callback();
      }
    };

    const target = element || document;
    target.addEventListener("keydown", handleKeyDown);

    return () => {
      target.removeEventListener("keydown", handleKeyDown);
    };
  },
};

export const FORM_ACCESSIBILITY = {
  // Generate proper form labels
  generateLabel: (fieldName: string, isRequired: boolean = false) => ({
    htmlFor: fieldName,
    children: `${fieldName}${isRequired ? " *" : ""}`,
    "aria-required": isRequired,
  }),

  // Generate proper input attributes
  generateInputProps: (
    fieldName: string,
    isRequired: boolean = false,
    error?: string
  ) => ({
    id: fieldName,
    name: fieldName,
    required: isRequired,
    "aria-required": isRequired,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${fieldName}-error` : undefined,
  }),

  // Generate error message attributes
  generateErrorProps: (fieldName: string) => ({
    id: `${fieldName}-error`,
    role: "alert",
    "aria-live": "polite",
  }),
};

export const TABLE_ACCESSIBILITY = {
  // Generate proper table headers
  generateHeaderProps: (columnName: string, sortable: boolean = false) => ({
    scope: "col",
    "aria-sort": sortable ? "none" : undefined,
    "aria-label": sortable ? `Sort by ${columnName}` : columnName,
  }),

  // Generate proper row attributes
  generateRowProps: (rowIndex: number, isSelected: boolean = false) => ({
    "aria-rowindex": rowIndex + 1,
    "aria-selected": isSelected,
    role: "row",
  }),

  // Generate cell attributes
  generateCellProps: (columnName: string, rowIndex: number) => ({
    "aria-describedby": `${columnName}-${rowIndex}`,
    role: "gridcell",
  }),
};

export const MODAL_ACCESSIBILITY = {
  // Generate modal attributes
  generateModalProps: (title: string, description?: string) => ({
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "modal-title",
    "aria-describedby": description ? "modal-description" : undefined,
  }),

  // Generate modal title attributes
  generateTitleProps: () => ({
    id: "modal-title",
    role: "heading",
    "aria-level": 2,
  }),

  // Generate modal description attributes
  generateDescriptionProps: () => ({
    id: "modal-description",
  }),
};

// High contrast mode detection
export const HIGH_CONTRAST = {
  isEnabled: () => {
    return window.matchMedia("(prefers-contrast: high)").matches;
  },

  applyHighContrast: (element: HTMLElement) => {
    if (HIGH_CONTRAST.isEnabled()) {
      element.classList.add("high-contrast");
    }
  },
};

// Focus visible polyfill for better keyboard navigation
export const FOCUS_VISIBLE = {
  init: () => {
    // Add focus-visible class when keyboard navigation is used
    let hadKeyboardEvent = true;

    const keyboardThrottleTimeout = 100;
    let keyboardThrottleTimeoutId: number;

    const onKeyDown = () => {
      hadKeyboardEvent = true;
    };

    const onMouseDown = () => {
      hadKeyboardEvent = false;
    };

    const onFocus = (e: FocusEvent) => {
      if (hadKeyboardEvent) {
        (e.target as HTMLElement).classList.add("focus-visible");
      }
    };

    const onBlur = (e: FocusEvent) => {
      (e.target as HTMLElement).classList.remove("focus-visible");
    };

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("mousedown", onMouseDown, true);
    document.addEventListener("focus", onFocus, true);
    document.addEventListener("blur", onBlur, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("mousedown", onMouseDown, true);
      document.removeEventListener("focus", onFocus, true);
      document.removeEventListener("blur", onBlur, true);
    };
  },
};
