import { useFormik } from "formik";
import * as yup from "yup";
import { AppDispatch, RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerMemberFn } from "@/redux/slices/members/registerSlice";
import ProfilePictureManager from "@/components/ProfilePictureManager";
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
  MapPin,
  Heart,
  AlertTriangle,
  FileText,
  Camera,
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
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone_number: "",
      age: "",
      membershiptype: "MONTHLY",
      password: "",
      confirmPassword: "",

      // Address Information
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },

      // Emergency Contact
      emergency_contact: {
        name: "",
        relationship: "",
        phone: "",
        email: "",
      },

      // Medical Information
      medical_info: {
        fitness_goals: [],
        health_conditions: [],
        allergies: [],
        medications: [],
        emergency_notes: "",
      },

      // Terms & Conditions
      terms_accepted: false,
    },
    onSubmit(values) {
      const data = {
        name: values.name,
        email: values.email,
        phone_number: values.phone_number,
        age: parseInt(values.age),
        membershiptype: values.membershiptype as "MONTHLY" | "DAILY",
        password: values.password,
        confirmPassword: values.confirmPassword,
        profile_picture: profilePicture,
        address: values.address,
        emergency_contact: values.emergency_contact,
        medical_info: values.medical_info,
        terms_accepted: values.terms_accepted,
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
      membershiptype: yup
        .string()
        .oneOf(["MONTHLY", "DAILY"], "Please select a valid membership type")
        .required("Please select a membership type"),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters long")
        .required("Please enter a password"),
      confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),

      // Address validation
      address: yup.object({
        street: yup.string().required("Street address is required"),
        city: yup.string().required("City is required"),
        state: yup.string().required("State/Province is required"),
        zipCode: yup.string().required("ZIP/Postal code is required"),
        country: yup.string().required("Country is required"),
      }),

      // Emergency contact validation
      emergency_contact: yup.object({
        name: yup.string().required("Emergency contact name is required"),
        relationship: yup.string().required("Relationship is required"),
        phone: yup.string().required("Emergency contact phone is required"),
        email: yup.string().email("Please enter a valid email").optional(),
      }),

      // Medical information validation
      medical_info: yup.object({
        fitness_goals: yup
          .array()
          .min(1, "Please select at least one fitness goal"),
        health_conditions: yup.array().of(yup.string()),
        allergies: yup.array().of(yup.string()),
        medications: yup.array().of(yup.string()),
        emergency_notes: yup.string().optional(),
      }),

      // Terms acceptance validation
      terms_accepted: yup
        .boolean()
        .oneOf([true], "You must accept the terms and conditions"),
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
        <div className="p-8 bg-white shadow-xl dark:bg-slate-800 rounded-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="p-3 mx-auto mb-4 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl w-fit">
              <UserPlus className="w-8 h-8" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
              Join BILKHAYR GYM
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Start your fitness journey with us today!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Personal Information Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Full Name */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
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
                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
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
                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
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
                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Age
                </label>
                <div className="relative">
                  <Calendar className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
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
                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
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
                    className="absolute transform -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
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
                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
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
                    className="absolute transform -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
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
              <label className="block mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                Membership Type
              </label>
              <div className="grid gap-4 md:grid-cols-2">
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
                    <CreditCard className="w-5 h-5 text-green-600" />
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
                    <CheckCircle className="absolute w-5 h-5 text-green-600 top-2 right-2" />
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
                    <Calendar className="w-5 h-5 text-green-600" />
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
                    <CheckCircle className="absolute w-5 h-5 text-green-600 top-2 right-2" />
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

            {/* Profile Picture Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 flex items-center justify-center border-2 border-dashed border-green-300 dark:border-green-600">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => setShowProfileManager(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    {profilePicture ? "Change Photo" : "Upload Photo"}
                  </button>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Upload a profile picture to personalize your account
                  </p>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                <FileText className="inline w-4 h-4 mr-2" />
                Terms & Conditions
              </label>
              <div className="p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700">
                <div className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                  <p className="mb-2">
                    By accepting these terms, you agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Follow all gym rules and safety guidelines</li>
                    <li>Use equipment responsibly and safely</li>
                    <li>Respect other members and staff</li>
                    <li>Maintain proper hygiene and cleanliness</li>
                    <li>Pay membership fees on time</li>
                    <li>Provide accurate health information</li>
                    <li>Notify staff of any health changes</li>
                  </ul>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formik.values.terms_accepted}
                    onChange={(e) =>
                      formik.setFieldValue("terms_accepted", e.target.checked)
                    }
                    className="w-5 h-5 text-green-600 border-slate-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    I have read and agree to the terms and conditions
                  </span>
                </label>
                {formik.touched.terms_accepted &&
                  formik.errors.terms_accepted && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {formik.errors.terms_accepted}
                    </p>
                  )}
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                <Heart className="inline w-4 h-4 mr-2" />
                Health & Fitness Information
              </label>

              {/* Fitness Goals */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Fitness Goals (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "Weight Loss",
                    "Muscle Gain",
                    "Cardiovascular Health",
                    "Flexibility & Mobility",
                    "Strength Training",
                    "Sports Performance",
                    "General Fitness",
                    "Rehabilitation",
                  ].map((goal) => (
                    <label
                      key={goal}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formik.values.medical_info.fitness_goals.includes(
                          goal
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            formik.setFieldValue("medical_info.fitness_goals", [
                              ...formik.values.medical_info.fitness_goals,
                              goal,
                            ]);
                          } else {
                            formik.setFieldValue(
                              "medical_info.fitness_goals",
                              formik.values.medical_info.fitness_goals.filter(
                                (g) => g !== goal
                              )
                            );
                          }
                        }}
                        className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {goal}
                      </span>
                    </label>
                  ))}
                </div>
                {formik.touched.medical_info?.fitness_goals &&
                  formik.errors.medical_info?.fitness_goals && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {formik.errors.medical_info.fitness_goals}
                    </p>
                  )}
              </div>

              {/* Health Conditions */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Health Conditions (Optional)
                </label>
                <textarea
                  name="medical_info.health_conditions"
                  placeholder="List any health conditions, injuries, or limitations..."
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                    formik.touched.medical_info?.health_conditions &&
                    formik.errors.medical_info?.health_conditions
                      ? "border-red-300 dark:border-red-600"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                  onChange={(e) => {
                    const conditions = e.target.value
                      .split(",")
                      .map((c) => c.trim())
                      .filter((c) => c);
                    formik.setFieldValue(
                      "medical_info.health_conditions",
                      conditions
                    );
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.medical_info.health_conditions.join(
                    ", "
                  )}
                />
              </div>

              {/* Allergies */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Allergies (Optional)
                </label>
                <textarea
                  name="medical_info.allergies"
                  placeholder="List any allergies..."
                  rows={2}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                    formik.touched.medical_info?.allergies &&
                    formik.errors.medical_info?.allergies
                      ? "border-red-300 dark:border-red-600"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                  onChange={(e) => {
                    const allergies = e.target.value
                      .split(",")
                      .map((a) => a.trim())
                      .filter((a) => a);
                    formik.setFieldValue("medical_info.allergies", allergies);
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.medical_info.allergies.join(", ")}
                />
              </div>

              {/* Emergency Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Emergency Notes (Optional)
                </label>
                <textarea
                  name="medical_info.emergency_notes"
                  placeholder="Any additional information for emergency situations..."
                  rows={2}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                    formik.touched.medical_info?.emergency_notes &&
                    formik.errors.medical_info?.emergency_notes
                      ? "border-red-300 dark:border-red-600"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.medical_info.emergency_notes}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                <AlertTriangle className="inline w-4 h-4 mr-2" />
                Emergency Contact
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="emergency_contact.name"
                    placeholder="Enter emergency contact name"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                      formik.touched.emergency_contact?.name &&
                      formik.errors.emergency_contact?.name
                        ? "border-red-300 dark:border-red-600"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.emergency_contact.name}
                  />
                  {formik.touched.emergency_contact?.name &&
                    formik.errors.emergency_contact?.name && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {formik.errors.emergency_contact.name}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Relationship
                  </label>
                  <input
                    type="text"
                    name="emergency_contact.relationship"
                    placeholder="e.g., Spouse, Parent, Friend"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                      formik.touched.emergency_contact?.relationship &&
                      formik.errors.emergency_contact?.relationship
                        ? "border-red-300 dark:border-red-600"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.emergency_contact.relationship}
                  />
                  {formik.touched.emergency_contact?.relationship &&
                    formik.errors.emergency_contact?.relationship && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {formik.errors.emergency_contact.relationship}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="emergency_contact.phone"
                    placeholder="Enter emergency contact phone"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                      formik.touched.emergency_contact?.phone &&
                      formik.errors.emergency_contact?.phone
                        ? "border-red-300 dark:border-red-600"
                        : "border-slate-300 dark:border-red-600"
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.emergency_contact.phone}
                  />
                  {formik.touched.emergency_contact?.phone &&
                    formik.errors.emergency_contact?.phone && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {formik.errors.emergency_contact.phone}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="emergency_contact.email"
                    placeholder="Enter emergency contact email"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                      formik.touched.emergency_contact?.email &&
                      formik.errors.emergency_contact?.email
                        ? "border-red-300 dark:border-red-600"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.emergency_contact.email}
                  />
                  {formik.touched.emergency_contact?.email &&
                    formik.errors.emergency_contact?.email && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {formik.errors.emergency_contact.email}
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                <MapPin className="inline w-4 h-4 mr-2" />
                Address Information
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    placeholder="Enter your street address"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                      formik.touched.address?.street &&
                      formik.errors.address?.street
                        ? "border-red-300 dark:border-red-600"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address.street}
                  />
                  {formik.touched.address?.street &&
                    formik.errors.address?.street && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {formik.errors.address.street}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    placeholder="Enter your city"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                      formik.touched.address?.city &&
                      formik.errors.address?.city
                        ? "border-red-300 dark:border-red-600"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address.city}
                  />
                  {formik.touched.address?.city &&
                    formik.errors.address?.city && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {formik.errors.address.city}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    placeholder="Enter your state/province"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                      formik.touched.address?.state &&
                      formik.errors.address?.state
                        ? "border-red-300 dark:border-red-600"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address.state}
                  />
                  {formik.touched.address?.state &&
                    formik.errors.address?.state && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {formik.errors.address.state}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    name="address.zipCode"
                    placeholder="Enter your ZIP/postal code"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                      formik.touched.address?.zipCode &&
                      formik.errors.address?.zipCode
                        ? "border-red-300 dark:border-red-600"
                        : "border-slate-300 dark:border-red-600"
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address.zipCode}
                  />
                  {formik.touched.address?.zipCode &&
                    formik.errors.address?.zipCode && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {formik.errors.address.zipCode}
                      </p>
                    )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="address.country"
                    placeholder="Enter your country"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all ${
                      formik.touched.address?.country &&
                      formik.errors.address?.country
                        ? "border-red-300 dark:border-red-600"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address.country}
                  />
                  {formik.touched.address?.country &&
                    formik.errors.address?.country && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {formik.errors.address.country}
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={registerState.loading || !formik.isValid}
              className="flex items-center justify-center w-full gap-2 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerState.loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                  Creating Account...
                </div>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Join BILKHAYR GYM
                  <ArrowRight className="w-4 h-4" />
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
              className="inline-flex items-center gap-2 px-6 py-3 transition-all border rounded-lg border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Sign In Instead
            </Link>
          </div>

          {/* Staff Registration Link */}
          <div className="mt-6 text-center">
            <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
              Are you a staff member?
            </p>
            <Link
              to="/auth/register"
              className="font-medium text-green-600 dark:text-green-400 hover:underline"
            >
              Staff Registration
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Picture Manager Modal */}
      {showProfileManager && (
        <ProfilePictureManager
          isOpen={showProfileManager}
          onClose={() => setShowProfileManager(false)}
          onPictureChange={(pictureUrl) => setProfilePicture(pictureUrl || "")}
          currentPicture={profilePicture}
        />
      )}
    </div>
  );
};

export default Register;
