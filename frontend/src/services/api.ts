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

  createPayment: (data: Omit<Payment, "id" | "createdAt" | "Member">) =>
    api.post<ApiResponse<Payment>>(`${BASE_API_URL}/payments/create`, data),

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
