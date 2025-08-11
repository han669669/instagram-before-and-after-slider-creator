import React from 'react';
import { cn } from '../utils/cn';

/**
 * AppIcon Component
 * Reusable brand icon for the Before After Slider app
 * Based on a photo/slider concept with customizable colors and sizes
 */
const AppIcon = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor',
  gradient = false,
  animated = false 
}) => {
  const iconId = `app-icon-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <svg
      className={cn(
        animated && 'transition-all duration-300 hover:scale-110',
        className
      )}
      width={size}
      height={size}
      viewBox="0 0 391.377 391.377"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {gradient && (
        <defs>
          <linearGradient id={`gradient-${iconId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" stopOpacity="1" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="1" />
          </linearGradient>
        </defs>
      )}
      <g fill={gradient ? `url(#gradient-${iconId})` : color}>
        <path d="M387.456,91.78c-3.739-6.178-9.648-10.526-16.638-12.245L162.499,28.298c-2.106-0.519-4.27-0.781-6.433-0.781c-12.471,0-23.259,8.45-26.235,20.551l-6.271,25.498L19.405,106.616c-13.918,4.416-22.089,18.982-18.602,33.163l50.1,203.696c1.733,7.046,6.122,12.958,12.358,16.647c4.182,2.474,8.837,3.737,13.564,3.737c2.324,0,4.667-0.306,6.977-0.923l160.436-42.907l63.58,15.638c2.106,0.519,4.271,0.781,6.435,0.781c12.471,0,23.259-8.451,26.233-20.55l50.102-203.698C392.307,105.211,391.195,97.959,387.456,91.78z M79.246,333.102L30.421,134.595l84.742-26.89L79.732,251.763c-1.721,6.99-0.608,14.243,3.131,20.422c3.738,6.178,9.646,10.527,16.639,12.247l84.249,20.721L79.246,333.102z M335.706,209.731l-28.492-43.88c-3.492-5.379-9.295-8.59-15.523-8.59c-4.229,0-8.271,1.438-11.69,4.157l-60.656,48.255c-1.82,1.449-4.045,2.215-6.434,2.215c-3.137,0-6.058-1.336-8.014-3.663l-22.981-27.35c-4.406-5.242-11.464-8.372-18.879-8.372c-3.661,0-7.207,0.803-10.254,2.32l-26.477,13.193l31.942-129.871L360.74,107.95L335.706,209.731z"/>
        <path d="M207.988,145.842c2.114,0.52,4.282,0.783,6.442,0.783c12.406,0,23.143-8.423,26.109-20.483c3.542-14.405-5.295-29.008-19.7-32.552c-2.114-0.52-4.282-0.783-6.442-0.783c-12.406,0-23.143,8.423-26.109,20.483C184.746,127.695,193.583,142.298,207.988,145.842z"/>
      </g>
    </svg>
  );
};

// Simplified version for smaller sizes (loader, buttons, etc.)
export const AppIconSimple = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="6" width="18" height="12" rx="2" stroke={color} strokeWidth="2"/>
      <circle cx="8" cy="11" r="1.5" fill={color}/>
      <path d="M3 14L8 11L12 13L18 9L21 11" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="6" x2="12" y2="18" stroke={color} strokeWidth="2" strokeOpacity="0.5"/>
    </svg>
  );
};

// Loading animation version
export const AppIconLoader = ({ className = '', size = 48 }) => {
  return (
    <div className={cn("relative", className)}>
      <svg
        className="animate-pulse"
        width={size}
        height={size}
        viewBox="0 0 391.377 391.377"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" stopOpacity="0.5">
              <animate attributeName="stop-opacity" 
                values="0.5;1;0.5" 
                dur="2s" 
                repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="1">
              <animate attributeName="stop-opacity" 
                values="1;0.5;1" 
                dur="2s" 
                repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
        <g fill="url(#loader-gradient)">
          <path d="M387.456,91.78c-3.739-6.178-9.648-10.526-16.638-12.245L162.499,28.298c-2.106-0.519-4.27-0.781-6.433-0.781c-12.471,0-23.259,8.45-26.235,20.551l-6.271,25.498L19.405,106.616c-13.918,4.416-22.089,18.982-18.602,33.163l50.1,203.696c1.733,7.046,6.122,12.958,12.358,16.647c4.182,2.474,8.837,3.737,13.564,3.737c2.324,0,4.667-0.306,6.977-0.923l160.436-42.907l63.58,15.638c2.106,0.519,4.271,0.781,6.435,0.781c12.471,0,23.259-8.451,26.233-20.55l50.102-203.698C392.307,105.211,391.195,97.959,387.456,91.78z M79.246,333.102L30.421,134.595l84.742-26.89L79.732,251.763c-1.721,6.99-0.608,14.243,3.131,20.422c3.738,6.178,9.646,10.527,16.639,12.247l84.249,20.721L79.246,333.102z M335.706,209.731l-28.492-43.88c-3.492-5.379-9.295-8.59-15.523-8.59c-4.229,0-8.271,1.438-11.69,4.157l-60.656,48.255c-1.82,1.449-4.045,2.215-6.434,2.215c-3.137,0-6.058-1.336-8.014-3.663l-22.981-27.35c-4.406-5.242-11.464-8.372-18.879-8.372c-3.661,0-7.207,0.803-10.254,2.32l-26.477,13.193l31.942-129.871L360.74,107.95L335.706,209.731z"/>
          <path d="M207.988,145.842c2.114,0.52,4.282,0.783,6.442,0.783c12.406,0,23.143-8.423,26.109-20.483c3.542-14.405-5.295-29.008-19.7-32.552c-2.114-0.52-4.282-0.783-6.442-0.783c-12.406,0-23.143,8.423-26.109,20.483C184.746,127.695,193.583,142.298,207.988,145.842z"/>
        </g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-purple-600 rounded-full animate-ping"></div>
      </div>
    </div>
  );
};

export default AppIcon;
