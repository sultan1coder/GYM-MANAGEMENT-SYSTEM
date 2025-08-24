import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import {
  Mail,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Shield,
} from "lucide-react";

interface EmailVerificationProps {
  email: string;
  isVerified: boolean;
  onVerificationComplete: (verified: boolean) => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  isVerified,
  onVerificationComplete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  const handleSendVerificationEmail = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Verification email sent! Check your inbox.");
      setShowVerificationInput(true);
    } catch (error) {
      toast.error("Failed to send verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock verification - in real app, validate against API
      if (verificationCode === "123456") {
        toast.success("Email verified successfully!");
        onVerificationComplete(true);
        setShowVerificationInput(false);
      } else {
        toast.error("Invalid verification code. Please try again.");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("New verification code sent!");
    } catch (error) {
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium text-green-900 dark:text-green-100">
                Email Verified
              </div>
              <div className="text-sm text-green-700 dark:text-green-200">
                Your email address has been verified successfully
              </div>
            </div>
            <Badge
              variant="secondary"
              className="ml-auto bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            >
              Verified
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-orange-600" />
          Email Verification Required
        </CardTitle>
        <CardDescription className="text-orange-700 dark:text-orange-200">
          Please verify your email address to access all features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-orange-200 dark:border-orange-700">
          <Mail className="w-5 h-5 text-orange-600" />
          <div className="flex-1">
            <div className="font-medium text-slate-900 dark:text-slate-100">
              {email}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Verification email will be sent to this address
            </div>
          </div>
        </div>

        {!showVerificationInput ? (
          <Button
            onClick={handleSendVerificationEmail}
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Verification Email
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            <div>
              <Label
                htmlFor="verificationCode"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Enter Verification Code
              </Label>
              <Input
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="mt-1"
                maxLength={6}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleVerifyCode}
                disabled={isLoading || !verificationCode.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Code
                  </>
                )}
              </Button>

              <Button
                onClick={handleResendCode}
                disabled={isLoading}
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-900/20"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="text-xs text-orange-700 dark:text-orange-200 text-center">
              <AlertCircle className="inline w-3 h-3 mr-1" />
              Check your email for the verification code
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
