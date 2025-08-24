import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { memberAPI } from "@/services/api";
import { Member } from "@/types/members/memberLogin";
import { toast } from "react-hot-toast";
import ProfilePictureManager from "@/components/ProfilePictureManager";
import {
  ArrowLeft,
  User,
  CreditCard,
  Camera,
  Save,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  BarChart3,
  Calendar,
  MapPin,
  Heart,
  AlertTriangle,
} from "lucide-react";

const MemberUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showProfileManager, setShowProfileManager] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    age: 18,
    membershiptype: "MONTHLY" as "MONTHLY" | "DAILY",
    password: "",
    confirmPassword: "",
    profile_picture: "",

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
      fitness_goals: [] as string[],
      health_conditions: [] as string[],
      allergies: [] as string[],
      medications: [] as string[],
      emergency_notes: "",
    },
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const membershipTypes = [
    {
      value: "MONTHLY",
      label: "Monthly Membership",
      description: "Full month access",
    },
    { value: "DAILY", label: "Daily Pass", description: "Single day access" },
  ];

  const ageOptions = Array.from({ length: 83 }, (_, i) => i + 18); // 18 to 100

  // Fetch member data on component mount
  useEffect(() => {
    if (id) {
      fetchMember();
    }
  }, [id]);

  const fetchMember = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await memberAPI.getSingleMember(id!);

      if (response.data.isSuccess && response.data.data) {
        const memberData = response.data.data;
        setMember(memberData);
        setFormData({
          name: memberData.name,
          email: memberData.email,
          phone_number: memberData.phone_number || "",
          age: memberData.age,
          membershiptype: memberData.membershiptype,
          password: "",
          confirmPassword: "",
          profile_picture: "",
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
          emergency_contact: {
            name: "",
            relationship: "",
            phone: "",
            email: "",
          },
          medical_info: {
            fitness_goals: [] as string[],
            health_conditions: [] as string[],
            allergies: [] as string[],
            medications: [] as string[],
            emergency_notes: "",
          },
        });
      } else {
        setError("Failed to fetch member data");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch member data");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (
      formData.phone_number &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone_number.replace(/\s/g, ""))
    ) {
      errors.phone_number = "Please enter a valid phone number";
    }

    if (formData.age < 18 || formData.age > 100) {
      errors.age = "Age must be between 18 and 100";
    }

    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    field: string,
    value: string | number | string[]
  ) => {
    setFormData((prev) => {
      // Handle nested object updates (e.g., "address.street")
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        const parentKey = parent as keyof typeof prev;
        const parentObj = prev[parentKey] as Record<string, any>;
        return {
          ...prev,
          [parentKey]: {
            ...parentObj,
            [child]: value,
          },
        };
      }

      // Handle regular field updates
      return {
        ...prev,
        [field]: value,
      };
    });

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleUpdateMember = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      setIsUpdating(true);

      // Prepare update data (exclude password if not changed)
      const updateData: Partial<Member> = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number || null,
        age: formData.age,
        membershiptype: formData.membershiptype,
        address: formData.address,
        emergency_contact: formData.emergency_contact,
        medical_info: formData.medical_info,
      };

      // Only include password if it was changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      // Only include profile picture if it was changed
      if (formData.profile_picture !== member?.profile_picture) {
        updateData.profile_picture = formData.profile_picture || null;
      }

      const response = await memberAPI.updateMember(id!, updateData);

      if (response.data.isSuccess) {
        toast.success("Member updated successfully!");
        // Refresh member data
        await fetchMember();
        // Clear password fields
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      } else {
        toast.error(response.data.message || "Failed to update member");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update member");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!member) return;

    try {
      setIsUpdating(true);
      const response = await memberAPI.deleteMember(id!);

      if (response.data.isSuccess) {
        toast.success("Member deleted successfully!");
        navigate("/members/dashboard");
      } else {
        toast.error(response.data.message || "Failed to delete member");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete member");
    } finally {
      setIsUpdating(false);
      setShowDeleteDialog(false);
    }
  };

  const resetForm = () => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone_number: member.phone_number || "",
        age: member.age,
        membershiptype: member.membershiptype,
        password: "",
        confirmPassword: "",
        profile_picture: member.profile_picture || "",
        address: member.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        emergency_contact: {
          name: "",
          relationship: "",
          phone: "",
          email: "",
        },
        medical_info: {
          fitness_goals: [] as string[],
          health_conditions: [] as string[],
          allergies: [] as string[],
          medications: [] as string[],
          emergency_notes: "",
        },
      });
    }
    setValidationErrors({});
  };

  const handleProfilePictureChange = (pictureUrl: string | null) => {
    setFormData((prev) => ({ ...prev, profile_picture: pictureUrl || "" }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Member
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-3">
              <Button onClick={() => fetchMember()} variant="outline">
                Try Again
              </Button>
              <Button onClick={() => navigate("/members/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Member Not Found
            </h3>
            <Button onClick={() => navigate("/members/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="mx-auto space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/members/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Members
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Update Member
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Edit member information and membership details
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Member
            </Button>
            <Link to="/members/dashboard">
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Members Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Member Overview Card */}
        <Card className="bg-white border-0 shadow-lg dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
                {member.profile_picture ? (
                  <img
                    src={member.profile_picture}
                    alt={member.name}
                    className="object-cover w-14 h-14 rounded-full"
                  />
                ) : (
                  <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Member ID: {member.id} • Joined:{" "}
                  {new Date(member.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="ml-auto">
                <Badge
                  variant="secondary"
                  className={`${
                    member.membershiptype === "MONTHLY"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  }`}
                >
                  {member.membershiptype === "MONTHLY" ? (
                    <Calendar className="w-3 h-3 mr-1" />
                  ) : (
                    <Clock className="w-3 h-3 mr-1" />
                  )}
                  {member.membershiptype} Membership
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {member.age}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Age
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {member.email}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Email
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {member.phone_number || "Not provided"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Phone
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Update Form */}
        <Card className="bg-white border-0 shadow-lg dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Member Information
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Update member details and membership information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={validationErrors.name ? "border-red-500" : ""}
                    placeholder="Enter full name"
                  />
                  {validationErrors.name && (
                    <p className="text-sm text-red-600">
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={validationErrors.email ? "border-red-500" : ""}
                    placeholder="Enter email address"
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-red-600">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) =>
                      handleInputChange("phone_number", e.target.value)
                    }
                    className={
                      validationErrors.phone_number ? "border-red-500" : ""
                    }
                    placeholder="Enter phone number"
                  />
                  {validationErrors.phone_number && (
                    <p className="text-sm text-red-600">
                      {validationErrors.phone_number}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Select
                    value={formData.age.toString()}
                    onValueChange={(value) =>
                      handleInputChange("age", parseInt(value))
                    }
                  >
                    <SelectTrigger
                      className={validationErrors.age ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      {ageOptions.map((age) => (
                        <SelectItem key={age} value={age.toString()}>
                          {age} years old
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.age && (
                    <p className="text-sm text-red-600">
                      {validationErrors.age}
                    </p>
                  )}
                </div>
              </div>

              {/* Membership & Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Membership & Security
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="membershiptype">Membership Type *</Label>
                  <Select
                    value={formData.membershiptype}
                    onValueChange={(value: "MONTHLY" | "DAILY") =>
                      handleInputChange("membershiptype", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select membership type" />
                    </SelectTrigger>
                    <SelectContent>
                      {membershipTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-gray-500">
                              {type.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    New Password (leave blank to keep current)
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={
                        validationErrors.password ? "border-red-500" : ""
                      }
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-sm text-red-600">
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className={
                        validationErrors.confirmPassword ? "border-red-500" : ""
                      }
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile_picture">Profile Picture</Label>
                  <div className="flex gap-2">
                    <Input
                      id="profile_picture"
                      value={formData.profile_picture}
                      onChange={(e) =>
                        handleInputChange("profile_picture", e.target.value)
                      }
                      placeholder="Enter profile picture URL"
                    />
                    <Button
                      type="button"
                      onClick={() => setShowProfileManager(true)}
                      variant="outline"
                      size="sm"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address.street">Street Address</Label>
                  <Input
                    id="address.street"
                    value={formData.address.street}
                    onChange={(e) =>
                      handleInputChange("address.street", e.target.value)
                    }
                    placeholder="Enter street address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.city">City</Label>
                  <Input
                    id="address.city"
                    value={formData.address.city}
                    onChange={(e) =>
                      handleInputChange("address.city", e.target.value)
                    }
                    placeholder="Enter city"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.state">State/Province</Label>
                  <Input
                    id="address.state"
                    value={formData.address.state}
                    onChange={(e) =>
                      handleInputChange("address.state", e.target.value)
                    }
                    placeholder="Enter state/province"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.zipCode">ZIP/Postal Code</Label>
                  <Input
                    id="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={(e) =>
                      handleInputChange("address.zipCode", e.target.value)
                    }
                    placeholder="Enter ZIP/postal code"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address.country">Country</Label>
                  <Input
                    id="address.country"
                    value={formData.address.country}
                    onChange={(e) =>
                      handleInputChange("address.country", e.target.value)
                    }
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact.name">Full Name</Label>
                  <Input
                    id="emergency_contact.name"
                    value={formData.emergency_contact.name}
                    onChange={(e) =>
                      handleInputChange(
                        "emergency_contact.name",
                        e.target.value
                      )
                    }
                    placeholder="Enter emergency contact name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact.relationship">
                    Relationship
                  </Label>
                  <Input
                    id="emergency_contact.relationship"
                    value={formData.emergency_contact.relationship}
                    onChange={(e) =>
                      handleInputChange(
                        "emergency_contact.relationship",
                        e.target.value
                      )
                    }
                    placeholder="e.g., Spouse, Parent, Friend"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact.phone">Phone Number</Label>
                  <Input
                    id="emergency_contact.phone"
                    value={formData.emergency_contact.phone}
                    onChange={(e) =>
                      handleInputChange(
                        "emergency_contact.phone",
                        e.target.value
                      )
                    }
                    placeholder="Enter emergency contact phone"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact.email">
                    Email (Optional)
                  </Label>
                  <Input
                    id="emergency_contact.email"
                    type="email"
                    value={formData.emergency_contact.email}
                    onChange={(e) =>
                      handleInputChange(
                        "emergency_contact.email",
                        e.target.value
                      )
                    }
                    placeholder="Enter emergency contact email"
                  />
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Health & Fitness Information
              </h3>

              {/* Fitness Goals */}
              <div className="space-y-2">
                <Label>Fitness Goals (Select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        checked={formData.medical_info.fitness_goals.includes(
                          goal
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const newGoals = [
                              ...formData.medical_info.fitness_goals,
                              goal,
                            ];
                            handleInputChange(
                              "medical_info.fitness_goals",
                              newGoals
                            );
                          } else {
                            const newGoals =
                              formData.medical_info.fitness_goals.filter(
                                (g) => g !== goal
                              );
                            handleInputChange(
                              "medical_info.fitness_goals",
                              newGoals
                            );
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {goal}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Health Conditions */}
              <div className="space-y-2">
                <Label htmlFor="medical_info.health_conditions">
                  Health Conditions (Optional)
                </Label>
                <textarea
                  id="medical_info.health_conditions"
                  value={formData.medical_info.health_conditions.join(", ")}
                  onChange={(e) => {
                    const conditions = e.target.value
                      .split(",")
                      .map((c) => c.trim())
                      .filter((c) => c);
                    handleInputChange(
                      "medical_info.health_conditions",
                      conditions
                    );
                  }}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="List any health conditions, injuries, or limitations..."
                />
              </div>

              {/* Allergies */}
              <div className="space-y-2">
                <Label htmlFor="medical_info.allergies">
                  Allergies (Optional)
                </Label>
                <textarea
                  id="medical_info.allergies"
                  value={formData.medical_info.allergies.join(", ")}
                  onChange={(e) => {
                    const allergies = e.target.value
                      .split(",")
                      .map((a) => a.trim())
                      .filter((a) => a);
                    handleInputChange("medical_info.allergies", allergies);
                  }}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="List any allergies..."
                />
              </div>

              {/* Emergency Notes */}
              <div className="space-y-2">
                <Label htmlFor="medical_info.emergency_notes">
                  Emergency Notes (Optional)
                </Label>
                <textarea
                  id="medical_info.emergency_notes"
                  value={formData.medical_info.emergency_notes}
                  onChange={(e) =>
                    handleInputChange(
                      "medical_info.emergency_notes",
                      e.target.value
                    )
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="Any additional information for emergency situations..."
                />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                onClick={resetForm}
                variant="outline"
                disabled={isUpdating}
              >
                Reset Form
              </Button>
              <Button
                onClick={handleUpdateMember}
                disabled={isUpdating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Member
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Delete Member
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete <strong>{member.name}</strong>?
                This will permanently remove their account and all associated
                data.
              </p>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setShowDeleteDialog(false)}
                  variant="outline"
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteMember}
                  variant="destructive"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Member
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Picture Manager */}
      <ProfilePictureManager
        currentPicture={formData.profile_picture}
        onPictureChange={handleProfilePictureChange}
        isOpen={showProfileManager}
        onClose={() => setShowProfileManager(false)}
        memberName={member?.name}
      />
    </div>
  );
};

export default MemberUpdate;
