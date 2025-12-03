import React, { useState, useEffect } from 'react';
import { Navigation } from '../Navigation';
import { Loader2 } from 'lucide-react';
import { toast } from '../ui/sonner';
import { useDIY } from '../../contexts/DIYContext';
import { Progress } from '../ui/progress-simple';

interface GenerationResponse {
  generation_id: string;
  html_code: string;
  preview_data: any;
}

interface DIYProcessingProps {
  onNavigateHome: () => void;
  onNavigateToThermometer: () => void;
  onNavigateToDIY: () => void;
  onNavigateToPricing: () => void;
  onNavigateToDIYPreview: (generationId?: string) => void;
  onNavigateToDIYCreate: () => void;
}

// ✅ SIMPLIFIED: Only N8N webhook needed
const WEBHOOK_URL = 'https://thinksid.app.n8n.cloud/webhook/diy-social-proof';

const LOADING_MESSAGES = [
  "Analyzing your customer stories...",
  "Crafting compelling narratives...",
  "Optimizing for conversion...",
  "Designing your carousel...",
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
  const { testimonials, setGenerationId, setPreviewData, setHtmlCode } = useDIY();
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
    try {
      console.log('🚀 ========== DIY PROCESSING START ==========');
      console.log('📊 Testimonials:', testimonials);
      console.log('🔗 Webhook URL:', WEBHOOK_URL);
      
      // Start progress bar animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90; // Hold at 90% until response
          }
          return prev + 2; // Increment by 2% every interval
        });
      }, 800); // Update every 800ms for smooth animation

      // Cycle through messages
      const messageInterval = setInterval(() => {
        setCurrentMessage(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 8000); // Change message every 8 seconds

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

      console.log('📤 Sending to N8N:', JSON.stringify(requestBody, null, 2));

      // ✅ Call N8N webhook - it handles everything (generation + save to Supabase)
      console.log('⏳ Calling N8N webhook...');
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 N8N Response Status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ N8N Error Response:', errorText);
        throw new Error(`Webhook request failed: ${response.statusText}`);
      }

      const data: GenerationResponse = await response.json();
      console.log('✅ N8N Response Data:', JSON.stringify(data, null, 2));

      // Validate response
      if (!data.generation_id || !data.html_code || !data.preview_data) {
        console.error('❌ Invalid response - missing fields:', {
          has_generation_id: !!data.generation_id,
          has_html_code: !!data.html_code,
          has_preview_data: !!data.preview_data,
          actual_data: data
        });
        throw new Error('Invalid response from server');
      }

      console.log('✅ Response validated successfully');
      console.log('🆔 Generation ID:', data.generation_id);
      console.log('📝 HTML Code length:', data.html_code.length);
      console.log('📊 Preview data:', data.preview_data);

      // ✅ N8N already saved to diy_generations table - no extra save needed!
      console.log('💾 N8N has saved to diy_generations table with generation_id:', data.generation_id);

      // Store in context
      console.log('🔄 Setting generation ID in context:', data.generation_id);
      setGenerationId(data.generation_id);
      
      console.log('🔄 Setting preview data in context:', data.preview_data);
      setPreviewData(data.preview_data);

      console.log('🔄 Setting HTML code in context:', data.html_code);
      setHtmlCode(data.html_code);

      console.log('✅ Context updated successfully');

      // Complete progress
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      setProgress(100);

      console.log('📊 Progress set to 100%');

      // Wait to show 100% completion
      setTimeout(() => {
        console.log('🎯 Navigating to preview page...');
        console.log('🔍 Final check - generationId being passed:', data.generation_id);
        console.log('🔍 Final check - previewData being passed:', data.preview_data);
        setIsProcessing(false);
        onNavigateToDIYPreview(data.generation_id);
        console.log('✅ Navigation triggered');
        console.log('========== DIY PROCESSING COMPLETE ==========');
      }, 1000);

    } catch (err) {
      console.error('💥 ========== DIY PROCESSING ERROR ==========');
      console.error('Error:', err);
      console.error('Error message:', err instanceof Error ? err.message : 'Unknown error');
      console.error('Error stack:', err instanceof Error ? err.stack : 'No stack');
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
            <h3 className="text-2xl text-[#1c1c60] mb-4">Generation Failed</h3>
            <p className="text-gray-600 mb-2">{error}</p>
            <p className="text-sm text-gray-500">Redirecting you back...</p>
          </div>
        ) : (
          // Loading State
          <div className="text-center">
            {/* Animated Icon - matching thermometer style */}
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
              Creating your personalized carousel with {testimonials.length} {testimonials.length === 1 ? 'testimonial' : 'testimonials'}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">AI-powered story optimization</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#5b81ff]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#5b81ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Professional carousel design</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#5b81ff]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#5b81ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Ready-to-embed code</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 bg-gradient-to-br from-[#5b81ff]/5 to-[#ebff82]/10 rounded-lg p-6 border border-[#5b81ff]/20">
              <p className="text-sm text-gray-700 leading-relaxed">
                💡 <strong>Did you know?</strong> Customer testimonials in carousel format can increase 
                trust and credibility by up to 72%. We're crafting an engaging experience that 
                highlights your customer success stories.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DIYProcessing;