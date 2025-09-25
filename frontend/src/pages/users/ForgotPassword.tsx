import { useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/axios";
import { BASE_API_URL } from "@/constants";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setToken("");
    setIsSuccess(false);
    try {
      const res = await api.post(`${BASE_API_URL}/auth/forgot-password`, {
        email,
      });
      setMessage(
        res?.data?.message || "If an account exists, a reset link has been sent"
      );
      if (res?.data?.resetToken) setToken(res.data.resetToken);
      setIsSuccess(true);
    } catch (e) {
      setMessage("Something went wrong");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl w-fit mx-auto mb-4">
              <Mail className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Forgot Password?
            </h1>
            <p className="text-slate-600">
              Enter your email address and we'll send you a reset link
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                required className="w-full px-4 py-3 border border-slate-300"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Sending...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
                isSuccess
                  ? "bg-green-50"
                  : "bg-red-50"
              }`}
            >
              {isSuccess ? (
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium">{message}</p>
                {token && (
                  <div className="mt-2 p-2 bg-white">
                    <span className="font-medium">Dev Token:</span> {token}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link
              to="/auth/login" className="inline-flex items-center gap-2 text-slate-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
