import { useFormik } from "formik";
import * as yup from "yup";
import { AppDispatch, RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { registerFn } from "../../redux/slices/auth/registerSlice";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const Register = () => {
  let toastId = "register";
  const dispatch = useDispatch<AppDispatch>();
  const registerState = useSelector((state: RootState) => state.registerSlice);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      phone_number: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit(values) {
      const data = {
        name: values.name,
        username: values.username,
        email: values.email,
        phone_number: values.phone_number,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: "staff",
      };
      toast.loading("Registering...", { id: toastId });
      dispatch(registerFn(data));
    },
    validationSchema: yup.object({
      name: yup.string().required("Please enter your full name"),
      username: yup.string().required("Please enter a username"),
      email: yup
        .string()
        .email("Please enter a valid email")
        .required("Please enter your email"),
      phone_number: yup.string().required("Please enter your phone number"),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters long")
        .required("Please enter a password"),
      confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),
    }),
  });

  useEffect(() => {
    if (registerState.error) {
      toast.error(registerState.error, { id: toastId });
    }

    if (registerState.data.isSuccess) {
      toast.success("Successfully Registered", { id: toastId });
    }
  }, [registerState.error, registerState.data]);

  useEffect(() => {
    if (registerState.data.isSuccess) {
      navigate("/auth/login");
    }
  }, [registerState.data.isSuccess]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl w-fit mx-auto mb-4">
              <UserPlus className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Create Staff Account
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Join our team! Fill in your details to get started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Personal Information Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                      formik.touched.name && formik.errors.name
                        ? "border-red-300 dark:border-red-600"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                </div>
                {formik.touched.name && formik.errors.name && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {formik.errors.name}
                  </p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                      formik.touched.username && formik.errors.username
                        ? "border-red-300 dark:border-red-600"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                  />
                </div>
                {formik.touched.username && formik.errors.username && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {formik.errors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-300 dark:border-red-600"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="Enter your phone number"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                      formik.touched.phone_number && formik.errors.phone_number
                        ? "border-red-300 dark:border-red-600"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone_number}
                  />
                </div>
                {formik.touched.phone_number && formik.errors.phone_number && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {formik.errors.phone_number}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-300 dark:border-red-600"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                        ? "border-red-300 dark:border-red-600"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={registerState.loading || !formik.isValid}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              {registerState.loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating Account...
                </div>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              Sign In Instead
            </Link>
          </div>

          {/* Member Registration Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Want to become a gym member?
            </p>
            <Link
              to="/members/register"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Member Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
