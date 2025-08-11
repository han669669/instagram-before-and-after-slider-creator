import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Play, 
  Pause, 
  Check, 
  Sparkles,
  Trash2,
  Eye,
  Video,
  ArrowRight,
  Loader2,
  AlertCircle,
  ImageIcon,
  Zap,
  ChevronRight,
  Info,
  Share2,
  Settings
} from 'lucide-react';
import AppIcon from './components/AppIcon';
import HeroSection from './components/HeroSection';
import { useImages, useVideoGeneration, useError, useProcessing } from './stores/appStore';
import { Button } from './components/Button';
import { VideoGenerationProgress } from './components/Progress';
import ResponsiveReelPreview from './components/ResponsiveReelPreview';
import DropZone from './components/DropZone';
import { cn } from './utils/cn';
import { generateReelVideo, downloadVideo } from './utils/videoGenerator';
import { processImageFile, shouldForceInstagramRatio } from './utils/imageProcessor';
import { createRealisticExampleImages } from './utils/exampleImages';

function AppImproved() {
  const [previewSlider, setPreviewSlider] = useState(0.5);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [showFinalPreview, setShowFinalPreview] = useState(false);
  const [aspectRatioMismatch, setAspectRatioMismatch] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const previewIntervalRef = useRef(null);
  const videoPreviewRef = useRef(null);
  
  // Store hooks
  const { beforeImage, afterImage, setBeforeImage, setAfterImage, clearImages } = useImages();
  const { 
    isGeneratingVideo, 
    videoProgress, 
    generatedVideo,
    setGeneratingVideo,
    setVideoProgress,
    setGeneratedVideo,
    clearVideo
  } = useVideoGeneration();
  const { isProcessing, setProcessing } = useProcessing();
  const { error, setError, clearError } = useError();
  
  const canGenerateVideo = beforeImage && afterImage && !isProcessing && !isGeneratingVideo;
  const hasImages = beforeImage && afterImage;

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide hero when user has images
  useEffect(() => {
    if (beforeImage || afterImage) {
      setShowHero(false);
    }
  }, [beforeImage, afterImage]);

  // Check aspect ratio compatibility
  useEffect(() => {
    if (beforeImage && afterImage) {
      const needsRescaling = shouldForceInstagramRatio(beforeImage, afterImage);
      setAspectRatioMismatch(needsRescaling);
    }
  }, [beforeImage, afterImage]);

  // Handle file processing
  const handleBeforeImageProcessed = (processedImage) => {
    setBeforeImage(processedImage);
    clearError();
  };

  const handleAfterImageProcessed = (processedImage) => {
    setAfterImage(processedImage);
    clearError();
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  // Load example images
  const handleLoadExampleImages = async () => {
    try {
      setProcessing(true);
      const exampleImages = await createRealisticExampleImages();
      setBeforeImage(exampleImages.before);
      setAfterImage(exampleImages.after);
      clearError();
      setShowHero(false);
    } catch (error) {
      setError('Failed to load example images: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  // Preview animation
  const togglePreviewAnimation = () => {
    if (isPreviewPlaying) {
      if (previewIntervalRef.current) {
        cancelAnimationFrame(previewIntervalRef.current);
        previewIntervalRef.current = null;
      }
      setIsPreviewPlaying(false);
    } else {
      let startTime = null;
      const duration = 3000;
      
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = (elapsed % duration) / duration;
        
        setPreviewSlider(progress);
        
        if (previewIntervalRef.current !== null) {
          previewIntervalRef.current = requestAnimationFrame(animate);
        }
      };
      
      setIsPreviewPlaying(true);
      previewIntervalRef.current = requestAnimationFrame(animate);
    }
  };

  // Generate video
  const handleGenerateVideo = async () => {
    if (!canGenerateVideo) return;
    
    setGeneratingVideo(true);
    clearVideo();
    clearError();
    setShowFinalPreview(true);
    
    try {
      const videoBlob = await generateReelVideo(
        beforeImage.base64,
        afterImage.base64,
        setVideoProgress
      );
      
      setGeneratedVideo(videoBlob);
      const previewUrl = URL.createObjectURL(videoBlob);
      setVideoPreviewUrl(previewUrl);
    } catch (error) {
      setError(`Failed to generate video: ${error.message}`);
      setShowFinalPreview(false);
    } finally {
      setGeneratingVideo(false);
    }
  };

  const handleDownloadVideo = () => {
    if (generatedVideo) {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      downloadVideo(generatedVideo, `before-after-reel-${timestamp}.webm`);
    }
  };

  const handleReset = () => {
    clearImages();
    clearVideo();
    clearError();
    setPreviewSlider(0.5);
    setIsPreviewPlaying(false);
    setShowFinalPreview(false);
    setShowHero(true);
    if (previewIntervalRef.current) {
      cancelAnimationFrame(previewIntervalRef.current);
    }
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(null);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (previewIntervalRef.current) {
        cancelAnimationFrame(previewIntervalRef.current);
      }
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl blur-lg group-hover:blur-xl opacity-70 group-hover:opacity-100 transition-all duration-300" />
                <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <AppIcon size={24} color="white" animated />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Before/After Slider
                  </h1>
                  {!isMobile && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Beta
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 hidden sm:block mt-0.5">
                  Transform your photos into viral content
                </p>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {hasImages && (
                <>
                  {/* Stats Badge */}
                  <div className="hidden lg:flex items-center space-x-4 mr-4 px-4 py-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-gray-600">Ready</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300" />
                    <span className="text-xs text-gray-500">
                      {beforeImage.width}×{beforeImage.height}px
                    </span>
                  </div>
                  
                  {/* Reset Button */}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleReset}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="ml-2 hidden sm:inline">Reset</span>
                  </Button>
                </>
              )}
              
              {!hasImages && (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="font-medium hover:bg-purple-50 hover:text-purple-700"
                  >
                    Get Started
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-6 py-6 lg:py-10 max-w-7xl">
        {/* Hero Section - Only show when no images */}
        {showHero && !hasImages && (
          <HeroSection 
            onGetStarted={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
            onLoadExample={handleLoadExampleImages}
          />
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-in fade-in slide-in duration-300">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Oops! Something went wrong</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button 
              onClick={clearError}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        )}

        {/* Main Content - Optimized Layout */}
        {showFinalPreview && generatedVideo ? (
          // Final Video Preview
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Success Message - Elegant Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5">
                    {/* Success Icon */}
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                        <Sparkles className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    
                    {/* Success Text */}
                    <div className="text-center sm:text-left flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                        Your masterpiece is ready!
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600">
                        Your before/after reel has been generated successfully. Ready to wow your audience?
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Preview Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 lg:p-8">
                  {/* Video Container with Decorative Background */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-2xl" />
                    <div className="relative p-4 sm:p-6">
                      <div className="relative rounded-xl overflow-hidden shadow-2xl max-w-md mx-auto bg-black">
                        {videoPreviewUrl && (
                          <video 
                            ref={videoPreviewRef}
                            src={videoPreviewUrl} 
                            className="w-full h-auto"
                            controls
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{
                              aspectRatio: beforeImage && afterImage ? 
                                `${beforeImage.width}/${beforeImage.height}` : 'auto'
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 space-y-4 max-w-md mx-auto">
                    {/* Primary Download Button */}
                    <Button 
                      onClick={handleDownloadVideo}
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                      size="lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Your Reel
                    </Button>
                    
                    {/* Secondary Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowFinalPreview(false)}
                        className="h-10 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Back to Editor
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleReset}
                        className="h-10 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create Another
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Sharing Encouragement */}
              <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-xl p-6 text-center">
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-center mb-3">
                    <Share2 className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="text-sm font-semibold text-gray-900">Ready to go viral?</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Share your transformation and inspire others to level up their content game.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Main Editor Interface
          <div className={cn(
            "grid gap-6 lg:gap-8",
            isMobile ? "grid-cols-1" : "lg:grid-cols-3"
          )}>
            {/* Left Column - Upload Section */}
            <div className={cn(
              isMobile ? "order-1" : "lg:col-span-1"
            )}>
              <div id="upload-section" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Upload Header */}
                <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Upload Photos</h2>
                      <p className="text-xs text-gray-600 mt-0.5">Add your before & after images</p>
                    </div>
                    {!hasImages && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleLoadExampleImages}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                        disabled={isProcessing}
                      >
                        <ImageIcon className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Example</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Upload Zones */}
                <div className="p-4 sm:p-5 space-y-4">
                  <DropZone 
                    title="Before Photo"
                    subtitle="Your original image"
                    onImageProcessed={handleBeforeImageProcessed}
                    onError={handleError}
                    isProcessing={isProcessing}
                    hasImage={!!beforeImage}
                    compact={isMobile}
                  />
                  
                  {/* Visual Separator */}
                  <div className="flex items-center justify-center py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-[2px] bg-gradient-to-r from-transparent to-purple-300"></div>
                      <ArrowRight className="w-5 h-5 text-purple-400" />
                      <div className="w-8 h-[2px] bg-gradient-to-l from-transparent to-purple-300"></div>
                    </div>
                  </div>
                  
                  <DropZone 
                    title="After Photo"
                    subtitle="Your edited version"
                    onImageProcessed={handleAfterImageProcessed}
                    onError={handleError}
                    isProcessing={isProcessing}
                    hasImage={!!afterImage}
                    compact={isMobile}
                  />

                  {/* Quick Tips */}
                  {!hasImages && (
                    <div className="bg-blue-50 rounded-lg p-3 mt-4">
                      <div className="flex items-start space-x-2">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-800">
                          <p className="font-medium mb-1">Pro tip:</p>
                          <p>Use the same angle and lighting for best results. Photos will auto-resize to match.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats/Features - Desktop only */}
              {!isMobile && hasImages && (
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { icon: Zap, label: "Instant", value: "3 sec" },
                    { icon: Video, label: "Format", value: "HD" },
                    { icon: Check, label: "Quality", value: "100%" }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 text-center border border-gray-200">
                      <stat.icon className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs font-medium text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Preview Section */}
            <div className={cn(
              "space-y-6",
              isMobile ? "order-2" : "lg:col-span-2"
            )}>
              {/* Preview Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Preview Header */}
                <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Live Preview</h2>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {hasImages ? 'Drag slider or press play to preview' : 'Upload images to start'}
                      </p>
                    </div>
                    {hasImages && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 hidden sm:block">
                          {beforeImage.width}×{beforeImage.height}
                        </span>
                        {aspectRatioMismatch && (
                          <span className="text-xs text-orange-600 font-medium">
                            Auto-resize
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white">
                  <div className="relative">
                    <ResponsiveReelPreview 
                      beforeImage={beforeImage}
                      afterImage={afterImage}
                      sliderPosition={previewSlider}
                      showSlider={true}
                      maxHeight={window.innerHeight * 0.6}
                      containerPadding={isMobile ? 8 : 16}
                    />
                    
                    {/* Play Button Overlay - positioned better */}
                    {hasImages && (
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/90 text-gray-800 hover:bg-white backdrop-blur-sm shadow-xl border border-gray-200"
                          onClick={togglePreviewAnimation}
                        >
                          {isPreviewPlaying ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Play Preview
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Slider Control */}
                  {hasImages && (
                    <div className="mt-6 px-2">
                      <div className="relative">
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={previewSlider}
                          onChange={(e) => {
                            const newValue = parseFloat(e.target.value);
                            setPreviewSlider(newValue);
                          }}
                          onMouseDown={() => {
                            if (isPreviewPlaying) {
                              if (previewIntervalRef.current) {
                                cancelAnimationFrame(previewIntervalRef.current);
                                previewIntervalRef.current = null;
                              }
                              setIsPreviewPlaying(false);
                            }
                          }}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span className="font-medium">Before</span>
                          <span className="text-purple-600 font-bold">
                            {Math.round(previewSlider * 100)}%
                          </span>
                          <span className="font-medium">After</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Generation Progress */}
                {isGeneratingVideo && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <VideoGenerationProgress videoProgress={videoProgress} />
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <div className="space-y-3">
                <Button 
                  onClick={handleGenerateVideo}
                  disabled={!canGenerateVideo}
                  className={cn(
                    "w-full h-12 sm:h-14 text-base sm:text-lg font-bold shadow-lg transition-all duration-300",
                    canGenerateVideo && "hover:shadow-xl hover:-translate-y-0.5 bg-gradient-to-r from-purple-600 to-purple-700"
                  )}
                  size="lg"
                >
                  {isGeneratingVideo ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Your Reel...
                    </>
                  ) : (
                    <>
                      <Video className="w-5 h-5 mr-2" />
                      Generate Instagram Reel
                      {canGenerateVideo && <ChevronRight className="w-4 h-4 ml-2" />}
                    </>
                  )}
                </Button>

                {!hasImages && (
                  <p className="text-center text-sm text-gray-500">
                    Upload both photos to unlock video generation
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Simplified Footer */}
      <footer className="border-t border-gray-200/50 bg-white mt-auto">
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Left side - Brand and copyright */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg shadow-sm">
                  <AppIcon size={18} color="white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Before/After Slider</span>
              </div>
              <span className="text-sm text-gray-500">© 2025</span>
            </div>
            
            {/* Center - Links */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-purple-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-purple-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-purple-600 transition-colors">Contact</a>
            </div>
            
            {/* Right side - Tagline */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Made with</span>
              <span className="text-red-500">❤️</span>
              <span>for creators</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AppImproved;
