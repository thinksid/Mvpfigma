import React, { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { Progress } from './ui/progress';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ThermometerProcessingProps {
  url: string;
  onSuccess: (data: any) => void;
  onNavigateHome: () => void;
  onNavigateToThermometer: () => void;
  onNavigateToDIY: () => void;
  onNavigateToPricing: () => void;
  onError: () => void;
}

const LOADING_MESSAGES = [
  "Scanning your website...",
  "Analyzing social proof elements...",
  "Evaluating storytelling effectiveness...",
  "Calculating your score...",
  "Almost there..."
];

export const ThermometerProcessing: React.FC<ThermometerProcessingProps> = ({
  url,
  onSuccess,
  onNavigateHome,
  onNavigateToThermometer,
  onNavigateToDIY,
  onNavigateToPricing,
  onError,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (!url) {
      toast.error('No URL provided. Please enter a website URL.');
      onError();
      return;
    }

    analyzeWebsite();
  }, []);

  const analyzeWebsite = async () => {
    try {
      // Start progress bar animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90; // Hold at 90% until response
          }
          return prev + 2; // Increment by 2% every interval
        });
      }, 800); // Update every 800ms for ~36 seconds

      // Cycle through messages
      const messageInterval = setInterval(() => {
        setCurrentMessage(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 8000); // Change message every 8 seconds

      // Make API call to webhook
      const response = await fetch('https://thinksid.app.n8n.cloud/webhook/api/scan/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response error:', errorText);
        throw new Error(`Analysis request failed: ${response.statusText}`);
      }

      // Check if response has content before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON response received:', responseText);
        throw new Error('Server returned an invalid response format');
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!responseText || responseText.trim() === '') {
        throw new Error('Server returned an empty response');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', responseText);
        throw new Error('Failed to parse server response');
      }

      console.log('Parsed data:', data);

      // Validate response
      if (!data.scan_id || !data.preview) {
        console.error('Invalid data structure:', data);
        throw new Error('Invalid response from server');
      }

      // Complete progress
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      setProgress(100);

      // Wait a moment to show 100% completion
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess(data);
      }, 1000);

    } catch (err) {
      console.error('Error analyzing website:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsProcessing(false);
      toast.error('Failed to analyze website. Please try again.');
      
      // Navigate back to landing page after showing error
      setTimeout(() => {
        onError();
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Navigation Bar */}
      <Navigation
        onNavigateHome={onNavigateHome}
        onNavigateToThermometer={onNavigateToThermometer}
        onNavigateToDIY={onNavigateToDIY}
        onNavigateToPricing={onNavigateToPricing}
        currentPage="thermometer"
      />

      {/* Spacer for fixed nav */}
      <div style={{ height: '80px' }} />

      {/* Processing Content */}
      <div className="max-w-3xl mx-auto px-6 py-20">
        {error ? (
          // Error State
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-2xl text-[#1c1c60] mb-4">Analysis Failed</h3>
            <p className="text-gray-600 mb-2">{error}</p>
            <p className="text-sm text-gray-500">Redirecting you back...</p>
          </div>
        ) : (
          // Loading State
          <div className="text-center">
            {/* Animated Icon */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5b81ff] to-[#1c1c60] rounded-full opacity-10 animate-pulse"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-[#5b81ff] to-[#1c1c60] rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute inset-8 bg-gradient-to-br from-[#5b81ff] to-[#1c1c60] rounded-full flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
            </div>

            {/* Animated Message */}
            <h3 className="text-3xl text-[#1c1c60] mb-4 animate-pulse">
              {LOADING_MESSAGES[currentMessage]}
            </h3>
            <p className="text-gray-600 mb-12">
              Analyzing <span className="text-[#5b81ff]">{url}</span>
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <Progress value={progress} className="h-3 mb-3" />
              <p className="text-sm text-gray-500">{Math.round(progress)}% complete</p>
            </div>

            {/* Info Cards */}
            <div className="mt-16 grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#5b81ff]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#5b81ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Comprehensive social proof analysis</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#5b81ff]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#5b81ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Evidence-based scoring</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#5b81ff]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#5b81ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Actionable recommendations</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 bg-gradient-to-br from-[#5b81ff]/5 to-[#ebff82]/10 rounded-lg p-6 border border-[#5b81ff]/20">
              <p className="text-sm text-gray-700 leading-relaxed">
                💡 <strong>Did you know?</strong> Websites with effective social proof can see conversion rate 
                improvements of up to 34%. We're analyzing how well your site leverages customer stories, 
                testimonials, and trust signals.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};