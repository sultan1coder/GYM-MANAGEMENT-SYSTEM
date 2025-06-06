import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store";
import Profile from "./profile";

const Header = () => {
  const loginState = useSelector((state: RootState) => state.loginSlice);

  return (
    <div className="flex items-center justify-around p-3">
      <div className="text-xl font-bold logo ">
        <h1>BILKHAYR GYM</h1>
      </div>
      {loginState.data.isSuccess ? (
        <div className="flex items-center gap-3">
          <Profile />
        </div>
      ) : (
        <div className="flex gap-4 menus">
          <Link
            className="p-3 text-white transition-all bg-gray-800 rounded-md hover:bg-gray-700"
            to={"/"}
          >
            HomePage
          </Link>
          <Link
            className="p-3 text-white transition-all bg-gray-800 rounded-md hover:bg-gray-700"
            to={"/auth/login"}
          >
            Login
          </Link>
          <Link
            className="p-3 text-white transition-all bg-gray-800 rounded-md hover:bg-gray-700"
            to={"/auth/register"}
          >
            Register
          </Link>
          <Link
            className="p-3 text-white transition-all bg-gray-800 rounded-md hover:bg-gray-700"
            to={"/dashboard"}
          >
            Dashboard
          </Link>
          <Link
            className="p-3 text-white transition-all bg-gray-800 rounded-md hover:bg-gray-700"
            to={"/members/login"}
          >
          LoginMember
          </Link>
          <Link
            className="p-3 text-white transition-all bg-gray-800 rounded-md hover:bg-gray-700"
            to={"/members/register"}
          >
          RegisterMember
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
