import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  UserPlus,
  Users,
  FileSpreadsheet,
  Mail,
  Download,
  Upload,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  X,
  Search,
  Filter,
  Building,
  UserCheck,
  TrendingUp,
  Activity,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Zap,
  Clock3,
  Bell,
  Globe,
  Shield,
  Workflow,
  Link,
  AlertTriangle,
  Code,
  FileText,
  Settings,
  Lock,
} from "lucide-react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useUserGetAll } from "@/hooks/user";
import { createUserByAdmin, bulkImportUsers, inviteUser } from "@/services/api";

interface UserTemplate {
  name: string;
  role: string;
  permissions: string[];
  description: string;
}

interface BulkImportResult {
  success: any[];
  errors: any[];
}

interface SearchFilters {
  searchTerm: string;
  role: string;
  status: string;
  department: string;
  dateRange: {
    start: string;
    end: string;
  };
  lastLoginRange: {
    start: string;
    end: string;
  };
}

interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  newUsersLastMonth: number;
  userGrowthRate: number;
  roleDistribution: {
    admin: number;
    staff: number;
  };
  activityMetrics: {
    highActivity: number;
    mediumActivity: number;
    lowActivity: number;
  };
  monthlyGrowth: Array<{
    month: string;
    users: number;
    growth: number;
  }>;
  userEngagement: {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
  };
  performanceMetrics: {
    avgLoginFrequency: number;
    avgSessionDuration: number;
    taskCompletionRate: number;
  };
}

interface ActivityData {
  userId: number;
  userName: string;
  lastLogin: string;
  loginCount: number;
  sessionDuration: number;
  tasksCompleted: number;
  status: "active" | "inactive" | "suspended";
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
}

interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  parentRole?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userCount: number;
}

interface RoleHierarchy {
  id: string;
  name: string;
  level: number;
  children: RoleHierarchy[];
  permissions: string[];
  userCount: number;
}

interface PermissionAudit {
  id: string;
  userId: string;
  userName: string;
  action: "granted" | "revoked" | "modified";
  permission: string;
  role: string;
  timestamp: string;
  adminUser: string;
  reason?: string;
}

interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number;
  preventReuse: number;
  complexityScore: number;
}

interface AccountLockout {
  maxFailedAttempts: number;
  lockoutDuration: number;
  lockoutThreshold: number;
  unlockMethod: "automatic" | "manual" | "admin";
  notifyUser: boolean;
  notifyAdmin: boolean;
}

interface UserSession {
  id: string;
  userId: number;
  userName: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  loginTime: string;
  lastActivity: string;
  isActive: boolean;
  deviceType: string;
  browser: string;
  os: string;
}

interface AccessLog {
  id: string;
  userId: number;
  userName: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  timestamp: string;
  status: "success" | "failed" | "blocked";
  details: string;
  riskScore: number;
}

interface IPRestriction {
  id: string;
  type: "whitelist" | "blacklist" | "geolocation";
  value: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  priority: number;
}

interface SecuritySettings {
  passwordPolicy: PasswordPolicy;
  accountLockout: AccountLockout;
  sessionTimeout: number;
  mfaRequired: boolean;
  ipRestrictions: IPRestriction[];
  auditLogging: boolean;
  realTimeMonitoring: boolean;
}

interface UserProfile {
  id: number;
  userId: number;
  profilePicture: string | null;
  bio: string;
  dateOfBirth: string | null;
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  socialMedia: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
  };
  preferences: {
    theme: "light" | "dark" | "auto";
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: "12h" | "24h";
    currency: string;
  };
  notificationSettings: {
    email: {
      loginAlerts: boolean;
      securityUpdates: boolean;
      systemAnnouncements: boolean;
      marketingEmails: boolean;
    };
    push: {
      loginAlerts: boolean;
      securityUpdates: boolean;
      systemAnnouncements: boolean;
      marketingNotifications: boolean;
    };
    sms: {
      loginAlerts: boolean;
      securityUpdates: boolean;
      emergencyAlerts: boolean;
    };
  };
  privacySettings: {
    profileVisibility: "public" | "private" | "team-only";
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowContact: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}

interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}

interface AdministrativeProfile {
  id: number;
  userId: number;
  adminLevel: "super_admin" | "admin" | "sub_admin";
  permissions: string[];
  assignedDepartments: string[];
  adminResponsibilities: string[];
  emergencyContact: EmergencyContact;
  adminSettings: AdminSettings;
  createdAt: string;
  updatedAt: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

interface AdminSettings {
  canCreateUsers: boolean;
  canDeleteUsers: boolean;
  canManageRoles: boolean;
  canAccessSystemSettings: boolean;
  canViewAuditLogs: boolean;
  canManageIntegrations: boolean;
  canManageSecurity: boolean;
  canManageProfiles: boolean;
  ipRestrictions: string[];
  sessionTimeout: number;
  mfaRequired: boolean;
  maxLoginAttempts: number;
}

interface AdminRole {
  id: string;
  name: string;
  description: string;
  level: "super_admin" | "admin" | "sub_admin";
  permissions: string[];
  isActive: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

interface AdminPermission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
  isCritical: boolean;
}

// Security & Access Control Interfaces
interface AdminRouteProtection {
  id: string;
  route: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  requiredPermissions: string[];
  requiredAdminLevel: "super_admin" | "admin" | "sub_admin";
  isActive: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminSession {
  id: string;
  adminId: number;
  adminName: string;
  sessionToken: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  loginTime: string;
  lastActivity: string;
  isActive: boolean;
  deviceType: string;
  browser: string;
  os: string;
  mfaVerified: boolean;
  riskScore: number;
  sessionDuration: number;
}

interface AdminActivityLog {
  id: string;
  adminId: number;
  adminName: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  timestamp: string;
  status: "success" | "failed" | "blocked" | "suspicious";
  severity: "low" | "medium" | "high" | "critical";
  riskScore: number;
  sessionId: string;
  affectedUsers?: number[];
  systemImpact: string;
}

interface AdminSecurityFeature {
  id: string;
  name: string;
  description: string;
  category: "authentication" | "authorization" | "monitoring" | "compliance";
  isEnabled: boolean;
  configuration: Record<string, any>;
  lastUpdated: string;
  updatedBy: string;
  complianceStatus: "compliant" | "non-compliant" | "pending";
}

interface AdminAccessControl {
  id: string;
  adminId: number;
  resource: string;
  permission: string;
  grantedAt: string;
  grantedBy: string;
  expiresAt?: string;
  isActive: boolean;
  auditTrail: string[];
}

interface AdminSecurityPolicy {
  id: string;
  name: string;
  description: string;
  policyType: "password" | "session" | "access" | "audit" | "compliance";
  rules: Record<string, any>;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
  complianceRequirements: string[];
}

// Phase 3: Advanced Administrative Features Interfaces
interface AdminThreatDetection {
  id: string;
  threatType:
    | "brute_force"
    | "suspicious_activity"
    | "unauthorized_access"
    | "data_exfiltration"
    | "malware"
    | "phishing";
  severity: "low" | "medium" | "high" | "critical";
  status:
    | "detected"
    | "investigating"
    | "mitigated"
    | "resolved"
    | "false_positive";
  description: string;
  indicators: string[];
  affectedAdmins: number[];
  detectedAt: string;
  lastUpdated: string;
  riskScore: number;
  automatedResponse: boolean;
  responseActions: string[];
}

interface AdminAnomalyDetection {
  id: string;
  anomalyType:
    | "unusual_login_time"
    | "unusual_location"
    | "unusual_activity_pattern"
    | "privilege_escalation"
    | "data_access_pattern";
  confidence: number;
  status: "detected" | "investigating" | "resolved" | "false_positive";
  description: string;
  baseline: Record<string, any>;
  currentValue: Record<string, any>;
  deviation: number;
  detectedAt: string;
  adminId: number;
  riskScore: number;
}

interface AdminComplianceReport {
  id: string;
  reportType:
    | "security_audit"
    | "access_review"
    | "policy_compliance"
    | "incident_report"
    | "risk_assessment";
  period: string;
  generatedAt: string;
  generatedBy: string;
  status: "draft" | "reviewed" | "approved" | "archived";
  summary: {
    totalFindings: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
    complianceScore: number;
  };
  findings: AdminComplianceFinding[];
  recommendations: string[];
  attachments: string[];
}

interface AdminComplianceFinding {
  id: string;
  category:
    | "security"
    | "access_control"
    | "data_protection"
    | "audit_logging"
    | "policy_management";
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  impact: string;
  recommendation: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo: string;
  dueDate: string;
  createdAt: string;
}

interface AdminSecurityWorkflow {
  id: string;
  workflowType:
    | "access_request"
    | "security_incident"
    | "policy_change"
    | "compliance_review"
    | "risk_assessment";
  status:
    | "initiated"
    | "pending_approval"
    | "approved"
    | "rejected"
    | "in_progress"
    | "completed"
    | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  title: string;
  description: string;
  initiator: string;
  approvers: string[];
  currentStep: number;
  totalSteps: number;
  steps: AdminWorkflowStep[];
  createdAt: string;
  updatedAt: string;
  dueDate: string;
}

interface AdminWorkflowStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  assignee: string;
  status: "pending" | "in_progress" | "completed" | "skipped";
  required: boolean;
  dueDate: string;
  completedAt?: string;
  comments: string[];
  attachments: string[];
}

interface AdminSecurityIntegration {
  id: string;
  name: string;
  type:
    | "siem"
    | "edr"
    | "iam"
    | "vpn"
    | "firewall"
    | "antivirus"
    | "backup"
    | "monitoring";
  vendor: string;
  version: string;
  status: "active" | "inactive" | "error" | "maintenance";
  configuration: Record<string, any>;
  lastSync: string;
  syncStatus: "success" | "failed" | "in_progress";
  healthScore: number;
  alerts: AdminIntegrationAlert[];
  apiEndpoints: string[];
  credentials: {
    encrypted: boolean;
    lastRotated: string;
    expiresAt: string;
  };
}

interface AdminIntegrationAlert {
  id: string;
  integrationId: string;
  alertType: "error" | "warning" | "info" | "critical";
  message: string;
  timestamp: string;
  status: "active" | "acknowledged" | "resolved";
  severity: "low" | "medium" | "high" | "critical";
  affectedServices: string[];
  resolution: string;
}

// Phase 4: Integration & Automation Features
interface SystemIntegration {
  id: string;
  name: string;
  type: "api" | "webhook" | "database" | "file" | "service";
  status: "active" | "inactive" | "error" | "maintenance";
  endpoint: string;
  authentication: "oauth2" | "api_key" | "basic" | "jwt" | "hmac" | "none";
  lastSync: string;
  syncFrequency: "realtime" | "hourly" | "daily" | "weekly" | "manual";
  dataFlow: "inbound" | "outbound" | "bidirectional";
  errorCount: number;
  successRate: number;
  lastError?: string;
  configuration: Record<string, any>;
  healthScore: number;
  uptime: number;
  responseTime: number;
  dataVolume: number;
  securityLevel: "low" | "medium" | "high" | "enterprise";
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: "schedule" | "event" | "manual" | "webhook" | "condition";
  status: "active" | "inactive" | "running" | "paused" | "error";
  priority: "low" | "medium" | "high" | "critical";
  category:
    | "user_management"
    | "security"
    | "compliance"
    | "reporting"
    | "maintenance";
  steps: AutomationStep[];
  currentStep: number;
  totalSteps: number;
  lastRun: string;
  nextRun: string;
  executionTime: number;
  successCount: number;
  failureCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  conditions: AutomationCondition[];
  actions: AutomationAction[];
}

interface AutomationStep {
  id: string;
  name: string;
  type: "action" | "condition" | "wait" | "loop" | "integration";
  order: number;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  input: Record<string, any>;
  output: Record<string, any>;
  error?: string;
  executionTime: number;
  retryCount: number;
  maxRetries: number;
  timeout: number;
}

interface AutomationCondition {
  id: string;
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "greater_than"
    | "less_than"
    | "regex";
  value: any;
  logicalOperator: "and" | "or";
}

interface AutomationAction {
  id: string;
  type:
    | "create_user"
    | "update_user"
    | "delete_user"
    | "send_email"
    | "create_role"
    | "assign_permission"
    | "log_activity"
    | "webhook_call";
  parameters: Record<string, any>;
  target: string;
  description: string;
}

interface DataSyncJob {
  id: string;
  name: string;
  source: string;
  destination: string;
  type: "full" | "incremental" | "differential";
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  progress: number;
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  startTime: string;
  endTime?: string;
  duration: number;
  error?: string;
  retryCount: number;
  maxRetries: number;
  schedule: string;
  lastSuccessfulRun?: string;
  nextRun: string;
  dataSize: number;
  compressionRatio: number;
  encryption: boolean;
}

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  status: "active" | "inactive" | "error";
  events: string[];
  authentication: "none" | "basic" | "bearer" | "hmac" | "oauth2";
  headers: Record<string, string>;
  timeout: number;
  retryCount: number;
  lastTriggered: string;
  successCount: number;
  failureCount: number;
  responseTime: number;
  payloadSize: number;
  securityLevel: "public" | "private" | "restricted";
  rateLimit: number;
  rateLimitWindow: number;
}

interface APIManagement {
  id: string;
  name: string;
  version: string;
  baseUrl: string;
  status: "active" | "deprecated" | "beta" | "maintenance";
  endpoints: APIEndpoint[];
  authentication: "none" | "api_key" | "oauth2" | "jwt" | "basic";
  rateLimit: number;
  rateLimitWindow: number;
  documentation: string;
  lastUpdated: string;
  usage: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    peakRequests: number;
    uniqueUsers: number;
  };
  security: {
    ssl: boolean;
    encryption: boolean;
    ipWhitelist: string[];
    userAgentFilter: boolean;
    requestValidation: boolean;
  };
}

interface APIEndpoint {
  id: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  status: "active" | "deprecated" | "beta";
  description: string;
  parameters: APIParameter[];
  responses: APIResponse[];
  rateLimit: number;
  authentication: boolean;
  deprecated: boolean;
  deprecationDate?: string;
  usage: {
    totalCalls: number;
    successRate: number;
    averageResponseTime: number;
    lastCalled: string;
  };
}

interface APIParameter {
  name: string;
  type: "string" | "number" | "boolean" | "array" | "object";
  required: boolean;
  description: string;
  defaultValue?: any;
  validation?: string;
}

