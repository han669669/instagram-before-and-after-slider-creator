// We'll use MediaRecorder API instead of Whammy for better browser compatibility
import { REEL_WIDTH, REEL_HEIGHT, aspectRatiosMatch } from './imageProcessor.js';

// Video configuration
export const VIDEO_CONFIG = {
  fps: 30,
  duration: 3, // seconds
  transition: {
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Smooth easing
    direction: 'horizontal' // left-to-right
  }
};

/**
 * Easing function for smooth transitions
 */
function easeInOutQuart(t) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
}

/**
 * Creates a single frame for the before/after transition
 */
function createTransitionFrame(beforeCanvas, afterCanvas, progress, videoWidth, videoHeight) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = videoWidth;
  canvas.height = videoHeight;
  
  // Apply easing to progress
  const easedProgress = easeInOutQuart(progress);
  
  // Calculate slider position (0 = fully before, 1 = fully after)
  const sliderX = easedProgress * videoWidth;
  
  // Draw before image (left side)
  ctx.drawImage(beforeCanvas, 0, 0);
  
  // Create clipping mask for after image
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, sliderX, videoHeight);
  ctx.clip();
  
  // Draw after image (right side, clipped)
  ctx.drawImage(afterCanvas, 0, 0);
  ctx.restore();
  
  // Optional: Add subtle slider line
  if (sliderX > 0 && sliderX < videoWidth) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sliderX, 0);
    ctx.lineTo(sliderX, videoHeight);
    ctx.stroke();
  }
  
  return canvas;
}

/**
 * Base64 image to canvas conversion
 */
function base64ToCanvas(base64Data) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      resolve(canvas);
    };
    
    img.onerror = () => reject(new Error('Failed to load image from base64'));
    img.src = base64Data;
  });
}

/**
 * Generates frames for the transition video
 */
export async function generateTransitionFrames(beforeBase64, afterBase64, onProgress = () => {}) {
  const beforeCanvas = await base64ToCanvas(beforeBase64);
  const afterCanvas = await base64ToCanvas(afterBase64);
  
  // Use original dimensions from the first image
  const videoWidth = beforeCanvas.width;
  const videoHeight = beforeCanvas.height;
  
  const totalFrames = VIDEO_CONFIG.fps * VIDEO_CONFIG.duration;
  const frames = [];
  
  for (let i = 0; i < totalFrames; i++) {
    const progress = i / (totalFrames - 1);
    const frameCanvas = createTransitionFrame(beforeCanvas, afterCanvas, progress, videoWidth, videoHeight);
    
    // Convert frame to WebP for better compression
    const frameData = frameCanvas.toDataURL('image/webp', 0.8);
    frames.push(frameData);
    
    // Report progress
    onProgress({
      current: i + 1,
      total: totalFrames,
      percentage: Math.round(((i + 1) / totalFrames) * 100)
    });
  }
  
  return frames;
}

/**
 * Creates MP4 video from canvas frames using MediaRecorder API
 */
