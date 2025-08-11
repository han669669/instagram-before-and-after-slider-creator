import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '../utils/cn';

const ResponsiveReelPreview = ({ 
  beforeImage, 
  afterImage, 
  className,
  showSlider = true,
  sliderPosition = 0.5,
  maxHeight = null, // Optional max height constraint
  containerPadding = 16 // Padding around the preview
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [scale, setScale] = useState(1);
  
  // Cache loaded images
  const beforeImageCache = useRef(null);
  const afterImageCache = useRef(null);

  // Load image from base64
  const loadImage = async (base64Data) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = base64Data;
    });
  };

  // Calculate optimal dimensions for the preview
  const calculateDimensions = useCallback(() => {
    if (!containerRef.current || !beforeImage || !afterImage) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth - (containerPadding * 2);
    const containerHeight = container.offsetHeight || window.innerHeight * 0.7;
    
    // Use original image dimensions
    const imageWidth = beforeImage.width;
    const imageHeight = beforeImage.height;
    const imageAspectRatio = imageWidth / imageHeight;
    
    // Calculate maximum available space
    const maxAvailableHeight = maxHeight || (containerHeight - containerPadding * 2);
    const maxAvailableWidth = containerWidth;
    
    let finalWidth, finalHeight, finalScale;
    
    // Determine if we need to scale down to fit
    if (imageWidth <= maxAvailableWidth && imageHeight <= maxAvailableHeight) {
      // Image fits within container at original size
      finalWidth = imageWidth;
      finalHeight = imageHeight;
      finalScale = 1;
    } else {
      // Need to scale down to fit
      const scaleX = maxAvailableWidth / imageWidth;
      const scaleY = maxAvailableHeight / imageHeight;
      finalScale = Math.min(scaleX, scaleY);
      
      finalWidth = imageWidth * finalScale;
      finalHeight = imageHeight * finalScale;
    }
    
    setDimensions({ 
      width: Math.floor(finalWidth), 
      height: Math.floor(finalHeight) 
    });
    setScale(finalScale);
  }, [beforeImage, afterImage, containerPadding, maxHeight]);

  // Draw the comparison
  const drawComparison = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !beforeImageCache.current || !afterImageCache.current) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const { width, height } = dimensions;
    
    // Set actual canvas size to match display size for crisp rendering
    canvas.width = width;
    canvas.height = height;

    // Enable high quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw before image (right side)
    ctx.drawImage(
      beforeImageCache.current, 
      0, 0, 
      beforeImageCache.current.width, 
      beforeImageCache.current.height,
      0, 0, 
      width, 
      height
    );

    // Calculate slider position
    const sliderX = Math.floor(sliderPosition * width);

    // Draw after image (left side with clipping)
    if (sliderX > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, sliderX, height);
      ctx.clip();
      
      ctx.drawImage(
        afterImageCache.current,
        0, 0,
        afterImageCache.current.width,
        afterImageCache.current.height,
        0, 0,
        width,
        height
      );
      
      ctx.restore();
    }

    // Draw slider line
    if (showSlider && sliderX > 0 && sliderX < width) {
      // Draw white line with shadow for visibility
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 3;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      ctx.beginPath();
      ctx.moveTo(sliderX, 0);
      ctx.lineTo(sliderX, height);
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
  }, [dimensions, sliderPosition, showSlider]);

  // Setup and load images
  useEffect(() => {
    if (!beforeImage || !afterImage) return;

    const loadAndSetup = async () => {
      setIsLoading(true);
      try {
        // Load images if not cached or if they changed
        if (!beforeImageCache.current || beforeImageCache.current.src !== beforeImage.base64) {
          beforeImageCache.current = await loadImage(beforeImage.base64);
        }
        if (!afterImageCache.current || afterImageCache.current.src !== afterImage.base64) {
          afterImageCache.current = await loadImage(afterImage.base64);
        }
        
        // Calculate dimensions after images are loaded
        calculateDimensions();
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAndSetup();
  }, [beforeImage, afterImage, calculateDimensions]);

  // Redraw when dimensions or slider position changes
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0 && !isLoading) {
      drawComparison();
    }
  }, [dimensions, sliderPosition, isLoading, drawComparison]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      calculateDimensions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateDimensions]);

  // Handle container resize
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      calculateDimensions();
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [calculateDimensions]);

  if (!beforeImage || !afterImage) {
    return (
      <div ref={containerRef} className={cn("w-full flex items-center justify-center", className)}>
        <div className="w-full max-w-md h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="mb-3">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-sm font-medium mb-1">No Preview Available</div>
            <div className="text-xs opacity-70">Upload both images to see preview</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={cn("w-full flex items-center justify-center", className)}
      style={{ minHeight: '200px' }}
    >
      <div className="relative inline-block">
        {/* Canvas centered within its container */}
        <canvas 
          ref={canvasRef}
          className={cn(
            "block rounded-xl shadow-2xl transition-opacity duration-300",
            isLoading && "opacity-0"
          )}
          style={{ 
            width: dimensions.width || 'auto',
            height: dimensions.height || 'auto',
            maxWidth: '100%',
            background: isLoading ? '#f3f4f6' : 'white'
          }}
        />
        
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <div className="text-sm text-gray-500 mt-2">Loading preview...</div>
            </div>
          </div>
        )}
        
        {/* Info badge */}
        {!isLoading && dimensions.width > 0 && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium">
            {beforeImage.width} × {beforeImage.height}
            {scale < 1 && ` (${Math.round(scale * 100)}%)`}
          </div>
        )}
        
        {/* Slider percentage indicator */}
        {!isLoading && showSlider && dimensions.width > 0 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
            {Math.round(sliderPosition * 100)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsiveReelPreview;
