import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { userAPI, memberAPI, equipmentAPI, paymentAPI } from "@/services/api";
import {
  Users,
  UserPlus,
  Dumbbell,
  CreditCard,
  Calendar,
  FileText,
} from "lucide-react";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState("user");
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    username: "",
    phone_number: "",
    password: "",
    role: "staff",
  });

  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    age: "",
    membershiptype: "MONTHLY",
  });

  const [equipmentForm, setEquipmentForm] = useState({
    name: "",
    type: "",
    category: "",
    quantity: "",
    brand: "",
    model: "",
    description: "",
    location: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    memberId: "",
    amount: "",
    method: "cash",
    description: "",
    dueDate: "",
  });

  const handleCreateUser = async () => {
    try {
      setIsLoading(true);
      const response = await userAPI.createUser({
        ...userForm,
        phone_number: userForm.phone_number || undefined,
      });

      if (response.data.isSuccess) {
        toast.success("User created successfully!");
        setUserForm({
          name: "",
          email: "",
          username: "",
          phone_number: "",
          password: "",
          role: "staff",
        });
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMember = async () => {
    try {
      setIsLoading(true);
      const response = await memberAPI.registerMember({
        ...memberForm,
        age: parseInt(memberForm.age),
        phone_number: memberForm.phone_number || undefined,
      });

      if (response.data.isSuccess) {
        toast.success("Member registered successfully!");
        setMemberForm({
          name: "",
          email: "",
          phone_number: "",
          password: "",
          age: "",
          membershiptype: "MONTHLY",
        });
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to register member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEquipment = async () => {
    try {
      setIsLoading(true);
      const response = await equipmentAPI.addEquipment({
        ...equipmentForm,
        quantity: parseInt(equipmentForm.quantity),
        available: parseInt(equipmentForm.quantity),
        inUse: 0,
        maintenance: false,
        status: "OPERATIONAL",
      });

      if (response.data.isSuccess) {
        toast.success("Equipment added successfully!");
        setEquipmentForm({
          name: "",
          type: "",
          category: "",
          quantity: "",
          brand: "",
          model: "",
          description: "",
          location: "",
        });
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add equipment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePayment = async () => {
    try {
      setIsLoading(true);
      const response = await paymentAPI.createPayment({
        memberId: paymentForm.memberId,
        amount: parseFloat(paymentForm.amount),
        method: paymentForm.method,
        description: paymentForm.description,
        dueDate: paymentForm.dueDate,
      });

      if (response.data.isSuccess) {
        toast.success("Payment record created successfully!");
        setPaymentForm({
          memberId: "",
          amount: "",
          method: "cash",
          description: "",
          dueDate: "",
        });
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create payment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    switch (activeTab) {
      case "user":
        handleCreateUser();
        break;
      case "member":
        handleCreateMember();
        break;
      case "equipment":
        handleCreateEquipment();
        break;
      case "payment":
        handleCreatePayment();
        break;
      default:
        break;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Quick Add
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="user" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              User
            </TabsTrigger>
            <TabsTrigger value="member" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Member
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              Equipment
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment
            </TabsTrigger>
          </TabsList>

          {/* User Tab */}
          <TabsContent value="user" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user-name">Full Name *</Label>
                <Input
                  id="user-name"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="user-username">Username *</Label>
                <Input
                  id="user-username"
                  value={userForm.username}
                  onChange={(e) =>
                    setUserForm({ ...userForm, username: e.target.value })
                  }
                  placeholder="Enter username"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="user-email">Email *</Label>
              <Input
                id="user-email"
                type="email"
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
                placeholder="Enter email address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user-phone">Phone Number</Label>
                <Input
                  id="user-phone"
                  value={userForm.phone_number}
                  onChange={(e) =>
                    setUserForm({ ...userForm, phone_number: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="user-role">Role *</Label>
                <Select
                  value={userForm.role}
                  onValueChange={(value) =>
                    setUserForm({ ...userForm, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="user-password">Password *</Label>
              <Input
                id="user-password"
                type="password"
                value={userForm.password}
                onChange={(e) =>
                  setUserForm({ ...userForm, password: e.target.value })
                }
                placeholder="Enter password"
              />
            </div>
          </TabsContent>

          {/* Member Tab */}
          <TabsContent value="member" className="space-y-4">
            <div>
              <Label htmlFor="member-name">Full Name *</Label>
              <Input
                id="member-name"
                value={memberForm.name}
                onChange={(e) =>
                  setMemberForm({ ...memberForm, name: e.target.value })
                }
                placeholder="Enter full name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="member-email">Email *</Label>
                <Input
                  id="member-email"
                  type="email"
                  value={memberForm.email}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, email: e.target.value })
                  }
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="member-phone">Phone Number</Label>
                <Input
                  id="member-phone"
                  value={memberForm.phone_number}
                  onChange={(e) =>
                    setMemberForm({
                      ...memberForm,
                      phone_number: e.target.value,
                    })
                  }
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="member-age">Age *</Label>
                <Input
                  id="member-age"
                  type="number"
                  value={memberForm.age}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, age: e.target.value })
                  }
                  placeholder="Enter age"
                />
              </div>
              <div>
                <Label htmlFor="member-type">Membership Type *</Label>
                <Select
                  value={memberForm.membershiptype}
                  onValueChange={(value) =>
                    setMemberForm({ ...memberForm, membershiptype: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="DAILY">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="member-password">Password *</Label>
              <Input
                id="member-password"
                type="password"
                value={memberForm.password}
                onChange={(e) =>
                  setMemberForm({ ...memberForm, password: e.target.value })
                }
                placeholder="Enter password"
              />
            </div>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="equipment-name">Equipment Name *</Label>
                <Input
                  id="equipment-name"
                  value={equipmentForm.name}
                  onChange={(e) =>
                    setEquipmentForm({ ...equipmentForm, name: e.target.value })
                  }
                  placeholder="Enter equipment name"
                />
              </div>
              <div>
                <Label htmlFor="equipment-type">Type *</Label>
                <Input
                  id="equipment-type"
                  value={equipmentForm.type}
                  onChange={(e) =>
                    setEquipmentForm({ ...equipmentForm, type: e.target.value })
                  }
                  placeholder="Enter equipment type"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="equipment-category">Category *</Label>
                <Select
                  value={equipmentForm.category}
                  onValueChange={(value) =>
                    setEquipmentForm({ ...equipmentForm, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardio">Cardio</SelectItem>
                    <SelectItem value="Strength">Strength</SelectItem>
                    <SelectItem value="Free Weights">Free Weights</SelectItem>
                    <SelectItem value="Functional">Functional</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="equipment-quantity">Quantity *</Label>
                <Input
                  id="equipment-quantity"
                  type="number"
                  value={equipmentForm.quantity}
                  onChange={(e) =>
                    setEquipmentForm({
                      ...equipmentForm,
                      quantity: e.target.value,
                    })
                  }
                  placeholder="Enter quantity"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="equipment-brand">Brand</Label>
                <Input
                  id="equipment-brand"
                  value={equipmentForm.brand}
                  onChange={(e) =>
                    setEquipmentForm({
                      ...equipmentForm,
                      brand: e.target.value,
                    })
                  }
                  placeholder="Enter brand"
                />
              </div>
              <div>
                <Label htmlFor="equipment-model">Model</Label>
                <Input
                  id="equipment-model"
                  value={equipmentForm.model}
                  onChange={(e) =>
                    setEquipmentForm({
                      ...equipmentForm,
                      model: e.target.value,
                    })
                  }
                  placeholder="Enter model"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="equipment-location">Location</Label>
              <Input
                id="equipment-location"
                value={equipmentForm.location}
                onChange={(e) =>
                  setEquipmentForm({
                    ...equipmentForm,
                    location: e.target.value,
                  })
                }
                placeholder="Enter location"
              />
            </div>
            <div>
              <Label htmlFor="equipment-description">Description</Label>
              <Textarea
                id="equipment-description"
                value={equipmentForm.description}
                onChange={(e) =>
                  setEquipmentForm({
                    ...equipmentForm,
                    description: e.target.value,
                  })
                }
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-4">
            <div>
              <Label htmlFor="payment-member">Member ID *</Label>
              <Input
                id="payment-member"
                value={paymentForm.memberId}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, memberId: e.target.value })
                }
                placeholder="Enter member ID"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payment-amount">Amount *</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, amount: e.target.value })
                  }
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <Label htmlFor="payment-method">Payment Method *</Label>
                <Select
                  value={paymentForm.method}
                  onValueChange={(value) =>
                    setPaymentForm({ ...paymentForm, method: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="payment-due">Due Date</Label>
              <Input
                id="payment-due"
                type="date"
                value={paymentForm.dueDate}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, dueDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="payment-description">Description</Label>
              <Textarea
                id="payment-description"
                value={paymentForm.description}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    description: e.target.value,
                  })
                }
                placeholder="Enter payment description"
                rows={3}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickAddModal;
