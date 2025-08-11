// Example images utility
// Loads actual example images from the public folder

// Load image from URL and convert to base64
const loadImageAsBase64 = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Handle CORS if needed
    
    img.onload = () => {
      // Create canvas to convert image to base64
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions to match image
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0);
      
      // Convert to base64
      const base64Data = canvas.toDataURL('image/jpeg', 0.9);
      
      resolve({
        base64: base64Data,
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: Math.round(base64Data.length * 0.75), // Approximate file size
        type: 'image/jpeg'
      });
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${imageUrl}`));
    };
    
    img.src = imageUrl;
  });
};

// Load example images from public folder
export const loadExampleImages = async () => {
  try {
    const [beforeImageData, afterImageData] = await Promise.all([
      loadImageAsBase64('/before.jpg'),
      loadImageAsBase64('/after.jpg')
    ]);
    
    return {
      before: {
        ...beforeImageData,
        name: 'example-before.jpg'
      },
      after: {
        ...afterImageData,
        name: 'example-after.jpg'
      }
    };
  } catch (error) {
    throw new Error(`Failed to load example images: ${error.message}`);
  }
};

// Backward compatibility - use the async loader
export const getExampleImages = async () => {
  return await loadExampleImages();
};

// Main function to use - loads real images from public folder
export const createRealisticExampleImages = async () => {
  return await loadExampleImages();
};
