import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AppDispatch, RootState } from "@/redux/store";
import { Button } from "./ui/button";
import { logout } from "@/redux/slices/auth/loginSlice";
import { logout as logoutMember } from "@/redux/slices/members/loginSlice";
import { Settings, Camera, LogOut, User } from "lucide-react";
import ProfileManager from "./ProfileManager";
import { isAdmin, isStaff, isMember } from "@/utils/auth";

const Profile = () => {
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [userType, setUserType] = useState<"staff" | "member">("staff");
  const navigate = useNavigate();
  
  const loginState = useSelector((state: RootState) => state.loginSlice);
  const memberLoginState = useSelector((state: RootState) => state.loginMemberSlice);
  const dispatch = useDispatch<AppDispatch>();

  // Determine which user type is logged in
  const isStaffUser = isStaff() || isAdmin();
  const isMemberUser = isMember();
  
  // Get the appropriate user data
  const user = isStaffUser ? loginState.data.user : memberLoginState.data.member;
  const isLoggedIn = isStaffUser ? loginState.data.isSuccess : memberLoginState.data.isSuccess;

  const logoutHandler = () => {
    if (isStaffUser) {
      dispatch(logout());
    } else {
      dispatch(logoutMember());
    }
  };

  const openProfileManager = (type: "staff" | "member") => {
    setUserType(type);
    setShowProfileManager(true);
  };

  const navigateToProfileSettings = () => {
    navigate("/profile");
  };

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <div className="relative group cursor-pointer">
            {user.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="Profile"
                className="w-[42px] h-[42px] rounded-full object-cover border-2 border-slate-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              />
            ) : (
              <div className="w-[42px] h-[42px] flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
            )}
            
            {/* Camera icon overlay on hover */}
            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-4 w-4 text-white" />
            </div>
          </div>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-0">
          <div className="p-4">
            {/* User Info */}
            <div className="flex items-center gap-4 mb-4">
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600">
                  <User className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {user.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {user.email}
                </p>
                {isStaffUser && (
                  <p className="text-xs text-slate-500 dark:text-slate-500 capitalize">
                    {isStaffUser && 'role' in user ? user.role : ""}
                  </p>
                )}
                {isMemberUser && (
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    Member
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => openProfileManager(userType)}
              >
                <Camera className="h-4 w-4 mr-2" />
                Change Profile Picture
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={navigateToProfileSettings}
              >
                <Settings className="h-4 w-4 mr-2" />
                Profile Settings
              </Button>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 dark:border-slate-700 my-4" />

            {/* Logout */}
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={logoutHandler}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Profile Manager Modal */}
      {showProfileManager && (
        <ProfileManager
          onClose={() => setShowProfileManager(false)}
          userType={userType}
        />
      )}
    </>
  );
};

export default Profile;
