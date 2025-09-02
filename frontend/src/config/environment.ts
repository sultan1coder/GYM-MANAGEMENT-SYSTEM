// Environment Configuration
export const config = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:4001",
  UPLOAD_URL:
    import.meta.env.VITE_UPLOAD_URL || "http://localhost:4000/uploads",

  // Feature flags
  FEATURES: {
    WEBSOCKET_ENABLED: false, // Disable WebSocket for now until server is stable
    REAL_TIME_UPDATES: true,
    ADVANCED_ANALYTICS: true,
    EXPORT_FUNCTIONALITY: true,
    MOBILE_OPTIMIZATIONS: true,
  },

  // Update intervals (in milliseconds)
  INTERVALS: {
    DASHBOARD_REFRESH: 5 * 60 * 1000, // 5 minutes
    SYSTEM_HEALTH: 30 * 1000, // 30 seconds
    MEMBER_STATS: 2 * 60 * 1000, // 2 minutes
  },

  // Mobile breakpoints
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1280,
  },
};

export default config;