interface APIResponse {
  code: number;
  description: string;
  schema: any;
  examples: any[];
}

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showInviteUser, setShowInviteUser] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<UserTemplate | null>(
    null
  );
  const [bulkImportFile, setBulkImportFile] = useState<File | null>(null);
  const [importResults, setImportResults] = useState<BulkImportResult | null>(
    null
  );
  const [isImporting, setIsImporting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Search and filtering state
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: "",
    role: "",
    status: "",
    department: "",
    dateRange: { start: "", end: "" },
    lastLoginRange: { start: "", end: "" },
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  // Analytics state
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(
    null
  );
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState("30d");
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // Role & Permission Management state
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roleHierarchy, setRoleHierarchy] = useState<RoleHierarchy[]>([]);
  const [permissionAudits, setPermissionAudits] = useState<PermissionAudit[]>(
    []
  );
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showBulkRoleAssignment, setShowBulkRoleAssignment] = useState(false);
  const [showPermissionAudit, setShowPermissionAudit] = useState(false);
  const [selectedRole, setSelectedRole] = useState<CustomRole | null>(null);
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null);

  // Security & Access Control state
  const [securitySettings, setSecuritySettings] =
    useState<SecuritySettings | null>(null);
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [ipRestrictions, setIpRestrictions] = useState<IPRestriction[]>([]);
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);
  const [showSessionManagement, setShowSessionManagement] = useState(false);
  const [showAccessLogs, setShowAccessLogs] = useState(false);
  const [showIPRestrictions, setShowIPRestrictions] = useState(false);
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(
    null
  );

  // User Profile Management state
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(
    null
  );
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showProfilePicture, setShowProfilePicture] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(
    null
  );
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

  // Administrative Profile Management state
  const [adminProfiles, setAdminProfiles] = useState<AdministrativeProfile[]>(
    []
  );
  const [adminRoles, setAdminRoles] = useState<AdminRole[]>([]);
  const [adminPermissions, setAdminPermissions] = useState<AdminPermission[]>(
    []
  );
  const [selectedAdminProfile, setSelectedAdminProfile] =
    useState<AdministrativeProfile | null>(null);
  const [editingAdminProfile, setEditingAdminProfile] =
    useState<AdministrativeProfile | null>(null);
  const [showAdminProfileEditor, setShowAdminProfileEditor] = useState(false);
  const [showAdminRoleManager, setShowAdminRoleManager] = useState(false);
  const [showAdminPermissionManager, setShowAdminPermissionManager] =
    useState(false);
  const [selectedAdminRole, setSelectedAdminRole] = useState<AdminRole | null>(
    null
  );
  const [editingAdminRole, setEditingAdminRole] = useState<AdminRole | null>(
    null
  );

  // Security & Access Control state
  const [adminRouteProtections, setAdminRouteProtections] = useState<
    AdminRouteProtection[]
  >([]);
  const [adminSessions, setAdminSessions] = useState<AdminSession[]>([]);
  const [adminActivityLogs, setAdminActivityLogs] = useState<
    AdminActivityLog[]
  >([]);
  const [adminSecurityFeatures, setAdminSecurityFeatures] = useState<
    AdminSecurityFeature[]
  >([]);
  const [adminAccessControls, setAdminAccessControls] = useState<
    AdminAccessControl[]
  >([]);
  const [adminSecurityPolicies, setAdminSecurityPolicies] = useState<
    AdminSecurityPolicy[]
  >([]);
  const [selectedAdminSession, setSelectedAdminSession] =
    useState<AdminSession | null>(null);
  const [selectedAdminActivity, setSelectedAdminActivity] =
    useState<AdminActivityLog | null>(null);
  const [showAdminSessionManager, setShowAdminSessionManager] = useState(false);
  const [showAdminActivityLogs, setShowAdminActivityLogs] = useState(false);
  const [showAdminSecuritySettings, setShowAdminSecuritySettings] =
    useState(false);
  const [showAdminRouteProtection, setShowAdminRouteProtection] =
    useState(false);
  const [securityTimeRange, setSecurityTimeRange] = useState<
    "24h" | "7d" | "30d" | "90d"
  >("7d");

  // Phase 3: Advanced Administrative Features state
  const [adminThreatDetections, setAdminThreatDetections] = useState<
    AdminThreatDetection[]
  >([]);
  const [adminAnomalyDetections, setAdminAnomalyDetections] = useState<
    AdminAnomalyDetection[]
  >([]);
  const [adminComplianceReports, setAdminComplianceReports] = useState<
    AdminComplianceReport[]
  >([]);
  const [adminSecurityWorkflows, setAdminSecurityWorkflows] = useState<
    AdminSecurityWorkflow[]
  >([]);
  const [adminSecurityIntegrations, setAdminSecurityIntegrations] = useState<
    AdminSecurityIntegration[]
  >([]);
  const [selectedThreat, setSelectedThreat] =
    useState<AdminThreatDetection | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] =
    useState<AdminAnomalyDetection | null>(null);
  const [selectedComplianceReport, setSelectedComplianceReport] =
    useState<AdminComplianceReport | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] =
    useState<AdminSecurityWorkflow | null>(null);
  const [selectedIntegration, setSelectedIntegration] =
    useState<AdminSecurityIntegration | null>(null);
  const [showThreatDetails, setShowThreatDetails] = useState(false);
  const [showAnomalyDetails, setShowAnomalyDetails] = useState(false);
  const [showComplianceReport, setShowComplianceReport] = useState(false);
  const [showWorkflowManager, setShowWorkflowManager] = useState(false);
  const [showIntegrationManager, setShowIntegrationManager] = useState(false);
  const [showComplianceDashboard, setShowComplianceDashboard] = useState(false);
  const [showThreatDashboard, setShowThreatDashboard] = useState(false);
  const [advancedSecurityTimeRange, setAdvancedSecurityTimeRange] = useState<
    "24h" | "7d" | "30d" | "90d" | "1y"
  >("30d");

  // Phase 4: Integration & Automation Features state
  const [systemIntegrations, setSystemIntegrations] = useState<
    SystemIntegration[]
  >([]);
  const [automationWorkflows, setAutomationWorkflows] = useState<
    AutomationWorkflow[]
  >([]);
  const [dataSyncJobs, setDataSyncJobs] = useState<DataSyncJob[]>([]);
  const [webhookEndpoints, setWebhookEndpoints] = useState<WebhookEndpoint[]>(
    []
  );
  const [apiManagement, setApiManagement] = useState<APIManagement[]>([]);
  const [selectedSystemIntegration, setSelectedSystemIntegration] =
    useState<SystemIntegration | null>(null);
  const [selectedAutomationWorkflow, setSelectedAutomationWorkflow] =
    useState<AutomationWorkflow | null>(null);
  const [selectedSyncJob, setSelectedSyncJob] = useState<DataSyncJob | null>(
    null
  );
  const [selectedWebhook, setSelectedWebhook] =
    useState<WebhookEndpoint | null>(null);
  const [selectedAPI, setSelectedAPI] = useState<APIManagement | null>(null);
  const [showSystemIntegrationManager, setShowSystemIntegrationManager] =
    useState(false);
  const [showAutomationWorkflowManager, setShowAutomationWorkflowManager] =
    useState(false);
  const [showSyncJobManager, setShowSyncJobManager] = useState(false);
  const [showWebhookManager, setShowWebhookManager] = useState(false);
  const [showAPIManager, setShowAPIManager] = useState(false);
  const [showCreateIntegration, setShowCreateIntegration] = useState(false);
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false);
  const [showCreateSyncJob, setShowCreateSyncJob] = useState(false);
  const [showCreateWebhook, setShowCreateWebhook] = useState(false);
  const [showCreateAPI, setShowCreateAPI] = useState(false);
  const [integrationTimeRange, setIntegrationTimeRange] = useState<
    "24h" | "7d" | "30d" | "90d"
  >("7d");

  const { users, isLoading, error, refetch } = useUserGetAll();

  // Apply filters whenever users or filters change
  useEffect(() => {
    if (users) {
      const filtered = users.filter((user) => {
        // Search term filter (name, email, username)
        if (searchFilters.searchTerm) {
          const searchLower = searchFilters.searchTerm.toLowerCase();
          const matchesSearch =
            user.name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.username?.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }

        // Role filter
        if (searchFilters.role && user.role !== searchFilters.role) {
          return false;
        }

        // Status filter (using created_at as a proxy for active status)
        if (searchFilters.status) {
          const userStatus = user.created_at ? "active" : "inactive";
          if (userStatus !== searchFilters.status) {
            return false;
          }
        }

        // Department filter (using role as a proxy for department)
        if (
          searchFilters.department &&
          user.role !== searchFilters.department
        ) {
          return false;
        }

        // Date range filter (creation date)
        if (searchFilters.dateRange.start && user.created_at) {
          const userDate = new Date(user.created_at);
          const startDate = new Date(searchFilters.dateRange.start);
          if (userDate < startDate) return false;
        }
        if (searchFilters.dateRange.end && user.created_at) {
          const userDate = new Date(user.created_at);
          const endDate = new Date(searchFilters.dateRange.end);
          if (userDate > endDate) return false;
        }

        // Last login range filter (using updated_at as a proxy for last activity)
        if (searchFilters.lastLoginRange.start && user.updated_at) {
          const userDate = new Date(user.updated_at);
          const startDate = new Date(searchFilters.lastLoginRange.start);
          if (userDate < startDate) return false;
        }
        if (searchFilters.lastLoginRange.end && user.updated_at) {
          const userDate = new Date(user.updated_at);
          const endDate = new Date(searchFilters.lastLoginRange.end);
          if (userDate > endDate) return false;
        }

        return true;
      });
      setFilteredUsers(filtered);
    }
  }, [users, searchFilters]);

  // Calculate analytics when users change
  useEffect(() => {
    if (users) {
      calculateUserAnalytics();
      generateActivityData();
    }
  }, [users]);

  // Initialize role and permission data
  useEffect(() => {
    setPermissions(mockPermissions);
    setCustomRoles(mockCustomRoles);
    setRoleHierarchy(mockRoleHierarchy);
    setPermissionAudits(mockPermissionAudits);
  }, []);

  // Initialize security and access control data
  useEffect(() => {
    setSecuritySettings(mockSecuritySettings);
    setUserSessions(mockUserSessions);
    setAccessLogs(mockAccessLogs);
    setIpRestrictions(mockIPRestrictions);
  }, []);

  // Initialize user profile data
  useEffect(() => {
    setUserProfiles(mockUserProfiles);
  }, []);

  // Initialize administrative profile data
  useEffect(() => {
    setAdminProfiles(mockAdminProfiles);
    setAdminRoles(mockAdminRoles);
    setAdminPermissions(mockAdminPermissions);
  }, []);

  // Initialize Security & Access Control data
  useEffect(() => {
    setAdminRouteProtections(mockAdminRouteProtections);
    setAdminSessions(mockAdminSessions);
    setAdminActivityLogs(mockAdminActivityLogs);
    setAdminSecurityFeatures(mockAdminSecurityFeatures);
    setAdminAccessControls(mockAdminAccessControls);
    setAdminSecurityPolicies(mockAdminSecurityPolicies);
  }, []);

  // Initialize Phase 3: Advanced Administrative Features data
  useEffect(() => {
    setAdminThreatDetections(mockAdminThreatDetections);
    setAdminAnomalyDetections(mockAdminAnomalyDetections);
    setAdminComplianceReports(mockAdminComplianceReports);
    setAdminSecurityWorkflows(mockAdminSecurityWorkflows);
    setAdminSecurityIntegrations(mockAdminSecurityIntegrations);
  }, []);

  // Initialize Phase 4: Integration & Automation Features data
  useEffect(() => {
    setSystemIntegrations(mockSystemIntegrations);
    setAutomationWorkflows(mockAutomationWorkflows);
    setDataSyncJobs(mockDataSyncJobs);
    setWebhookEndpoints(mockWebhookEndpoints);
    setApiManagement(mockAPIManagement);
  }, []);

  const userTemplates: UserTemplate[] = [
    {
      name: "Administrator",
      role: "admin",
      permissions: ["all"],
      description: "Full system access with user management capabilities",
    },
    {
      name: "Staff Manager",
      role: "staff",
      permissions: [
        "member_management",
        "equipment_management",
        "payment_management",
      ],
      description: "Can manage members, equipment, and payments",
    },
    {
      name: "Receptionist",
      role: "staff",
      permissions: ["member_management", "payment_management"],
      description: "Can manage members and handle payments",
    },
    {
      name: "Trainer",
      role: "staff",
      permissions: ["member_management"],
      description: "Can view and manage member profiles",
    },
  ];

  // Mock permissions data
  const mockPermissions: Permission[] = [
    // User Management
    {
      id: "user_create",
      name: "Create Users",
      description: "Create new user accounts",
      category: "User Management",
      resource: "users",
      action: "create",
    },
    {
      id: "user_read",
      name: "View Users",
      description: "View user information and profiles",
      category: "User Management",
      resource: "users",
      action: "read",
    },
    {
      id: "user_update",
      name: "Update Users",
      description: "Modify user information and settings",
      category: "User Management",
      resource: "users",
      action: "update",
    },
    {
      id: "user_delete",
      name: "Delete Users",
      description: "Remove user accounts",
      category: "User Management",
      resource: "users",
      action: "delete",
    },

    // Member Management
    {
      id: "member_create",
      name: "Create Members",
      description: "Create new member accounts",
      category: "Member Management",
      resource: "members",
      action: "create",
    },
    {
      id: "member_read",
      name: "View Members",
      description: "View member information and profiles",
      category: "Member Management",
      resource: "members",
      action: "read",
    },
    {
      id: "member_update",
      name: "Update Members",
      description: "Modify member information",
      category: "Member Management",
      resource: "members",
      action: "update",
    },
    {
      id: "member_delete",
      name: "Delete Members",
      description: "Remove member accounts",
      category: "Member Management",
      resource: "members",
      action: "delete",
    },

    // Equipment Management
    {
      id: "equipment_create",
      name: "Create Equipment",
      description: "Add new equipment to inventory",
      category: "Equipment Management",
      resource: "equipment",
      action: "create",
    },
    {
      id: "equipment_read",
      name: "View Equipment",
      description: "View equipment information and status",
      category: "Equipment Management",
      resource: "equipment",
      action: "read",
    },
    {
      id: "equipment_update",
      name: "Update Equipment",
      description: "Modify equipment information",
      category: "Equipment Management",
      resource: "equipment",
      action: "update",
    },
    {
      id: "equipment_delete",
      name: "Delete Equipment",
      description: "Remove equipment from inventory",
      category: "Equipment Management",
      resource: "equipment",
      action: "delete",
    },

    // Payment Management
    {
      id: "payment_create",
      name: "Create Payments",
      description: "Process new payments",
      category: "Payment Management",
      resource: "payments",
      action: "create",
    },
    {
      id: "payment_read",
      name: "View Payments",
      description: "View payment information and history",
      category: "Payment Management",
      resource: "payments",
      action: "read",
    },
    {
      id: "payment_update",
      name: "Update Payments",
      description: "Modify payment information",
      category: "Payment Management",
      resource: "payments",
      action: "update",
    },
    {
      id: "payment_delete",
      name: "Delete Payments",
      description: "Remove payment records",
      category: "Payment Management",
      resource: "payments",
      action: "delete",
    },

    // Subscription Management
    {
      id: "subscription_create",
      name: "Create Subscriptions",
      description: "Create new subscription plans",
      category: "Subscription Management",
      resource: "subscriptions",
      action: "create",
    },
    {
      id: "subscription_read",
      name: "View Subscriptions",
      description: "View subscription information",
      category: "Subscription Management",
      resource: "subscriptions",
      action: "read",
    },
    {
      id: "subscription_update",
      name: "Update Subscriptions",
      description: "Modify subscription plans",
      category: "Subscription Management",
      resource: "subscriptions",
      action: "update",
    },
    {
      id: "subscription_delete",
      name: "Delete Subscriptions",
      description: "Remove subscription plans",
      category: "Subscription Management",
      resource: "subscriptions",
      action: "delete",
    },

    // Analytics & Reporting
    {
      id: "analytics_read",
      name: "View Analytics",
      description: "Access system analytics and reports",
      category: "Analytics",
      resource: "analytics",
      action: "read",
    },
    {
      id: "reports_generate",
      name: "Generate Reports",
      description: "Create and export reports",
      category: "Analytics",
      resource: "reports",
      action: "create",
    },

    // System Administration
    {
      id: "system_config",
      name: "System Configuration",
      description: "Modify system settings and configuration",
      category: "System Admin",
      resource: "system",
      action: "update",
    },
    {
      id: "backup_restore",
      name: "Backup & Restore",
      description: "Perform system backup and restore operations",
      category: "System Admin",
      resource: "system",
      action: "admin",
    },
  ];

  // Mock custom roles data
  const mockCustomRoles: CustomRole[] = [
    {
      id: "role_1",
      name: "Senior Manager",
      description: "Advanced management role with extended permissions",
      permissions: [
        "user_create",
        "user_read",
        "user_update",
        "member_create",
        "member_read",
        "member_update",
        "equipment_create",
        "equipment_read",
        "equipment_update",
        "payment_create",
        "payment_read",
        "payment_update",
        "analytics_read",
        "reports_generate",
      ],
      parentRole: "admin",
      isActive: true,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      userCount: 3,
    },
    {
      id: "role_2",
      name: "Equipment Specialist",
      description: "Specialized role for equipment management",
      permissions: [
        "equipment_create",
        "equipment_read",
        "equipment_update",
        "equipment_delete",
        "analytics_read",
      ],
      parentRole: "staff",
      isActive: true,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-15",
      userCount: 2,
    },
    {
      id: "role_3",
      name: "Member Services",
      description: "Focused on member management and support",
      permissions: [
        "member_create",
        "member_read",
        "member_update",
        "payment_create",
        "payment_read",
        "subscription_read",
      ],
      parentRole: "staff",
      isActive: true,
      createdAt: "2024-01-05",
      updatedAt: "2024-01-10",
      userCount: 5,
    },
    {
      id: "role_4",
      name: "Financial Controller",
      description: "Financial management and payment processing",
      permissions: [
        "payment_create",
        "payment_read",
        "payment_update",
        "payment_delete",
        "subscription_create",
        "subscription_read",
        "subscription_update",
        "analytics_read",
        "reports_generate",
      ],
      parentRole: "staff",
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-05",
      userCount: 2,
    },
  ];

  // Mock role hierarchy data
  const mockRoleHierarchy: RoleHierarchy[] = [
    {
      id: "admin",
      name: "Administrator",
      level: 1,
      children: [
        {
          id: "role_1",
          name: "Senior Manager",
          level: 2,
          children: [
            {
              id: "role_2",
              name: "Equipment Specialist",
              level: 3,
              children: [],
              permissions: [
                "equipment_create",
                "equipment_read",
                "equipment_update",
                "equipment_delete",
                "analytics_read",
              ],
              userCount: 2,
            },
            {
              id: "role_3",
              name: "Member Services",
              level: 3,
              children: [],
              permissions: [
                "member_create",
                "member_read",
                "member_update",
                "payment_create",
                "payment_read",
                "subscription_read",
              ],
              userCount: 5,
            },
          ],
          permissions: [
            "user_create",
            "user_read",
            "user_update",
            "member_create",
            "member_read",
            "member_update",
            "equipment_create",
            "equipment_read",
            "equipment_update",
            "payment_create",
            "payment_read",
            "payment_update",
            "analytics_read",
            "reports_generate",
          ],
          userCount: 3,
        },
      ],
      permissions: ["all"],
      userCount: 1,
    },
    {
      id: "staff",
      name: "Staff",
      level: 2,
      children: [
        {
          id: "role_4",
          name: "Financial Controller",
          level: 3,
          children: [],
          permissions: [
            "payment_create",
            "payment_read",
            "payment_update",
            "payment_delete",
            "subscription_create",
            "subscription_read",
            "subscription_update",
            "analytics_read",
            "reports_generate",
          ],
          userCount: 2,
        },
      ],
      permissions: [
        "member_management",
        "equipment_management",
        "payment_management",
      ],
      userCount: 8,
    },
  ];

  // Mock permission audit data
  const mockPermissionAudits: PermissionAudit[] = [
    {
      id: "audit_1",
      userId: "user_1",
      userName: "John Doe",
      action: "granted",
      permission: "user_create",
      role: "Senior Manager",
      timestamp: "2024-01-20T10:30:00Z",
      adminUser: "admin@example.com",
      reason: "Promotion to senior management",
    },
    {
      id: "audit_2",
      userId: "user_2",
      userName: "Jane Smith",
      action: "revoked",
      permission: "payment_delete",
      role: "Staff",
      timestamp: "2024-01-19T14:15:00Z",
      adminUser: "admin@example.com",
      reason: "Security policy update",
    },
    {
      id: "audit_3",
      userId: "user_3",
      userName: "Mike Johnson",
      action: "modified",
      permission: "equipment_management",
      role: "Equipment Specialist",
      timestamp: "2024-01-18T09:45:00Z",
      adminUser: "admin@example.com",
      reason: "Role refinement",
    },
  ];

  // Mock security settings data
  const mockSecuritySettings: SecuritySettings = {
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90,
      preventReuse: 5,
      complexityScore: 8,
    },
    accountLockout: {
      maxFailedAttempts: 5,
      lockoutDuration: 30,
      lockoutThreshold: 3,
      unlockMethod: "automatic",
      notifyUser: true,
      notifyAdmin: true,
    },
    sessionTimeout: 480,
    mfaRequired: true,
    ipRestrictions: [],
    auditLogging: true,
    realTimeMonitoring: true,
  };

  // Mock user sessions data
  const mockUserSessions: UserSession[] = [
    {
      id: "session_1",
      userId: 1,
      userName: "John Doe",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "New York, NY, USA",
      loginTime: "2024-01-20T08:00:00Z",
      lastActivity: "2024-01-20T14:30:00Z",
      isActive: true,
      deviceType: "Desktop",
      browser: "Chrome 120.0",
      os: "Windows 11",
    },
    {
      id: "session_2",
      userId: 2,
      userName: "Jane Smith",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      location: "Los Angeles, CA, USA",
      loginTime: "2024-01-20T09:15:00Z",
      lastActivity: "2024-01-20T13:45:00Z",
      isActive: true,
      deviceType: "Mobile",
      browser: "Safari 17.0",
      os: "iOS 17.0",
    },
    {
      id: "session_3",
      userId: 3,
      userName: "Mike Johnson",
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      location: "Chicago, IL, USA",
      loginTime: "2024-01-20T07:30:00Z",
      lastActivity: "2024-01-20T12:20:00Z",
      isActive: false,
      deviceType: "Desktop",
      browser: "Firefox 121.0",
      os: "macOS 12.0",
    },
    {
      id: "session_4",
      userId: 4,
      userName: "Sarah Wilson",
      ipAddress: "203.45.67.89",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "London, UK",
      loginTime: "2024-01-20T06:00:00Z",
      lastActivity: "2024-01-20T11:30:00Z",
      isActive: true,
      deviceType: "Desktop",
      browser: "Edge 120.0",
      os: "Windows 10",
    },
  ];

  // Mock access logs data
  const mockAccessLogs: AccessLog[] = [
    {
      id: "log_1",
      userId: 1,
      userName: "John Doe",
      action: "login",
      resource: "authentication",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "New York, NY, USA",
      timestamp: "2024-01-20T08:00:00Z",
      status: "success",
      details: "Successful login from trusted IP",
      riskScore: 2,
    },
    {
      id: "log_2",
      userId: 2,
      userName: "Jane Smith",
      action: "failed_login",
      resource: "authentication",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      location: "Los Angeles, CA, USA",
      timestamp: "2024-01-20T09:15:00Z",
      status: "failed",
      details: "Invalid password attempt",
      riskScore: 5,
    },
    {
      id: "log_3",
      userId: 3,
      userName: "Mike Johnson",
      action: "access_denied",
      resource: "admin_panel",
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      location: "Chicago, IL, USA",
      timestamp: "2024-01-20T10:30:00Z",
      status: "blocked",
      details: "Insufficient permissions for admin access",
      riskScore: 8,
    },
    {
      id: "log_4",
      userId: 4,
      userName: "Sarah Wilson",
      action: "data_export",
      resource: "member_data",
      ipAddress: "203.45.67.89",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "London, UK",
      timestamp: "2024-01-20T11:45:00Z",
      status: "success",
      details: "Exported member data to CSV",
      riskScore: 3,
    },
    {
      id: "log_5",
      userId: 1,
      userName: "John Doe",
      action: "role_modification",
      resource: "user_management",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "New York, NY, USA",
      timestamp: "2024-01-20T12:00:00Z",
      status: "success",
      details: "Modified user role permissions",
      riskScore: 4,
    },
  ];

  // Mock IP restrictions data
  const mockIPRestrictions: IPRestriction[] = [
    {
      id: "ip_1",
      type: "whitelist",
      value: "192.168.1.0/24",
      description: "Office network - trusted IP range",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      createdBy: "admin@example.com",
      priority: 1,
    },
    {
      id: "ip_2",
      type: "blacklist",
      value: "203.45.67.89",
      description: "Suspicious IP - multiple failed attempts",
      isActive: true,
      createdAt: "2024-01-15T00:00:00Z",
      createdBy: "admin@example.com",
      priority: 2,
    },
    {
      id: "ip_3",
      type: "geolocation",
      value: "US,CA,UK",
      description: "Allowed countries for access",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      createdBy: "admin@example.com",
      priority: 3,
    },
    {
      id: "ip_4",
      type: "blacklist",
      value: "10.0.0.0/8",
      description: "Blocked private network range",
      isActive: false,
      createdAt: "2024-01-10T00:00:00Z",
      createdBy: "admin@example.com",
      priority: 4,
    },
  ];

  // Mock user profiles data
  const mockUserProfiles: UserProfile[] = [
    {
      id: 1,
      userId: 1,
      profilePicture:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "Experienced gym manager with 8+ years in fitness industry. Passionate about helping members achieve their fitness goals.",
      dateOfBirth: "1985-03-15",
      gender: "male",
      address: {
        street: "123 Fitness Street",
        city: "New York",
        state: "NY",
        country: "United States",
        postalCode: "10001",
      },
      emergencyContact: {
        name: "Sarah Johnson",
        relationship: "Spouse",
        phone: "+1-555-0123",
        email: "sarah.johnson@email.com",
      },
      socialMedia: {
        linkedin: "linkedin.com/in/john-doe-fitness",
        twitter: "@johndoe_fitness",
        facebook: "facebook.com/john.doe.fitness",
        instagram: "@johndoe_fitness",
      },
      preferences: {
        theme: "auto",
        language: "en-US",
        timezone: "America/New_York",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12h",
        currency: "USD",
      },
      notificationSettings: {
        email: {
          loginAlerts: true,
          securityUpdates: true,
          systemAnnouncements: true,
          marketingEmails: false,
        },
        push: {
          loginAlerts: true,
          securityUpdates: true,
          systemAnnouncements: false,
          marketingNotifications: false,
        },
        sms: {
          loginAlerts: true,
          securityUpdates: false,
          emergencyAlerts: true,
        },
      },
      privacySettings: {
        profileVisibility: "team-only",
        showEmail: true,
        showPhone: false,
        showLocation: true,
        allowContact: true,
      },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-20T00:00:00Z",
    },
    {
      id: 2,
      userId: 2,
      profilePicture:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      bio: "Fitness enthusiast and certified personal trainer. Specialized in strength training and nutrition coaching.",
      dateOfBirth: "1992-07-22",
      gender: "female",
      address: {
        street: "456 Wellness Avenue",
        city: "Los Angeles",
        state: "CA",
        country: "United States",
        postalCode: "90210",
      },
      emergencyContact: {
        name: "Mike Wilson",
        relationship: "Partner",
        phone: "+1-555-0456",
        email: "mike.wilson@email.com",
      },
      socialMedia: {
        linkedin: "linkedin.com/in/jane-smith-fitness",
        twitter: "@janesmith_fitness",
        facebook: "facebook.com/jane.smith.fitness",
        instagram: "@janesmith_fitness",
      },
      preferences: {
        theme: "dark",
        language: "en-US",
        timezone: "America/Los_Angeles",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "24h",
        currency: "USD",
      },
      notificationSettings: {
        email: {
          loginAlerts: true,
          securityUpdates: true,
          systemAnnouncements: false,
          marketingEmails: true,
        },
        push: {
          loginAlerts: false,
          securityUpdates: true,
          systemAnnouncements: true,
          marketingNotifications: true,
        },
        sms: {
          loginAlerts: false,
          securityUpdates: false,
          emergencyAlerts: true,
        },
      },
      privacySettings: {
        profileVisibility: "public",
        showEmail: true,
        showPhone: true,
        showLocation: true,
        allowContact: true,
      },
      createdAt: "2024-01-05T00:00:00Z",
      updatedAt: "2024-01-18T00:00:00Z",
    },
    {
      id: 3,
      userId: 3,
      profilePicture: null,
      bio: "Equipment specialist with expertise in gym maintenance and safety protocols.",
      dateOfBirth: "1988-11-08",
      gender: "male",
      address: {
        street: "789 Equipment Lane",
        city: "Chicago",
        state: "IL",
        country: "United States",
        postalCode: "60601",
      },
      emergencyContact: {
        name: "Lisa Brown",
        relationship: "Sister",
        phone: "+1-555-0789",
        email: "lisa.brown@email.com",
      },
      socialMedia: {
        linkedin: "linkedin.com/in/mike-johnson-equipment",
        twitter: "",
        facebook: "",
        instagram: "",
      },
      preferences: {
        theme: "light",
        language: "en-US",
        timezone: "America/Chicago",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12h",
        currency: "USD",
      },
      notificationSettings: {
        email: {
          loginAlerts: true,
          securityUpdates: false,
          systemAnnouncements: true,
          marketingEmails: false,
        },
        push: {
          loginAlerts: false,
          securityUpdates: false,
          systemAnnouncements: false,
          marketingNotifications: false,
        },
        sms: {
          loginAlerts: true,
          securityUpdates: true,
          emergencyAlerts: true,
        },
      },
      privacySettings: {
        profileVisibility: "private",
        showEmail: false,
        showPhone: false,
        showLocation: false,
        allowContact: false,
      },
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
  ];

  // Mock internationalization data
  const mockLanguages: LanguageOption[] = [
    { code: "en-US", name: "English (US)", nativeName: "English", flag: "🇺🇸" },
    { code: "en-GB", name: "English (UK)", nativeName: "English", flag: "🇬🇧" },
    { code: "es-ES", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
    { code: "fr-FR", name: "French", nativeName: "Français", flag: "🇫🇷" },
    { code: "de-DE", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
    { code: "it-IT", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
    {
      code: "pt-BR",
      name: "Portuguese (Brazil)",
      nativeName: "Português",
      flag: "🇧🇷",
    },
    { code: "ja-JP", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
    { code: "ko-KR", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
    {
      code: "zh-CN",
      name: "Chinese (Simplified)",
      nativeName: "中文",
      flag: "🇨🇳",
    },
    { code: "ar-SA", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
    { code: "hi-IN", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  ];

  const mockTimezones: TimezoneOption[] = [
    { value: "America/New_York", label: "Eastern Time (ET)", offset: "UTC-5" },
    { value: "America/Chicago", label: "Central Time (CT)", offset: "UTC-6" },
    { value: "America/Denver", label: "Mountain Time (MT)", offset: "UTC-7" },
    {
      value: "America/Los_Angeles",
      label: "Pacific Time (PT)",
      offset: "UTC-8",
    },
    {
      value: "Europe/London",
      label: "Greenwich Mean Time (GMT)",
      offset: "UTC+0",
    },
    {
      value: "Europe/Paris",
      label: "Central European Time (CET)",
      offset: "UTC+1",
    },
    {
      value: "Europe/Berlin",
      label: "Central European Time (CET)",
      offset: "UTC+1",
    },
    {
      value: "Asia/Tokyo",
      label: "Japan Standard Time (JST)",
      offset: "UTC+9",
    },
    {
      value: "Asia/Shanghai",
      label: "China Standard Time (CST)",
      offset: "UTC+8",
    },
    {
      value: "Australia/Sydney",
      label: "Australian Eastern Time (AET)",
      offset: "UTC+10",
    },
  ];

  const mockCurrencies: CurrencyOption[] = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  ];

  // Mock administrative profile data
  const mockAdminProfiles: AdministrativeProfile[] = [
    {
      id: 1,
      userId: 1,
      adminLevel: "super_admin",
      permissions: [
        "user_management",
        "role_management",
        "system_settings",
        "audit_logs",
        "security_management",
      ],
      assignedDepartments: ["IT", "HR", "Operations", "Finance"],
      adminResponsibilities: [
        "System Administration",
        "User Management",
        "Security Oversight",
        "Policy Management",
      ],
      emergencyContact: {
        name: "Sarah Johnson",
        relationship: "Spouse",
        phone: "+1-555-0123",
        email: "sarah.johnson@email.com",
      },
      adminSettings: {
        canCreateUsers: true,
        canDeleteUsers: true,
        canManageRoles: true,
        canAccessSystemSettings: true,
        canViewAuditLogs: true,
        canManageIntegrations: true,
        canManageSecurity: true,
        canManageProfiles: true,
        ipRestrictions: ["192.168.1.0/24", "10.0.0.0/8"],
        sessionTimeout: 30,
        mfaRequired: true,
        maxLoginAttempts: 3,
      },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-20T00:00:00Z",
    },
    {
      id: 2,
      userId: 2,
      adminLevel: "admin",
      permissions: ["user_management", "role_management", "audit_logs"],
      assignedDepartments: ["HR", "Operations"],
      adminResponsibilities: [
        "User Management",
        "Role Assignment",
        "Audit Review",
      ],
      emergencyContact: {
        name: "Mike Wilson",
        relationship: "Partner",
        phone: "+1-555-0456",
        email: "mike.wilson@email.com",
      },
      adminSettings: {
        canCreateUsers: true,
        canDeleteUsers: false,
        canManageRoles: true,
        canAccessSystemSettings: false,
        canViewAuditLogs: true,
        canManageIntegrations: false,
        canManageSecurity: false,
        canManageProfiles: true,
        ipRestrictions: ["192.168.1.0/24"],
        sessionTimeout: 60,
        mfaRequired: true,
        maxLoginAttempts: 5,
      },
      createdAt: "2024-01-05T00:00:00Z",
      updatedAt: "2024-01-18T00:00:00Z",
    },
    {
      id: 3,
      userId: 3,
      adminLevel: "sub_admin",
      permissions: ["user_management"],
      assignedDepartments: ["Operations"],
      adminResponsibilities: ["User Support", "Basic User Management"],
      emergencyContact: {
        name: "Lisa Brown",
        relationship: "Sister",
        phone: "+1-555-0789",
        email: "lisa.brown@email.com",
      },
      adminSettings: {
        canCreateUsers: true,
        canDeleteUsers: false,
        canManageRoles: false,
        canAccessSystemSettings: false,
        canViewAuditLogs: false,
        canManageIntegrations: false,
        canManageSecurity: false,
        canManageProfiles: false,
        ipRestrictions: ["192.168.1.0/24"],
        sessionTimeout: 120,
        mfaRequired: false,
        maxLoginAttempts: 10,
      },
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
  ];

  const mockAdminRoles: AdminRole[] = [
    {
      id: "role_1",
      name: "Super Administrator",
      description: "Full system access with all administrative privileges",
      level: "super_admin",
      permissions: [
        "user_management",
        "role_management",
        "system_settings",
        "audit_logs",
        "security_management",
        "integration_management",
      ],
      isActive: true,
      userCount: 1,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-20T00:00:00Z",
    },
    {
      id: "role_2",
      name: "System Administrator",
      description: "System administration with user and role management",
      level: "admin",
      permissions: [
        "user_management",
        "role_management",
        "audit_logs",
        "security_management",
      ],
      isActive: true,
      userCount: 1,
      createdAt: "2024-01-05T00:00:00Z",
      updatedAt: "2024-01-18T00:00:00Z",
    },
    {
      id: "role_3",
      name: "User Administrator",
      description: "Basic user management and support",
      level: "sub_admin",
      permissions: ["user_management"],
      isActive: true,
      userCount: 1,
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
  ];

  const mockAdminPermissions: AdminPermission[] = [
    {
      id: "perm_1",
      name: "User Management",
      description: "Create, edit, and delete user accounts",
      category: "User Administration",
      resource: "users",
      action: "manage",
      isCritical: true,
    },
    {
      id: "perm_2",
      name: "Role Management",
      description: "Create, edit, and delete user roles",
      category: "User Administration",
      resource: "roles",
      action: "manage",
      isCritical: true,
    },
    {
      id: "perm_3",
      name: "System Settings",
      description: "Access and modify system configuration",
      category: "System Administration",
      resource: "system",
      action: "configure",
      isCritical: true,
    },
    {
      id: "perm_4",
      name: "Audit Logs",
      description: "View system audit logs and activity",
      category: "Security",
      resource: "audit",
      action: "view",
      isCritical: false,
    },
    {
      id: "perm_5",
      name: "Security Management",
      description: "Manage security policies and settings",
      category: "Security",
      resource: "security",
      action: "manage",
      isCritical: true,
    },
    {
      id: "perm_6",
      name: "Integration Management",
      description: "Manage third-party integrations",
      category: "System Administration",
      resource: "integrations",
      action: "manage",
      isCritical: false,
    },
  ];

  // Mock Security & Access Control data
  const mockAdminRouteProtections: AdminRouteProtection[] = [
    {
      id: "route_1",
      route: "/api/admin/users/create",
      method: "POST",
      requiredPermissions: ["user_management"],
      requiredAdminLevel: "admin",
      isActive: true,
      description: "Create new user accounts",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-20T00:00:00Z",
    },
    {
      id: "route_2",
      route: "/api/admin/users/delete",
      method: "DELETE",
      requiredPermissions: ["user_management"],
      requiredAdminLevel: "super_admin",
      isActive: true,
      description: "Delete user accounts",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-20T00:00:00Z",
    },
    {
      id: "route_3",
      route: "/api/admin/system/settings",
      method: "GET",
      requiredPermissions: ["system_settings"],
      requiredAdminLevel: "super_admin",
      isActive: true,
      description: "Access system configuration",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-20T00:00:00Z",
    },
    {
      id: "route_4",
      route: "/api/admin/security/policies",
      method: "POST",
      requiredPermissions: ["security_management"],
      requiredAdminLevel: "admin",
      isActive: true,
      description: "Manage security policies",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-20T00:00:00Z",
    },
  ];

  const mockAdminSessions: AdminSession[] = [
    {
      id: "session_1",
      adminId: 1,
      adminName: "Sarah Johnson",
      sessionToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "New York, US",
      loginTime: "2024-01-20T10:00:00Z",
      lastActivity: "2024-01-20T15:30:00Z",
      isActive: true,
      deviceType: "Desktop",
      browser: "Chrome 120.0",
      os: "Windows 11",
      mfaVerified: true,
      riskScore: 15,
      sessionDuration: 330,
    },
    {
      id: "session_2",
      adminId: 2,
      adminName: "Mike Wilson",
      sessionToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      ipAddress: "192.168.1.101",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      location: "Los Angeles, US",
      loginTime: "2024-01-20T09:00:00Z",
      lastActivity: "2024-01-20T14:45:00Z",
      isActive: true,
      deviceType: "Desktop",
      browser: "Safari 17.0",
      os: "macOS 14.0",
      mfaVerified: true,
      riskScore: 25,
      sessionDuration: 345,
    },
    {
      id: "session_3",
      adminId: 3,
      adminName: "Lisa Brown",
      sessionToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      ipAddress: "192.168.1.102",
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
      location: "Chicago, US",
      loginTime: "2024-01-20T11:00:00Z",
      lastActivity: "2024-01-20T16:20:00Z",
      isActive: false,
      deviceType: "Mobile",
      browser: "Safari Mobile",
      os: "iOS 17.0",
      mfaVerified: false,
      riskScore: 45,
      sessionDuration: 320,
    },
  ];

  const mockAdminActivityLogs: AdminActivityLog[] = [
    {
      id: "log_1",
      adminId: 1,
      adminName: "Sarah Johnson",
      action: "CREATE_USER",
      resource: "users",
      details: "Created new user account: john.doe@company.com",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "New York, US",
      timestamp: "2024-01-20T15:30:00Z",
      status: "success",
      severity: "low",
      riskScore: 15,
      sessionId: "session_1",
      affectedUsers: [101],
      systemImpact: "User account created successfully",
    },
    {
      id: "log_2",
      adminId: 2,
      adminName: "Mike Wilson",
      action: "UPDATE_ROLE",
      resource: "roles",
      details: 'Updated role permissions for "Staff Manager" role',
      ipAddress: "192.168.1.101",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      location: "Los Angeles, US",
      timestamp: "2024-01-20T14:45:00Z",
      status: "success",
      severity: "medium",
      riskScore: 25,
      sessionId: "session_2",
      affectedUsers: [50, 51, 52],
      systemImpact: "Role permissions updated for 3 users",
    },
    {
      id: "log_3",
      adminId: 1,
      adminName: "Sarah Johnson",
      action: "DELETE_USER",
      resource: "users",
      details: "Attempted to delete user account: jane.smith@company.com",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "New York, US",
      timestamp: "2024-01-20T13:15:00Z",
      status: "blocked",
      severity: "high",
      riskScore: 75,
      sessionId: "session_1",
      affectedUsers: [102],
      systemImpact: "Delete operation blocked by security policy",
    },
    {
      id: "log_4",
      adminId: 3,
      adminName: "Lisa Brown",
      action: "ACCESS_SYSTEM_SETTINGS",
      resource: "system",
      details:
        "Attempted to access system configuration without proper permissions",
      ipAddress: "192.168.1.102",
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
      location: "Chicago, US",
      timestamp: "2024-01-20T12:30:00Z",
      status: "failed",
      severity: "medium",
      riskScore: 35,
      sessionId: "session_3",
      affectedUsers: [],
      systemImpact: "Access denied due to insufficient permissions",
    },
  ];

  const mockAdminSecurityFeatures: AdminSecurityFeature[] = [
    {
      id: "feature_1",
      name: "Multi-Factor Authentication",
      description: "Require MFA for all administrative accounts",
      category: "authentication",
      isEnabled: true,
      configuration: {
        mfaType: "TOTP",
        backupCodes: true,
        rememberDevice: true,
        gracePeriod: 24,
      },
      lastUpdated: "2024-01-20T00:00:00Z",
      updatedBy: "Sarah Johnson",
      complianceStatus: "compliant",
    },
    {
      id: "feature_2",
      name: "Session Management",
      description: "Monitor and control active administrative sessions",
      category: "monitoring",
      isEnabled: true,
      configuration: {
        maxSessions: 3,
        sessionTimeout: 30,
        idleTimeout: 15,
        forceLogout: true,
      },
      lastUpdated: "2024-01-19T00:00:00Z",
      updatedBy: "Mike Wilson",
      complianceStatus: "compliant",
    },
    {
      id: "feature_3",
      name: "IP Restriction",
      description: "Restrict administrative access to specific IP ranges",
      category: "authorization",
      isEnabled: true,
      configuration: {
        allowedIPs: ["192.168.1.0/24", "10.0.0.0/8"],
        geolocationRestriction: false,
        vpnRequired: false,
      },
      lastUpdated: "2024-01-18T00:00:00Z",
      updatedBy: "Sarah Johnson",
      complianceStatus: "compliant",
    },
    {
      id: "feature_4",
      name: "Audit Logging",
      description: "Comprehensive logging of all administrative actions",
      category: "compliance",
      isEnabled: true,
      configuration: {
        logLevel: "detailed",
        retentionPeriod: 90,
        realTimeAlerts: true,
        complianceReporting: true,
      },
      lastUpdated: "2024-01-17T00:00:00Z",
      updatedBy: "Mike Wilson",
      complianceStatus: "compliant",
    },
  ];

  const mockAdminAccessControls: AdminAccessControl[] = [
    {
      id: "access_1",
      adminId: 1,
      resource: "user_management",
      permission: "full_access",
      grantedAt: "2024-01-01T00:00:00Z",
      grantedBy: "System",
      isActive: true,
      auditTrail: [
        "Granted by system initialization",
        "Reviewed by compliance team",
      ],
    },
    {
      id: "access_2",
      adminId: 2,
      resource: "role_management",
      permission: "read_write",
      grantedAt: "2024-01-05T00:00:00Z",
      grantedBy: "Sarah Johnson",
      expiresAt: "2024-12-31T23:59:59Z",
      isActive: true,
      auditTrail: ["Granted by Sarah Johnson", "Temporary access for project"],
    },
    {
      id: "access_3",
      adminId: 3,
      resource: "user_management",
      permission: "read_only",
      grantedAt: "2024-01-10T00:00:00Z",
      grantedBy: "Mike Wilson",
      isActive: true,
      auditTrail: ["Granted by Mike Wilson", "Limited access for support role"],
    },
  ];

  const mockAdminSecurityPolicies: AdminSecurityPolicy[] = [
    {
      id: "policy_1",
      name: "Password Policy",
      description: "Strong password requirements for administrative accounts",
      policyType: "password",
      rules: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAge: 90,
        preventReuse: 5,
      },
      isActive: true,
      priority: 1,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-20T00:00:00Z",
      complianceRequirements: ["SOX", "GDPR", "HIPAA"],
    },
    {
      id: "policy_2",
      name: "Session Policy",
      description: "Administrative session management and timeout policies",
      policyType: "session",
      rules: {
        maxSessionDuration: 480,
        idleTimeout: 15,
        maxConcurrentSessions: 3,
        forceLogoutOnInactivity: true,
        requireReauthentication: true,
      },
      isActive: true,
      priority: 2,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-20T00:00:00Z",
      complianceRequirements: ["SOX", "GDPR"],
    },
    {
      id: "policy_3",
      name: "Access Control Policy",
      description: "Granular access control for administrative resources",
      policyType: "access",
      rules: {
        principleOfLeastPrivilege: true,
        requireApproval: true,
        maxAccessDuration: 30,
        auditAllAccess: true,
        blockSuspiciousActivity: true,
      },
      isActive: true,
      priority: 3,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-20T00:00:00Z",
      complianceRequirements: ["SOX", "GDPR", "HIPAA", "PCI-DSS"],
    },
  ];

  // Phase 3: Advanced Administrative Features Mock Data
  const mockAdminThreatDetections: AdminThreatDetection[] = [
    {
      id: "threat_1",
      threatType: "brute_force",
      severity: "high",
      status: "investigating",
      description:
        "Multiple failed login attempts detected from suspicious IP address",
      indicators: [
        "Failed login attempts",
        "Suspicious IP range",
        "Unusual time pattern",
      ],
      affectedAdmins: [3],
      detectedAt: "2024-01-20T14:30:00Z",
      lastUpdated: "2024-01-20T15:00:00Z",
      riskScore: 75,
      automatedResponse: true,
      responseActions: [
        "IP blocked",
        "Account locked",
        "Alert sent to security team",
      ],
    },
    {
      id: "threat_2",
      threatType: "suspicious_activity",
      severity: "medium",
      status: "detected",
      description:
        "Unusual data access pattern detected for sensitive user information",
      indicators: [
        "Bulk data export",
        "Unusual access time",
        "Multiple user records accessed",
      ],
      affectedAdmins: [2],
      detectedAt: "2024-01-20T13:15:00Z",
      lastUpdated: "2024-01-20T13:15:00Z",
      riskScore: 45,
      automatedResponse: false,
      responseActions: ["Activity logged", "Admin notified"],
    },
    {
      id: "threat_3",
      threatType: "unauthorized_access",
      severity: "critical",
      status: "mitigated",
      description:
        "Attempted access to system settings without proper authorization",
      indicators: [
        "Access denied",
        "Privilege escalation attempt",
        "Unauthorized resource",
      ],
      affectedAdmins: [3],
      detectedAt: "2024-01-20T12:00:00Z",
      lastUpdated: "2024-01-20T12:30:00Z",
      riskScore: 90,
      automatedResponse: true,
      responseActions: [
        "Access blocked",
        "Session terminated",
        "Security alert raised",
      ],
    },
  ];

  const mockAdminAnomalyDetections: AdminAnomalyDetection[] = [
    {
      id: "anomaly_1",
      anomalyType: "unusual_login_time",
      confidence: 85,
      status: "detected",
      description: "Login attempt outside normal business hours",
      baseline: {
        normalStartTime: "08:00",
        normalEndTime: "18:00",
        timezone: "UTC",
      },
      currentValue: { loginTime: "02:30", timezone: "UTC" },
      deviation: 6.5,
      detectedAt: "2024-01-20T02:30:00Z",
      adminId: 2,
      riskScore: 60,
    },
    {
      id: "anomaly_2",
      anomalyType: "unusual_location",
      confidence: 92,
      status: "investigating",
      description: "Login from new geographic location",
      baseline: {
        usualLocations: ["New York", "Los Angeles"],
        maxDistance: 100,
      },
      currentValue: { location: "London, UK", distance: 3500 },
      deviation: 3500,
      detectedAt: "2024-01-20T10:00:00Z",
      adminId: 1,
      riskScore: 70,
    },
    {
      id: "anomaly_3",
      anomalyType: "unusual_activity_pattern",
      confidence: 78,
      status: "resolved",
      description:
        "Unusual number of administrative actions in short time period",
      baseline: { avgActionsPerHour: 5, maxActionsPerHour: 15 },
      currentValue: { actionsInLastHour: 25, timePeriod: "1 hour" },
      deviation: 67,
      detectedAt: "2024-01-19T16:00:00Z",
      adminId: 1,
      riskScore: 55,
    },
  ];

  const mockAdminComplianceReports: AdminComplianceReport[] = [
    {
      id: "report_1",
      reportType: "security_audit",
      period: "Q4 2024",
      generatedAt: "2024-01-20T00:00:00Z",
      generatedBy: "Sarah Johnson",
      status: "approved",
      summary: {
        totalFindings: 12,
        criticalIssues: 1,
        highIssues: 3,
        mediumIssues: 5,
        lowIssues: 3,
        complianceScore: 87,
      },
      findings: [
        {
          id: "finding_1",
          category: "security",
          severity: "critical",
          description: "MFA not enabled for all administrative accounts",
          impact: "High risk of unauthorized access",
          recommendation: "Enable MFA for all admin accounts within 7 days",
          status: "open",
          assignedTo: "Mike Wilson",
          dueDate: "2024-01-27T00:00:00Z",
          createdAt: "2024-01-20T00:00:00Z",
        },
        {
          id: "finding_2",
          category: "access_control",
          severity: "high",
          description: "Excessive permissions granted to sub-admin role",
          impact: "Potential privilege escalation",
          recommendation: "Review and reduce sub-admin permissions",
          status: "in_progress",
          assignedTo: "Lisa Brown",
          dueDate: "2024-01-25T00:00:00Z",
          createdAt: "2024-01-20T00:00:00Z",
        },
      ],
      recommendations: [
        "Implement mandatory MFA for all administrative accounts",
        "Review and update role-based access controls",
        "Enhance session monitoring and timeout policies",
        "Implement automated threat detection and response",
      ],
      attachments: ["security_audit_q4_2024.pdf", "compliance_checklist.xlsx"],
    },
    {
      id: "report_2",
      reportType: "access_review",
      period: "Monthly - January 2024",
      generatedAt: "2024-01-15T00:00:00Z",
      generatedBy: "Mike Wilson",
      status: "reviewed",
      summary: {
        totalFindings: 8,
        criticalIssues: 0,
        highIssues: 2,
        mediumIssues: 4,
        lowIssues: 2,
        complianceScore: 92,
      },
      findings: [
        {
          id: "finding_3",
          category: "data_protection",
          severity: "high",
          description: "Sensitive data access not properly logged",
          impact: "Compliance violation and audit trail gaps",
          recommendation: "Implement comprehensive data access logging",
          status: "open",
          assignedTo: "Sarah Johnson",
          dueDate: "2024-01-30T00:00:00Z",
          createdAt: "2024-01-15T00:00:00Z",
        },
      ],
      recommendations: [
        "Enhance data access logging and monitoring",
        "Implement data classification and labeling",
        "Review and update data retention policies",
        "Conduct regular access rights reviews",
      ],
      attachments: [
        "access_review_jan_2024.pdf",
        "user_permissions_matrix.xlsx",
      ],
    },
  ];

  const mockAdminSecurityWorkflows: AdminSecurityWorkflow[] = [
    {
      id: "workflow_1",
      workflowType: "access_request",
      status: "pending_approval",
      priority: "high",
      title: "Emergency Access Request - Database Administrator",
      description:
        "Request for temporary elevated access to resolve critical system issue",
      initiator: "Lisa Brown",
      approvers: ["Sarah Johnson", "Mike Wilson"],
      currentStep: 2,
      totalSteps: 3,
      steps: [
        {
          id: "step_1",
          stepNumber: 1,
          title: "Access Request Submitted",
          description: "Emergency access request submitted with justification",
          assignee: "Lisa Brown",
          status: "completed",
          required: true,
          dueDate: "2024-01-20T10:00:00Z",
          completedAt: "2024-01-20T10:15:00Z",
          comments: ["Emergency access needed for critical system maintenance"],
          attachments: ["emergency_request_form.pdf"],
        },
        {
          id: "step_2",
          stepNumber: 2,
          title: "Security Review",
          description:
            "Security team review of access request and risk assessment",
          assignee: "Mike Wilson",
          status: "in_progress",
          required: true,
          dueDate: "2024-01-20T16:00:00Z",
          comments: [
            "Reviewing access scope and duration",
            "Risk assessment in progress",
          ],
          attachments: [],
        },
        {
          id: "step_3",
          stepNumber: 3,
          title: "Final Approval",
          description: "Final approval from senior administrator",
          assignee: "Sarah Johnson",
          status: "pending",
          required: true,
          dueDate: "2024-01-20T18:00:00Z",
          comments: [],
          attachments: [],
        },
      ],
      createdAt: "2024-01-20T10:00:00Z",
      updatedAt: "2024-01-20T10:15:00Z",
      dueDate: "2024-01-20T18:00:00Z",
    },
    {
      id: "workflow_2",
      workflowType: "security_incident",
      status: "in_progress",
      priority: "urgent",
      title: "Suspicious Login Activity Investigation",
      description:
        "Investigation of multiple failed login attempts from suspicious IP",
      initiator: "System",
      approvers: ["Sarah Johnson"],
      currentStep: 1,
      totalSteps: 4,
      steps: [
        {
          id: "step_4",
          stepNumber: 1,
          title: "Incident Detection",
          description: "Automated detection of suspicious login activity",
          assignee: "System",
          status: "completed",
          required: true,
          dueDate: "2024-01-20T14:30:00Z",
          completedAt: "2024-01-20T14:30:00Z",
          comments: ["Threat detected automatically", "IP address blocked"],
          attachments: ["threat_detection_log.pdf"],
        },
      ],
      createdAt: "2024-01-20T14:30:00Z",
      updatedAt: "2024-01-20T14:30:00Z",
      dueDate: "2024-01-20T20:00:00Z",
    },
  ];

  const mockAdminSecurityIntegrations: AdminSecurityIntegration[] = [
    {
      id: "integration_1",
      name: "Splunk SIEM",
      type: "siem",
      vendor: "Splunk Inc.",
      version: "8.2.4",
      status: "active",
      configuration: {
        serverUrl: "https://splunk.company.com:8089",
        indexName: "admin_security",
        sourcetype: "admin_activity",
        apiToken: "encrypted_token_here",
      },
      lastSync: "2024-01-20T15:00:00Z",
      syncStatus: "success",
      healthScore: 95,
      alerts: [
        {
          id: "alert_1",
          integrationId: "integration_1",
          alertType: "warning",
          message: "High volume of admin login events detected",
          timestamp: "2024-01-20T14:45:00Z",
          status: "acknowledged",
          severity: "medium",
          affectedServices: ["Admin Portal", "API Gateway"],
          resolution: "Normal business activity, no action required",
        },
      ],
      apiEndpoints: ["/services/search/jobs", "/services/receivers/simple"],
      credentials: {
        encrypted: true,
        lastRotated: "2024-01-01T00:00:00Z",
        expiresAt: "2024-04-01T00:00:00Z",
      },
    },
    {
      id: "integration_2",
      name: "CrowdStrike EDR",
      type: "edr",
      vendor: "CrowdStrike",
      version: "6.45.0",
      status: "active",
      configuration: {
        cloudUrl: "https://company.crowdstrike.com",
        apiKey: "encrypted_api_key_here",
        sensorGroup: "admin_workstations",
      },
      lastSync: "2024-01-20T14:30:00Z",
      syncStatus: "success",
      healthScore: 98,
      alerts: [],
      apiEndpoints: [
        "/devices/queries/devices/v1",
        "/alerts/queries/alerts/v1",
      ],
      credentials: {
        encrypted: true,
        lastRotated: "2024-01-01T00:00:00Z",
        expiresAt: "2024-07-01T00:00:00Z",
      },
    },
    {
      id: "integration_3",
      name: "Okta IAM",
      type: "iam",
      vendor: "Okta Inc.",
      version: "2023.12.1",
      status: "maintenance",
      configuration: {
        orgUrl: "https://company.okta.com",
        apiToken: "encrypted_token_here",
        groupMapping: true,
      },
      lastSync: "2024-01-20T12:00:00Z",
      syncStatus: "failed",
      healthScore: 45,
      alerts: [
        {
          id: "alert_2",
          integrationId: "integration_3",
          alertType: "error",
          message: "API synchronization failed - authentication error",
          timestamp: "2024-01-20T12:00:00Z",
          status: "active",
          severity: "high",
          affectedServices: ["User Authentication", "SSO"],
          resolution: "API token expired, rotation required",
        },
      ],
      apiEndpoints: ["/api/v1/users", "/api/v1/groups"],
      credentials: {
        encrypted: true,
        lastRotated: "2024-01-01T00:00:00Z",
        expiresAt: "2024-01-01T00:00:00Z",
      },
    },
  ];

  // Phase 4: Integration & Automation Features mock data
  const mockSystemIntegrations: SystemIntegration[] = [
    {
      id: "sys_int_1",
      name: "Active Directory Sync",
      type: "database",
      status: "active",
      endpoint: "ldap://ad.company.com:389",
      authentication: "basic",
      lastSync: "2024-01-20T15:00:00Z",
      syncFrequency: "hourly",
      dataFlow: "inbound",
      errorCount: 2,
      successRate: 98.5,
      lastError: "Connection timeout",
      configuration: {
        baseDN: "DC=company,DC=com",
        filter: "(objectClass=user)",
      },
      healthScore: 95,
      uptime: 99.8,
      responseTime: 150,
      dataVolume: 1024,
      securityLevel: "high",
    },
    {
      id: "sys_int_2",
      name: "HR System API",
      type: "api",
      status: "active",
      endpoint: "https://hr.company.com/api/v1",
      authentication: "oauth2",
      lastSync: "2024-01-20T14:30:00Z",
      syncFrequency: "daily",
      dataFlow: "bidirectional",
      errorCount: 0,
      successRate: 100,
      configuration: { apiVersion: "v1", rateLimit: 1000 },
      healthScore: 100,
      uptime: 99.9,
      responseTime: 85,
      dataVolume: 512,
      securityLevel: "enterprise",
    },
    {
      id: "sys_int_3",
      name: "Email Service Webhook",
      type: "webhook",
      status: "active",
      endpoint: "https://email.company.com/webhook",
      authentication: "hmac",
      lastSync: "2024-01-20T15:15:00Z",
      syncFrequency: "realtime",
      dataFlow: "outbound",
      errorCount: 1,
      successRate: 99.2,
      lastError: "Rate limit exceeded",
      configuration: { retryAttempts: 3, timeout: 5000 },
      healthScore: 92,
      uptime: 99.5,
      responseTime: 200,
      dataVolume: 256,
      securityLevel: "medium",
    },
  ];

  const mockAutomationWorkflows: AutomationWorkflow[] = [
    {
      id: "workflow_1",
      name: "New User Onboarding",
      description:
        "Automated workflow for new user setup and access provisioning",
      trigger: "event",
      status: "active",
      priority: "high",
      category: "user_management",
      steps: [
        {
          id: "step_1",
          name: "Create User Account",
          type: "action",
          order: 1,
          status: "completed",
          input: { userData: "user_info" },
          output: { userId: "12345" },
          executionTime: 2.5,
          retryCount: 0,
          maxRetries: 3,
          timeout: 30,
        },
        {
          id: "step_2",
          name: "Assign Default Role",
          type: "action",
          order: 2,
          status: "completed",
          input: { userId: "12345", role: "staff" },
          output: { roleAssigned: true },
          executionTime: 1.8,
          retryCount: 0,
          maxRetries: 3,
          timeout: 30,
        },
      ],
      currentStep: 2,
      totalSteps: 2,
      lastRun: "2024-01-20T15:00:00Z",
      nextRun: "2024-01-20T16:00:00Z",
      executionTime: 4.3,
      successCount: 45,
      failureCount: 2,
      createdBy: "admin@company.com",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-20T15:00:00Z",
      tags: ["onboarding", "automation", "user_management"],
      conditions: [
        {
          id: "cond_1",
          field: "user.role",
          operator: "equals",
          value: "staff",
          logicalOperator: "and",
        },
      ],
      actions: [
        {
          id: "action_1",
          type: "create_user",
          parameters: { template: "staff_user" },
          target: "user_management_system",
          description: "Create new user account",
        },
      ],
    },
    {
      id: "workflow_2",
      name: "Security Compliance Check",
      description:
        "Automated security compliance verification for user accounts",
      trigger: "schedule",
      status: "active",
      priority: "medium",
      category: "compliance",
      steps: [
        {
          id: "step_1",
          name: "Check Password Age",
          type: "condition",
          order: 1,
          status: "completed",
          input: { maxAge: 90 },
          output: { expiredPasswords: 5 },
          executionTime: 0.5,
          retryCount: 0,
          maxRetries: 3,
          timeout: 10,
        },
      ],
      currentStep: 1,
      totalSteps: 1,
      lastRun: "2024-01-20T14:00:00Z",
      nextRun: "2024-01-21T14:00:00Z",
      executionTime: 0.5,
      successCount: 30,
      failureCount: 0,
      createdBy: "security@company.com",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-20T14:00:00Z",
      tags: ["security", "compliance", "automation"],
      conditions: [],
      actions: [],
    },
  ];

  const mockDataSyncJobs: DataSyncJob[] = [
    {
      id: "sync_1",
      name: "User Profile Sync",
      source: "HR System",
      destination: "User Management",
      type: "incremental",
      status: "completed",
      progress: 100,
      totalRecords: 1250,
      processedRecords: 1250,
      failedRecords: 0,
      startTime: "2024-01-20T14:00:00Z",
      endTime: "2024-01-20T14:15:00Z",
      duration: 900,
      retryCount: 0,
      maxRetries: 3,
      schedule: "0 14 * * *",
      lastSuccessfulRun: "2024-01-20T14:00:00Z",
      nextRun: "2024-01-21T14:00:00Z",
      dataSize: 2048,
      compressionRatio: 0.75,
      encryption: true,
    },
    {
      id: "sync_2",
      name: "Role Permission Sync",
      source: "Active Directory",
      destination: "Permission System",
      type: "full",
      status: "running",
      progress: 65,
      totalRecords: 500,
      processedRecords: 325,
      failedRecords: 0,
      startTime: "2024-01-20T15:00:00Z",
      retryCount: 0,
      maxRetries: 3,
      schedule: "0 15 * * *",
      nextRun: "2024-01-21T15:00:00Z",
      dataSize: 1024,
      compressionRatio: 0.8,
      encryption: true,
      duration: 0,
    },
  ];

  const mockWebhookEndpoints: WebhookEndpoint[] = [
    {
      id: "webhook_1",
      name: "User Activity Notifications",
      url: "https://notifications.company.com/webhook/activity",
      method: "POST",
      status: "active",
      events: ["user.login", "user.logout", "user.permission_change"],
      authentication: "hmac",
      headers: {
        "Content-Type": "application/json",
        "X-Signature": "hmac_sha256",
      },
      timeout: 5000,
      retryCount: 3,
      lastTriggered: "2024-01-20T15:10:00Z",
      successCount: 150,
      failureCount: 2,
      responseTime: 180,
      payloadSize: 512,
      securityLevel: "private",
      rateLimit: 100,
      rateLimitWindow: 3600,
    },
    {
      id: "webhook_2",
      name: "Security Alerts",
      url: "https://security.company.com/webhook/alerts",
      method: "POST",
      status: "active",
      events: ["security.threat", "security.anomaly", "security.incident"],
      authentication: "bearer",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
      timeout: 10000,
      retryCount: 5,
      lastTriggered: "2024-01-20T15:05:00Z",
      successCount: 25,
      failureCount: 0,
      responseTime: 250,
      payloadSize: 1024,
      securityLevel: "restricted",
      rateLimit: 50,
      rateLimitWindow: 3600,
    },
  ];

  const mockAPIManagement: APIManagement[] = [
    {
      id: "api_1",
      name: "User Management API",
      version: "v2.1.0",
      baseUrl: "https://api.company.com/users",
      status: "active",
      endpoints: [
        {
          id: "endpoint_1",
          path: "/users",
          method: "GET",
          status: "active",
          description: "Retrieve all users with pagination",
          parameters: [
            {
              name: "page",
              type: "number",
              required: false,
              description: "Page number for pagination",
              defaultValue: 1,
            },
            {
              name: "limit",
              type: "number",
              required: false,
              description: "Number of users per page",
              defaultValue: 20,
            },
          ],
          responses: [
            {
              code: 200,
              description: "Success",
              schema: {
                type: "object",
                properties: { users: { type: "array" } },
              },
              examples: [{ users: [] }],
            },
          ],
          rateLimit: 1000,
          authentication: true,
          deprecated: false,
          usage: {
            totalCalls: 5000,
            successRate: 99.8,
            averageResponseTime: 120,
            lastCalled: "2024-01-20T15:00:00Z",
          },
        },
      ],
      authentication: "oauth2",
      rateLimit: 10000,
      rateLimitWindow: 3600,
      documentation: "https://docs.company.com/api/users",
      lastUpdated: "2024-01-15T00:00:00Z",
      usage: {
        totalRequests: 25000,
        successfulRequests: 24950,
        failedRequests: 50,
        averageResponseTime: 150,
        peakRequests: 500,
        uniqueUsers: 150,
      },
      security: {
        ssl: true,
        encryption: true,
        ipWhitelist: ["192.168.1.0/24", "10.0.0.0/8"],
        userAgentFilter: true,
        requestValidation: true,
      },
    },
  ];

  const createUserFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      username: "",
      phone_number: "",
      password: "",
      role: "staff",
    },
    validationSchema: yup.object({
      name: yup.string().required("Name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      username: yup.string().required("Username is required"),
      phone_number: yup.string().required("Phone number is required"),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      role: yup.string().required("Role is required"),
    }),
    onSubmit: async (values) => {
      try {
        await createUserByAdmin(values);
        toast.success("User created successfully!");
        setShowCreateUser(false);
        createUserFormik.resetForm();
        refetch();
      } catch (error) {
        toast.error("Failed to create user");
      }
    },
  });

  const inviteUserFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      username: "",
      phone_number: "",
      role: "staff",
    },
    validationSchema: yup.object({
      name: yup.string().required("Name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      username: yup.string().required("Username is required"),
      phone_number: yup.string().required("Phone number is required"),
      role: yup.string().required("Role is required"),
    }),
    onSubmit: async (values) => {
      try {
        await inviteUser(values);
        toast.success("Invitation sent successfully!");
        setShowInviteUser(false);
        inviteUserFormik.resetForm();
        refetch();
      } catch (error) {
        toast.error("Failed to send invitation");
      }
    },
  });

  const handleBulkImport = async () => {
    if (!bulkImportFile) {
      toast.error("Please select a file");
      return;
    }

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", bulkImportFile);

      const response = await bulkImportUsers(formData);
      setImportResults({
        success: response.data || [],
        errors: [],
      });
      toast.success("Bulk import completed!");
      setBulkImportFile(null);
      refetch();
    } catch (error) {
      toast.error("Failed to import users");
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      "name,email,username,phone_number,password,role\nJohn Doe,john@example.com,johndoe,+1234567890,password123,staff\nJane Smith,jane@example.com,janesmith,+1234567891,password123,staff";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_import_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "staff":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Role & Permission Management helper functions
  const getPermissionCategoryColor = (category: string) => {
    switch (category) {
      case "User Management":
        return "bg-blue-100 text-blue-800";
      case "Member Management":
        return "bg-green-100 text-green-800";
      case "Equipment Management":
        return "bg-purple-100 text-purple-800";
      case "Payment Management":
        return "bg-yellow-100 text-yellow-800";
      case "Subscription Management":
        return "bg-indigo-100 text-indigo-800";
      case "Analytics":
        return "bg-pink-100 text-pink-800";
      case "System Admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPermissionActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return "➕";
      case "read":
        return "👁️";
      case "update":
        return "✏️";
      case "delete":
        return "🗑️";
      case "admin":
        return "⚙️";
      default:
        return "🔧";
    }
  };

  const getPermissionDescription = (permissionId: string) => {
    const permission = permissions.find((p) => p.id === permissionId);
    return permission ? permission.description : "Unknown permission";
  };

  const getRolePermissions = (roleId: string) => {
    const role = customRoles.find((r) => r.id === roleId);
    return role ? role.permissions : [];
  };

  const getInheritedPermissions = (roleId: string) => {
    const role = customRoles.find((r) => r.id === roleId);
    if (!role?.parentRole) return [];

    const parentRole = customRoles.find((r) => r.name === role.parentRole);
    return parentRole ? parentRole.permissions : [];
  };

  const hasPermission = (roleId: string, permissionId: string) => {
    const rolePermissions = getRolePermissions(roleId);
    const inheritedPermissions = getInheritedPermissions(roleId);
    return (
      rolePermissions.includes(permissionId) ||
      inheritedPermissions.includes(permissionId)
    );
  };

  const getRoleHierarchyLevel = (roleId: string) => {
    const findLevel = (
      roles: RoleHierarchy[],
      targetId: string,
      currentLevel: number = 1
    ): number => {
      for (const role of roles) {
        if (role.id === targetId) return currentLevel;
        const childLevel = findLevel(role.children, targetId, currentLevel + 1);
        if (childLevel > 0) return childLevel;
      }
      return 0;
    };
    return findLevel(roleHierarchy, roleId);
  };

  // Security & Access Control helper functions
  const getRiskScoreColor = (riskScore: number) => {
    if (riskScore <= 3) return "bg-green-100 text-green-800";
    if (riskScore <= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getRiskScoreLabel = (riskScore: number) => {
    if (riskScore <= 3) return "Low";
    if (riskScore <= 6) return "Medium";
    return "High";
  };

  const getSessionStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const getDeviceTypeIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "desktop":
        return "💻";
      case "mobile":
        return "📱";
      case "tablet":
        return "📱";
      default:
        return "🖥️";
    }
  };

  const getActionStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "blocked":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIPRestrictionTypeColor = (type: string) => {
    switch (type) {
      case "whitelist":
        return "bg-green-100 text-green-800";
      case "blacklist":
        return "bg-red-100 text-red-800";
      case "geolocation":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatSessionDuration = (loginTime: string, lastActivity: string) => {
    const login = new Date(loginTime);
    const last = new Date(lastActivity);
    const diffMs = last.getTime() - login.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800";
    if (score >= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getPasswordStrengthLabel = (score: number) => {
    if (score >= 8) return "Strong";
    if (score >= 6) return "Moderate";
    return "Weak";
  };

  // User Profile Management helper functions
  const getUserProfile = (userId: number) => {
    return userProfiles.find((profile) => profile.userId === userId);
  };

  const getProfilePictureUrl = (profile: UserProfile | undefined) => {
    if (!profile?.profilePicture) {
      return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
    }
    return profile.profilePicture;
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case "male":
        return "Male";
      case "female":
        return "Female";
      case "other":
        return "Other";
      case "prefer-not-to-say":
        return "Prefer not to say";
      default:
        return "Not specified";
    }
  };

  const getProfileVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "Public";
      case "private":
        return "Private";
      case "team-only":
        return "Team Only";
      default:
        return "Not specified";
    }
  };

  const getProfileVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "bg-green-100 text-green-800";
      case "private":
        return "bg-red-100 text-red-800";
      case "team-only":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getThemeLabel = (theme: string) => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "auto":
        return "Auto (System)";
      default:
        return "Not specified";
    }
  };

  const getTimeFormatLabel = (format: string) => {
    switch (format) {
      case "12h":
        return "12-hour";
      case "24h":
        return "24-hour";
      default:
        return "Not specified";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getNotificationCount = (profile: UserProfile) => {
    const emailCount = Object.values(profile.notificationSettings.email).filter(
      Boolean
    ).length;
    const pushCount = Object.values(profile.notificationSettings.push).filter(
      Boolean
    ).length;
    const smsCount = Object.values(profile.notificationSettings.sms).filter(
      Boolean
    ).length;
    return emailCount + pushCount + smsCount;
  };

  // Administrative Profile Management helper functions
  const getAdminProfile = (userId: number) => {
    return adminProfiles.find((profile) => profile.userId === userId);
  };

  const getAdminLevelLabel = (level: string) => {
    switch (level) {
      case "super_admin":
        return "Super Administrator";
      case "admin":
        return "Administrator";
      case "sub_admin":
        return "Sub Administrator";
      default:
        return "Unknown Level";
    }
  };

  const getAdminLevelColor = (level: string) => {
    switch (level) {
      case "super_admin":
        return "bg-red-100 text-red-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "sub_admin":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAdminPermissionCount = (profile: AdministrativeProfile) => {
    return profile.permissions.length;
  };

  const getAdminDepartmentCount = (profile: AdministrativeProfile) => {
    return profile.assignedDepartments.length;
  };

  const getAdminResponsibilityCount = (profile: AdministrativeProfile) => {
    return profile.adminResponsibilities.length;
  };

  const getAdminCriticalPermissions = (profile: AdministrativeProfile) => {
    return profile.permissions.filter(
      (perm) => adminPermissions.find((p) => p.id === perm)?.isCritical
    ).length;
  };

  const getAdminUser = (profile: AdministrativeProfile) => {
    return users?.find((user) => user.id === profile.userId);
  };

  // Security & Access Control helper functions
  const getAdminSessionStatus = (session: AdminSession) => {
    if (!session.isActive) return "expired";
    const lastActivity = new Date(session.lastActivity);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60);

    if (diffMinutes > 15) return "idle";
    if (diffMinutes > 5) return "active";
    return "recent";
  };

  const getAdminSessionStatusColor = (status: string) => {
    switch (status) {
      case "recent":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "idle":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAdminActivitySeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAdminActivityStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "blocked":
        return "bg-orange-100 text-orange-800";
      case "suspicious":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAdminRiskScoreColor = (riskScore: number) => {
    if (riskScore <= 25) return "bg-green-100 text-green-800";
    if (riskScore <= 50) return "bg-yellow-100 text-yellow-800";
    if (riskScore <= 75) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const getAdminRiskScoreLabel = (riskScore: number) => {
    if (riskScore <= 25) return "Low Risk";
    if (riskScore <= 50) return "Medium Risk";
    if (riskScore <= 75) return "High Risk";
    return "Critical Risk";
  };

  const getAdminSecurityFeatureStatus = (feature: AdminSecurityFeature) => {
    if (!feature.isEnabled) return "disabled";
    if (feature.complianceStatus === "non-compliant") return "non-compliant";
    if (feature.complianceStatus === "pending") return "pending";
    return "compliant";
  };

  const getAdminSecurityFeatureStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800";
      case "non-compliant":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "disabled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAdminRouteProtectionMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-100 text-blue-800";
      case "POST":
        return "bg-green-100 text-green-800";
      case "PUT":
        return "bg-yellow-100 text-yellow-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      case "PATCH":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatAdminSessionDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getAdminComplianceStatus = () => {
    const totalFeatures = adminSecurityFeatures.length;
    const compliantFeatures = adminSecurityFeatures.filter(
      (f) => f.complianceStatus === "compliant"
    ).length;
    const compliancePercentage =
      totalFeatures > 0 ? (compliantFeatures / totalFeatures) * 100 : 0;

    if (compliancePercentage >= 90)
      return { status: "excellent", color: "bg-green-100 text-green-800" };
    if (compliancePercentage >= 75)
      return { status: "good", color: "bg-blue-100 text-blue-800" };
    if (compliancePercentage >= 60)
      return { status: "fair", color: "bg-yellow-100 text-yellow-800" };
    return { status: "poor", color: "bg-red-100 text-red-800" };
  };

  // Phase 3: Advanced Administrative Features helper functions
  const getThreatTypeIcon = (threatType: string) => {
    switch (threatType) {
      case "brute_force":
        return "🔓";
      case "suspicious_activity":
        return "👁️";
      case "unauthorized_access":
        return "🚫";
      case "data_exfiltration":
        return "📤";
      case "malware":
        return "🦠";
      case "phishing":
        return "🎣";
      default:
        return "⚠️";
    }
  };

  const getThreatSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getThreatStatusColor = (status: string) => {
    switch (status) {
      case "detected":
        return "bg-blue-100 text-blue-800";
      case "investigating":
        return "bg-yellow-100 text-yellow-800";
      case "mitigated":
        return "bg-green-100 text-green-800";
      case "resolved":
        return "bg-gray-100 text-gray-800";
      case "false_positive":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAnomalyTypeIcon = (anomalyType: string) => {
    switch (anomalyType) {
      case "unusual_login_time":
        return "🕐";
      case "unusual_location":
        return "🌍";
      case "unusual_activity_pattern":
        return "📊";
      case "privilege_escalation":
        return "⬆️";
      case "data_access_pattern":
        return "📁";
      default:
        return "❓";
    }
  };

  const getAnomalyConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-100 text-green-800";
    if (confidence >= 75) return "bg-blue-100 text-blue-800";
    if (confidence >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getWorkflowStatusColor = (status: string) => {
    switch (status) {
      case "initiated":
        return "bg-blue-100 text-blue-800";
      case "pending_approval":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getWorkflowPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIntegrationTypeIcon = (type: string) => {
    switch (type) {
      case "siem":
        return "🔍";
      case "edr":
        return "🛡️";
      case "iam":
        return "👤";
      case "vpn":
        return "🔒";
      case "firewall":
        return "🔥";
      case "antivirus":
        return "💊";
      case "backup":
        return "💾";
      case "monitoring":
        return "📊";
      default:
        return "🔗";
    }
  };

  const getIntegrationStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIntegrationHealthColor = (healthScore: number) => {
    if (healthScore >= 90) return "bg-green-100 text-green-800";
    if (healthScore >= 75) return "bg-blue-100 text-blue-800";
    if (healthScore >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getComplianceReportStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getComplianceFindingSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-green-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getComplianceFindingStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOverallSecurityScore = () => {
    const threatScore =
      (adminThreatDetections.filter((t) => t.status === "resolved").length /
        Math.max(adminThreatDetections.length, 1)) *
      100;
    const anomalyScore =
      (adminAnomalyDetections.filter((t) => t.status === "resolved").length /
        Math.max(adminAnomalyDetections.length, 1)) *
      100;
    const complianceScore =
      adminComplianceReports.reduce(
        (acc, report) => acc + report.summary.complianceScore,
        0
      ) / Math.max(adminComplianceReports.length, 1);
    const integrationScore =
      (adminSecurityIntegrations.filter((i) => i.status === "active").length /
        Math.max(adminSecurityIntegrations.length, 1)) *
      100;

    return Math.round(
      (threatScore + anomalyScore + complianceScore + integrationScore) / 4
    );
  };

  // Phase 4: Integration & Automation Features helper functions
  const getIntegrationTypeIconPhase4 = (type: string) => {
    switch (type) {
      case "api":
        return "🔌";
      case "webhook":
        return "🔗";
      case "database":
        return "🗄️";
      case "file":
        return "📁";
      case "service":
        return "⚙️";
      default:
        return "🔧";
    }
  };

  const getIntegrationStatusColorPhase4 = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIntegrationHealthColorPhase4 = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getWorkflowStatusColorPhase4 = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getWorkflowPriorityColorPhase4 = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getWorkflowCategoryIconPhase4 = (category: string) => {
    switch (category) {
      case "user_management":
        return "👥";
      case "security":
        return "🔒";
      case "compliance":
        return "📋";
      case "reporting":
        return "📊";
      case "maintenance":
        return "🔧";
      default:
        return "⚙️";
    }
  };

  const getSyncJobStatusColorPhase4 = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getWebhookMethodColorPhase4 = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800";
      case "POST":
        return "bg-blue-100 text-blue-800";
      case "PUT":
        return "bg-yellow-100 text-yellow-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      case "PATCH":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAPIVersionColorPhase4 = (version: string) => {
    if (version.includes("beta")) return "bg-yellow-100 text-yellow-800";
    if (version.includes("deprecated")) return "bg-red-100 text-red-800";
    return "bg-green-100 text-green-800";
  };

  const getOverallIntegrationHealth = () => {
    const totalIntegrations = systemIntegrations.length;
    if (totalIntegrations === 0) return 0;

    const healthyIntegrations = systemIntegrations.filter(
      (i) => i.healthScore >= 80
    ).length;
    return Math.round((healthyIntegrations / totalIntegrations) * 100);
  };

  const getAutomationEfficiency = () => {
    const totalWorkflows = automationWorkflows.length;
    if (totalWorkflows === 0) return 0;

    const successfulWorkflows = automationWorkflows.filter(
      (w) => w.successCount > w.failureCount
    ).length;
    return Math.round((successfulWorkflows / totalWorkflows) * 100);
  };

  const getDataSyncSuccessRate = () => {
    const totalJobs = dataSyncJobs.length;
    if (totalJobs === 0) return 0;

    const successfulJobs = dataSyncJobs.filter(
      (j) => j.status === "completed"
    ).length;
    return Math.round((successfulJobs / totalJobs) * 100);
  };

  const clearFilters = () => {
    setSearchFilters({
      searchTerm: "",
      role: "",
      status: "",
      department: "",
      dateRange: { start: "", end: "" },
      lastLoginRange: { start: "", end: "" },
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchFilters.searchTerm) count++;
    if (searchFilters.role) count++;
    if (searchFilters.status) count++;
    if (searchFilters.department) count++;
    if (searchFilters.dateRange.start || searchFilters.dateRange.end) count++;
    if (searchFilters.lastLoginRange.start || searchFilters.lastLoginRange.end)
      count++;
    return count;
  };

  const generateSearchSuggestions = (searchTerm: string) => {
    if (!searchTerm || !users) return [];

    const suggestions: string[] = [];
    const searchLower = searchTerm.toLowerCase();

    users.forEach((user) => {
      if (
        user.name?.toLowerCase().includes(searchLower) &&
        !suggestions.includes(user.name)
      ) {
        suggestions.push(user.name);
      }
      if (
        user.email?.toLowerCase().includes(searchLower) &&
        !suggestions.includes(user.email)
      ) {
        suggestions.push(user.email);
      }
      if (
        user.username?.toLowerCase().includes(searchLower) &&
        !suggestions.includes(user.username)
      ) {
        suggestions.push(user.username);
      }
    });

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  };

  // Calculate user analytics
  const calculateUserAnalytics = () => {
    if (!users) return;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const activeUsers = users.filter(
      (user) => user.created_at && new Date(user.created_at) > thirtyDaysAgo
    ).length;
    const inactiveUsers = users.length - activeUsers;

    const newUsersThisMonth = users.filter(
      (user) => user.created_at && new Date(user.created_at) > thirtyDaysAgo
    ).length;

    const newUsersLastMonth = users.filter(
      (user) =>
        user.created_at &&
        new Date(user.created_at) > sixtyDaysAgo &&
        new Date(user.created_at) <= thirtyDaysAgo
    ).length;

    const userGrowthRate =
      newUsersLastMonth > 0
        ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100
        : newUsersThisMonth > 0
        ? 100
        : 0;

    const roleDistribution = {
      admin: users.filter((user) => user.role === "admin").length,
      staff: users.filter((user) => user.role === "staff").length,
    };

    // Generate mock monthly growth data for the last 6 months
    const monthlyGrowth = Array.from({ length: 6 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      const baseUsers = Math.max(users.length - i * 2, 1);
      const userCount = baseUsers + Math.floor(Math.random() * 5);
      const growth = i === 0 ? 0 : Math.floor(Math.random() * 20) - 10;

      return { month: monthName, users: userCount, growth };
    }).reverse();

    // Mock activity metrics
    const activityMetrics = {
      highActivity: Math.floor(activeUsers * 0.3),
      mediumActivity: Math.floor(activeUsers * 0.5),
      lowActivity:
        activeUsers -
        Math.floor(activeUsers * 0.3) -
        Math.floor(activeUsers * 0.5),
    };

    // Mock user engagement
    const userEngagement = {
      dailyActive: Math.floor(activeUsers * 0.7),
      weeklyActive: Math.floor(activeUsers * 0.9),
      monthlyActive: activeUsers,
    };

    // Mock performance metrics
    const performanceMetrics = {
      avgLoginFrequency: Math.floor(Math.random() * 5) + 3, // 3-7 logins per week
      avgSessionDuration: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
      taskCompletionRate: Math.floor(Math.random() * 20) + 80, // 80-100%
    };

    setUserAnalytics({
      totalUsers: users.length,
      activeUsers,
      inactiveUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      userGrowthRate,
      roleDistribution,
      activityMetrics,
      monthlyGrowth,
      userEngagement,
      performanceMetrics,
    });
  };

  // Generate mock activity data
  const generateActivityData = () => {
    if (!users) return;

    const mockActivityData: ActivityData[] = users.map((user) => ({
      userId: user.id,
      userName: user.name || "Unknown User",
      lastLogin: user.updated_at
        ? new Date(user.updated_at).toLocaleDateString()
        : "Never",
      loginCount: Math.floor(Math.random() * 50) + 1,
      sessionDuration: Math.floor(Math.random() * 120) + 15,
      tasksCompleted: Math.floor(Math.random() * 100) + 10,
      status: user.created_at ? "active" : "inactive",
    }));

    setActivityData(mockActivityData);
  };

  const stats = {
    totalUsers: filteredUsers.length || users?.length || 0,
    admins:
      filteredUsers.filter((u) => u.role === "admin").length ||
      users?.filter((u) => u.role === "admin").length ||
      0,
    staff:
      filteredUsers.filter((u) => u.role === "staff").length ||
      users?.filter((u) => u.role === "staff").length ||
      0,
    activeUsers:
      filteredUsers.filter((u) => u.created_at).length ||
      users?.filter((u) => u.created_at).length ||
      0,
  };

  return (
    <div className="container p-6 mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">
            Manage staff users, roles, and permissions
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowCreateUser(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create User
          </Button>
          <Button onClick={() => setShowBulkImport(true)} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
          <Button onClick={() => setShowInviteUser(true)} variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Administrators
            </CardTitle>
            <UserPlus className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.staff}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-11">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="roles-permissions">
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="security">Security & Access</TabsTrigger>
          <TabsTrigger value="profiles">User Profiles</TabsTrigger>
          <TabsTrigger value="administrative">Administrative</TabsTrigger>
          <TabsTrigger value="advanced-security">Advanced Security</TabsTrigger>
          <TabsTrigger value="integration-automation">
            Integration & Automation
          </TabsTrigger>
          <TabsTrigger value="templates">User Templates</TabsTrigger>
          <TabsTrigger value="bulk-import">Bulk Import</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filter Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search & Filter Users
              </CardTitle>
              <CardDescription>
                Find users by name, email, username, role, status, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Search */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Users</Label>
                  <div className="relative mt-1">
                    <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <Input
                      id="search"
                      placeholder="Search by name, email, or username..."
                      value={searchFilters.searchTerm}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSearchFilters((prev) => ({
                          ...prev,
                          searchTerm: value,
                        }));
                        if (value.length > 1) {
                          const suggestions = generateSearchSuggestions(value);
                          setSearchSuggestions(suggestions);
                          setShowSearchSuggestions(suggestions.length > 0);
                        } else {
                          setShowSearchSuggestions(false);
                        }
                      }}
                      onFocus={() => {
                        if (searchFilters.searchTerm.length > 1) {
                          const suggestions = generateSearchSuggestions(
                            searchFilters.searchTerm
                          );
                          setSearchSuggestions(suggestions);
                          setShowSearchSuggestions(suggestions.length > 0);
                        }
                      }}
                      onBlur={() => {
                        // Delay hiding suggestions to allow clicking on them
                        setTimeout(() => setShowSearchSuggestions(false), 200);
                      }}
                      className="pl-10"
                    />

                    {/* Search Suggestions */}
                    {showSearchSuggestions && searchSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg top-full">
                        {searchSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setSearchFilters((prev) => ({
                                ...prev,
                                searchTerm: suggestion,
                              }));
                              setShowSearchSuggestions(false);
                            }}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    💡 Tip: Use quotes for exact matches, e.g., "john@email.com"
                  </p>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Advanced Filters
                    {getActiveFiltersCount() > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="grid grid-cols-1 gap-4 pt-4 border-t md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <Label htmlFor="role-filter">Role</Label>
                    <Select
                      value={searchFilters.role}
                      onValueChange={(value) =>
                        setSearchFilters((prev) => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All roles</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status-filter">Status</Label>
                    <Select
                      value={searchFilters.status}
                      onValueChange={(value) =>
                        setSearchFilters((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="department-filter">Department/Team</Label>
                    <Select
                      value={searchFilters.department}
                      onValueChange={(value) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          department: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All departments</SelectItem>
                        <SelectItem value="admin">Administration</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date-start">Created From</Label>
                    <Input
                      id="date-start"
                      type="date"
                      value={searchFilters.dateRange.start}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          dateRange: {
                            ...prev.dateRange,
                            start: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="date-end">Created To</Label>
                    <Input
                      id="date-end"
                      type="date"
                      value={searchFilters.dateRange.end}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, end: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="last-activity-start">
                      Last Activity From
                    </Label>
                    <Input
                      id="last-activity-start"
                      type="date"
                      value={searchFilters.lastLoginRange.start}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          lastLoginRange: {
                            ...prev.lastLoginRange,
                            start: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="last-activity-end">Last Activity To</Label>
                    <Input
                      id="last-activity-end"
                      type="date"
                      value={searchFilters.lastLoginRange.end}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          lastLoginRange: {
                            ...prev.lastLoginRange,
                            end: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Clear Filters
                    </Button>
                    <Button
                      onClick={() => setShowAdvancedFilters(false)}
                      variant="ghost"
                    >
                      Hide Filters
                    </Button>
                  </div>
                </div>
              )}

              {/* Active Filter Chips */}
              {getActiveFiltersCount() > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Active Filters:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchFilters.searchTerm && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        Search: "{searchFilters.searchTerm}"
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-600"
                          onClick={() =>
                            setSearchFilters((prev) => ({
                              ...prev,
                              searchTerm: "",
                            }))
                          }
                        />
                      </Badge>
                    )}
                    {searchFilters.role && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        Role: {searchFilters.role}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-600"
                          onClick={() =>
                            setSearchFilters((prev) => ({ ...prev, role: "" }))
                          }
                        />
                      </Badge>
                    )}
                    {searchFilters.status && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        Status: {searchFilters.status}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-600"
                          onClick={() =>
                            setSearchFilters((prev) => ({
                              ...prev,
                              status: "",
                            }))
                          }
                        />
                      </Badge>
                    )}
                    {searchFilters.department && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        Department: {searchFilters.department}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-600"
                          onClick={() =>
                            setSearchFilters((prev) => ({
                              ...prev,
                              department: "",
                            }))
                          }
                        />
                      </Badge>
                    )}
                    {(searchFilters.dateRange.start ||
                      searchFilters.dateRange.end) && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        Created: {searchFilters.dateRange.start || "any"} -{" "}
                        {searchFilters.dateRange.end || "any"}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-600"
                          onClick={() =>
                            setSearchFilters((prev) => ({
                              ...prev,
                              dateRange: { start: "", end: "" },
                            }))
                          }
                        />
                      </Badge>
                    )}
                    {(searchFilters.lastLoginRange.start ||
                      searchFilters.lastLoginRange.end) && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        Last Activity:{" "}
                        {searchFilters.lastLoginRange.start || "any"} -{" "}
                        {searchFilters.lastLoginRange.end || "any"}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-600"
                          onClick={() =>
                            setSearchFilters((prev) => ({
                              ...prev,
                              lastLoginRange: { start: "", end: "" },
                            }))
                          }
                        />
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Results Summary */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm text-gray-600">
                  Showing {filteredUsers.length} of {users?.length || 0} users
                  {getActiveFiltersCount() > 0 && (
                    <span className="ml-2 text-blue-600">(filtered)</span>
                  )}
                </div>
                {getActiveFiltersCount() > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Manage existing users and their roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="py-8 text-center text-red-600">{error}</div>
              ) : users && users.length > 0 && filteredUsers.length === 0 ? (
                <div className="py-8 text-center text-gray-600">
                  <div>
                    <p>No users match your current filters</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search criteria or clearing some
                      filters
                    </p>
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="mt-3"
                    >
                      Clear all filters
                    </Button>
                  </div>
                </div>
              ) : filteredUsers && filteredUsers.length > 0 ? (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                          <span className="text-sm font-medium text-gray-600">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getRoleColor(user.role || "staff")}>
                          {user.role || "staff"}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserDetails(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-600">
                  {getActiveFiltersCount() > 0 ? (
                    <div>
                      <p>No users match your current filters</p>
                      <Button
                        variant="link"
                        onClick={clearFilters}
                        className="mt-2 text-blue-600 hover:text-blue-700"
                      >
                        Clear all filters
                      </Button>
                    </div>
                  ) : (
                    "No users found"
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                User Analytics & Reporting
              </h3>
              <p className="text-gray-600">
                Comprehensive insights into user activity, growth, and
                performance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={analyticsTimeRange}
                onValueChange={setAnalyticsTimeRange}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  calculateUserAnalytics();
                  generateActivityData();
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userAnalytics?.totalUsers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userAnalytics?.userGrowthRate ? (
                    <span
                      className={
                        userAnalytics.userGrowthRate >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {userAnalytics.userGrowthRate >= 0 ? "+" : ""}
                      {userAnalytics.userGrowthRate.toFixed(1)}% from last month
                    </span>
                  ) : (
                    "No previous data"
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <UserCheck className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userAnalytics?.activeUsers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userAnalytics
                    ? `${(
                        (userAnalytics.activeUsers / userAnalytics.totalUsers) *
                        100
                      ).toFixed(1)}% of total`
                    : "0%"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  New This Month
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userAnalytics?.newUsersThisMonth || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userAnalytics?.newUsersLastMonth
                    ? `vs ${userAnalytics.newUsersLastMonth} last month`
                    : "No previous data"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Avg Login Frequency
                </CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userAnalytics?.performanceMetrics?.avgLoginFrequency || 0}
                </div>
                <p className="text-xs text-muted-foreground">logins per week</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Visualizations */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Role Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Role Distribution
                </CardTitle>
                <CardDescription>Breakdown of users by role</CardDescription>
              </CardHeader>
              <CardContent>
                {userAnalytics ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Administrators</span>
                      </div>
                      <span className="font-medium">
                        {userAnalytics.roleDistribution.admin}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Staff Members</span>
                      </div>
                      <span className="font-medium">
                        {userAnalytics.roleDistribution.staff}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-red-500 to-blue-500"
                        style={{
                          width: `${
                            userAnalytics.roleDistribution.admin > 0
                              ? (userAnalytics.roleDistribution.admin /
                                  userAnalytics.totalUsers) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    Loading analytics...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Growth Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  User Growth Trend
                </CardTitle>
                <CardDescription>Monthly user growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                {userAnalytics?.monthlyGrowth ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Growth Rate</span>
                      <span className="font-medium">
                        {userAnalytics.monthlyGrowth[
                          userAnalytics.monthlyGrowth.length - 1
                        ]?.growth || 0}
                        %
                      </span>
                    </div>
                    <div className="space-y-2">
                      {userAnalytics.monthlyGrowth.map((month, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{month.month}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{month.users}</span>
                            <span
                              className={`text-xs ${
                                month.growth >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {month.growth >= 0 ? "+" : ""}
                              {month.growth}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    Loading growth data...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Activity Metrics */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Activity Levels
                </CardTitle>
                <CardDescription>User activity distribution</CardDescription>
              </CardHeader>
              <CardContent>
                {userAnalytics ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">High Activity</span>
                      <span className="font-medium text-green-600">
                        {userAnalytics.activityMetrics.highActivity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Medium Activity</span>
                      <span className="font-medium text-yellow-600">
                        {userAnalytics.activityMetrics.mediumActivity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Low Activity</span>
                      <span className="font-medium text-red-600">
                        {userAnalytics.activityMetrics.lowActivity}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    Loading activity data...
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>User productivity indicators</CardDescription>
              </CardHeader>
              <CardContent>
                {userAnalytics ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Session Duration</span>
                      <span className="font-medium">
                        {userAnalytics.performanceMetrics.avgSessionDuration}{" "}
                        min
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Task Completion</span>
                      <span className="font-medium">
                        {userAnalytics.performanceMetrics.taskCompletionRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Engagement Score</span>
                      <span className="font-medium">
                        {Math.round(
                          (userAnalytics.performanceMetrics.avgLoginFrequency /
                            7) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    Loading performance data...
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  User Engagement
                </CardTitle>
                <CardDescription>
                  Daily, weekly, and monthly active users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userAnalytics ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Daily Active</span>
                      <span className="font-medium text-blue-600">
                        {userAnalytics.userEngagement.dailyActive}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly Active</span>
                      <span className="font-medium text-green-600">
                        {userAnalytics.userEngagement.weeklyActive}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Monthly Active</span>
                      <span className="font-medium text-purple-600">
                        {userAnalytics.userEngagement.monthlyActive}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    Loading engagement data...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* User Activity Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock3 className="w-5 h-5" />
                User Activity Tracking
              </CardTitle>
              <CardDescription>
                Detailed user activity and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activityData.length > 0 ? (
                <div className="space-y-4">
                  {activityData.map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                          <span className="text-sm font-medium text-gray-600">
                            {user.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{user.userName}</h3>
                          <p className="text-sm text-gray-600">
                            Last login: {user.lastLogin}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{user.loginCount}</div>
                          <div className="text-gray-500">Logins</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">
                            {user.sessionDuration} min
                          </div>
                          <div className="text-gray-500">Avg Session</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">
                            {user.tasksCompleted}
                          </div>
                          <div className="text-gray-500">Tasks</div>
                        </div>
                        <Badge
                          className={
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  Loading activity data...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles-permissions" className="space-y-6">
          {/* Roles & Permissions Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Role & Permission Management
              </h3>
              <p className="text-gray-600">
                Create custom roles, manage permissions, and establish role
                hierarchy
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowCreateRole(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Custom Role
              </Button>
              <Button
                onClick={() => setShowBulkRoleAssignment(true)}
                variant="outline"
              >
                <Users className="w-4 h-4 mr-2" />
                Bulk Role Assignment
              </Button>
              <Button
                onClick={() => setShowPermissionAudit(true)}
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                Permission Audit
              </Button>
            </div>
          </div>

          {/* Custom Roles Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {customRoles.map((role) => (
              <Card key={role.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {role.name}
                        <Badge
                          className={
                            role.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {role.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {role.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingRole(role)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRole(role)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>Users: {role.userCount}</span>
                    <span>
                      Created: {new Date(role.createdAt).toLocaleDateString()}
                    </span>
                    {role.parentRole && <span>Parent: {role.parentRole}</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">
                      Permissions ({role.permissions.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.slice(0, 5).map((permissionId) => (
                        <Badge
                          key={permissionId}
                          variant="secondary"
                          className="text-xs"
                          title={getPermissionDescription(permissionId)}
                        >
                          {getPermissionActionIcon(
                            getPermissionDescription(permissionId)
                              .split(" ")[0]
                              .toLowerCase()
                          )}{" "}
                          {permissionId}
                        </Badge>
                      ))}
                      {role.permissions.length > 5 && (
                        <Badge variant="secondary" className="text-xs">
                          +{role.permissions.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Role Hierarchy Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Role Hierarchy
              </CardTitle>
              <CardDescription>
                Visual representation of role inheritance and structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {roleHierarchy.map((rootRole) => (
                  <div key={rootRole.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div className="flex items-center gap-2">
                        <Badge className="font-medium text-blue-800 bg-blue-100">
                          Level {rootRole.level}
                        </Badge>
                        <span className="text-lg font-semibold">
                          {rootRole.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          ({rootRole.userCount} users)
                        </span>
                      </div>
                    </div>
                    {rootRole.children.length > 0 && (
                      <div className="ml-8 space-y-3">
                        {rootRole.children.map((childRole) => (
                          <div key={childRole.id} className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <div className="flex items-center gap-2">
                                <Badge className="font-medium text-green-800 bg-green-100">
                                  Level {childRole.level}
                                </Badge>
                                <span className="font-medium">
                                  {childRole.name}
                                </span>
                                <span className="text-sm text-gray-600">
                                  ({childRole.userCount} users)
                                </span>
                              </div>
                            </div>
                            {childRole.children.length > 0 && (
                              <div className="ml-8 space-y-2">
                                {childRole.children.map((grandChildRole) => (
                                  <div
                                    key={grandChildRole.id}
                                    className="flex items-center gap-3"
                                  >
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <div className="flex items-center gap-2">
                                      <Badge className="font-medium text-purple-800 bg-purple-100">
                                        Level {grandChildRole.level}
                                      </Badge>
                                      <span className="font-medium">
                                        {grandChildRole.name}
                                      </span>
                                      <span className="text-sm text-gray-600">
                                        ({grandChildRole.userCount} users)
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Permissions Library */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Permissions Library
              </CardTitle>
              <CardDescription>
                Complete list of available permissions organized by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Array.from(new Set(permissions.map((p) => p.category))).map(
                  (category) => (
                    <div key={category} className="space-y-3">
                      <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <Badge className={getPermissionCategoryColor(category)}>
                          {category}
                        </Badge>
                      </h3>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {permissions
                          .filter((p) => p.category === category)
                          .map((permission) => (
                            <div
                              key={permission.id}
                              className="p-3 transition-colors border rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium">
                                    {permission.name}
                                  </h4>
                                  <p className="mt-1 text-xs text-gray-600">
                                    {permission.description}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs"
                                >
                                  {permission.action}
                                </Badge>
                              </div>
                              <div className="mt-2 text-xs text-gray-500">
                                Resource: {permission.resource}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security & Access Control Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Security & Access Control
              </h3>
              <p className="text-gray-600">
                Manage password policies, account security, session monitoring,
                and access controls
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowSecuritySettings(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Security Settings
              </Button>
              <Button
                onClick={() => setShowSessionManagement(true)}
                variant="outline"
              >
                <Clock className="w-4 h-4 mr-2" />
                Session Management
              </Button>
              <Button onClick={() => setShowAccessLogs(true)} variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Access Logs
              </Button>
              <Button
                onClick={() => setShowIPRestrictions(true)}
                variant="outline"
              >
                <Building className="w-4 h-4 mr-2" />
                IP Restrictions
              </Button>
            </div>
          </div>

          {/* Security Overview Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Active Sessions
                </CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userSessions.filter((s) => s.isActive).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userSessions.length} total sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Password Strength
                </CardTitle>
                <Target className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {securitySettings?.passwordPolicy.complexityScore || 0}/10
                </div>
                <Badge
                  className={getPasswordStrengthColor(
                    securitySettings?.passwordPolicy.complexityScore || 0
                  )}
                >
                  {getPasswordStrengthLabel(
                    securitySettings?.passwordPolicy.complexityScore || 0
                  )}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Failed Logins
                  </CardTitle>
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {accessLogs.filter((log) => log.status === "failed").length}
                </div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  IP Restrictions
                </CardTitle>
                <Building className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {ipRestrictions.filter((ip) => ip.isActive).length}
                </div>
                <p className="text-xs text-muted-foreground">Active rules</p>
              </CardContent>
            </Card>
          </div>

          {/* Password Policy & Account Security */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Password Policy
                </CardTitle>
                <CardDescription>
                  Current password requirements and complexity rules
                </CardDescription>
              </CardHeader>
              <CardContent>
                {securitySettings ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Minimum Length
                        </Label>
                        <p className="text-lg font-medium">
                          {securitySettings.passwordPolicy.minLength} characters
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Complexity Score
                        </Label>
                        <Badge
                          className={getPasswordStrengthColor(
                            securitySettings.passwordPolicy.complexityScore
                          )}
                        >
                          {securitySettings.passwordPolicy.complexityScore}/10
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Requirements:</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle
                            className={`w-4 h-4 ${
                              securitySettings.passwordPolicy.requireUppercase
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          />
                          <span className="text-sm">
                            Uppercase letters (A-Z)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle
                            className={`w-4 h-4 ${
                              securitySettings.passwordPolicy.requireLowercase
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          />
                          <span className="text-sm">
                            Lowercase letters (a-z)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle
                            className={`w-4 h-4 ${
                              securitySettings.passwordPolicy.requireNumbers
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          />
                          <span className="text-sm">Numbers (0-9)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle
                            className={`w-4 h-4 ${
                              securitySettings.passwordPolicy
                                .requireSpecialChars
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          />
                          <span className="text-sm">
                            Special characters (!@#$%^&*)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Max Age
                        </Label>
                        <p>{securitySettings.passwordPolicy.maxAge} days</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Prevent Reuse
                        </Label>
                        <p>
                          Last {securitySettings.passwordPolicy.preventReuse}{" "}
                          passwords
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    Loading security settings...
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Account Lockout
                </CardTitle>
                <CardDescription>
                  Failed login attempt handling and lockout policies
                </CardDescription>
              </CardHeader>
              <CardContent>
                {securitySettings ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Max Failed Attempts
                        </Label>
                        <p className="text-lg font-medium">
                          {securitySettings.accountLockout.maxFailedAttempts}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Lockout Duration
                        </Label>
                        <p className="text-lg font-medium">
                          {securitySettings.accountLockout.lockoutDuration}{" "}
                          minutes
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Lockout Settings:</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">
                            Threshold:{" "}
                            {securitySettings.accountLockout.lockoutThreshold}{" "}
                            attempts
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">
                            Unlock:{" "}
                            {securitySettings.accountLockout.unlockMethod}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle
                            className={`w-4 h-4 ${
                              securitySettings.accountLockout.notifyUser
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          />
                          <span className="text-sm">
                            Notify user on lockout
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle
                            className={`w-4 h-4 ${
                              securitySettings.accountLockout.notifyAdmin
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          />
                          <span className="text-sm">
                            Notify admin on lockout
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm">
                      <Label className="text-sm font-medium text-gray-600">
                        Session Timeout
                      </Label>
                      <p>
                        {Math.floor(securitySettings.sessionTimeout / 60)}{" "}
                        minutes
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    Loading account lockout settings...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Active Sessions Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>
                Monitor current user sessions and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userSessions
                  .filter((s) => s.isActive)
                  .map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                          <span className="text-sm font-medium text-gray-600">
                            {session.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{session.userName}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>
                              {getDeviceTypeIcon(session.deviceType)}{" "}
                              {session.deviceType}
                            </span>
                            <span>•</span>
                            <span>{session.browser}</span>
                            <span>•</span>
                            <span>{session.os}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{session.ipAddress}</div>
                          <div className="text-gray-500">IP Address</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{session.location}</div>
                          <div className="text-gray-500">Location</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">
                            {formatSessionDuration(
                              session.loginTime,
                              session.lastActivity
                            )}
                          </div>
                          <div className="text-gray-500">Duration</div>
                        </div>
                        <Badge
                          className={getSessionStatusColor(session.isActive)}
                        >
                          {session.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Access Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Recent Access Activity
              </CardTitle>
              <CardDescription>
                Latest user actions and security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accessLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                        <span className="text-xs font-medium text-gray-600">
                          {log.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{log.userName}</span>
                          <Badge className={getActionStatusColor(log.status)}>
                            {log.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {log.action} • {log.resource} • {log.ipAddress}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{log.location}</div>
                        <div className="text-gray-500">Location</div>
                      </div>
                      <div className="text-center">
                        <Badge className={getRiskScoreColor(log.riskScore)}>
                          {getRiskScoreLabel(log.riskScore)} Risk
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* IP Restrictions Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                IP Access Controls
              </CardTitle>
              <CardDescription>
                Current IP whitelist, blacklist, and geolocation restrictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ipRestrictions
                  .filter((ip) => ip.isActive)
                  .map((restriction) => (
                    <div
                      key={restriction.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Badge
                          className={getIPRestrictionTypeColor(
                            restriction.type
                          )}
                        >
                          {restriction.type}
                        </Badge>
                        <div>
                          <h3 className="font-medium">{restriction.value}</h3>
                          <p className="text-sm text-gray-600">
                            {restriction.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium">
                            Priority {restriction.priority}
                          </div>
                          <div className="text-gray-500">Priority</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">
                            {restriction.createdBy}
                          </div>
                          <div className="text-gray-500">Created By</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(restriction.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profiles" className="space-y-6">
          {/* User Profiles Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                User Profile Management
              </h3>
              <p className="text-gray-600">
                Manage user profiles, contact information, preferences, and
                settings
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowProfileEditor(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profiles
              </Button>
              <Button
                onClick={() => setShowProfilePicture(true)}
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                Manage Pictures
              </Button>
            </div>
          </div>

          {/* Profile Overview Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Profiles
                </CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userProfiles.length}</div>
                <p className="text-xs text-muted-foreground">
                  {userProfiles.filter((p) => p.profilePicture).length} with
                  pictures
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Public Profiles
                </CardTitle>
                <Eye className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    userProfiles.filter(
                      (p) => p.privacySettings.profileVisibility === "public"
                    ).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Publicly visible
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Active Notifications
                </CardTitle>
                <Bell className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userProfiles.reduce(
                    (total, profile) => total + getNotificationCount(profile),
                    0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Total enabled</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Languages</CardTitle>
                <Globe className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    new Set(userProfiles.map((p) => p.preferences.language))
                      .size
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Different languages
                </p>
              </CardContent>
            </Card>
          </div>

          {/* User Profile Cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {userProfiles.map((profile) => {
              const user = users?.find((u) => u.id === profile.userId);
              return (
                <Card
                  key={profile.id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={getProfilePictureUrl(profile)}
                            alt={`${user?.name || "User"} profile`}
                            className="object-cover w-16 h-16 border-2 border-gray-200 rounded-full"
                          />
                          <Badge
                            className={getProfileVisibilityColor(
                              profile.privacySettings.profileVisibility
                            )}
                          >
                            {getProfileVisibilityLabel(
                              profile.privacySettings.profileVisibility
                            )}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {user?.name || "Unknown User"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {user?.email || "No email"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {getGenderLabel(profile.gender)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {formatDate(profile.dateOfBirth)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProfile(profile)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProfile(profile)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Bio */}
                      <div>
                        <h4 className="mb-1 text-sm font-medium text-gray-700">
                          Bio
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {profile.bio}
                        </p>
                      </div>

                      {/* Contact Information */}
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-700">
                          Contact Information
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Location:</span>
                            <p className="font-medium">
                              {profile.address.city}, {profile.address.state}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Emergency Contact:
                            </span>
                            <p className="font-medium">
                              {profile.emergencyContact.name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Preferences */}
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-700">
                          Preferences
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            {getThemeLabel(profile.preferences.theme)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {profile.preferences.language}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getTimeFormatLabel(profile.preferences.timeFormat)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {profile.preferences.currency}
                          </Badge>
                        </div>
                      </div>

                      {/* Notification Settings */}
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-700">
                          Notifications
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Email:{" "}
                            {
                              Object.values(
                                profile.notificationSettings.email
                              ).filter(Boolean).length
                            }
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Push:{" "}
                            {
                              Object.values(
                                profile.notificationSettings.push
                              ).filter(Boolean).length
                            }
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            SMS:{" "}
                            {
                              Object.values(
                                profile.notificationSettings.sms
                              ).filter(Boolean).length
                            }
                          </Badge>
                        </div>
                      </div>

                      {/* Social Media */}
                      {Object.values(profile.socialMedia).some(
                        (link) => link
                      ) && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700">
                            Social Media
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {profile.socialMedia.linkedin && (
                              <Badge variant="outline" className="text-xs">
                                LinkedIn
                              </Badge>
                            )}
                            {profile.socialMedia.twitter && (
                              <Badge variant="outline" className="text-xs">
                                Twitter
                              </Badge>
                            )}
                            {profile.socialMedia.facebook && (
                              <Badge variant="outline" className="text-xs">
                                Facebook
                              </Badge>
                            )}
                            {profile.socialMedia.instagram && (
                              <Badge variant="outline" className="text-xs">
                                Instagram
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Profile Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Profile Statistics
              </CardTitle>
              <CardDescription>
                Overview of user profile characteristics and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Language Distribution */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Language Distribution</h4>
                  <div className="space-y-2">
                    {Array.from(
                      new Set(userProfiles.map((p) => p.preferences.language))
                    ).map((lang) => {
                      const count = userProfiles.filter(
                        (p) => p.preferences.language === lang
                      ).length;
                      const language = mockLanguages.find(
                        (l) => l.code === lang
                      );
                      return (
                        <div
                          key={lang}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="flex items-center gap-2">
                            {language?.flag} {language?.name || lang}
                          </span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Theme Preferences */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Theme Preferences</h4>
                  <div className="space-y-2">
                    {["light", "dark", "auto"].map((theme) => {
                      const count = userProfiles.filter(
                        (p) => p.preferences.theme === theme
                      ).length;
                      return (
                        <div
                          key={theme}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{getThemeLabel(theme)}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Privacy Settings</h4>
                  <div className="space-y-2">
                    {["public", "private", "team-only"].map((visibility) => {
                      const count = userProfiles.filter(
                        (p) =>
                          p.privacySettings.profileVisibility === visibility
                      ).length;
                      return (
                        <div
                          key={visibility}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{getProfileVisibilityLabel(visibility)}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="administrative" className="space-y-6">
          {/* Administrative Profile Management Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Administrative Profile Management
              </h3>
              <p className="text-gray-600">
                Manage administrative users, roles, permissions, and system
                oversight
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAdminProfileEditor(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Admin
              </Button>
              <Button
                onClick={() => setShowAdminRoleManager(true)}
                variant="outline"
              >
                <Edit className="w-4 h-4 mr-2" />
                Manage Roles
              </Button>
              <Button
                onClick={() => setShowAdminPermissionManager(true)}
                variant="outline"
              >
                <Target className="w-4 h-4 mr-2" />
                Permissions
              </Button>
            </div>
          </div>

          {/* Administrative Overview Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Admins
                </CardTitle>
                <UserPlus className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminProfiles.length}</div>
                <p className="text-xs text-muted-foreground">
                  {
                    adminProfiles.filter((p) => p.adminLevel === "super_admin")
                      .length
                  }{" "}
                  super admins
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Admin Roles
                </CardTitle>
                <Target className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminRoles.length}</div>
                <p className="text-xs text-muted-foreground">
                  {adminRoles.filter((r) => r.isActive).length} active roles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Permissions
                </CardTitle>
                <Zap className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminPermissions.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {adminPermissions.filter((p) => p.isCritical).length} critical
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Departments
                </CardTitle>
                <Building className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    new Set(adminProfiles.flatMap((p) => p.assignedDepartments))
                      .size
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Covered departments
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Administrative Profile Cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {adminProfiles.map((profile) => {
              const user = getAdminUser(profile);
              return (
                <Card
                  key={profile.id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                          <span className="text-lg font-semibold text-white">
                            {user?.name?.charAt(0).toUpperCase() || "A"}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {user?.name || "Unknown User"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {user?.email || "No email"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              className={getAdminLevelColor(profile.adminLevel)}
                            >
                              {getAdminLevelLabel(profile.adminLevel)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getAdminPermissionCount(profile)} permissions
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAdminProfile(profile)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingAdminProfile(profile)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Departments */}
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-700">
                          Assigned Departments
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.assignedDepartments.map((dept) => (
                            <Badge
                              key={dept}
                              variant="outline"
                              className="text-xs"
                            >
                              {dept}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Responsibilities */}
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-700">
                          Responsibilities
                        </h4>
                        <div className="space-y-1">
                          {profile.adminResponsibilities.map((resp) => (
                            <div
                              key={resp}
                              className="flex items-center gap-2 text-sm text-gray-600"
                            >
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              {resp}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Admin Settings */}
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-700">
                          Capabilities
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle
                              className={`w-3 h-3 ${
                                profile.adminSettings.canCreateUsers
                                  ? "text-green-500"
                                  : "text-gray-400"
                              }`}
                            />
                            <span>Create Users</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle
                              className={`w-3 h-3 ${
                                profile.adminSettings.canDeleteUsers
                                  ? "text-green-500"
                                  : "text-gray-400"
                              }`}
                            />
                            <span>Delete Users</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle
                              className={`w-3 h-3 ${
                                profile.adminSettings.canManageRoles
                                  ? "text-green-500"
                                  : "text-gray-400"
                              }`}
                            />
                            <span>Manage Roles</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle
                              className={`w-3 h-3 ${
                                profile.adminSettings.canAccessSystemSettings
                                  ? "text-green-500"
                                  : "text-gray-400"
                              }`}
                            />
                            <span>System Settings</span>
                          </div>
                        </div>
                      </div>

                      {/* Security Settings */}
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-700">
                          Security Settings
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">
                              Session Timeout:
                            </span>
                            <p className="font-medium">
                              {profile.adminSettings.sessionTimeout} min
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">MFA Required:</span>
                            <p className="font-medium">
                              {profile.adminSettings.mfaRequired ? "Yes" : "No"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Max Login Attempts:
                            </span>
                            <p className="font-medium">
                              {profile.adminSettings.maxLoginAttempts}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              IP Restrictions:
                            </span>
                            <p className="font-medium">
                              {profile.adminSettings.ipRestrictions.length}{" "}
                              rules
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Administrative Role Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Administrative Roles Overview
              </CardTitle>
              <CardDescription>
                Current administrative roles and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {adminRoles.map((role) => (
                  <Card key={role.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{role.name}</h4>
                      <Badge className={getAdminLevelColor(role.level)}>
                        {getAdminLevelLabel(role.level)}
                      </Badge>
                    </div>
                    <p className="mb-3 text-sm text-gray-600">
                      {role.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Permissions:</span>
                        <Badge variant="outline">
                          {role.permissions.length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Users:</span>
                        <Badge variant="outline">{role.userCount}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Status:</span>
                        <Badge
                          className={
                            role.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {role.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAdminRole(role)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingAdminRole(role)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Administrative Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Administrative Statistics
              </CardTitle>
              <CardDescription>
                Overview of administrative system usage and distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Admin Level Distribution */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">
                    Admin Level Distribution
                  </h4>
                  <div className="space-y-2">
                    {["super_admin", "admin", "sub_admin"].map((level) => {
                      const count = adminProfiles.filter(
                        (p) => p.adminLevel === level
                      ).length;
                      return (
                        <div
                          key={level}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{getAdminLevelLabel(level)}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Department Coverage */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Department Coverage</h4>
                  <div className="space-y-2">
                    {Array.from(
                      new Set(
                        adminProfiles.flatMap((p) => p.assignedDepartments)
                      )
                    ).map((dept) => {
                      const count = adminProfiles.filter((p) =>
                        p.assignedDepartments.includes(dept)
                      ).length;
                      return (
                        <div
                          key={dept}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{dept}</span>
                          <Badge variant="outline">{count} admins</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Permission Usage */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Permission Usage</h4>
                  <div className="space-y-2">
                    {adminPermissions.map((perm) => {
                      const count = adminProfiles.filter((p) =>
                        p.permissions.includes(perm.id)
                      ).length;
                      return (
                        <div
                          key={perm.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="truncate">{perm.name}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Access Control Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Access Control
              </CardTitle>
              <CardDescription>
                Monitor and manage administrative security, sessions, and access
                controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Security Overview Cards */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Active Sessions
                      </p>
                      <p className="text-2xl font-bold">
                        {adminSessions.filter((s) => s.isActive).length}
                      </p>
                    </div>
                    <Activity className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {adminSessions.filter((s) => !s.isActive).length} expired
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Security Features
                      </p>
                      <p className="text-2xl font-bold">
                        {
                          adminSecurityFeatures.filter((f) => f.isEnabled)
                            .length
                        }
                      </p>
                    </div>
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {
                      adminSecurityFeatures.filter(
                        (f) => f.complianceStatus === "compliant"
                      ).length
                    }{" "}
                    compliant
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Protected Routes
                      </p>
                      <p className="text-2xl font-bold">
                        {adminRouteProtections.filter((r) => r.isActive).length}
                      </p>
                    </div>
                    <Lock className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {adminRouteProtections.filter((r) => !r.isActive).length}{" "}
                    inactive
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Compliance Status
                      </p>
                      <p className="text-2xl font-bold">
                        {getAdminComplianceStatus().status}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Overall security posture
                  </p>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowAdminSessionManager(true)}
                  variant="outline"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Manage Sessions
                </Button>
                <Button
                  onClick={() => setShowAdminActivityLogs(true)}
                  variant="outline"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Activity Logs
                </Button>
                <Button
                  onClick={() => setShowAdminSecuritySettings(true)}
                  variant="outline"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Security Settings
                </Button>
                <Button
                  onClick={() => setShowAdminRouteProtection(true)}
                  variant="outline"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Route Protection
                </Button>
              </div>

              {/* Active Sessions Overview */}
              <div>
                <h4 className="mb-3 text-sm font-medium">
                  Active Administrative Sessions
                </h4>
                <div className="space-y-3">
                  {adminSessions
                    .filter((s) => s.isActive)
                    .slice(0, 3)
                    .map((session) => {
                      const status = getAdminSessionStatus(session);
                      return (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                              <span className="text-sm font-semibold text-white">
                                {session.adminName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {session.adminName}
                              </p>
                              <p className="text-xs text-gray-600">
                                {session.ipAddress} • {session.location}
                              </p>
                              <p className="text-xs text-gray-500">
                                {session.deviceType} • {session.browser}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={getAdminSessionStatusColor(status)}
                            >
                              {status}
                            </Badge>
                            <Badge
                              className={getAdminRiskScoreColor(
                                session.riskScore
                              )}
                            >
                              {getAdminRiskScoreLabel(session.riskScore)}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatAdminSessionDuration(
                                session.sessionDuration
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Recent Security Activity */}
              <div>
                <h4 className="mb-3 text-sm font-medium">
                  Recent Security Activity
                </h4>
                <div className="space-y-3">
                  {adminActivityLogs.slice(0, 3).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600">
                          <Activity className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-600">
                            {activity.adminName} • {activity.resource}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.details}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={getAdminActivityStatusColor(
                            activity.status
                          )}
                        >
                          {activity.status}
                        </Badge>
                        <Badge
                          className={getAdminActivitySeverityColor(
                            activity.severity
                          )}
                        >
                          {activity.severity}
                        </Badge>
                        <Badge
                          className={getAdminRiskScoreColor(activity.riskScore)}
                        >
                          {getAdminRiskScoreLabel(activity.riskScore)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Features Status */}
              <div>
                <h4 className="mb-3 text-sm font-medium">
                  Security Features Status
                </h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {adminSecurityFeatures.map((feature) => {
                    const status = getAdminSecurityFeatureStatus(feature);
                    return (
                      <div
                        key={feature.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                      >
                        <div>
                          <p className="text-sm font-medium">{feature.name}</p>
                          <p className="text-xs text-gray-600">
                            {feature.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {feature.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={getAdminSecurityFeatureStatusColor(
                              status
                            )}
                          >
                            {status}
                          </Badge>
                          <Switch checked={feature.isEnabled} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Route Protection Overview */}
              <div>
                <h4 className="mb-3 text-sm font-medium">
                  Protected API Routes
                </h4>
                <div className="space-y-3">
                  {adminRouteProtections
                    .filter((r) => r.isActive)
                    .map((route) => (
                      <div
                        key={route.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              className={getAdminRouteProtectionMethodColor(
                                route.method
                              )}
                            >
                              {route.method}
                              <span className="font-mono text-sm">
                                {route.route}
                              </span>
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">
                            {route.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            Requires:{" "}
                            {getAdminLevelLabel(route.requiredAdminLevel)} •{" "}
                            {route.requiredPermissions.length} permissions
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              route.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {route.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced-security" className="space-y-6">
          {/* Advanced Security Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Advanced Security & Threat Management
              </h3>
              <p className="text-gray-600">
                Advanced threat detection, anomaly monitoring, compliance
                reporting, and security workflows
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowThreatDashboard(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                Threat Dashboard
              </Button>
              <Button
                onClick={() => setShowComplianceDashboard(true)}
                variant="outline"
              >
                <FileText className="w-4 h-4 mr-2" />
                Compliance Reports
              </Button>
              <Button
                onClick={() => setShowWorkflowManager(true)}
                variant="outline"
              >
                <Workflow className="w-4 h-4 mr-2" />
                Workflows
              </Button>
              <Button
                onClick={() => setShowIntegrationManager(true)}
                variant="outline"
              >
                <Link className="w-4 h-4 mr-2" />
                Integrations
              </Button>
            </div>
          </div>

          {/* Overall Security Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Overall Security Score
              </CardTitle>
              <CardDescription>
                Comprehensive security assessment across all systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="mb-2 text-6xl font-bold text-blue-600">
                  {getOverallSecurityScore()}%
                </div>
                <p className="text-gray-600">Security Posture Score</p>
                <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {
                        adminThreatDetections.filter(
                          (t) => t.status === "resolved"
                        ).length
                      }
                    </div>
                    <p className="text-sm text-gray-600">Threats Resolved</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {
                        adminAnomalyDetections.filter(
                          (a) => a.status === "resolved"
                        ).length
                      }
                    </div>
                    <p className="text-sm text-gray-600">Anomalies Resolved</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {adminComplianceReports.reduce(
                        (acc, r) => acc + r.summary.complianceScore,
                        0
                      ) / Math.max(adminComplianceReports.length, 1)}
                    </div>
                    <p className="text-sm text-gray-600">Avg Compliance</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {
                        adminSecurityIntegrations.filter(
                          (i) => i.status === "active"
                        ).length
                      }
                    </div>
                    <p className="text-sm text-gray-600">Active Integrations</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Threat Detection & Anomaly Monitoring */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Active Threats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Active Threats
                </CardTitle>
                <CardDescription>
                  Current security threats requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {adminThreatDetections
                    .filter((t) => t.status !== "resolved")
                    .slice(0, 3)
                    .map((threat) => (
                      <div
                        key={threat.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-red-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {getThreatTypeIcon(threat.threatType)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {threat.description}
                            </p>
                            <p className="text-xs text-gray-600">
                              Detected:{" "}
                              {new Date(threat.detectedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={getThreatSeverityColor(threat.severity)}
                          >
                            {threat.severity}
                          </Badge>
                          <Badge
                            className={getThreatStatusColor(threat.status)}
                          >
                            {threat.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedThreat(threat)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  {adminThreatDetections.filter((t) => t.status !== "resolved")
                    .length === 0 && (
                    <div className="py-4 text-center text-gray-500">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <p>No active threats detected</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Anomaly Detection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  Anomaly Detection
                </CardTitle>
                <CardDescription>
                  Unusual patterns and behaviors detected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {adminAnomalyDetections
                    .filter((a) => a.status !== "resolved")
                    .slice(0, 3)
                    .map((anomaly) => (
                      <div
                        key={anomaly.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-orange-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {getAnomalyTypeIcon(anomaly.anomalyType)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {anomaly.description}
                            </p>
                            <p className="text-xs text-gray-600">
                              Confidence: {anomaly.confidence}%
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={getAnomalyConfidenceColor(
                              anomaly.confidence
                            )}
                          >
                            {anomaly.confidence}%
                          </Badge>
                          <Badge
                            className={getThreatStatusColor(anomaly.status)}
                          >
                            {anomaly.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedAnomaly(anomaly)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  {adminAnomalyDetections.filter((a) => a.status !== "resolved")
                    .length === 0 && (
                    <div className="py-4 text-center text-gray-500">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <p>No anomalies detected</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance & Workflows */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Compliance Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Recent Compliance Reports
                </CardTitle>
                <CardDescription>
                  Latest compliance and audit reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {adminComplianceReports.slice(0, 3).map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-blue-50"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {report.reportType.replace("_", " ").toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-600">
                          {report.period} • {report.generatedBy}
                        </p>
                        <p className="text-xs text-gray-500">
                          Score: {report.summary.complianceScore}%
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={getComplianceReportStatusColor(
                            report.status
                          )}
                        >
                          {report.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedComplianceReport(report)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Workflows */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-purple-600" />
                  Active Workflows
                </CardTitle>
                <CardDescription>
                  Security workflows and approval processes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {adminSecurityWorkflows
                    .filter((w) => w.status !== "completed")
                    .slice(0, 3)
                    .map((workflow) => (
                      <div
                        key={workflow.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-purple-50"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {workflow.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            {workflow.initiator} • Step {workflow.currentStep}/
                            {workflow.totalSteps}
                          </p>
                          <p className="text-xs text-gray-500">
                            Due:{" "}
                            {new Date(workflow.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={getWorkflowPriorityColor(
                              workflow.priority
                            )}
                          >
                            {workflow.priority}
                          </Badge>
                          <Badge
                            className={getWorkflowStatusColor(workflow.status)}
                          >
                            {workflow.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedWorkflow(workflow)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  {adminSecurityWorkflows.filter(
                    (w) => w.status !== "completed"
                  ).length === 0 && (
                    <div className="py-4 text-center text-gray-500">
                      <CheckCircle className="w-8 h-4 mx-auto mb-2 text-green-600" />
                      <p>No active workflows</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Integrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Security Integrations
              </CardTitle>
              <CardDescription>
                Third-party security tools and system integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {adminSecurityIntegrations.map((integration) => (
                  <Card key={integration.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">
                          {getIntegrationTypeIcon(integration.type)}
                        </span>
                        <div>
                          <h4 className="text-sm font-semibold">
                            {integration.name}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {integration.vendor}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={getIntegrationStatusColor(
                          integration.status
                        )}
                      >
                        {integration.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Version:</span>
                        <span className="font-medium">
                          {integration.version}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Health:</span>
                        <Badge
                          className={getIntegrationHealthColor(
                            integration.healthScore
                          )}
                        >
                          {integration.healthScore}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Last Sync:</span>
                        <span className="font-medium">
                          {new Date(integration.lastSync).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Alerts:</span>
                        <Badge variant="outline">
                          {
                            integration.alerts.filter(
                              (a) => a.status === "active"
                            ).length
                          }
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedIntegration(integration)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowIntegrationManager(true)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration-automation" className="space-y-6">
          {/* Integration & Automation Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Integration & Automation Management
              </h3>
              <p className="text-gray-600">
                Manage system integrations, automation workflows, data
                synchronization, and API management
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowSystemIntegrationManager(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link className="w-4 h-4 mr-2" />
                Manage Integrations
              </Button>
              <Button
                onClick={() => setShowAutomationWorkflowManager(true)}
                variant="outline"
              >
                <Workflow className="w-4 h-4 mr-2" />
                Workflows
              </Button>
              <Button
                onClick={() => setShowSyncJobManager(true)}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Jobs
              </Button>
              <Button onClick={() => setShowAPIManager(true)} variant="outline">
                <Code className="w-4 h-4 mr-2" />
                API Management
              </Button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  System Integrations
                </CardTitle>
                <Link className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemIntegrations.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {getOverallIntegrationHealth()}% healthy
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Automation Workflows
                </CardTitle>
                <Workflow className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {automationWorkflows.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {getAutomationEfficiency()}% efficient
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Data Sync Jobs
                </CardTitle>
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dataSyncJobs.length}</div>
                <p className="text-xs text-muted-foreground">
                  {getDataSyncSuccessRate()}% success rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Webhook Endpoints
                </CardTitle>
                <Globe className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {webhookEndpoints.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {webhookEndpoints.filter((w) => w.status === "active").length}{" "}
                  active
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Integrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                System Integrations
              </CardTitle>
              <CardDescription>
                Monitor and manage external system connections and data flows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemIntegrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getIntegrationTypeIconPhase4(integration.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-gray-600">
                          {integration.endpoint}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={getIntegrationStatusColorPhase4(
                              integration.status
                            )}
                          >
                            {integration.status}
                          </Badge>
                          <Badge variant="outline">{integration.type}</Badge>
                          <span
                            className={`text-sm ${getIntegrationHealthColorPhase4(
                              integration.healthScore
                            )}`}
                          >
                            {integration.healthScore}% health
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Last sync:{" "}
                        {new Date(integration.lastSync).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Success rate: {integration.successRate}%
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedSystemIntegration(integration)
                        }
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Automation Workflows */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="w-5 h-5" />
                Automation Workflows
              </CardTitle>
              <CardDescription>
                Manage automated processes and business logic workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationWorkflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getWorkflowCategoryIconPhase4(workflow.category)}
                      </div>
                      <div>
                        <h4 className="font-medium">{workflow.name}</h4>
                        <p className="text-sm text-gray-600">
                          {workflow.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={getWorkflowStatusColorPhase4(
                              workflow.status
                            )}
                          >
                            {workflow.status}
                          </Badge>
                          <Badge
                            className={getWorkflowPriorityColorPhase4(
                              workflow.priority
                            )}
                          >
                            {workflow.priority}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            Step {workflow.currentStep}/{workflow.totalSteps}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Last run: {new Date(workflow.lastRun).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Success: {workflow.successCount} | Failed:{" "}
                        {workflow.failureCount}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAutomationWorkflow(workflow)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Sync Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Data Synchronization Jobs
              </CardTitle>
              <CardDescription>
                Monitor data synchronization processes and schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataSyncJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🔄</div>
                      <div>
                        <h4 className="font-medium">{job.name}</h4>
                        <p className="text-sm text-gray-600">
                          {job.source} → {job.destination}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={getSyncJobStatusColorPhase4(job.status)}
                          >
                            {job.status}
                          </Badge>
                          <Badge variant="outline">{job.type}</Badge>
                          {job.status === "running" && (
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-gray-200 rounded-full">
                                <div
                                  className="h-2 bg-blue-600 rounded-full"
                                  style={{ width: `${job.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">
                                {job.progress}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Next run: {new Date(job.nextRun).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {job.processedRecords}/{job.totalRecords} records
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSyncJob(job)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Webhook Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Webhook Endpoints
              </CardTitle>
              <CardDescription>
                Manage webhook configurations and event notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhookEndpoints.map((webhook) => (
                  <div
                    key={webhook.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🔗</div>
                      <div>
                        <h4 className="font-medium">{webhook.name}</h4>
                        <p className="text-sm text-gray-600">{webhook.url}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={getWebhookMethodColorPhase4(
                              webhook.method
                            )}
                          >
                            {webhook.method}
                          </Badge>
                          <Badge
                            className={getIntegrationStatusColorPhase4(
                              webhook.status
                            )}
                          >
                            {webhook.status}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {webhook.events.length} events
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Last triggered:{" "}
                        {new Date(webhook.lastTriggered).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Success: {webhook.successCount} | Failed:{" "}
                        {webhook.failureCount}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedWebhook(webhook)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* API Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                API Management
              </CardTitle>
              <CardDescription>
                Monitor API performance, usage, and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiManagement.map((api) => (
                  <div
                    key={api.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🔌</div>
                      <div>
                        <h4 className="font-medium">{api.name}</h4>
                        <p className="text-sm text-gray-600">{api.baseUrl}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={getAPIVersionColorPhase4(api.version)}
                          >
                            {api.version}
                          </Badge>
                          <Badge
                            className={getIntegrationStatusColorPhase4(
                              api.status
                            )}
                          >
                            {api.status}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {api.endpoints.length} endpoints
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Last updated:{" "}
                        {new Date(api.lastUpdated).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {api.usage.successfulRequests.toLocaleString()}{" "}
                        successful requests
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAPI(api)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Role Templates</CardTitle>
              <CardDescription>
                Predefined user role configurations for quick setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {userTemplates.map((template) => (
                  <Card
                    key={template.name}
                    className="transition-shadow cursor-pointer hover:shadow-md"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {template.name}
                        <Badge className={getRoleColor(template.role)}>
                          {template.role}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Permissions:</h4>
                        <div className="flex flex-wrap gap-2">
                          {template.permissions.map((permission) => (
                            <Badge
                              key={permission}
                              variant="secondary"
                              className="text-xs"
                            >
                              {permission}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          className="w-full mt-4"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk User Import</CardTitle>
              <CardDescription>
                Import multiple users from CSV or Excel files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Download Template</h3>
                  <p className="text-sm text-gray-600">
                    Get the CSV template with the correct format
                  </p>
                </div>
                <Button onClick={downloadTemplate} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">Upload File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) =>
                      setBulkImportFile(e.target.files?.[0] || null)
                    }
                    className="mt-2"
                  />
                  <p className="mt-1 text-sm text-gray-600">
                    Supported formats: CSV, Excel (.xlsx, .xls). Max size: 5MB
                  </p>
                </div>

                {bulkImportFile && (
                  <div className="flex items-center space-x-2">
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">
                      {bulkImportFile.name} selected
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setBulkImportFile(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <Button
                  onClick={handleBulkImport}
                  disabled={!bulkImportFile || isImporting}
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Import Users
                    </>
                  )}
                </Button>
              </div>

              {importResults && (
                <div className="space-y-4">
                  <Separator />
                  <h3 className="font-medium">Import Results</h3>

                  {importResults.success.length > 0 && (
                    <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                      <div className="flex items-center mb-2 space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">
                          {importResults.success.length} users imported
                          successfully
                        </span>
                      </div>
                      <div className="space-y-2">
                        {importResults.success.map((user) => (
                          <div key={user.id} className="text-sm text-green-700">
                            ✓ {user.name} ({user.email}) - {user.role}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {importResults.errors.length > 0 && (
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center mb-2 space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-800">
                          {importResults.errors.length} errors encountered
                        </span>
                      </div>
                      <div className="space-y-2">
                        {importResults.errors.map((error, index) => (
                          <div key={index} className="text-sm text-red-700">
                            ✗ Row {error.row}: {error.error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Invitations</CardTitle>
              <CardDescription>
                Send email invitations to new users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center text-gray-600">
                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No pending invitations</p>
                <p className="text-sm">Invite new users to get started</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create User Dialog */}
      <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new staff member to the system
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createUserFormik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...createUserFormik.getFieldProps("name")}
                  className={
                    createUserFormik.touched.name &&
                    createUserFormik.errors.name
                      ? "border-red-500"
                      : ""
                  }
                />
                {createUserFormik.touched.name &&
                  createUserFormik.errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {createUserFormik.errors.name}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...createUserFormik.getFieldProps("email")}
                  className={
                    createUserFormik.touched.email &&
                    createUserFormik.errors.email
                      ? "border-red-500"
                      : ""
                  }
                />
                {createUserFormik.touched.email &&
                  createUserFormik.errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {createUserFormik.errors.email}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...createUserFormik.getFieldProps("username")}
                  className={
                    createUserFormik.touched.username &&
                    createUserFormik.errors.username
                      ? "border-red-500"
                      : ""
                  }
                />
                {createUserFormik.touched.username &&
                  createUserFormik.errors.username && (
                    <p className="mt-1 text-sm text-red-600">
                      {createUserFormik.errors.username}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  {...createUserFormik.getFieldProps("phone_number")}
                  className={
                    createUserFormik.touched.phone_number &&
                    createUserFormik.errors.phone_number
                      ? "border-red-500"
                      : ""
                  }
                />
                {createUserFormik.touched.phone_number &&
                  createUserFormik.errors.phone_number && (
                    <p className="mt-1 text-sm text-red-600">
                      {createUserFormik.errors.phone_number}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...createUserFormik.getFieldProps("password")}
                  className={
                    createUserFormik.touched.password &&
                    createUserFormik.errors.password
                      ? "border-red-500"
                      : ""
                  }
                />
                {createUserFormik.touched.password &&
                  createUserFormik.errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {createUserFormik.errors.password}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={createUserFormik.values.role}
                  onValueChange={(value) =>
                    createUserFormik.setFieldValue("role", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end pt-4 space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateUser(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createUserFormik.isSubmitting}>
                {createUserFormik.isSubmitting ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog open={showInviteUser} onOpenChange={setShowInviteUser}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Send an email invitation to a new user
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={inviteUserFormik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invite-name">Full Name</Label>
                <Input
                  id="invite-name"
                  {...inviteUserFormik.getFieldProps("name")}
                  className={
                    inviteUserFormik.touched.name &&
                    inviteUserFormik.errors.name
                      ? "border-red-500"
                      : ""
                  }
                />
                {inviteUserFormik.touched.name &&
                  inviteUserFormik.errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {inviteUserFormik.errors.name}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  {...inviteUserFormik.getFieldProps("email")}
                  className={
                    inviteUserFormik.touched.email &&
                    inviteUserFormik.errors.email
                      ? "border-red-500"
                      : ""
                  }
                />
                {inviteUserFormik.touched.email &&
                  inviteUserFormik.errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {inviteUserFormik.errors.email}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="invite-username">Username</Label>
                <Input
                  id="invite-username"
                  {...inviteUserFormik.getFieldProps("username")}
                  className={
                    inviteUserFormik.touched.username &&
                    inviteUserFormik.errors.username
                      ? "border-red-500"
                      : ""
                  }
                />
                {inviteUserFormik.touched.username &&
                  inviteUserFormik.errors.username && (
                    <p className="mt-1 text-sm text-red-600">
                      {inviteUserFormik.errors.username}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="invite-phone_number">Phone Number</Label>
                <Input
                  id="invite-phone_number"
                  {...inviteUserFormik.getFieldProps("phone_number")}
                  className={
                    inviteUserFormik.touched.phone_number &&
                    inviteUserFormik.errors.phone_number
                      ? "border-red-500"
                      : ""
                  }
                />
                {inviteUserFormik.touched.phone_number &&
                  inviteUserFormik.errors.phone_number && (
                    <p className="mt-1 text-sm text-red-600">
                      {inviteUserFormik.errors.phone_number}
                    </p>
                  )}
              </div>
              <div className="col-span-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select
                  value={inviteUserFormik.values.role}
                  onValueChange={(value) =>
                    inviteUserFormik.setFieldValue("role", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end pt-4 space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowInviteUser(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={inviteUserFormik.isSubmitting}>
                {inviteUserFormik.isSubmitting
                  ? "Sending..."
                  : "Send Invitation"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Template Selection Dialog */}
      <Dialog
        open={!!selectedTemplate}
        onOpenChange={() => setSelectedTemplate(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Use Template: {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Permissions</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTemplate?.permissions.map((permission) => (
                  <Badge key={permission} variant="secondary">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setSelectedTemplate(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // TODO: Implement template application
                  setSelectedTemplate(null);
                  setShowCreateUser(true);
                }}
              >
                Apply Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Custom Role Dialog */}
      <Dialog open={showCreateRole} onOpenChange={setShowCreateRole}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Custom Role</DialogTitle>
            <DialogDescription>
              Define a new role with specific permissions and hierarchy
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  placeholder="e.g., Senior Manager, Equipment Specialist"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="parentRole">Parent Role</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select parent role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    {customRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="roleDescription">Description</Label>
              <Textarea
                id="roleDescription"
                placeholder="Describe the role's purpose and responsibilities..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Permissions</Label>
              <div className="mt-2 space-y-4">
                {Array.from(new Set(permissions.map((p) => p.category))).map(
                  (category) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        {category}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {permissions
                          .filter((p) => p.category === category)
                          .map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={permission.id}
                                className="border-gray-300 rounded"
                              />
                              <Label
                                htmlFor={permission.id}
                                className="text-sm"
                              >
                                {permission.name}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <Button variant="outline" onClick={() => setShowCreateRole(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Custom role created successfully!");
                setShowCreateRole(false);
              }}
            >
              Create Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Role Assignment Dialog */}
      <Dialog
        open={showBulkRoleAssignment}
        onOpenChange={setShowBulkRoleAssignment}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Role Assignment</DialogTitle>
            <DialogDescription>
              Assign roles and permissions to multiple users at once
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="bulkRole">Select Role</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a role to assign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  {customRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Select Users</Label>
              <div className="mt-2 space-y-2 overflow-y-auto max-h-60">
                {users?.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`user-${user.id}`}
                      className="border-gray-300 rounded"
                    />
                    <Label htmlFor={`user-${user.id}`} className="text-sm">
                      {user.name} ({user.email})
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="bulkReason">Reason for Assignment</Label>
              <Textarea
                id="bulkReason"
                placeholder="Document the reason for this role assignment..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowBulkRoleAssignment(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Bulk role assignment completed successfully!");
                setShowBulkRoleAssignment(false);
              }}
            >
              Assign Roles
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Permission Audit Dialog */}
      <Dialog open={showPermissionAudit} onOpenChange={setShowPermissionAudit}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Permission Audit Trail</DialogTitle>
            <DialogDescription>
              Complete history of permission changes and role assignments
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="auditSearch">Search Audit Log</Label>
                <Input
                  id="auditSearch"
                  placeholder="Search by user, permission, or action..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="auditFilter">Filter by Action</Label>
                <Select>
                  <SelectTrigger className="w-32 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="granted">Granted</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                    <SelectItem value="modified">Modified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-y-auto max-h-96">
              <div className="space-y-3">
                {permissionAudits.map((audit) => (
                  <div key={audit.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={
                              audit.action === "granted"
                                ? "bg-green-100 text-green-800"
                                : audit.action === "revoked"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {audit.action.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{audit.userName}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-600">
                            {audit.permission}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Role: {audit.role} • Admin: {audit.adminUser}
                        </div>
                        {audit.reason && (
                          <div className="mt-1 text-sm text-gray-500">
                            Reason: {audit.reason}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(audit.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowPermissionAudit(false)}
            >
              Close
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Audit Log
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Details Dialog */}
      <Dialog open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Role Details: {selectedRole?.name}</DialogTitle>
            <DialogDescription>
              Detailed information about permissions and inheritance
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Role Name
                  </Label>
                  <p className="text-lg font-medium">{selectedRole.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Status
                  </Label>
                  <Badge
                    className={
                      selectedRole.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {selectedRole.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Parent Role
                  </Label>
                  <p className="text-lg font-medium">
                    {selectedRole.parentRole || "None"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Users Assigned
                  </Label>
                  <p className="text-lg font-medium">
                    {selectedRole.userCount}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Description
                </Label>
                <p className="text-gray-600">{selectedRole.description}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Permissions ({selectedRole.permissions.length})
                </Label>
                <div className="grid grid-cols-1 gap-2 mt-2 md:grid-cols-2">
                  {selectedRole.permissions.map((permissionId) => (
                    <div
                      key={permissionId}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="text-sm">{permissionId}</span>
                      <Badge variant="outline" className="text-xs">
                        {getPermissionDescription(permissionId)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRole.parentRole && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Inherited Permissions
                    </Label>
                    <div className="mt-2 text-sm text-gray-600">
                      This role inherits permissions from:{" "}
                      <strong>{selectedRole.parentRole}</strong>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  Created:{" "}
                  {new Date(selectedRole.createdAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>
                  Updated:{" "}
                  {new Date(selectedRole.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
          <div className="flex justify-end pt-4 space-x-3">
            <Button variant="outline" onClick={() => setSelectedRole(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setEditingRole(selectedRole);
                setSelectedRole(null);
              }}
            >
              Edit Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Security Settings Dialog */}
      <Dialog
        open={showSecuritySettings}
        onOpenChange={setShowSecuritySettings}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Security Settings Configuration</DialogTitle>
            <DialogDescription>
              Configure password policies, account lockout, and security
              features
            </DialogDescription>
          </DialogHeader>
          {securitySettings && (
            <div className="space-y-6">
              {/* Password Policy Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Password Policy</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minLength">Minimum Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={securitySettings.passwordPolicy.minLength}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="complexityScore">Complexity Score</Label>
                    <Input
                      id="complexityScore"
                      type="number"
                      min="1"
                      max="10"
                      value={securitySettings.passwordPolicy.complexityScore}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Password Requirements</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="requireUppercase"
                        checked={
                          securitySettings.passwordPolicy.requireUppercase
                        }
                        className="border-gray-300 rounded"
                      />
                      <Label htmlFor="requireUppercase">
                        Require Uppercase
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="requireLowercase"
                        checked={
                          securitySettings.passwordPolicy.requireLowercase
                        }
                        className="border-gray-300 rounded"
                      />
                      <Label htmlFor="requireLowercase">
                        Require Lowercase
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="requireNumbers"
                        checked={securitySettings.passwordPolicy.requireNumbers}
                        className="border-gray-300 rounded"
                      />
                      <Label htmlFor="requireNumbers">Require Numbers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="requireSpecialChars"
                        checked={
                          securitySettings.passwordPolicy.requireSpecialChars
                        }
                        className="border-gray-300 rounded"
                      />
                      <Label htmlFor="requireSpecialChars">
                        Require Special Characters
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxAge">Maximum Age (days)</Label>
                    <Input
                      id="maxAge"
                      type="number"
                      value={securitySettings.passwordPolicy.maxAge}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preventReuse">
                      Prevent Reuse (last N passwords)
                    </Label>
                    <Input
                      id="preventReuse"
                      type="number"
                      value={securitySettings.passwordPolicy.preventReuse}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Account Lockout Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Lockout</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxFailedAttempts">
                      Maximum Failed Attempts
                    </Label>
                    <Input
                      id="maxFailedAttempts"
                      type="number"
                      value={securitySettings.accountLockout.maxFailedAttempts}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lockoutDuration">
                      Lockout Duration (minutes)
                    </Label>
                    <Input
                      id="lockoutDuration"
                      type="number"
                      value={securitySettings.accountLockout.lockoutDuration}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lockoutThreshold">Lockout Threshold</Label>
                    <Input
                      id="lockoutThreshold"
                      type="number"
                      value={securitySettings.accountLockout.lockoutThreshold}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unlockMethod">Unlock Method</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="admin">Admin Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Notifications</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="notifyUser"
                        checked={securitySettings.accountLockout.notifyUser}
                        className="border-gray-300 rounded"
                      />
                      <Label htmlFor="notifyUser">Notify User on Lockout</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="notifyAdmin"
                        checked={securitySettings.accountLockout.notifyAdmin}
                        className="border-gray-300 rounded"
                      />
                      <Label htmlFor="notifyAdmin">
                        Notify Admin on Lockout
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* General Security Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">General Security</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sessionTimeout">
                      Session Timeout (minutes)
                    </Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={Math.floor(securitySettings.sessionTimeout / 60)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="mfaRequired"
                      checked={securitySettings.mfaRequired}
                      className="border-gray-300 rounded"
                    />
                    <Label htmlFor="mfaRequired">
                      Require Multi-Factor Authentication
                    </Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Monitoring</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="auditLogging"
                        checked={securitySettings.auditLogging}
                        className="border-gray-300 rounded"
                      />
                      <Label htmlFor="auditLogging">Enable Audit Logging</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="realTimeMonitoring"
                        checked={securitySettings.realTimeMonitoring}
                        className="border-gray-300 rounded"
                      />
                      <Label htmlFor="realTimeMonitoring">
                        Enable Real-Time Monitoring
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end pt-4 space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowSecuritySettings(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Security settings updated successfully!");
                setShowSecuritySettings(false);
              }}
            >
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Session Management Dialog */}
      <Dialog
        open={showSessionManagement}
        onOpenChange={setShowSessionManagement}
      >
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Session Management</DialogTitle>
            <DialogDescription>
              Monitor and manage active user sessions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select
                  value={securityTimeRange}
                  onValueChange={setSecurityTimeRange}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last hour</SelectItem>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Refresh sessions
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                {userSessions.length} total sessions
              </div>
            </div>

            <div className="overflow-y-auto max-h-96">
              <div className="space-y-3">
                {userSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                        <span className="text-sm font-medium text-gray-600">
                          {session.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{session.userName}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>
                            {getDeviceTypeIcon(session.deviceType)}{" "}
                            {session.deviceType}
                          </span>
                          <span>•</span>
                          <span>{session.browser}</span>
                          <span>•</span>
                          <span>{session.os}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{session.ipAddress}</div>
                        <div className="text-gray-500">IP Address</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{session.location}</div>
                        <div className="text-gray-500">Location</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">
                          {formatSessionDuration(
                            session.loginTime,
                            session.lastActivity
                          )}
                        </div>
                        <div className="text-gray-500">Duration</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">
                          {new Date(session.loginTime).toLocaleTimeString()}
                        </div>
                        <div className="text-gray-500">Login Time</div>
                      </div>
                      <Badge
                        className={getSessionStatusColor(session.isActive)}
                      >
                        {session.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSession(session)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Terminate session
                            toast.success(
                              `Session terminated for ${session.userName}`
                            );
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowSessionManagement(false)}
            >
              Close
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Sessions
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Access Logs Dialog */}
      <Dialog open={showAccessLogs} onOpenChange={setShowAccessLogs}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Access Logs & Security Events</DialogTitle>
            <DialogDescription>
              Comprehensive view of user actions, security events, and access
              patterns
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="logSearch">Search Logs</Label>
                <Input
                  id="logSearch"
                  placeholder="Search by user, action, resource, or IP..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="logStatus">Filter by Status</Label>
                <Select>
                  <SelectTrigger className="w-32 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="logRisk">Filter by Risk</Label>
                <Select>
                  <SelectTrigger className="w-32 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-y-auto max-h-96">
              <div className="space-y-3">
                {accessLogs.map((log) => (
                  <div key={log.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{log.userName}</span>
                          <Badge className={getActionStatusColor(log.status)}>
                            {log.status.toUpperCase()}
                          </Badge>
                          <Badge className={getRiskScoreColor(log.riskScore)}>
                            {getRiskScoreLabel(log.riskScore)} Risk
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Action:</strong> {log.action} •{" "}
                          <strong>Resource:</strong> {log.resource}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>IP:</strong> {log.ipAddress} •{" "}
                          <strong>Location:</strong> {log.location}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {log.details}
                        </div>
                      </div>
                      <div className="text-sm text-right text-gray-500">
                        <div>
                          {new Date(log.timestamp).toLocaleDateString()}
                        </div>
                        <div>
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <Button variant="outline" onClick={() => setShowAccessLogs(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* IP Restrictions Dialog */}
      <Dialog open={showIPRestrictions} onOpenChange={setShowIPRestrictions}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>IP Access Control Management</DialogTitle>
            <DialogDescription>
              Configure IP whitelist, blacklist, and geolocation restrictions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Current IP Restrictions</h3>
              <Button
                onClick={() => {
                  // Add new IP restriction
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Restriction
              </Button>
            </div>

            <div className="space-y-4">
              {ipRestrictions.map((restriction) => (
                <div
                  key={restriction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Badge
                      className={getIPRestrictionTypeColor(restriction.type)}
                    >
                      {restriction.type}
                    </Badge>
                    <div>
                      <h3 className="font-medium">{restriction.value}</h3>
                      <p className="text-sm text-gray-600">
                        {restriction.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium">
                        Priority {restriction.priority}
                      </div>
                      <div className="text-gray-500">Priority</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{restriction.createdBy}</div>
                      <div className="text-gray-500">Created By</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(restriction.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Edit restriction
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Toggle active status
                          toast.success(
                            `IP restriction ${
                              restriction.isActive ? "deactivated" : "activated"
                            }`
                          );
                        }}
                      >
                        {restriction.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowIPRestrictions(false)}
            >
              Close
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Rules
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Editor Dialog */}
      <Dialog open={showProfileEditor} onOpenChange={setShowProfileEditor}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Modify user profile information, preferences, and settings
            </DialogDescription>
          </DialogHeader>
          {editingProfile && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editingProfile.bio}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          bio: e.target.value,
                        })
                      }
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={editingProfile.dateOfBirth || ""}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          dateOfBirth: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={editingProfile.gender}
                    onValueChange={(value) =>
                      setEditingProfile({
                        ...editingProfile,
                        gender: value as any,
                      })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Address Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={editingProfile.address.street}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          address: {
                            ...editingProfile.address,
                            street: e.target.value,
                          },
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={editingProfile.address.city}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          address: {
                            ...editingProfile.address,
                            city: e.target.value,
                          },
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={editingProfile.address.state}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          address: {
                            ...editingProfile.address,
                            state: e.target.value,
                          },
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={editingProfile.address.postalCode}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          address: {
                            ...editingProfile.address,
                            postalCode: e.target.value,
                          },
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={editingProfile.address.country}
                    onChange={(e) =>
                      setEditingProfile({
                        ...editingProfile,
                        address: {
                          ...editingProfile.address,
                          country: e.target.value,
                        },
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <Separator />

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyName">Name</Label>
                    <Input
                      id="emergencyName"
                      value={editingProfile.emergencyContact.name}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          emergencyContact: {
                            ...editingProfile.emergencyContact,
                            name: e.target.value,
                          },
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      value={editingProfile.emergencyContact.relationship}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          emergencyContact: {
                            ...editingProfile.emergencyContact,
                            relationship: e.target.value,
                          },
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={editingProfile.emergencyContact.phone}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          emergencyContact: {
                            ...editingProfile.emergencyContact,
                            phone: e.target.value,
                          },
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyEmail">Email</Label>
                    <Input
                      id="emergencyEmail"
                      value={editingProfile.emergencyContact.email}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          emergencyContact: {
                            ...editingProfile.emergencyContact,
                            email: e.target.value,
                          },
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Social Media */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Media</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={editingProfile.socialMedia.linkedin}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          socialMedia: {
                            ...editingProfile.socialMedia,
                            linkedin: e.target.value,
                          },
                        })
                      }
                      className="mt-1"
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={editingProfile.socialMedia.twitter}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          socialMedia: {
                            ...editingProfile.socialMedia,
                            twitter: e.target.value,
                          },
                        })
                      }
                      className="mt-1"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={editingProfile.socialMedia.facebook}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          socialMedia: {
                            ...editingProfile.socialMedia,
                            facebook: e.target.value,
                          },
                        })
                      }
                      className="mt-1"
                      placeholder="facebook.com/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={editingProfile.socialMedia.instagram}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          socialMedia: {
                            ...editingProfile.socialMedia,
                            instagram: e.target.value,
                          },
                        })
                      }
                      className="mt-1"
                      placeholder="@username"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={editingProfile.preferences.theme}
                      onValueChange={(value) =>
                        setEditingProfile({
                          ...editingProfile,
                          preferences: {
                            ...editingProfile.preferences,
                            theme: value as any,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto (System)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={editingProfile.preferences.language}
                      onValueChange={(value) =>
                        setEditingProfile({
                          ...editingProfile,
                          preferences: {
                            ...editingProfile.preferences,
                            language: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockLanguages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={editingProfile.preferences.timezone}
                      onValueChange={(value) =>
                        setEditingProfile({
                          ...editingProfile,
                          preferences: {
                            ...editingProfile.preferences,
                            timezone: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockTimezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label} ({tz.offset})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <Select
                      value={editingProfile.preferences.timeFormat}
                      onValueChange={(value) =>
                        setEditingProfile({
                          ...editingProfile,
                          preferences: {
                            ...editingProfile.preferences,
                            timeFormat: value as any,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={editingProfile.preferences.currency}
                      onValueChange={(value) =>
                        setEditingProfile({
                          ...editingProfile,
                          preferences: {
                            ...editingProfile.preferences,
                            currency: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCurrencies.map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.symbol} {curr.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Notification Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notification Settings</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Email Notifications */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Email Notifications</h4>
                    <div className="space-y-2">
                      {Object.entries(
                        editingProfile.notificationSettings.email
                      ).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`email_${key}`}
                            checked={value}
                            onChange={(e) =>
                              setEditingProfile({
                                ...editingProfile,
                                notificationSettings: {
                                  ...editingProfile.notificationSettings,
                                  email: {
                                    ...editingProfile.notificationSettings
                                      .email,
                                    [key]: e.target.checked,
                                  },
                                },
                              })
                            }
                            className="border-gray-300 rounded"
                          />
                          <Label
                            htmlFor={`email_${key}`}
                            className="text-sm capitalize"
                          >
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Push Notifications</h4>
                    <div className="space-y-2">
                      {Object.entries(
                        editingProfile.notificationSettings.push
                      ).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`push_${key}`}
                            checked={value}
                            onChange={(e) =>
                              setEditingProfile({
                                ...editingProfile,
                                notificationSettings: {
                                  ...editingProfile.notificationSettings,
                                  push: {
                                    ...editingProfile.notificationSettings.push,
                                    [key]: e.target.checked,
                                  },
                                },
                              })
                            }
                            className="border-gray-300 rounded"
                          />
                          <Label
                            htmlFor={`push_${key}`}
                            className="text-sm capitalize"
                          >
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SMS Notifications */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">SMS Notifications</h4>
                    <div className="space-y-2">
                      {Object.entries(
                        editingProfile.notificationSettings.sms
                      ).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`sms_${key}`}
                            checked={value}
                            onChange={(e) =>
                              setEditingProfile({
                                ...editingProfile,
                                notificationSettings: {
                                  ...editingProfile.notificationSettings,
                                  sms: {
                                    ...editingProfile.notificationSettings.sms,
                                    [key]: e.target.checked,
                                  },
                                },
                              })
                            }
                            className="border-gray-300 rounded"
                          />
                          <Label
                            htmlFor={`sms_${key}`}
                            className="text-sm capitalize"
                          >
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Privacy Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Privacy Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profileVisibility">
                      Profile Visibility
                    </Label>
                    <Select
                      value={editingProfile.privacySettings.profileVisibility}
                      onValueChange={(value) =>
                        setEditingProfile({
                          ...editingProfile,
                          privacySettings: {
                            ...editingProfile.privacySettings,
                            profileVisibility: value as any,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="team-only">Team Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">
                      Information Visibility
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(editingProfile.privacySettings)
                        .filter(([key]) => key !== "profileVisibility")
                        .map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`privacy_${key}`}
                              checked={value as boolean}
                              onChange={(e) =>
                                setEditingProfile({
                                  ...editingProfile,
                                  privacySettings: {
                                    ...editingProfile.privacySettings,
                                    [key]: e.target.checked,
                                  },
                                })
                              }
                              className="border-gray-300 rounded"
                            />
                            <Label
                              htmlFor={`privacy_${key}`}
                              className="text-sm capitalize"
                            >
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end pt-4 space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowProfileEditor(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Profile updated successfully!");
                setShowProfileEditor(false);
                setEditingProfile(null);
              }}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Picture Management Dialog */}
      <Dialog open={showProfilePicture} onOpenChange={setShowProfilePicture}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Profile Picture Management</DialogTitle>
            <DialogDescription>
              Upload, crop, and manage user profile pictures
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Upload New Picture</h3>
                <div className="p-6 text-center border-2 border-gray-300 border-dashed rounded-lg">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <div className="mt-2">
                    <Label htmlFor="profilePicture" className="cursor-pointer">
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Click to upload
                      </span>
                      <span className="text-sm text-gray-500">
                        {" "}
                        or drag and drop
                      </span>
                    </Label>
                    <Input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
                {profileImagePreview && (
                  <div className="text-center">
                    <h4 className="mb-2 text-sm font-medium">Preview</h4>
                    <img
                      src={profileImagePreview}
                      alt="Profile picture preview"
                      className="object-cover w-32 h-32 mx-auto border-2 border-gray-200 rounded-full"
                    />
                  </div>
                )}
              </div>

              {/* Current Pictures */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Current Profile Pictures
                </h3>
                <div className="space-y-3">
                  {userProfiles
                    .filter((p) => p.profilePicture)
                    .map((profile) => {
                      const user = users?.find((u) => u.id === profile.userId);
                      return (
                        <div
                          key={profile.id}
                          className="flex items-center p-3 space-x-3 border rounded-lg"
                        >
                          <img
                            src={profile.profilePicture!}
                            alt={`${user?.name || "User"} profile`}
                            className="object-cover w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">
                              {user?.name || "Unknown User"}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {user?.email || "No email"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // View full size
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Remove picture
                                toast.success(
                                  `Profile picture removed for ${
                                    user?.name || "user"
                                  }`
                                );
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowProfilePicture(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                if (profilePictureFile) {
                  toast.success("Profile picture uploaded successfully!");
                  setShowProfilePicture(false);
                  setProfilePictureFile(null);
                  setProfileImagePreview(null);
                }
              }}
            >
              Upload Picture
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Name
                  </Label>
                  <p className="text-lg font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Username
                  </Label>
                  <p className="text-lg font-medium">{selectedUser.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Email
                  </Label>
                  <p className="text-lg font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Phone Number
                  </Label>
                  <p className="text-lg font-medium">
                    {selectedUser.phone_number}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Role
                  </Label>
                  <Badge className={getRoleColor(selectedUser.role || "staff")}>
                    {selectedUser.role || "staff"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Status
                  </Label>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Created At
                </Label>
                <p className="text-sm text-gray-600">
                  {selectedUser.created_at
                    ? new Date(selectedUser.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Last Updated
                </Label>
                <p className="text-sm text-gray-600">
                  {selectedUser.updated_at
                    ? new Date(selectedUser.updated_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end pt-4 space-x-3">
            <Button variant="outline" onClick={() => setShowUserDetails(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setShowUserDetails(false);
                // TODO: Implement edit functionality
              }}
            >
              Edit User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
