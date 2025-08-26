import api from "@/lib/axios";
import { BASE_API_URL } from "@/constants";
import {
  User,
  Member,
  Equipment,
  Payment,
  Invoice,
  MembershipPlan,
  Subscription,
  LoginBody,
  RegisterUserBody,
  RegisterMemberBody,
  ForgotPasswordBody,
  ResetPasswordBody,
  LoginResponse,
  ApiResponse,
  ILoginMemberResponse,
} from "@/types";

// Auth API
export const authAPI = {
  // User Authentication
  loginUser: (data: LoginBody) =>
    api.post<LoginResponse>(`${BASE_API_URL}/auth/login`, data),

  registerUser: (data: RegisterUserBody) =>
    api.post<ApiResponse<User>>(`${BASE_API_URL}/auth/register`, data),

  logoutUser: () => api.post(`${BASE_API_URL}/auth/logout`),

  refreshToken: () => api.post<LoginResponse>(`${BASE_API_URL}/auth/refresh`),

  getCurrentUser: () => api.get<ApiResponse<User>>(`${BASE_API_URL}/auth/me`),

  forgotPassword: (data: ForgotPasswordBody) =>
    api.post<ApiResponse<{ resetToken?: string }>>(
      `${BASE_API_URL}/auth/forgot-password`,
      data
    ),

  resetPassword: (data: ResetPasswordBody) =>
    api.post<ApiResponse<null>>(`${BASE_API_URL}/auth/reset-password`, data),
};

// User Management API
export const userAPI = {
  getAllUsers: () => api.get<ApiResponse<User[]>>(`${BASE_API_URL}/users/list`),

  getSingleUser: (id: number) =>
    api.get<ApiResponse<User>>(`${BASE_API_URL}/users/single/${id}`),

  updateUser: (id: number, data: Partial<User>) =>
    api.put<ApiResponse<User>>(`${BASE_API_URL}/users/update/${id}`, data),

  updateProfilePicture: (id: number, profilePictureUrl: string) =>
    api.put<ApiResponse<User>>(`${BASE_API_URL}/users/profile-picture/${id}`, {
      profile_picture: profilePictureUrl,
    }),

  deleteUser: (id: number) =>
    api.delete<ApiResponse<User>>(`${BASE_API_URL}/users/delete/${id}`),

  // Equipment Management (for staff/admin users)
  getEquipment: () =>
    api.get<ApiResponse<Equipment[]>>(`${BASE_API_URL}/equipments/list`),

  addEquipment: (data: Omit<Equipment, "id" | "createdAt" | "updatedAt">) =>
    api.post<ApiResponse<Equipment>>(`${BASE_API_URL}/equipments/add`, data),

  updateEquipment: (id: string, data: Partial<Equipment>) =>
    api.put<ApiResponse<Equipment>>(
      `${BASE_API_URL}/equipments/update/${id}`,
      data
    ),

  deleteEquipment: (id: string) =>
    api.delete<ApiResponse<Equipment>>(
      `${BASE_API_URL}/equipments/delete/${id}`
    ),

  updateEquipmentStatus: (
    id: string,
    data: { status: string; maintenance?: boolean; nextMaintenance?: string }
  ) =>
    api.put<ApiResponse<Equipment>>(
      `${BASE_API_URL}/equipments/status/${id}`,
      data
    ),

  addMaintenanceLog: (
    id: string,
    data: {
      type: string;
      description: string;
      cost?: string;
      performedBy?: string;
      nextDue?: string;
    }
  ) =>
    api.post<ApiResponse<any>>(
      `${BASE_API_URL}/equipments/maintenance/${id}`,
      data
    ),

  getMaintenanceLogs: (params?: {
    page?: number;
    limit?: number;
    equipmentId?: string;
    type?: string;
  }) =>
    api.get<ApiResponse<any>>(`${BASE_API_URL}/equipments/maintenance`, {
      params,
    }),

  getEquipmentStats: () =>
    api.get<ApiResponse<any>>(`${BASE_API_URL}/equipments/stats`),
};

// User Management API functions
export const createUserByAdmin = async (userData: {
  name: string;
  email: string;
  username: string;
  phone_number: string;
  password: string;
  role: string;
}) => {
  const response = await api.post<ApiResponse<User>>(`/users/create`, userData);
  return response.data;
};

