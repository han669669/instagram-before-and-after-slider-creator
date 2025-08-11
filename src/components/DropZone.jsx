import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertCircle, Image, CheckCircle2, X } from 'lucide-react';
import { cn } from '../utils/cn';
import { processImageFile } from '../utils/imageProcessor';

const DropZone = ({ 
  title, 
  subtitle,
  onImageProcessed, 
  onError,
  isProcessing,
  hasImage,
  className,
  compact = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file) => {
    try {
      // Create preview URL immediately for better UX
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFileName(file.name);
      
      const processedImage = await processImageFile(file);
      onImageProcessed(processedImage);
    } catch (error) {
      setImagePreview(null);
      setFileName(null);
      onError(error.message);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (compact) {
    // Compact version for mobile and better space usage
    return (
      <div className={cn("relative", className)}>
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg transition-all duration-300 cursor-pointer",
            "hover:border-purple-400 hover:bg-purple-50/50",
            isDragOver && "border-purple-500 bg-purple-50",
            isProcessing && "pointer-events-none opacity-60",
            hasImage ? "border-green-400 bg-green-50/50" : "border-gray-300 bg-gray-50/30"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />
          
          <div className="p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              {/* Icon/Preview */}
              <div className="flex-shrink-0">
                {hasImage && imagePreview ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-md">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={cn(
                    "w-16 h-16 rounded-lg flex items-center justify-center",
                    hasImage ? "bg-green-100" : "bg-gradient-to-br from-purple-100 to-purple-200"
                  )}>
                    {isProcessing ? (
                      <div className="animate-spin">
                        <Camera className="w-7 h-7 text-purple-600" />
                      </div>
                    ) : hasImage ? (
                      <CheckCircle2 className="w-7 h-7 text-green-600" />
                    ) : (
                      <Image className="w-7 h-7 text-purple-600" />
                    )}
                  </div>
                )}
              </div>
              
              {/* Text content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  {isProcessing ? (
                    "Processing..."
                  ) : hasImage ? (
                    <span className="text-green-600 font-medium">
                      {fileName ? `✓ ${fileName.substring(0, 20)}${fileName.length > 20 ? '...' : ''}` : '✓ Image uploaded'}
                    </span>
                  ) : (
                    "Tap to upload • JPG, PNG, WebP"
                  )}
                </p>
              </div>
              
              {/* Action icon */}
              <div className="flex-shrink-0">
                {hasImage && !isProcessing ? (
                  <div className="text-green-500">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : (
                  <Upload className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original full version
  return (
    <div className={cn("space-y-3", className)}>
      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP • Max 10MB</p>
      </div>
      
      <div
        className={cn(
          "drag-zone border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300",
          "hover:border-purple-400 hover:bg-purple-50/50",
          isDragOver && "border-purple-500 bg-purple-50 transform scale-[1.02]",
          isProcessing && "pointer-events-none opacity-60",
          hasImage && "border-green-400 bg-green-50/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center space-y-3">
          {isProcessing ? (
            <>
              <div className="animate-pulse rounded-full p-4 bg-purple-100">
                <Camera className="w-8 h-8 text-purple-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-purple-700">Processing image...</p>
                <p className="text-xs text-purple-600">Optimizing for Instagram</p>
              </div>
            </>
          ) : hasImage ? (
            <>
              {imagePreview && (
                <div className="relative">
                  <div className="w-24 h-24 rounded-xl overflow-hidden border-3 border-white shadow-lg">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-700">Ready to transform!</p>
                <p className="text-xs text-gray-600">Click to replace</p>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl shadow-inner">
                  <Upload className="w-8 h-8 text-purple-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">Drop your photo here</p>
                <p className="text-xs text-gray-500">
                  or <span className="text-purple-600 font-medium">browse files</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropZone;
