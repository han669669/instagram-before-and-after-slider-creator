import { create } from 'zustand';

const initialState = {
  // Images
  beforeImage: null, // { base64, originalSize, processedSize, dimensions }
  afterImage: null,
  
  // UI State
  isProcessing: false,
  isGeneratingVideo: false,
  error: null,
  
  // Video generation progress
  videoProgress: {
    stage: null, // 'frames' | 'encoding' | 'complete' | 'error'
    current: 0,
    total: 0,
    percentage: 0
  },
  
  // Generated video
  generatedVideo: null, // Blob
  
  // Settings
  settings: {
    videoQuality: 0.8,
    includeSliderLine: true
  }
};

export const useAppStore = create((set, get) => ({
  ...initialState,
      
      // Image Management
      setBeforeImage: (imageData) => {
        const state = get();
        if (state.generatedVideo) {
          URL.revokeObjectURL(state.generatedVideo);
        }
        set({ beforeImage: imageData, error: null, generatedVideo: null });
      },
      
      setAfterImage: (imageData) => {
        const state = get();
        if (state.generatedVideo) {
          URL.revokeObjectURL(state.generatedVideo);
        }
        set({ afterImage: imageData, error: null, generatedVideo: null });
      },
      
      clearImages: () => {
        const state = get();
        if (state.generatedVideo) {
          URL.revokeObjectURL(state.generatedVideo);
        }
        set({
          beforeImage: null,
          afterImage: null,
          error: null,
          generatedVideo: null
        });
      },
      
      // Video Management
      setGeneratedVideo: (videoBlob) => {
        set({ generatedVideo: videoBlob });
      },
      
      clearVideo: () => {
        if (get().generatedVideo) {
          URL.revokeObjectURL(get().generatedVideo);
        }
        set({ generatedVideo: null });
      },
      
      // Processing States
      setProcessing: (isProcessing) => {
        set({ isProcessing });
      },
      
      setGeneratingVideo: (isGenerating) => {
        set({ isGeneratingVideo: isGenerating });
        if (!isGenerating) {
          set({ videoProgress: initialState.videoProgress });
        }
      },
      
      setVideoProgress: (progress) => {
        set({ videoProgress: progress });
      },
      
      // Error Management
      setError: (error) => {
        set({ 
          error,
          isProcessing: false,
          isGeneratingVideo: false
        });
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      // Settings
      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },
      
      // Computed properties are not needed in Zustand, we'll handle them in hooks
      canGenerateVideo: false, // We'll compute this in the hook
      
      // Reset entire state
      reset: () => {
        const state = get();
        if (state.generatedVideo) {
          URL.revokeObjectURL(state.generatedVideo);
        }
        set(initialState);
      }
}));

// Utility hooks for specific state slices - using shallow comparison to prevent infinite loops
export const useImages = () => {
  const beforeImage = useAppStore(state => state.beforeImage);
  const afterImage = useAppStore(state => state.afterImage);
  const setBeforeImage = useAppStore(state => state.setBeforeImage);
  const setAfterImage = useAppStore(state => state.setAfterImage);
  const clearImages = useAppStore(state => state.clearImages);
  
  return { beforeImage, afterImage, setBeforeImage, setAfterImage, clearImages };
};

export const useVideoGeneration = () => {
  const isGeneratingVideo = useAppStore(state => state.isGeneratingVideo);
  const videoProgress = useAppStore(state => state.videoProgress);
  const generatedVideo = useAppStore(state => state.generatedVideo);
  const setGeneratingVideo = useAppStore(state => state.setGeneratingVideo);
  const setVideoProgress = useAppStore(state => state.setVideoProgress);
  const setGeneratedVideo = useAppStore(state => state.setGeneratedVideo);
  const clearVideo = useAppStore(state => state.clearVideo);
  
  return {
    isGeneratingVideo,
    videoProgress,
    generatedVideo,
    setGeneratingVideo,
    setVideoProgress,
    setGeneratedVideo,
    clearVideo
  };
};

export const useProcessing = () => {
  const isProcessing = useAppStore(state => state.isProcessing);
  const setProcessing = useAppStore(state => state.setProcessing);
  
  return { isProcessing, setProcessing };
};

export const useError = () => {
  const error = useAppStore(state => state.error);
  const setError = useAppStore(state => state.setError);
  const clearError = useAppStore(state => state.clearError);
  
  return { error, setError, clearError };
};
