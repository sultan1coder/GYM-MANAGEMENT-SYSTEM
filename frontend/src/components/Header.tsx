import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store";
import Profile from "./profile";
import { Dumbbell, Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { isAdmin, isStaff, isMember } from "../utils/auth";

const Header = () => {
  const loginState = useSelector((state: RootState) => state.loginSlice);
  const memberLoginState = useSelector(
    (state: RootState) => state.loginMemberSlice
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-700">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              FITNESS GYM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="items-center hidden space-x-1 md:flex">
            {loginState.data.isSuccess || memberLoginState.data.isSuccess ? (
              <div className="flex items-center space-x-4">
                {isAdmin() && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1 px-4 py-2 transition-colors text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                {(isAdmin() || isStaff()) && (
                  <>
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 transition-colors text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Dashboard
                    </Link>
                    {isAdmin() && (
                      <Link
                        to="/payments/manage"
                        className="px-4 py-2 transition-colors text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400"
                      >
                        Payments
                      </Link>
                    )}
                  </>
                )}
                {isMember() && (
                  <Link
                    to="/members/dashboard"
                    className="px-4 py-2 transition-colors text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400"
                  >
                    Member Portal
                  </Link>
                )}
                <Profile />
              </div>
            ) : (
              <>
                <Link
                  to="/"
                  className="px-4 py-2 transition-colors text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Home
                </Link>
                <Link
                  to="/auth/login"
                  className="px-4 py-2 transition-colors text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Staff Login
                </Link>
                <Link
                  to="/members/login"
                  className="px-4 py-2 transition-colors text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Member Login
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg md:hidden text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="py-4 border-t md:hidden border-slate-200 dark:border-slate-700">
            <div className="flex flex-col space-y-2">
              {loginState.data.isSuccess || memberLoginState.data.isSuccess ? (
                <>
                  {isAdmin() && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  {(isAdmin() || isStaff()) && (
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Staff Dashboard
                    </Link>
                  )}
                  {isMember() && (
                    <Link
                      to="/members/dashboard"
                      className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Member Portal
                    </Link>
                  )}
                  <div className="px-4 py-2">
                    <Profile />
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/auth/login"
                    className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Staff Login
                  </Link>
                  <Link
                    to="/members/login"
                    className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Member Login
                  </Link>
                  <Link
                    to="/auth/register"
                    className="px-4 py-2 mx-4 text-center text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
