import React, { useState, useEffect } from 'react';
import { Navigation } from '../Navigation';
import { useDIY } from '../../contexts/DIYContext';
import { GenerationResponse } from '../../types/diy';
import { publicAnonKey } from '../../utils/supabase/info';
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

// ✅ SIMPLIFIED: Only N8N webhook needed
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

      // ✅ Call N8N webhook - it handles everything (generation + save to Supabase)
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

      // Validate response
      if (!data.generation_id || !data.html_code || !data.preview_data) {
        throw new Error('Invalid response from server');
      }

      // ✅ N8N already saved to Supabase - no extra save needed!
      console.log('Carousel generated successfully:', data.generation_id);

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
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Generation Failed</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={onNavigateToDIYCreate}
            className="px-6 py-3 bg-[#5b81ff] text-white rounded-lg hover:bg-[#4a6fd9]"
          >
            Back to Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
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
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <Loader2 className="h-16 w-16 animate-spin text-[#5b81ff] mx-auto mb-4" />
          </div>

          <h2 className="text-3xl font-bold text-[#1c1c60] mb-4">
            Creating Your Carousel
          </h2>

          <p className="text-lg text-gray-600 mb-8 animate-pulse min-h-[1.75rem]">
            {LOADING_MESSAGES[currentMessage]}
          </p>

          <Progress value={progress} className="mb-6 h-3" />

          <p className="text-sm text-gray-500">
            This takes about 45 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default DIYProcessing;
