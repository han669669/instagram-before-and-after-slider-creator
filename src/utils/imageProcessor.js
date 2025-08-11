// Instagram Reel dimensions
export const REEL_WIDTH = 1080;
export const REEL_HEIGHT = 1920;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates image file size and format
 */
export function validateImage(file) {
  if (!file) return { valid: false, error: 'No file provided' };
  
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large (max 10MB)' };
  }
  
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return { valid: false, error: 'Unsupported format. Use JPG, PNG, or WebP' };
  }
  
  return { valid: true };
}

/**
 * Loads image file and returns HTMLImageElement
 */
export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

/**
 * Processes image preserving original dimensions
 * Only scales to Instagram format if forceInstagramRatio is true
 */
export function processImageForReel(img, forceInstagramRatio = false) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (forceInstagramRatio) {
    // Force Instagram Reel aspect ratio (9:16)
    canvas.width = REEL_WIDTH;
    canvas.height = REEL_HEIGHT;
    
    // Calculate scaling to fit the shorter dimension
    const scaleX = REEL_WIDTH / img.width;
    const scaleY = REEL_HEIGHT / img.height;
    const scale = Math.max(scaleX, scaleY); // Use larger scale to cover entire area
    
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    
    // Center the image
    const offsetX = (REEL_WIDTH - scaledWidth) / 2;
    const offsetY = (REEL_HEIGHT - scaledHeight) / 2;
    
    // Fill with white background first (in case image doesn't cover everything)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, REEL_WIDTH, REEL_HEIGHT);
    
    // Draw the scaled and centered image
    ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
  } else {
    // Preserve original dimensions
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw image at original size
    ctx.drawImage(img, 0, 0);
  }
  
  return canvas;
}

/**
 * Compresses canvas to base64 with quality optimization
 */
export function canvasToCompressedBase64(canvas, quality = 0.85) {
  // Try WebP first (better compression)
  try {
    const webpData = canvas.toDataURL('image/webp', quality);
    if (webpData !== 'data:,') return webpData;
  } catch (e) {
    // WebP not supported, fallback to JPEG
  }
  
  return canvas.toDataURL('image/jpeg', quality);
}

/**
 * Estimates storage size of image data
 */
export function estimateStorageSize(base64Data) {
  // Base64 adds ~33% overhead
  return Math.round(base64Data.length * 0.75);
}

/**
 * Calculates aspect ratio of dimensions
 */
export function getAspectRatio(width, height) {
  return width / height;
}

/**
 * Checks if two aspect ratios are similar (within 5% tolerance)
 */
export function aspectRatiosMatch(width1, height1, width2, height2) {
  const ratio1 = getAspectRatio(width1, height1);
  const ratio2 = getAspectRatio(width2, height2);
  const tolerance = 0.05; // 5% tolerance
  
  return Math.abs(ratio1 - ratio2) < tolerance;
}

/**
 * Determines if images need to be rescaled to Instagram format
 */
export function shouldForceInstagramRatio(beforeImage, afterImage) {
  if (!beforeImage || !afterImage) return false;
  
  // If aspect ratios don't match, force Instagram ratio
  return !aspectRatiosMatch(
    beforeImage.width, beforeImage.height,
    afterImage.width, afterImage.height
  );
}

/**
 * Complete image processing pipeline
 */
export async function processImageFile(file, forceInstagramRatio = false) {
  const validation = validateImage(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  const img = await loadImage(file);
  const canvas = processImageForReel(img, forceInstagramRatio);
  const base64 = canvasToCompressedBase64(canvas);
  
  return {
    canvas,
    base64,
    originalSize: file.size,
    processedSize: estimateStorageSize(base64),
    width: canvas.width,
    height: canvas.height,
    originalDimensions: { width: img.width, height: img.height }
  };
}
