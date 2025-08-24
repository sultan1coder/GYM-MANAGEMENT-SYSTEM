import React, { useState, useRef, useCallback } from "react";
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
  Camera,
  Upload,
  X,
  Check,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Crop,
  User,
  AlertCircle,

  Trash2,
  Image as ImageIcon,
  FileImage,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog";

interface ProfilePictureManagerProps {
  currentPicture?: string | null;
  onPictureChange: (pictureUrl: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
  memberName?: string;
}

interface DefaultAvatar {
  id: string;
  name: string;
  url: string;
  category: string;
}

const DEFAULT_AVATARS: DefaultAvatar[] = [
  // Professional avatars
  { id: "prof1", name: "Professional 1", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", category: "Professional" },
  { id: "prof2", name: "Professional 2", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", category: "Professional" },
  { id: "prof3", name: "Professional 3", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", category: "Professional" },
  
  // Casual avatars
  { id: "casual1", name: "Casual 1", url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face", category: "Casual" },
  { id: "casual2", name: "Casual 2", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", category: "Casual" },
  { id: "casual3", name: "Casual 3", url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", category: "Casual" },
  
  // Fitness avatars
  { id: "fitness1", name: "Fitness 1", url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face", category: "Fitness" },
  { id: "fitness2", name: "Fitness 2", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", category: "Fitness" },
  { id: "fitness3", name: "Fitness 3", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", category: "Fitness" },
];

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_DIMENSIONS = { width: 200, height: 200 };
const MAX_DIMENSIONS = { width: 2000, height: 2000 };

export default function ProfilePictureManager({
  currentPicture,
  onPictureChange,
  isOpen,
  onClose,
  memberName = "Member",
}: ProfilePictureManagerProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "defaults" | "url">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(currentPicture || "");
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedDefaultAvatar, setSelectedDefaultAvatar] = useState<string | null>(null);
  
  // Image editing states

  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const validateFile = useCallback((file: File): string[] => {
    const errors: string[] = [];

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      errors.push(`File type not supported. Please use: ${ALLOWED_FILE_TYPES.join(", ")}`);
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    return errors;
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const errors = validateFile(file);
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error(errors[0]);
      return;
    }

    setValidationErrors([]);
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Check dimensions
        if (img.width < MIN_DIMENSIONS.width || img.height < MIN_DIMENSIONS.height) {
          setValidationErrors([`Image too small. Minimum dimensions are ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height}px`]);
          toast.error(`Image too small. Minimum dimensions are ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height}px`);
          return;
        }
        if (img.width > MAX_DIMENSIONS.width || img.height > MAX_DIMENSIONS.height) {
          setValidationErrors([`Image too large. Maximum dimensions are ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.width}px`]);
          toast.error(`Image too large. Maximum dimensions are ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.width}px`);
          return;
        }
        
        setImagePreview(e.target?.result as string);

      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [validateFile]);

  const handleUrlChange = useCallback((url: string) => {
    setImageUrl(url);
    setValidationErrors([]);
    
    if (url) {
      // Validate URL image
      const img = new Image();
      img.onload = () => {
        if (img.width < MIN_DIMENSIONS.width || img.height < MIN_DIMENSIONS.height) {
          setValidationErrors([`Image too small. Minimum dimensions are ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height}px`]);
        } else if (img.width > MAX_DIMENSIONS.width || img.height > MAX_DIMENSIONS.height) {
          setValidationErrors([`Image too large. Maximum dimensions are ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.width}px`]);
        }
      };
      img.onerror = () => {
        setValidationErrors(["Invalid image URL or image cannot be loaded"]);
      };
      img.src = url;
    }
  }, []);

  const handleDefaultAvatarSelect = useCallback((avatarId: string) => {
    setSelectedDefaultAvatar(avatarId);
    const avatar = DEFAULT_AVATARS.find(a => a.id === avatarId);
    if (avatar) {
      setImageUrl(avatar.url);
      setValidationErrors([]);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (validationErrors.length > 0) {
      toast.error("Please fix validation errors before saving");
      return;
    }

    if (!imageUrl.trim()) {
      toast.error("Please select an image or enter a URL");
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onPictureChange(imageUrl);
      toast.success("Profile picture updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update profile picture");
    } finally {
      setIsUploading(false);
    }
  }, [imageUrl, validationErrors, onPictureChange, onClose]);

  const handleRemove = useCallback(() => {
    onPictureChange(null);
    toast.success("Profile picture removed");
    onClose();
  }, [onPictureChange, onClose]);

  const resetImageEditing = useCallback(() => {
    setRotation(0);
    setZoom(1);

  }, []);

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  }, []);

  const handleCrop = useCallback(() => {
    // Simple crop implementation - in a real app, you'd use a proper cropping library
    toast.success("Crop functionality would be implemented with a cropping library");
  }, []);

  const triggerFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    setImagePreview(null);
    setImageUrl(currentPicture || "");
    setValidationErrors([]);

    resetImageEditing();
  }, [currentPicture, resetImageEditing]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Camera className="w-6 h-6 text-blue-600" />
            Profile Picture Manager
          </DialogTitle>
          <DialogDescription>
            Upload, edit, or select a profile picture for {memberName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "upload"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Upload className="w-4 h-4 mr-2 inline" />
              Upload Image
            </button>
            <button
              onClick={() => setActiveTab("defaults")}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "defaults"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <User className="w-4 h-4 mr-2 inline" />
              Default Avatars
            </button>
            <button
              onClick={() => setActiveTab("url")}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "url"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <ImageIcon className="w-4 h-4 mr-2 inline" />
              Image URL
            </button>
          </div>

          {/* Current Picture Display */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center overflow-hidden">
                    {currentPicture ? (
                      <img
                        src={currentPicture}
                        alt="Current profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  {!currentPicture && (
                    <Badge variant="secondary" className="absolute -bottom-2 -right-2 text-xs">
                      No Picture
                    </Badge>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentPicture ? "Current profile picture" : "No profile picture set"}
                  </p>
                  {currentPicture && (
                    <Button
                      onClick={handleRemove}
                      variant="outline"
                      size="sm"
                      className="mt-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Picture
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tab Content */}
          {activeTab === "upload" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload New Image</CardTitle>
                <CardDescription>
                  Choose an image file from your device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ALLOWED_FILE_TYPES.join(",")}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        PNG, JPG, JPEG, WEBP up to 5MB
                      </p>
                    </div>
                    <Button onClick={triggerFileUpload} variant="outline">
                      <FileImage className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>

                {selectedFile && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileImage className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{selectedFile.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </Badge>
                      </div>
                      <Button onClick={clearSelection} variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {imagePreview && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <h4 className="font-medium mb-2">Image Preview</h4>
                          <div className="relative inline-block">
                            <img
                              ref={imageRef}
                              src={imagePreview}
                              alt="Preview"
                              className="max-w-full max-h-64 rounded-lg border"
                              style={{
                                transform: `rotate(${rotation}deg) scale(${zoom})`,
                                transition: 'transform 0.2s ease-in-out'
                              }}
                            />
                          </div>
                        </div>

                        {/* Image Editing Controls */}
                        <div className="space-y-3">
                          <h5 className="font-medium text-sm">Edit Image</h5>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              onClick={handleRotate}
                              variant="outline"
                              size="sm"
                            >
                              <RotateCw className="w-4 h-4 mr-2" />
                              Rotate
                            </Button>
                            <Button
                              onClick={handleZoomIn}
                              variant="outline"
                              size="sm"
                            >
                              <ZoomIn className="w-4 h-4 mr-2" />
                              Zoom In
                            </Button>
                            <Button
                              onClick={handleZoomOut}
                              variant="outline"
                              size="sm"
                            >
                              <ZoomOut className="w-4 h-4 mr-2" />
                              Zoom Out
                            </Button>
                            <Button
                              onClick={handleCrop}
                              variant="outline"
                              size="sm"
                            >
                              <Crop className="w-4 h-4 mr-2" />
                              Crop
                            </Button>
                            <Button
                              onClick={resetImageEditing}
                              variant="outline"
                              size="sm"
                            >
                              Reset
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "defaults" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Choose Default Avatar</CardTitle>
                <CardDescription>
                  Select from our collection of professional avatars
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Professional", "Casual", "Fitness"].map((category) => (
                    <div key={category}>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                        {category} Avatars
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {DEFAULT_AVATARS.filter(avatar => avatar.category === category).map((avatar) => (
                          <div
                            key={avatar.id}
                            className={`relative cursor-pointer rounded-lg border-2 transition-all hover:scale-105 ${
                              selectedDefaultAvatar === avatar.id
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            }`}
                            onClick={() => handleDefaultAvatarSelect(avatar.id)}
                          >
                            <img
                              src={avatar.url}
                              alt={avatar.name}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            {selectedDefaultAvatar === avatar.id && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                            <div className="p-2 text-center">
                              <p className="text-xs font-medium text-gray-900 dark:text-white">
                                {avatar.name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "url" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Enter Image URL</CardTitle>
                <CardDescription>
                  Provide a direct link to an image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                  />
                </div>

                {imageUrl && (
                  <div className="space-y-3">
                    <h5 className="font-medium text-sm">Preview</h5>
                    <div className="text-center">
                      <img
                        src={imageUrl}
                        alt="URL preview"
                        className="max-w-full max-h-48 rounded-lg border mx-auto"
                        onError={() => setValidationErrors(["Failed to load image from URL"])}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      Please fix the following issues:
                    </p>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* File Requirements */}
          <Card className="bg-gray-50 dark:bg-gray-800/50">
            <CardHeader>
              <CardTitle className="text-lg">File Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Supported Formats</h5>
                  <div className="space-y-1 text-gray-600 dark:text-gray-400">
                    {ALLOWED_FILE_TYPES.map(type => (
                      <div key={type} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        {type.split('/')[1].toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Size & Dimensions</h5>
                  <div className="space-y-1 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Max file size: 5MB
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Min dimensions: 200x200px
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Max dimensions: 2000x2000px
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUploading || validationErrors.length > 0 || !imageUrl.trim()}
            className="min-w-[120px]"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
