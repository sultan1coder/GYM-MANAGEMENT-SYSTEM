import { useFormik } from "formik";
import * as yup from "yup";
import { AppDispatch, RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerMemberFn } from "@/redux/slices/members/registerSlice";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  CreditCard,
} from "lucide-react";

const Register = () => {
  let toastId = "register";
  const dispatch = useDispatch<AppDispatch>();
  const registerState = useSelector(
    (state: RootState) => state.registerMemberSlice
  );
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone_number: "",
      age: "",
      membershiptype: "MONTHLY",
      password: "",
      confirmPassword: "",
    },
    onSubmit(values) {
      const data = {
        name: values.name,
        email: values.email,
        phone_number: values.phone_number,
        age: parseInt(values.age),
        membershiptype: values.membershiptype,
        password: values.password,
        confirmPassword: values.confirmPassword,
      };
      toast.loading("Registering...", { id: toastId });
      dispatch(registerMemberFn(data));
    },
    validationSchema: yup.object({
      name: yup.string().required("Please enter your full name"),
      email: yup
        .string()
        .email("Please enter a valid email")
        .required("Please enter your email"),
      phone_number: yup.string().required("Please enter your phone number"),
      age: yup
        .number()
        .min(16, "Must be at least 16 years old")
        .required("Please enter your age"),
      membershiptype: yup.string().required("Please select a membership type"),
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
      navigate("/members/login");
    }
  }, [registerState.data.isSuccess]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-xl w-fit mx-auto mb-4">
              <UserPlus className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Join BILKHAYR GYM
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Start your fitness journey with us today!
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
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

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Age
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    name="age"
                    placeholder="Enter your age"
                    min="16"
                    max="100"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                      formik.touched.age && formik.errors.age
                        ? "border-red-300 dark:border-red-600"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.age}
                  />
                </div>
                {formik.touched.age && formik.errors.age && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {formik.errors.age}
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
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
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
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
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

            {/* Membership Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Membership Type
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <label
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    formik.values.membershiptype === "MONTHLY"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-slate-300 dark:border-slate-600 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="membershiptype"
                    value="MONTHLY"
                    checked={formik.values.membershiptype === "MONTHLY"}
                    onChange={formik.handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        Monthly
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        Flexible monthly membership
                      </div>
                    </div>
                  </div>
                  {formik.values.membershiptype === "MONTHLY" && (
                    <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-green-600" />
                  )}
                </label>

                <label
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    formik.values.membershiptype === "DAILY"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-slate-300 dark:border-slate-600 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="membershiptype"
                    value="DAILY"
                    checked={formik.values.membershiptype === "DAILY"}
                    onChange={formik.handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        Daily
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        Pay per visit option
                      </div>
                    </div>
                  </div>
                  {formik.values.membershiptype === "DAILY" && (
                    <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-green-600" />
                  )}
                </label>
              </div>
              {formik.touched.membershiptype &&
                formik.errors.membershiptype && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {formik.errors.membershiptype}
                  </p>
                )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={registerState.loading || !formik.isValid}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              {registerState.loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating Account...
                </div>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Join BILKHAYR GYM
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
                Already a member?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link
              to="/members/login"
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              Sign In Instead
            </Link>
          </div>

          {/* Staff Registration Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Are you a staff member?
            </p>
            <Link
              to="/auth/register"
              className="text-green-600 dark:text-green-400 hover:underline font-medium"
            >
              Staff Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
