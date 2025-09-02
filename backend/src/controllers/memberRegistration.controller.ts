import { Request, Response } from "express";
import { defaultErrorMessage } from "../constants";
import { MemberShipType } from "@prisma/client";
import prisma from "../lib/prisma";
import { hashPassword } from "../utils/auth";
import crypto from "crypto";
import { sendWelcomeEmail } from "../utils/email";

interface EnhancedMemberRegistration {
  // Basic Info
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone_number?: string;
  age: number;
  dateOfBirth?: string;
  gender?: string;
  membershiptype: MemberShipType;

  // Address Info
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };

  // Emergency Contact
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };

  // Medical Info
  medicalInfo?: {
    bloodType?: string;
    allergies?: string;
    medications?: string;
    conditions?: string;
    emergencyMedicalInfo?: string;
  };

  // Preferences
  fitnessGoals?: string[];
  referralCode?: string;
  marketingConsent?: boolean;
  termsAccepted: boolean;
}

// Enhanced member registration with comprehensive data collection
export const enhancedRegisterMember = async (req: Request, res: Response) => {
  try {
    const registrationData = req.body as EnhancedMemberRegistration;

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "password",
      "confirmPassword",
      "age",
      "membershiptype",
    ];
    for (const field of requiredFields) {
      if (!registrationData[field as keyof EnhancedMemberRegistration]) {
        res.status(400).json({
          isSuccess: false,
          message: `${field} is required`,
        });
        return;
      }
    }

    // Validate password match
    if (registrationData.password !== registrationData.confirmPassword) {
      res.status(400).json({
        isSuccess: false,
        message: "Passwords do not match",
      });
      return;
    }

    // Validate password strength
    if (registrationData.password.length < 8) {
      res.status(400).json({
        isSuccess: false,
        message: "Password must be at least 8 characters long",
      });
      return;
    }

    // Validate age
    if (registrationData.age < 16 || registrationData.age > 100) {
      res.status(400).json({
        isSuccess: false,
        message: "Age must be between 16 and 100",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registrationData.email)) {
      res.status(400).json({
        isSuccess: false,
        message: "Please enter a valid email address",
      });
      return;
    }

    // Validate phone number if provided
    if (registrationData.phone_number) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(registrationData.phone_number.replace(/\s/g, ""))) {
        res.status(400).json({
          isSuccess: false,
          message: "Please enter a valid phone number",
        });
        return;
      }
    }

    // Check if terms are accepted
    if (!registrationData.termsAccepted) {
      res.status(400).json({
        isSuccess: false,
        message: "You must accept the terms and conditions",
      });
      return;
    }

    // Check if member already exists
    const existingMember = await prisma.member.findUnique({
      where: { email: registrationData.email.toLowerCase() },
    });

    if (existingMember) {
      res.status(400).json({
        isSuccess: false,
        message: "A member with this email already exists",
      });
      return;
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Hash password
    const hashedPassword = await hashPassword(registrationData.password);

    // Create member with comprehensive data
    const newMember = await prisma.member.create({
      data: {
        name: registrationData.name.trim(),
        email: registrationData.email.toLowerCase().trim(),
        password: hashedPassword,
        phone_number: registrationData.phone_number?.trim() || null,
        age: registrationData.age,
        membershiptype: registrationData.membershiptype,
        email_verification_token: emailVerificationToken,
        email_verification_expires: emailVerificationExpires,
        email_verified: false,
        terms_accepted: registrationData.termsAccepted,
        terms_accepted_at: new Date(),

        // Create address if provided
        address: registrationData.address
          ? {
              create: {
                street: registrationData.address.street,
                city: registrationData.address.city,
                state: registrationData.address.state,
                zipCode: registrationData.address.zipCode,
                country: registrationData.address.country || "USA",
              },
            }
          : undefined,

        // Create emergency contact if provided
        emergency_contact: registrationData.emergencyContact
          ? {
              create: {
                name: registrationData.emergencyContact.name,
                relationship: registrationData.emergencyContact.relationship,
                phone: registrationData.emergencyContact.phone,
                email: registrationData.emergencyContact.email || null,
              },
            }
          : undefined,

        // Create medical info if provided
        medical_info: registrationData.medicalInfo
          ? {
              create: {
                bloodType: registrationData.medicalInfo.bloodType || null,
                allergies: registrationData.medicalInfo.allergies || null,
                medications: registrationData.medicalInfo.medications || null,
                conditions: registrationData.medicalInfo.conditions || null,
                emergencyMedicalInfo:
                  registrationData.medicalInfo.emergencyMedicalInfo || null,
              },
            }
          : undefined,
      },
      include: {
        address: true,
        emergency_contact: true,
        medical_info: true,
      },
    });

    // Create initial fitness goals if provided
    if (
      registrationData.fitnessGoals &&
      registrationData.fitnessGoals.length > 0
    ) {
      const goalPromises = registrationData.fitnessGoals.map((goalType) =>
        prisma.memberFitnessGoal.create({
          data: {
            memberId: newMember.id,
            goalType,
            targetValue: 1, // Default target
            currentValue: 0,
            unit: "sessions", // Default unit
            notes: `Initial ${goalType} goal`,
          },
        })
      );
      await Promise.all(goalPromises);
    }

    // Send welcome email (if email service is configured)
    try {
      await sendWelcomeEmail(
        registrationData.email,
        registrationData.name,
        emailVerificationToken
      );
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail registration if email fails
    }

    // Return success response (without sensitive data)
    res.status(201).json({
      isSuccess: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      member: {
        id: newMember.id,
        name: newMember.name,
        email: newMember.email,
        membershiptype: newMember.membershiptype,
        email_verified: newMember.email_verified,
        terms_accepted: newMember.terms_accepted,
        createdAt: newMember.createdAt,
      },
      nextSteps: {
        emailVerification: true,
        profileCompletion:
          !registrationData.address || !registrationData.emergencyContact,
        paymentSetup: true,
      },
    });
  } catch (error) {
    console.error("Enhanced member registration error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

// Email verification endpoint
export const verifyMemberEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({
        isSuccess: false,
        message: "Verification token is required",
      });
      return;
    }

    // Find member with valid token
    const member = await prisma.member.findFirst({
      where: {
        email_verification_token: token,
        email_verification_expires: {
          gt: new Date(),
        },
      },
    });

    if (!member) {
      res.status(400).json({
        isSuccess: false,
        message: "Invalid or expired verification token",
      });
      return;
    }

    // Update member as verified
    const verifiedMember = await prisma.member.update({
      where: { id: member.id },
      data: {
        email_verified: true,
        email_verification_token: null,
        email_verification_expires: null,
      },
    });

    res.status(200).json({
      isSuccess: true,
      message:
        "Email verified successfully! Welcome to BILKHAYR Premium Fitness!",
      member: {
        id: verifiedMember.id,
        name: verifiedMember.name,
        email: verifiedMember.email,
        email_verified: verifiedMember.email_verified,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

// Resend verification email
export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        isSuccess: false,
        message: "Email is required",
      });
      return;
    }

    const member = await prisma.member.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!member) {
      res.status(404).json({
        isSuccess: false,
        message: "Member not found",
      });
      return;
    }

    if (member.email_verified) {
      res.status(400).json({
        isSuccess: false,
        message: "Email is already verified",
      });
      return;
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Update member with new token
    await prisma.member.update({
      where: { id: member.id },
      data: {
        email_verification_token: emailVerificationToken,
        email_verification_expires: emailVerificationExpires,
      },
    });

    // Send verification email
    try {
      await sendWelcomeEmail(email, member.name, emailVerificationToken);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      res.status(500).json({
        isSuccess: false,
        message: "Failed to send verification email",
      });
      return;
    }

    res.status(200).json({
      isSuccess: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

// Check email availability
export const checkEmailAvailability = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    if (!email) {
      res.status(400).json({
        isSuccess: false,
        message: "Email is required",
      });
      return;
    }

    const existingMember = await prisma.member.findUnique({
      where: { email: email.toLowerCase() },
    });

    res.status(200).json({
      isSuccess: true,
      available: !existingMember,
      message: existingMember ? "Email is already taken" : "Email is available",
    });
  } catch (error) {
    console.error("Email availability check error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

// Get membership plans
export const getMembershipPlans = async (req: Request, res: Response) => {
  try {
    const plans = await prisma.membershipPlan.findMany({
      orderBy: { price: "asc" },
    });

    // If no plans exist, create default ones
    if (plans.length === 0) {
      const defaultPlans = [
        {
          name: "Daily Pass",
          price: 25.0,
          duration: 1, // 1 day
        },
        {
          name: "Monthly Premium",
          price: 89.0,
          duration: 30, // 30 days
        },
        {
          name: "Annual Elite",
          price: 899.0,
          duration: 365, // 365 days
        },
      ];

      const createdPlans = await Promise.all(
        defaultPlans.map((plan) => prisma.membershipPlan.create({ data: plan }))
      );

      res.status(200).json({
        isSuccess: true,
        message: "Membership plans retrieved successfully",
        data: createdPlans,
      });
      return;
    }

    res.status(200).json({
      isSuccess: true,
      message: "Membership plans retrieved successfully",
      data: plans,
    });
  } catch (error) {
    console.error("Get membership plans error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};

// Complete member profile after registration
export const completeProfile = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    const {
      address,
      emergencyContact,
      medicalInfo,
      fitnessGoals,
      preferences,
    } = req.body;

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      res.status(404).json({
        isSuccess: false,
        message: "Member not found",
      });
      return;
    }

    // Update address if provided
    if (address) {
      await prisma.address.upsert({
        where: { memberId },
        update: address,
        create: { ...address, memberId },
      });
    }

    // Update emergency contact if provided
    if (emergencyContact) {
      await prisma.emergencyContact.upsert({
        where: { memberId },
        update: emergencyContact,
        create: { ...emergencyContact, memberId },
      });
    }

    // Update medical info if provided
    if (medicalInfo) {
      await prisma.medicalInfo.upsert({
        where: { memberId },
        update: medicalInfo,
        create: { ...medicalInfo, memberId },
      });
    }

    // Create fitness goals if provided
    if (fitnessGoals && fitnessGoals.length > 0) {
      const goalPromises = fitnessGoals.map((goal: any) =>
        prisma.memberFitnessGoal.create({
          data: {
            memberId,
            goalType: goal.type,
            targetValue: goal.target || 1,
            currentValue: 0,
            unit: goal.unit || "sessions",
            targetDate: goal.targetDate ? new Date(goal.targetDate) : null,
            notes: goal.notes || null,
          },
        })
      );
      await Promise.all(goalPromises);
    }

    // Get updated member with all relations
    const updatedMember = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        address: true,
        emergency_contact: true,
        medical_info: true,
        fitness_goals: true,
      },
    });

    res.status(200).json({
      isSuccess: true,
      message: "Profile completed successfully!",
      member: updatedMember,
    });
  } catch (error) {
    console.error("Complete profile error:", error);
    res.status(500).json({
      isSuccess: false,
      message: defaultErrorMessage,
    });
  }
};
