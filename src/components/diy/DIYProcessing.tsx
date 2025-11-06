import React, { useState, useEffect } from 'react';
import { Navigation } from '../Navigation';
import { useDIY } from '../../contexts/DIYContext';
import { GenerationResponse } from '../../types/diy';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { Progress } from '../ui/progress';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DIYProcessingProps {
  onNavigateHome: () => void;
  onNavigateToThermometer: () => void;
  onNavigateToDIY: () => void;
  onNavigateToPricing: () => void;
  onNavigateToDIYPreview: () => void;
  onNavigateToDIYCreate: () => void;
}

const WEBHOOK_URL = 'https://thinksid.app.n8n.cloud/webhook/diy-social-proof';

const LOADING_MESSAGES = [
  "Analyzing your customer stories...",
  "Crafting compelling narratives...",
  "Optimizing for conversion...",
  "Almost there..."
];

export const DIYProcessing: React.FC<DIYProcessingProps> = ({
  onNavigateHome,
  onNavigateToThermometer,
  onNavigateToDIY,
  onNavigateToPricing,
  onNavigateToDIYPreview,
  onNavigateToDIYCreate,
}) => {
  const { testimonials, setGenerationId, setPreviewData } = useDIY();
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // If no testimonials, redirect back to create
    if (testimonials.length === 0) {
      toast.error('No testimonials found. Please create your testimonials first.');
      onNavigateToDIYCreate();
      return;
    }

    processTestimonials();
  }, []);

  const processTestimonials = async () => {
    const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-1da61fc8`;
    
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
      }, 1000); // Update every second for ~45 seconds

      // Cycle through messages
      const messageInterval = setInterval(() => {
        setCurrentMessage(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 10000); // Change message every 10 seconds

      // Prepare request body
      const requestBody = {
        testimonials: testimonials.map(t => ({
          customer_name: t.customer_name,
          location: t.location,
          product_service: t.product_service,
          photo_url: t.use_photo_placeholder ? 'placeholder' : t.photo_url,
          context: t.context,
          problem: t.problem,
          solution: t.solution,
          technical_result: t.technical_result,
          meaningful_result: t.meaningful_result,
          quote: t.use_quote_placeholder ? 'placeholder' : t.quote,
        }))
      };

      console.log('Calling N8N webhook with testimonials:', requestBody);

      // Make webhook call
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.statusText}`);
      }

      const data: GenerationResponse = await response.json();
      console.log('Received response from N8N:', data);

      // Validate response
      if (!data.generation_id || !data.html_code || !data.preview_data) {
        throw new Error('Invalid response from server');
      }

      // Save to server using the existing endpoint (which uses service role key)
      try {
        const saveResponse = await fetch(`${SERVER_URL}/diy/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            generation_id: data.generation_id,
            data: {
              generation_id: data.generation_id,
              html_code: data.html_code,
              preview_data: data.preview_data,
              testimonial_count: data.testimonial_count,
              paid: false,
              customer_email: null,
              customer_name: null,
              stripe_session_id: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          }),
        });

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json();
          console.error('Error saving to server:', errorData);
          toast.error('Warning: Failed to save to database, but continuing...');
        } else {
          console.log('Successfully saved to server');
        }
      } catch (saveError) {
        console.error('Error saving to database:', saveError);
        toast.error('Warning: Failed to save to database, but continuing...');
      }

      // Store in context
      setGenerationId(data.generation_id);
      setPreviewData(data.preview_data);

      // Complete progress
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      setProgress(100);

      // Wait a moment to show 100% completion
      setTimeout(() => {
        setIsProcessing(false);
        onNavigateToDIYPreview();
      }, 1000);

    } catch (err) {
      console.error('Error processing testimonials:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsProcessing(false);
      toast.error('Failed to generate carousel. Please try again.');
      
      // Navigate back to create page after showing error
      setTimeout(() => {
        onNavigateToDIYCreate();
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
        currentPage="diy"
      />

      {/* Spacer for fixed nav */}
      <div style={{ height: '80px' }} />

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#5b81ff] mb-1">Step 2 of 3</div>
              <h2 className="text-2xl text-[#1c1c60]">Processing Your Carousel</h2>
            </div>
            <div className="flex gap-2">
              <div className="w-24 h-2 bg-[#5b81ff] rounded-full"></div>
              <div className="w-24 h-2 bg-[#5b81ff] rounded-full"></div>
              <div className="w-24 h-2 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

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
            <h3 className="text-2xl text-[#1c1c60] mb-4">Processing Failed</h3>
            <p className="text-gray-600 mb-2">{error}</p>
            <p className="text-sm text-gray-500">Redirecting you back to edit your testimonials...</p>
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
              Creating your custom carousel with {testimonials.length} customer {testimonials.length === 1 ? 'story' : 'stories'}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">AI-powered narrative optimization</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#5b81ff]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#5b81ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Conversion-focused design</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#5b81ff]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#5b81ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Clean, production-ready code</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 bg-gradient-to-br from-[#5b81ff]/5 to-[#ebff82]/10 rounded-lg p-6 border border-[#5b81ff]/20">
              <p className="text-sm text-gray-700 leading-relaxed">
                💡 <strong>Pro tip:</strong> While we're generating your carousel, think about where on your website 
                it will have the most impact. Customer success stories work great on landing pages, pricing pages, 
                and product pages.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};