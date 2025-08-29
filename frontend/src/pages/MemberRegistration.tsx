import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Users,
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Phone,
  User,
  Calendar,
  Shield,
  CheckCircle,
  AlertCircle,
  Heart,
  FileText,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { toast } from "react-hot-toast";

const MemberRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    age: "",
    membershiptype: "MONTHLY" as "MONTHLY" | "DAILY",
    password: "",
    confirmPassword: "",
    terms_accepted: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateStep1 = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone_number ||
      !formData.age
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 13 || age > 100) {
      toast.error("Age must be between 13 and 100");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!formData.terms_accepted) {
      toast.error("Please accept the terms and conditions");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep1() || !validateStep2()) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement member registration API call
      // const result = await dispatch(registerMember(formData) as any);

      // For now, simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        "Member registration successful! Please check your email for verification."
      );
      navigate("/member/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Personal Information", icon: User },
    { number: 2, title: "Account Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl mb-6 shadow-lg">
            <Users className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Member Registration
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Join our gym community and start your fitness journey today
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? "bg-green-600 border-green-600 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {currentStep > step.number ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 ${
                    currentStep > step.number ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-center space-x-16 mb-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`text-sm font-medium ${
                currentStep >= step.number ? "text-green-600" : "text-gray-400"
              }`}
            >
              {step.title}
            </div>
          ))}
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {currentStep === 1 ? "Personal Information" : "Account Security"}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {currentStep === 1
                ? "Tell us about yourself and choose your membership"
                : "Set up your password and accept terms"}
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 ? (
                <>
                  {/* Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                    >
                      <User className="w-4 h-4 text-green-600" />
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                    >
                      <Mail className="w-4 h-4 text-green-600" />
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label
                      htmlFor="phone_number"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                    >
                      <Phone className="w-4 h-4 text-green-600" />
                      Phone Number *
                    </label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      required
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <label
                      htmlFor="age"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                    >
                      <Calendar className="w-4 h-4 text-green-600" />
                      Age *
                    </label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      required
                      min="13"
                      max="100"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Enter your age"
                      className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Must be between 13 and 100 years old
                    </p>
                  </div>

                  {/* Membership Type */}
                  <div className="space-y-2">
                    <label
                      htmlFor="membershiptype"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                    >
                      <Heart className="w-4 h-4 text-green-600" />
                      Membership Type *
                    </label>
                    <select
                      id="membershiptype"
                      name="membershiptype"
                      value={formData.membershiptype}
                      onChange={handleInputChange}
                      className="h-12 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                    >
                      <option value="MONTHLY">Monthly Membership</option>
                      <option value="DAILY">Daily Pass</option>
                    </select>
                  </div>

                  {/* Next Button */}
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Continue to Account Security
                  </Button>
                </>
              ) : (
                <>
                  {/* Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                    >
                      <Shield className="w-4 h-4 text-green-600" />
                      Password *
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a strong password"
                        className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Must be at least 6 characters long
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                    >
                      <Shield className="w-4 h-4 text-green-600" />
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                      <input
                        id="terms_accepted"
                        name="terms_accepted"
                        type="checkbox"
                        checked={formData.terms_accepted}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="terms_accepted"
                        className="text-sm text-gray-700 leading-relaxed"
                      >
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-green-600 hover:text-green-700 font-medium underline"
                        >
                          Terms and Conditions
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-green-600 hover:text-green-700 font-medium underline"
                        >
                          Privacy Policy
                        </a>
                        . I understand that my information will be used in
                        accordance with these policies. *
                      </label>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FileText className="w-3 h-3" />
                      By checking this box, you confirm that you have read and
                      agree to our terms
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating Account...
                        </div>
                      ) : (
                        "Create Member Account"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/member/login"
                  className="font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Portal Selection */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal Selection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MemberRegistration;
