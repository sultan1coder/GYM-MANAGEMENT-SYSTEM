import { User, Member } from "@/types";

// Token management
export const getToken = (): string | null => {
  // First try to get from token storage
  const token = localStorage.getItem("token");
  if (token) return token;

  // Check for member token
  const memberToken = localStorage.getItem("memberToken");
  if (memberToken) return memberToken;

  // Fallback to userData if token not found
  const userData = localStorage.getItem("userData");
  if (userData) {
    const parsed = JSON.parse(userData);
    return parsed.token || null;
  }

  // Fallback to memberData if token not found
  const memberData = localStorage.getItem("memberData");
  if (memberData) {
    const parsed = JSON.parse(memberData);
    return parsed.token || null;
  }

  return null;
};

export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("member");
  localStorage.removeItem("memberToken");
  localStorage.removeItem("memberData");
  localStorage.removeItem("userData");
};

// User management
export const getUser = (): User | null => {
  // First try to get from user storage
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);

  // Fallback to userData if user not found
  const userData = localStorage.getItem("userData");
  if (userData) {
    const parsed = JSON.parse(userData);
    return parsed.user || null;
  }

  return null;
};

export const setUser = (user: User): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getMember = (): Member | null => {
  // First try to get from member storage
  const member = localStorage.getItem("member");
  if (member) return JSON.parse(member);

  // Check for memberData if member not found
  const memberData = localStorage.getItem("memberData");
  if (memberData) {
    try {
      const parsed = JSON.parse(memberData);
      return parsed.member || null;
    } catch {
      return null;
    }
  }

  return null;
};

export const setMember = (member: Member): void => {
  localStorage.setItem("member", JSON.stringify(member));
};

// Role checking
export const getUserRole = (): string | null => {
  const user = getUser();
  return user?.role || null;
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === "admin";
};

export const isStaff = (): boolean => {
  const user = getUser();
  return user?.role === "staff";
};

export const isMember = (): boolean => {
  // Check for member token and data
  const memberToken = localStorage.getItem("memberToken");
  const memberData = localStorage.getItem("memberData");

  if (memberToken && memberData) {
    try {
      const parsed = JSON.parse(memberData);
      return parsed.member && memberToken;
    } catch {
      return false;
    }
  }
  return false;
};

export const isAuthenticated = (): boolean => {
  return getToken() !== null && (getUser() !== null || getMember() !== null);
};

// Navigation helpers
export const getDefaultRoute = (): string => {
  if (isAdmin()) return "/admin/dashboard";
  if (isStaff()) return "/dashboard";
  if (isMember()) return "/members/dashboard";
  return "/";
};

export const canAccessAdminRoutes = (): boolean => {
  return isAdmin();
};

export const canAccessStaffRoutes = (): boolean => {
  return isAdmin() || isStaff();
};

export const canAccessMemberRoutes = (): boolean => {
  return isMember();
};

export const debugAuthState = () => {
  console.log("Authentication Debug Information:");

  // Check tokens
  const token = localStorage.getItem("token");
  const memberToken = localStorage.getItem("memberToken");

  console.log("Staff/Admin Token:", token ? "Present" : "Missing");
  console.log("Member Token:", memberToken ? "Present" : "Missing");

  // Check user data
  const userData = localStorage.getItem("userData");
  const memberData = localStorage.getItem("memberData");

  console.log("Staff/Admin User Data:", userData ? "Present" : "Missing");
  console.log("Member User Data:", memberData ? "Present" : "Missing");

  // Parse and log user details if available
  if (userData) {
    try {
      const parsedUserData = JSON.parse(userData);
      console.log("Staff/Admin User ID:", parsedUserData.id);
      console.log("Staff/Admin User Role:", parsedUserData.role);
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }

  if (memberData) {
    try {
      const parsedMemberData = JSON.parse(memberData);
      console.log("Member ID:", parsedMemberData.id);
    } catch (error) {
      console.error("Error parsing member data:", error);
    }
  }
};
