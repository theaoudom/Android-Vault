"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function NewFeatureModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the modal
    const isDismissed = localStorage.getItem("dismiss_quiz_announcement");
    if (!isDismissed) {
      // Delay opening for better UX
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDontShowAgain = () => {
    localStorage.setItem("dismiss_quiz_announcement", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel max-w-md w-full rounded-3xl p-8 relative overflow-hidden animate-slide-up shadow-2xl">
        {/* Glow Effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
            🧪
          </div>
          
          <h2 className="text-2xl font-bold mb-3">
            New Feature: <span className="text-gradient">Interactive Quizzes</span>
          </h2>
          
          <p className="text-gray-400 mb-8 leading-relaxed">
            Test your Android knowledge with our new interactive quiz mode! 
            Challenge yourself across 7 categories and track your progress.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/quiz"
              onClick={handleClose}
              className="bg-primary hover:bg-primary/80 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20"
            >
              Try it Now
            </Link>
            
            <button
              onClick={handleDontShowAgain}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors py-2"
            >
              Don't show it again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