export async function createVideoFromCanvasFrames(beforeBase64, afterBase64, onProgress = () => {}) {
  return new Promise(async (resolve, reject) => {
    try {
      // Load images first to get their dimensions
      const beforeCanvas = await base64ToCanvas(beforeBase64);
      const afterCanvas = await base64ToCanvas(afterBase64);
      
      // Check if aspect ratios match - if not, use Instagram format
      const aspectRatiosAreMatching = aspectRatiosMatch(
        beforeCanvas.width, beforeCanvas.height,
        afterCanvas.width, afterCanvas.height
      );
      
      // Use original dimensions if aspect ratios match, otherwise use Instagram format
      const videoWidth = aspectRatiosAreMatching ? beforeCanvas.width : REEL_WIDTH;
      const videoHeight = aspectRatiosAreMatching ? beforeCanvas.height : REEL_HEIGHT;
      
      // Create canvas for recording
      const canvas = document.createElement('canvas');
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      const ctx = canvas.getContext('2d');
      
      // If we need to force Instagram ratio, create processed versions of the canvases
      let processedBeforeCanvas = beforeCanvas;
      let processedAfterCanvas = afterCanvas;
      
      if (!aspectRatiosAreMatching) {
        // Create Instagram-sized versions of both images
        processedBeforeCanvas = document.createElement('canvas');
        processedBeforeCanvas.width = REEL_WIDTH;
        processedBeforeCanvas.height = REEL_HEIGHT;
        const beforeCtx = processedBeforeCanvas.getContext('2d');
        
        processedAfterCanvas = document.createElement('canvas');
        processedAfterCanvas.width = REEL_WIDTH;
        processedAfterCanvas.height = REEL_HEIGHT;
        const afterCtx = processedAfterCanvas.getContext('2d');
        
        // Process before image to Instagram ratio
        const beforeScaleX = REEL_WIDTH / beforeCanvas.width;
        const beforeScaleY = REEL_HEIGHT / beforeCanvas.height;
        const beforeScale = Math.max(beforeScaleX, beforeScaleY);
        
        const beforeScaledWidth = beforeCanvas.width * beforeScale;
        const beforeScaledHeight = beforeCanvas.height * beforeScale;
        const beforeOffsetX = (REEL_WIDTH - beforeScaledWidth) / 2;
        const beforeOffsetY = (REEL_HEIGHT - beforeScaledHeight) / 2;
        
        beforeCtx.fillStyle = '#ffffff';
        beforeCtx.fillRect(0, 0, REEL_WIDTH, REEL_HEIGHT);
        beforeCtx.drawImage(beforeCanvas, beforeOffsetX, beforeOffsetY, beforeScaledWidth, beforeScaledHeight);
        
        // Process after image to Instagram ratio
        const afterScaleX = REEL_WIDTH / afterCanvas.width;
        const afterScaleY = REEL_HEIGHT / afterCanvas.height;
        const afterScale = Math.max(afterScaleX, afterScaleY);
        
        const afterScaledWidth = afterCanvas.width * afterScale;
        const afterScaledHeight = afterCanvas.height * afterScale;
        const afterOffsetX = (REEL_WIDTH - afterScaledWidth) / 2;
        const afterOffsetY = (REEL_HEIGHT - afterScaledHeight) / 2;
        
        afterCtx.fillStyle = '#ffffff';
        afterCtx.fillRect(0, 0, REEL_WIDTH, REEL_HEIGHT);
        afterCtx.drawImage(afterCanvas, afterOffsetX, afterOffsetY, afterScaledWidth, afterScaledHeight);
      }
      
      // Set up MediaRecorder with fallback for different browsers
      const stream = canvas.captureStream(VIDEO_CONFIG.fps);
      let mediaRecorder;
      
      // Try different codec options for best compatibility
      const codecOptions = [
        { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 8000000 }, // VP9 highest quality
        { mimeType: 'video/webm;codecs=vp8', videoBitsPerSecond: 5000000 }, // VP8 fallback
        { mimeType: 'video/webm', videoBitsPerSecond: 5000000 }              // Generic WebM
      ];
      
      for (const options of codecOptions) {
        if (MediaRecorder.isTypeSupported(options.mimeType)) {
          mediaRecorder = new MediaRecorder(stream, options);
          break;
        }
      }
      
      const chunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        resolve(videoBlob);
      };
      
      mediaRecorder.onerror = (event) => {
        reject(new Error('MediaRecorder error: ' + event.error));
      };
      
      // Start recording
      mediaRecorder.start();
      
      // Animate the transition
      const totalFrames = VIDEO_CONFIG.fps * VIDEO_CONFIG.duration;
      const frameDuration = 1000 / VIDEO_CONFIG.fps;
      let currentFrame = 0;
      
      const animateFrame = () => {
        if (currentFrame >= totalFrames) {
          mediaRecorder.stop();
          return;
        }
        
        // Hold the first frame for several frames to ensure high-quality start
        const holdFrames = 10; // Hold first frame for 10 frames (~333ms at 30fps)
        if (currentFrame < holdFrames) {
          // Keep drawing the first frame
          const progress = 0;
          const easedProgress = easeInOutQuart(progress);
          const sliderX = easedProgress * videoWidth;
          
          // Clear canvas
          ctx.clearRect(0, 0, videoWidth, videoHeight);
          
          // Draw before image (full quality)
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(processedBeforeCanvas, 0, 0);
          
          currentFrame++;
          setTimeout(animateFrame, frameDuration);
          return;
        }
        
        const progress = currentFrame / (totalFrames - 1);
        const easedProgress = easeInOutQuart(progress);
        const sliderX = easedProgress * videoWidth;
        
        // Clear canvas
        ctx.clearRect(0, 0, videoWidth, videoHeight);
        
        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw before image
        ctx.drawImage(processedBeforeCanvas, 0, 0);
        
        // Draw after image with clipping
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, sliderX, videoHeight);
        ctx.clip();
        ctx.drawImage(processedAfterCanvas, 0, 0);
        ctx.restore();
        
        // Draw slider line
        if (sliderX > 0 && sliderX < videoWidth) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sliderX, 0);
          ctx.lineTo(sliderX, videoHeight);
          ctx.stroke();
        }
        
        // Report progress
        onProgress({
          current: currentFrame + 1,
          total: totalFrames,
          percentage: Math.round(((currentFrame + 1) / totalFrames) * 100)
        });
        
        currentFrame++;
        setTimeout(animateFrame, frameDuration);
      };
      
      // Start animation
      animateFrame();
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Complete video generation pipeline using MediaRecorder
 */
export async function generateReelVideo(beforeBase64, afterBase64, onProgress = () => {}) {
  try {
    // Update progress: Starting video recording
    onProgress({ stage: 'encoding', current: 0, total: 1, percentage: 0 });
    
    const videoBlob = await createVideoFromCanvasFrames(beforeBase64, afterBase64, (frameProgress) => {
      onProgress({
        stage: 'frames',
        ...frameProgress
      });
    });
    
    // Update progress: Complete
    onProgress({ stage: 'complete', current: 1, total: 1, percentage: 100 });
    
    return videoBlob;
  } catch (error) {
    onProgress({ stage: 'error', error: error.message });
    throw error;
  }
}

/**
 * Downloads video blob as MP4 file
 */
export function downloadVideo(videoBlob, filename = 'instagram-reel.webm') {
  const url = URL.createObjectURL(videoBlob);
  const a = document.createElement('a');
  
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Estimates final video file size (rough approximation)
 */
export function estimateVideoSize(frameCount = VIDEO_CONFIG.fps * VIDEO_CONFIG.duration) {
  // Rough estimate: ~50KB per frame for WebP-compressed frames
  return frameCount * 50 * 1024; // in bytes
}
