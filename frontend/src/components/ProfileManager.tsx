import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button } from "./ui/button";
import { Camera, Upload, X, User } from "lucide-react";
import { toast } from "react-hot-toast";
import { userAPI, memberAPI } from "../services/api";

interface ProfileManagerProps {
  onClose: () => void;
  userType: "staff" | "member";
}

const ProfileManager = ({ onClose, userType }: ProfileManagerProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const loginState = useSelector((state: RootState) => 
    userType === "staff" ? state.loginSlice : state.loginMemberSlice
  );
  
  const user = userType === "staff" 
    ? (loginState.data as any).user 
    : (loginState.data as any).member;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    
    try {
      // For now, we'll simulate uploading to a cloud service
      // In a real application, you would upload to AWS S3, Cloudinary, etc.
      
      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock URL (in real app, this would be the actual uploaded file URL)
      const mockImageUrl = `https://via.placeholder.com/400x400/6366f1/ffffff?text=${encodeURIComponent(user.name)}`;
      
      // Update profile picture in database
      if (userType === "staff") {
        await userAPI.updateProfilePicture(user.id, mockImageUrl);
      } else {
        await memberAPI.updateProfilePicture(user.id, mockImageUrl);
      }
      
      toast.success('Profile picture updated successfully!');
      onClose();
      
      // TODO: Update user state with new profile picture URL
      // This would typically involve dispatching an action to update the Redux store
      
    } catch (error) {
      toast.error('Failed to upload profile picture');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePicture = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Profile Picture
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Profile Picture */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-200 dark:border-slate-600"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-slate-200 dark:border-slate-600">
                {user?.name?.[0]?.toUpperCase() || <User className="h-8 w-8" />}
              </div>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {user?.name}
          </p>
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button
            onClick={openFileDialog}
            variant="outline"
            className="w-full"
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose Image
          </Button>

          {selectedFile && (
            <div className="space-y-3">
              <div className="text-center">
                <img
                  src={previewUrl!}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-slate-300 dark:border-slate-600"
                />
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {selectedFile.name}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleRemovePicture}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-1" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
            Tips for best results:
          </h4>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Use square images (1:1 aspect ratio)</li>
            <li>• Recommended size: 400x400 pixels</li>
            <li>• Max file size: 5MB</li>
            <li>• Supported formats: JPG, PNG, GIF</li>
          </ul>
        </div>

        {/* Note about current implementation */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-400">
            <strong>Note:</strong> Currently using placeholder images. In production, 
            integrate with a cloud storage service like AWS S3 or Cloudinary for 
            actual file uploads.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileManager;
