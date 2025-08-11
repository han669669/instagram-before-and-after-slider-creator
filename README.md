# 📸 Instagram Before/After Reel Creator

A powerful web application that transforms your before & after photos into stunning Instagram Reels with smooth sliding transitions. No watermarks, no hassle - just beautiful content ready to share!

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.0-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### 🎬 Core Functionality
- **Before/After Slider Videos**: Create smooth, professional sliding transition videos from two photos
- **Interactive Preview**: Real-time preview with draggable slider to see your transition before generating
- **Instagram Optimized**: Automatically handles aspect ratios and dimensions for perfect Instagram Reels
- **No Watermarks**: Clean, professional output ready for your social media

### 🛠️ Technical Features
- **Smart Image Processing**: Automatic image compression and optimization
- **Aspect Ratio Handling**: Intelligent detection and correction of mismatched aspect ratios
- **WebM Video Export**: High-quality video generation using MediaRecorder API
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Drag & Drop Interface**: Easy file upload with visual feedback

### 🎨 User Experience
- **Live Animation Preview**: Play button to preview the transition animation
- **Progress Tracking**: Real-time video generation progress indicator
- **Example Images**: Built-in example generator to test the app instantly
- **Error Handling**: Clear error messages and recovery options
- **One-Click Download**: Simple download of generated videos

## 🚀 Tech Stack

### Frontend Framework
- **React 19.1.1** - Latest React with hooks and modern features
- **Vite 7.1.0** - Lightning-fast build tool and dev server
- **JavaScript (ES6+)** - Modern JavaScript with modules

### Styling & UI
- **TailwindCSS 3.4.17** - Utility-first CSS framework
- **Lucide React** - Beautiful, consistent icon library
- **Radix UI** - Unstyled, accessible UI components
- **Class Variance Authority** - Dynamic className management

### State Management
- **Zustand 5.0.7** - Lightweight, performant state management
- Custom hooks for modular state access

### Image & Video Processing
- **Canvas API** - For image manipulation and processing
- **MediaRecorder API** - For video generation
- **WebP/JPEG Compression** - Optimized image formats

### Development Tools
- **ESLint 9.32.0** - Code quality and consistency
- **PostCSS & Autoprefixer** - CSS processing and compatibility
- **React Plugin for Vite** - Fast Refresh and React optimization

## 📁 Project Structure

```
instagram-before-after-slider/
├── src/
│   ├── components/
│   │   ├── Button.jsx           # Reusable button component
│   │   ├── DropZone.jsx         # Drag-and-drop file upload
│   │   ├── Progress.jsx         # Video generation progress
│   │   ├── ReelPreview.jsx      # Full preview component
│   │   └── SimpleReelPreview.jsx # Canvas-based preview
│   ├── stores/
│   │   └── appStore.js          # Zustand state management
│   ├── utils/
│   │   ├── cn.js                # ClassName utility
│   │   ├── exampleImages.js     # Example image generator
│   │   ├── imageProcessor.js    # Image processing logic
│   │   └── videoGenerator.js    # Video creation logic
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles & Tailwind imports
├── public/                      # Static assets
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind customization
├── eslint.config.js            # ESLint rules
├── postcss.config.js           # PostCSS configuration
└── package.json                # Dependencies & scripts
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/instagram-before-after-slider.git
cd instagram-before-after-slider
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open in browser**
```
http://localhost:5173
```

### Production Build

```bash
npm run build
# or
yarn build
```

Preview production build:
```bash
npm run preview
# or
yarn preview
```

## 🎯 How to Use

1. **Upload Images**
   - Click or drag-drop to upload your original photo
   - Upload your edited version in the second slot
   - Or click "Use Example Photos" to test with demo images

2. **Preview Transition**
   - Use the interactive slider to preview the effect
   - Click "Play" to see the animated transition
   - Adjust slider manually for precise control

3. **Generate Video**
   - Click "Create Instagram Reel" to generate your video
   - Watch real-time progress as frames are created

4. **Download & Share**
   - Preview the final video with controls
   - Click "Download Instagram Reel" to save
   - Share directly to Instagram as a Reel!

## 💡 Key Features Explained

### Image Processing Pipeline
- Validates file size (max 10MB) and format (JPG, PNG, WebP)
- Preserves original dimensions when aspect ratios match
- Automatically rescales to Instagram format (1080x1920) when needed
- Applies smart compression for optimal quality/size balance

### Video Generation Process
- Creates 90 frames (30fps × 3 seconds) for smooth transitions
- Uses cubic-bezier easing for professional motion
- Applies high-quality image smoothing
- Generates WebM format with VP9/VP8 codec

### State Management Architecture
- Centralized Zustand store for global state
- Modular hooks for specific state slices
- Automatic cleanup of blob URLs
- Error boundary implementation

## 🎨 Customization Options

### Modify Video Settings
Edit `src/utils/videoGenerator.js`:
```javascript
export const VIDEO_CONFIG = {
  fps: 30,        // Frames per second
  duration: 3,    // Duration in seconds
  transition: {
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    direction: 'horizontal'
  }
};
```

### Adjust Instagram Dimensions
Edit `src/utils/imageProcessor.js`:
```javascript
export const REEL_WIDTH = 1080;
export const REEL_HEIGHT = 1920;
```

### Customize Theme Colors
Modify `tailwind.config.js` for brand colors and styling.

## 🐛 Known Issues & Solutions

### Browser Compatibility
- **WebM Support**: The app generates WebM videos which work on most modern browsers
- **MediaRecorder API**: Required for video generation (check browser compatibility)

### Performance Optimization
- Large images are automatically compressed
- Canvas operations are optimized for performance
- Progress indicators prevent UI freezing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React and Vite for optimal performance
- Icons by Lucide React
- UI components inspired by Radix UI
- Styling powered by TailwindCSS

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the maintainers

---

**Made with ❤️ for content creators**

*Transform your edits into engaging Instagram Reels in seconds!*
