import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { AppDispatch, RootState } from "../../redux/store";
import { loginFn } from "../../redux/slices/auth/loginSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserCircle, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const Login = () => {
  let toastId = "login";
  const dispatch = useDispatch<AppDispatch>();
  const loginState = useSelector((state: RootState) => state.loginSlice);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit(values) {
      const data = {
        email: values.email,
        password: values.password,
      };
      toast.loading("Logging in..", { id: toastId });
      dispatch(loginFn(data));
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Please enter valid email")
        .required("Please enter email"),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters long")
        .required("Password is required"),
    }),
  });

  useEffect(() => {
    if (loginState.error) {
      toast.error(loginState.error, { id: toastId });
    }

    if (loginState.data.isSuccess) {
      const role = loginState.data.user?.role || "unknown";
      toast.success(`Successfully logged in as ${role}`, { id: toastId });
    }
  }, [loginState.error, loginState.data]);

  useEffect(() => {
    if (loginState.data.isSuccess && loginState.data.user) {
      // Debug logging
      console.log("Login successful:", loginState.data);
      console.log("User role:", loginState.data.user.role);

      // Role-based navigation
      if (loginState.data.user.role === "admin") {
        console.log("Navigating to admin dashboard");
        navigate("/admin/dashboard");
      } else {
        console.log("Navigating to staff dashboard");
        navigate("/dashboard");
      }
    }
  }, [loginState.data.isSuccess, loginState.data.user, navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="p-8 bg-white shadow-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="p-3 mx-auto mb-4 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl w-fit">
              <UserCircle className="w-8 h-8" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-slate-900">
              Staff Login
            </h1>
            <p className="text-slate-600">
              Welcome back! Please enter your credentials
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email" className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent${
                    formik.touched.email && formik.errors.email
                      ? "border-red-300"
                      : "border-slate-300"
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password" className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent${
                    formik.touched.password && formik.errors.password
                      ? "border-red-300"
                      : "border-slate-300"
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} className="absolute transform -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/auth/forgot-password" className="text-sm text-blue-600"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginState.loading || !formik.isValid} className="flex items-center justify-center w-full gap-2 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginState.loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white">
                New to BILKHAYR GYM?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link
              to="/auth/register" className="inline-flex items-center gap-2 px-6 py-3 transition-all border rounded-lg border-slate-300"
            >
              Create Staff Account
            </Link>
          </div>

          {/* Member Login Link */}
          <div className="mt-6 text-center">
            <p className="mb-2 text-sm text-slate-600">
              Are you a gym member?
            </p>
            <Link
              to="/members/login" className="font-medium text-blue-600"
            >
              Member Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
