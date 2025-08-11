import React from 'react';
import { Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import AppIcon from './AppIcon';

const HeroSection = ({ onGetStarted, onLoadExample }) => {
  const features = [
    { icon: Zap, text: "Instant creation", color: "text-yellow-600" },
    { icon: Shield, text: "No watermarks", color: "text-green-600" },
    { icon: Sparkles, text: "HD quality", color: "text-purple-600" }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-2xl p-8 lg:p-12 mb-8">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Free Forever • No Sign-up Required
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Transform Your Photos into
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> Viral Reels</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl">
            Create stunning before/after Instagram Reels with smooth sliding transitions. 
            Join 50,000+ creators making engaging content in seconds.
          </p>
          
          {/* Features list */}
          <div className="flex flex-wrap gap-4 mb-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
                <span className="text-sm font-medium text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              onClick={onGetStarted}
              className="px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              Start Creating Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              onClick={onLoadExample}
              className="px-8 py-3 text-base font-semibold border-2"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              See Example
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center">
                <span className="text-green-500 mr-1">●</span>
                2.5M+ videos created
              </span>
              <span className="flex items-center">
                <span className="text-green-500 mr-1">●</span>
                4.8/5 rating
              </span>
              <span className="flex items-center">
                <span className="text-green-500 mr-1">●</span>
                Used by top influencers
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
