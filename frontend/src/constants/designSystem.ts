// Design System Constants
export const COLORS = {
  // Primary Colors
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },

  // Secondary Colors
  secondary: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },

  // Success Colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
  },

  // Warning Colors
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03",
  },

  // Error Colors
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a",
  },

  // Info Colors
  info: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49",
  },

  // Neutral Colors
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"],
    mono: ["JetBrains Mono", "Consolas", "monospace"],
  },

  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },

  fontWeight: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },

  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
} as const;

export const SPACING = {
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
  40: "10rem", // 160px
  48: "12rem", // 192px
  56: "14rem", // 224px
  64: "16rem", // 256px
} as const;

export const BORDER_RADIUS = {
  none: "0",
  sm: "0.125rem", // 2px
  base: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
} as const;

export const SHADOWS = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
} as const;

// Icon Library - Standardized Lucide React icons
export const ICONS = {
  // Navigation
  home: "Home",
  menu: "Menu",
  search: "Search",
  filter: "Filter",
  sort: "ArrowUpDown",
  chevronRight: "ChevronRight",
  chevronLeft: "ChevronLeft",
  chevronDown: "ChevronDown",
  chevronUp: "ChevronUp",

  // Actions
  add: "Plus",
  edit: "Edit",
  delete: "Trash2",
  save: "Save",
  cancel: "X",
  close: "X",
  check: "Check",
  refresh: "RefreshCw",
  download: "Download",
  upload: "Upload",
  export: "FileDown",
  import: "FileUp",

  // Status
  success: "CheckCircle",
  error: "XCircle",
  warning: "AlertTriangle",
  info: "Info",
  loading: "Loader2",

  // Business
  members: "Users",
  equipment: "Dumbbell",
  payments: "CreditCard",
  attendance: "Activity",
  reports: "FileText",
  settings: "Settings",
  profile: "User",
  calendar: "Calendar",
  clock: "Clock",
  bell: "Bell",

  // Data
  table: "Table",
  list: "List",
  grid: "Grid3X3",
  chart: "BarChart3",
  pie: "PieChart",
  line: "TrendingUp",

  // Communication
  mail: "Mail",
  phone: "Phone",
  message: "MessageSquare",
  notification: "Bell",

  // Security
  lock: "Lock",
  unlock: "Unlock",
  shield: "Shield",
  key: "Key",

  // Media
  image: "Image",
  camera: "Camera",
  video: "Video",
  file: "File",
  folder: "Folder",

  // UI Elements
  eye: "Eye",
  eyeOff: "EyeOff",
  star: "Star",
  heart: "Heart",
  bookmark: "Bookmark",
  share: "Share2",
  copy: "Copy",
  external: "ExternalLink",
} as const;

// Component Variants
export const BUTTON_VARIANTS = {
  primary: "bg-primary-600 hover:bg-primary-700 text-white",
  secondary: "bg-secondary-100 hover:bg-secondary-200 text-secondary-900",
  outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
  ghost: "hover:bg-gray-100 text-gray-700",
  destructive: "bg-error-600 hover:bg-error-700 text-white",
  success: "bg-success-600 hover:bg-success-700 text-white",
  warning: "bg-warning-600 hover:bg-warning-700 text-white",
  info: "bg-info-600 hover:bg-info-700 text-white",
} as const;

export const BADGE_VARIANTS = {
  default: "bg-gray-100 text-gray-800",
  primary: "bg-primary-100 text-primary-800",
  secondary: "bg-secondary-100 text-secondary-800",
  success: "bg-success-100 text-success-800",
  warning: "bg-warning-100 text-warning-800",
  error: "bg-error-100 text-error-800",
  info: "bg-info-100 text-info-800",
} as const;

// Responsive Breakpoints
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Animation Durations
export const ANIMATION = {
  fast: "150ms",
  normal: "300ms",
  slow: "500ms",
} as const;

// Z-Index Scale
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
} as const;
