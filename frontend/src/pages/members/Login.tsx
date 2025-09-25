import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { loginMemberFn, clearError } from "@/redux/slices/members/loginSlice";
import {
  Users,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Dumbbell,
  AlertCircle,
} from "lucide-react";

const Login = () => {
  let toastId = "login";
  const dispatch = useDispatch<AppDispatch>();
  const loginState = useSelector((state: RootState) => state.loginMemberSlice);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit(values) {
      // Clear any previous errors
      dispatch(clearError());
      
      const data = {
        email: values.email,
        password: values.password,
      };
      toast.loading("Logging in..", { id: toastId });
      dispatch(loginMemberFn(data));
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

  // Clear errors when form values change
  useEffect(() => {
    if (loginState.error) {
      dispatch(clearError());
    }
  }, [formik.values.email, formik.values.password]);

  useEffect(() => {
    if (loginState.error) {
      toast.error(loginState.error, { id: toastId });
    }

    if (loginState.data.isSuccess) {
      toast.success("Successfully logged in", { id: toastId });
    }
  }, [loginState.error, loginState.data]);

  useEffect(() => {
    if (loginState.data.isSuccess) {
      navigate("/members/dashboard");
    }
  }, [loginState.data.isSuccess, navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-xl w-fit mx-auto mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Member Login
            </h1>
            <p className="text-slate-600">
              Welcome back! Access your gym member portal
            </p>
          </div>

          {/* Error Display */}
          {loginState.error && (
            <div className="mb-6 p-4 bg-red-50">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">{loginState.error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email" className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent${
                    formik.touched.email && formik.errors.email
                      ? "border-red-300"
                      : "border-slate-300"
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  disabled={loginState.loading}
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
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password" className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent${
                    formik.touched.password && formik.errors.password
                      ? "border-red-300"
                      : "border-slate-300"
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  disabled={loginState.loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  disabled={loginState.loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginState.loading || !formik.isValid} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              {loginState.loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  <Dumbbell className="h-4 w-4" />
                  Access Member Portal
                  <ArrowRight className="h-4 w-4" />
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
                New member?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link
              to="/members/register" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300"
            >
              Join as Member
            </Link>
          </div>

          {/* Staff Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Are you a staff member?
            </p>
            <Link
              to="/auth/login" className="text-green-600"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
