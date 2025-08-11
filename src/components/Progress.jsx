import React from 'react';
import { cn } from '../utils/cn';

const Progress = ({ value = 0, className, ...props }) => {
  return (
    <div
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-gray-200",
        className
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-purple-600 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  );
};

const VideoGenerationProgress = ({ videoProgress, className }) => {
  const { stage, current, total, percentage, error } = videoProgress;

  if (!stage || stage === 'complete') {
    return null;
  }

  if (error) {
    return (
      <div className={cn("text-center p-4 bg-red-50 rounded-lg", className)}>
        <p className="text-sm text-red-800 font-medium">Error generating video</p>
        <p className="text-xs text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  const getStageText = () => {
    switch (stage) {
      case 'frames':
        return `Generating frames (${current}/${total})`;
      case 'encoding':
        return 'Encoding video...';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className={cn("space-y-3 p-4 bg-gray-50 rounded-lg", className)}>
      <div className="text-center">
        <p className="text-sm font-medium">{getStageText()}</p>
        <p className="text-xs text-gray-600 mt-1">{percentage}% complete</p>
      </div>
      
      <Progress value={percentage} className="w-full" />
      
      {stage === 'frames' && (
        <div className="flex justify-center">
          <div className="animate-pulse text-xs text-gray-500">
            Creating transition frames...
          </div>
        </div>
      )}
      
      {stage === 'encoding' && (
        <div className="flex justify-center">
          <div className="animate-pulse text-xs text-gray-500">
            Compiling MP4 video...
          </div>
        </div>
      )}
    </div>
  );
};

export { Progress, VideoGenerationProgress };
