import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { logout } from "@/redux/slices/members/loginSlice";
import { User } from "lucide-react";

const Profile = () => {
  const loginState = useSelector((state: RootState) => state.loginMemberSlice);
  const dispatch = useDispatch<AppDispatch>();

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div className="border w-[42px] h-[42px] flex items-center justify-center rounded-full bg-slate-100">
          <User className="h-5 w-5 text-slate-400" />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center gap-4">
          <div className="border w-[42px] h-[42px] flex items-center justify-center rounded-full bg-slate-100">
            <User className="h-6 w-6 text-slate-400" />
          </div>
          <div className="gap-6">
            <h1 className="text-xl font-bold">
              {loginState.data.member.email}
            </h1>
            <p className="text-sm text-gray-600">
              {loginState.data.member.email}
            </p>
          </div>
        </div>
        <div className="p-3 mt-4">
          <Button
            variant={"destructive"} className="w-full"
            onClick={logoutHandler}
          >
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Profile;