export const bulkImportUsers = async (formData: FormData) => {
  const response = await api.post<ApiResponse<User[]>>(
    `/users/bulk-import`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const getUserTemplates = async () => {
  const response = await api.get<ApiResponse<User[]>>(`/users/templates`);
  return response.data;
};

export const inviteUser = async (userData: {
  name: string;
  email: string;
  username: string;
  phone_number: string;
  role: string;
}) => {
  const response = await api.post<ApiResponse<User>>(`/users/invite`, userData);
  return response.data;
};

export const resendInvitation = async (userId: number) => {
  const response = await api.post<ApiResponse<User>>(
    `/users/resend-invitation/${userId}`
  );
  return response.data;
};

// Additional User Management API functions
export const searchUsers = async (params: {
  searchTerm?: string;
  role?: string;
  status?: string;
  department?: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get<
    ApiResponse<{
      users: User[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>
  >(`/users/search`, { params });
  return response.data;
};

export const updateUserStatus = async (userId: number, isActive: boolean) => {
  const response = await api.put<ApiResponse<User>>(`/users/status/${userId}`, {
    isActive,
  });
  return response.data;
};

export const getUserActivity = async (userId: number) => {
  const response = await api.get<
    ApiResponse<{
      userId: number;
      userName: string;
      userEmail: string;
      daysSinceCreation: number;
      daysSinceLastUpdate: number;
      isActive: boolean;
      activityLevel: "high" | "medium" | "low";
      lastActivity: string;
      accountAge: number;
    }>
  >(`/users/activity/${userId}`);
  return response.data;
};

export const bulkUpdateUserRoles = async (
  updates: Array<{
    userId: number;
    role: string;
  }>
) => {
  const response = await api.post<
    ApiResponse<{
      success: Array<{
        userId: number;
        oldRole: string;
        newRole: string;
        user: User;
      }>;
      errors: Array<{
        userId: number;
        error: string;
      }>;
    }>
  >(`/users/bulk-update-roles`, { updates });
  return response.data;
};

// Profile Management API functions
export const getUserProfile = async (userId: number) => {
  const response = await api.get<
    ApiResponse<{
      userId: number;
      basicInfo: {
        name: string;
        phone_number: string;
        bio: string;
        dateOfBirth: string | null;
        gender: "male" | "female" | "other" | "prefer-not-to-say";
      };
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
    }>
  >(`/users/profile/${userId}`);
  return response.data;
};

export const updateUserProfile = async (
  userId: number,
  profileData: {
    basicInfo: {
      name: string;
      phone_number: string;
      bio: string;
      dateOfBirth: string | null;
      gender: "male" | "female" | "other" | "prefer-not-to-say";
    };
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
  }
) => {
  const response = await api.put<
    ApiResponse<{
      user: User;
      profileData: any;
    }>
  >(`/users/profile/${userId}`, profileData);
  return response.data;
};

// Member Management API
export const memberAPI = {
  // Member Authentication
  loginMember: (data: LoginBody) =>
    api.post<ILoginMemberResponse>(`${BASE_API_URL}/members/login`, data),

  registerMember: (data: RegisterMemberBody) =>
    api.post<ApiResponse<Member>>(`${BASE_API_URL}/members/register`, data),

  // Member CRUD
  getAllMembers: () =>
    api.get<ApiResponse<Member[]>>(`${BASE_API_URL}/members/list`),

  getSingleMember: (id: string) =>
    api.get<ApiResponse<Member>>(`${BASE_API_URL}/members/single/${id}`),

  updateMember: (id: string, data: Partial<Member>) =>
    api.put<ApiResponse<Member>>(`${BASE_API_URL}/members/update/${id}`, data),

  updateProfilePicture: (id: string, profilePictureUrl: string) =>
    api.put<ApiResponse<Member>>(
      `${BASE_API_URL}/members/profile-picture/${id}`,
      {
        profile_picture: profilePictureUrl,
      }
    ),

  deleteMember: (id: string) =>
    api.delete<ApiResponse<Member>>(`${BASE_API_URL}/members/delete/${id}`),

  // Member Subscriptions
  subscribeMember: (id: string, planId: string) =>
    api.post<ApiResponse<Subscription>>(
      `${BASE_API_URL}/members/${id}/subscribe`,
      { planId }
    ),

  unsubscribeMember: (id: string) =>
    api.post<ApiResponse<null>>(`${BASE_API_URL}/members/${id}/unsubscribe`),
};

// Member Management API functions
export const searchMembers = async (params: {
  searchTerm?: string;
  status?: "active" | "inactive" | "all";
  membershipType?: string;
  ageMin?: number;
  ageMax?: number;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  city?: string;
  state?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get<
    ApiResponse<{
      members: Member[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>
  >(`/members/search`, { params });
  return response.data;
};

export const getMemberStats = async () => {
  const response = await api.get<
    ApiResponse<{
      totalMembers: number;
      activeMembers: number;
      pendingVerification: number;
      inactiveMembers: number;
      membershipDistribution: Array<{
        type: string;
        count: number;
        percentage: string;
      }>;
      ageDistribution: {
        under18: number;
        age18to25: number;
        age26to35: number;
        age36to50: number;
        over50: number;
      };
      monthlyGrowth: Array<{
        month: string;
        count: number;
      }>;
      growthRate: string;
      topCities: Array<{
        city: string;
        state: string;
        count: number;
      }>;
      recentRegistrations: number;
      averageAge: string;
    }>
  >(`/members/stats`);
  return response.data;
};

export const bulkImportMembers = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<
    ApiResponse<{
      success: Array<{
        row: number;
        member: Member;
      }>;
      errors: Array<{
        row: number;
        error: string;
        data: any;
      }>;
      total: number;
    }>
  >(`/members/bulk-import`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Equipment Management API
export const equipmentAPI = {
  getAllEquipment: () =>
    api.get<ApiResponse<Equipment[]>>(`${BASE_API_URL}/equipments/list`),

  getSingleEquipment: (id: string) =>
    api.get<ApiResponse<Equipment>>(`${BASE_API_URL}/equipments/single/${id}`),

  addEquipment: (data: Omit<Equipment, "id" | "createdAt" | "updatedAt">) =>
    api.post<ApiResponse<Equipment>>(`${BASE_API_URL}/equipments/add`, data),

  updateEquipment: (id: string, data: Partial<Equipment>) =>
    api.put<ApiResponse<Equipment>>(
      `${BASE_API_URL}/equipments/update/${id}`,
      data
    ),

  deleteEquipment: (id: string) =>
    api.delete<ApiResponse<Equipment>>(
      `${BASE_API_URL}/equipments/delete/${id}`
    ),

  // Equipment Status and Maintenance
  updateEquipmentStatus: (
    id: string,
    data: { status: string; maintenance?: boolean; nextMaintenance?: string }
  ) =>
    api.put<ApiResponse<Equipment>>(
      `${BASE_API_URL}/equipments/status/${id}`,
      data
    ),

  addMaintenanceLog: (
    id: string,
    data: {
      type: string;
      description: string;
      cost?: string;
      performedBy?: string;
      nextDue?: string;
    }
  ) =>
    api.post<ApiResponse<any>>(
      `${BASE_API_URL}/equipments/maintenance/${id}`,
      data
    ),

  getMaintenanceLogs: (params?: {
    page?: number;
    limit?: number;
    equipmentId?: string;
    type?: string;
  }) =>
    api.get<ApiResponse<any>>(`${BASE_API_URL}/equipments/maintenance`, {
      params,
    }),

  getEquipmentStats: () =>
    api.get<ApiResponse<any>>(`${BASE_API_URL}/equipments/stats`),

  // Equipment Usage Tracking
  checkOutEquipment: (id: string, data: { quantity?: number }) =>
    api.post<ApiResponse<Equipment>>(
      `${BASE_API_URL}/equipments/checkout/${id}`,
      data
    ),

  checkInEquipment: (id: string, data: { quantity?: number }) =>
    api.post<ApiResponse<Equipment>>(
      `${BASE_API_URL}/equipments/checkin/${id}`,
      data
    ),
};

// Payment Management API
export const paymentAPI = {
  getAllPayments: () =>
    api.get<ApiResponse<Payment[]>>(`${BASE_API_URL}/payments/list`),

  getSinglePayment: (id: string) =>
    api.get<ApiResponse<Payment>>(`${BASE_API_URL}/payments/single/${id}`),

  createPayment: (
    data: Omit<Payment, "id" | "createdAt" | "updatedAt" | "Member" | "status">
  ) => api.post<ApiResponse<Payment>>(`${BASE_API_URL}/payments/create`, data),

  updatePayment: (
    id: string,
    data: Partial<Omit<Payment, "id" | "createdAt" | "updatedAt" | "Member">>
  ) =>
    api.put<ApiResponse<Payment>>(
      `${BASE_API_URL}/payments/update/${id}`,
      data
    ),

  deletePayment: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(
      `${BASE_API_URL}/payments/delete/${id}`
    ),

  getMemberPaymentHistory: (memberId: string) =>
    api.get<ApiResponse<Payment[]>>(
      `${BASE_API_URL}/payments/member/${memberId}/payments`
    ),

  generateInvoice: (data: Omit<Invoice, "id" | "createdAt" | "Member">) =>
    api.post<ApiResponse<Invoice>>(`${BASE_API_URL}/payments/invoice`, data),

  getReports: () =>
    api.get<ApiResponse<any>>(`${BASE_API_URL}/payments/reports`),
};

// Subscription Management API
export const subscriptionAPI = {
  getAllPlans: () =>
    api.get<ApiResponse<MembershipPlan[]>>(
      `${BASE_API_URL}/subscriptions/list`
    ),

  getSinglePlan: (id: string) =>
    api.get<ApiResponse<MembershipPlan>>(
      `${BASE_API_URL}/subscriptions/single/${id}`
    ),

  createPlan: (data: Omit<MembershipPlan, "id" | "createdAt" | "updatedAt">) =>
    api.post<ApiResponse<MembershipPlan>>(
      `${BASE_API_URL}/subscriptions/create`,
      data
    ),

  updatePlan: (id: string, data: Partial<MembershipPlan>) =>
    api.put<ApiResponse<MembershipPlan>>(
      `${BASE_API_URL}/subscriptions/update/${id}`,
      data
    ),

  deletePlan: (id: string) =>
    api.delete<ApiResponse<MembershipPlan>>(
      `${BASE_API_URL}/subscriptions/delete/${id}`
    ),
};
