import React from "react";
import {
  X,
  QrCode,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Download,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface DigitalMembershipCardProps {
  onClose: () => void;
  member: {
    name: string;
    id: string;
    plan: string;
    startDate: string;
    endDate: string;
    status: string;
    profilePicture?: string;
  };
  gymInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
}

const DigitalMembershipCard: React.FC<DigitalMembershipCardProps> = ({
  onClose,
  member,
  gymInfo,
}) => {
  const generateQRCode = () => {
    // In a real implementation, this would generate a QR code with member data
    // For now, we'll use a placeholder
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      JSON.stringify({
        memberId: member.id,
        memberName: member.name,
        plan: member.plan,
        validFrom: member.startDate,
        validTo: member.endDate,
      })
    )}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "expired":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <QrCode className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Digital Membership Card</h2>
                <p className="text-blue-100 text-sm">Scan at gym entrance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Membership Card */}
          <Card className="border-2 border-blue-200 dark:border-blue-700 shadow-lg">
            <CardContent className="p-6">
              {/* Gym Logo/Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {gymInfo.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Premium Fitness & Wellness
                </p>
              </div>

              {/* Member Photo and Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  {member.profilePicture ? (
                    <img
                      src={member.profilePicture}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    member.name[0]?.toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Member ID: {member.id}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {member.plan}
                  </p>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    member.status
                  )}`}
                ></div>
              </div>

              {/* QR Code */}
              <div className="text-center mb-6">
                <div className="inline-block p-4 bg-white rounded-lg border-2 border-gray-200">
                  <img
                    src={generateQRCode()}
                    alt="QR Code"
                    className="w-32 h-32"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Scan to verify membership
                </p>
              </div>

              {/* Membership Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Valid from:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(member.startDate)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Valid until:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(member.endDate)}
                  </span>
                </div>
              </div>

              {/* Gym Contact Info */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {gymInfo.address}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {gymInfo.phone}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {gymInfo.email}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => {
                // In a real app, this would download the card as an image
                window.print();
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Card
            </Button>
            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              How to use your digital membership card:
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Present this card at the gym entrance</li>
              <li>• Staff can scan the QR code to verify membership</li>
              <li>• Keep this card accessible on your device</li>
              <li>• Card is valid until the expiration date shown</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalMembershipCard;
