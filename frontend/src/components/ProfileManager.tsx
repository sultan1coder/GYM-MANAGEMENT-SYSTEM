import { useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button } from "./ui/button";
import { Camera, Upload, X, User, Image, Trash2, CheckCircle, AlertCircle } from "lucide-react";
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
  const [isDragOver, setIsDragOver] = useState(false);
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
      processFile(file);
    }
  };

  const processFile = (file: File) => {
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
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Camera className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Update Profile Picture</h2>
                <p className="text-blue-100 text-sm">Choose a new profile image</p>
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
          {/* Current Profile Picture */}
          <div className="text-center">
            <div className="relative inline-block">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Current Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-slate-200 dark:border-slate-600 shadow-lg"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-slate-200 dark:border-slate-600 shadow-lg">
                  {user?.name?.[0]?.toUpperCase() || <User className="h-10 w-10" />}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full border-2 border-white">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white mt-3">
              {user?.name}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Current Profile Picture
            </p>
          </div>

          {/* File Upload Area */}
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {/* Drag & Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!selectedFile ? (
                <div className="space-y-4">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                    isDragOver 
                      ? 'bg-blue-100 dark:bg-blue-800' 
                      : 'bg-slate-100 dark:bg-slate-700'
                  }`}>
                    <Image className={`h-8 w-8 transition-colors ${
                      isDragOver ? 'text-blue-600' : 'text-slate-500'
                    }`} />
                  </div>
                  
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {isDragOver ? 'Drop your image here' : 'Upload New Picture'}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Drag and drop an image here, or click to browse
                    </p>
                    
                    <Button
                      onClick={openFileDialog}
                      variant="outline"
                      size="lg"
                      className="bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={previewUrl!}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-200 dark:border-blue-700 shadow-lg"
                    />
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-white">
                      <Image className="h-3 w-3" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type.split('/')[1].toUpperCase()}
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={handleRemovePicture}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Camera className="h-4 w-4 mr-2" />
                          Upload Picture
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700 dark:to-blue-900/20 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Tips for best results:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Square images (1:1 ratio)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>400x400 pixels recommended</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Max 5MB file size</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>JPG, PNG, GIF formats</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Implementation Note */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-700">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                  Development Mode
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Currently using placeholder images. In production, integrate with AWS S3, 
                  Cloudinary, or similar cloud storage service for actual file uploads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManager;
