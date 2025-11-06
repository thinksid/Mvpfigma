import React, { useState, useEffect } from 'react';
import { Navigation } from '../Navigation';
import { ProgressIndicator } from './ProgressIndicator';
import { useDIY } from '../../contexts/DIYContext';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getSupabaseClient } from '../../utils/supabase/client';

interface DIYPreviewProps {
  onNavigateHome: () => void;
  onNavigateToThermometer: () => void;
  onNavigateToDIY: () => void;
  onNavigateToPricing: () => void;
  onNavigateToDIYDownload: () => void;
  onNavigateToDIYCreate: () => void;
}

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-1da61fc8`;

// Stripe Buy Button configuration
const STRIPE_BUY_BUTTON_ID = 'buy_btn_1SQInZ1epFGDXBkyWumuKai2';
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51SQ8RN1epFGDXBkybYp7vZzL0d73nEGxk7PHPsuX9trliPFpUTKFMkkTs0f1llKjZeYs9kDKHiHYfrpS1I2XwEE300ai8lQfJr';

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'buy-button-id': string;
        'publishable-key': string;
      };
    }
  }
}

export const DIYPreview: React.FC<DIYPreviewProps> = ({
  onNavigateHome,
  onNavigateToThermometer,
  onNavigateToDIY,
  onNavigateToPricing,
  onNavigateToDIYDownload,
  onNavigateToDIYCreate,
}) => {
  const sb = getSupabaseClient();
  const { generationId: contextGenerationId, htmlCode: contextHtmlCode } = useDIY();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [testimonialCount, setTestimonialCount] = useState<number>(0);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    loadPreview();
    loadStripeScript();
  }, []);

  const loadStripeScript = () => {
    // Check if script already exists
    if (document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]')) {
      setStripeLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    script.onload = () => setStripeLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Stripe script');
      toast.error('Failed to load payment system. Please refresh the page.');
    };
    document.body.appendChild(script);
  };

  const loadPreview = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 === LOADING PREVIEW ===');
      console.log('Context generationId:', contextGenerationId);
      console.log('Context htmlCode:', contextHtmlCode ? `${contextHtmlCode.length} chars` : 'null');

      // ✅ FIX: Use HTML from context if available
      if (contextHtmlCode && contextHtmlCode.trim().length > 0) {
        console.log('✅ Using HTML code from context (skipping database query)');
        setHtmlCode(contextHtmlCode);
        setLoading(false);
        return;
      }

      // ✅ FIX: Try to get generation_id from context first, then URL, then error
      const urlParams = new URLSearchParams(window.location.search);
      const urlGenerationId = urlParams.get('id');
      const idToFetch = contextGenerationId || urlGenerationId;

      console.log('Generation ID sources:');
      console.log('  - Context:', contextGenerationId);
      console.log('  - URL:', urlGenerationId);
      console.log('  - Using:', idToFetch);

      if (!idToFetch) {
        console.error('❌ No generation ID found');
        throw new Error('No generation ID found. Please create a carousel first.');
      }

      // ✅ FALLBACK: Fetch from Supabase KV store directly (bypasses RLS issue with server)
      console.log('🔄 Fetching from Supabase KV store...');
      const kvKey = `diy_generation:${idToFetch}`;
      console.log('🔑 KV Key:', kvKey);

      const { data, error: dbError } = await sb
        .from('kv_store_1da61fc8')
        .select('value')
        .eq('key', kvKey)
        .maybeSingle();

      console.log('📥 Supabase query result:');
      console.log('  - Error:', dbError);
      console.log('  - Data:', data);

      if (dbError || !data) {
        console.error('❌ Failed to load from Supabase KV store');
        console.error('  - Error details:', dbError);
        console.error('  - Data received:', data);
        throw new Error('Carousel not found. Please generate a new one.');
      }

      const generationData = data.value as any;
      console.log('✅ Generation data loaded from Supabase');
      console.log('📊 Data keys:', Object.keys(generationData));

      if (!generationData.html_code) {
        console.error('❌ HTML code not found in generation data');
        console.error('Available keys:', Object.keys(generationData));
        throw new Error('HTML code not found. Please wait for processing to complete.');
      }

      console.log('✅ HTML code found:', generationData.html_code.length, 'chars');
      setHtmlCode(generationData.html_code);
      setTestimonialCount(generationData.testimonial_count || 0);
      setLoading(false);
      console.log('=== LOADING PREVIEW COMPLETE ===');
    } catch (err) {
      console.error('💥 Error in loadPreview:', err);
      console.error('Error details:', err instanceof Error ? err.message : 'Unknown error');
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setLoading(false);
      toast.error('Failed to load carousel preview');
    }
  };

  // Update iframe when HTML changes
  useEffect(() => {
    if (iframeRef.current && htmlCode) {
      console.log('📺 Updating iframe with HTML code');
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlCode);
        iframeDoc.close();
      }
    }
  }, [htmlCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation
          onNavigateHome={onNavigateHome}
          onNavigateToThermometer={onNavigateToThermometer}
          onNavigateToDIY={onNavigateToDIY}
          onNavigateToPricing={onNavigateToPricing}
          currentPage="diy"
        />
        <div style={{ height: '80px' }} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#5b81ff] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your carousel preview...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation
          onNavigateHome={onNavigateHome}
          onNavigateToThermometer={onNavigateToThermometer}
          onNavigateToDIY={onNavigateToDIY}
          onNavigateToPricing={onNavigateToPricing}
          currentPage="diy"
        />
        <div style={{ height: '80px' }} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-2xl text-[#1c1c60] mb-4">Unable to Load Preview</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={onNavigateToDIYCreate}
              className="bg-[#5b81ff] text-white hover:bg-[#4a6fe0]"
            >
              Create New Carousel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
      <ProgressIndicator currentStep={2} />

      {/* Preview Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Info Banner */}
        <div className="bg-gradient-to-br from-[#5b81ff]/5 to-[#ebff82]/10 rounded-lg p-6 mb-8 border border-[#5b81ff]/20">
          <h3 className="text-lg text-[#1c1c60] mb-2">
            🎉 Your Carousel is Ready!
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Review your customer success stories below. Use the arrow buttons to navigate through the carousel. 
            When you're satisfied, continue to payment to download the production-ready code.
          </p>
        </div>

        {/* Carousel Preview */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg text-[#1c1c60]">Your Carousel Preview</h3>
            </div>
            <div className="p-0">
              <iframe
                ref={iframeRef}
                className="w-full border-0 bg-white"
                style={{ minHeight: '600px', height: '70vh' }}
                title="Carousel Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-12 max-w-3xl mx-auto">
          <Button
            variant="outline"
            onClick={onNavigateToDIYCreate}
            className="flex items-center justify-center gap-2 h-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>

          {/* Stripe Buy Button */}
          {stripeLoaded ? (
            <div className="flex items-center justify-center">
              <stripe-buy-button
                buy-button-id={STRIPE_BUY_BUTTON_ID}
                publishable-key={STRIPE_PUBLISHABLE_KEY}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-12 bg-[#5b81ff] text-white rounded-md">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Loading payment...
            </div>
          )}
        </div>

        {/* What You'll Get */}
        <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 mb-12">
          <h3 className="text-xl text-[#1c1c60] mb-6">What You'll Get After Payment</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#5b81ff] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-gray-700">Production-ready React component</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#5b81ff] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-gray-700">Clean, well-documented HTML/CSS</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#5b81ff] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-gray-700">Mobile-responsive design</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#5b81ff] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-gray-700">Easy copy-paste integration</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#5b81ff] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-gray-700">Customizable styling options</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#5b81ff] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-gray-700">Lifetime access to your code</p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Mode Button */}
        <div className="pt-4 border-t border-gray-200 w-full max-w-md mx-auto">
          <p className="text-xs text-gray-400 text-center mb-2">Development Testing</p>
          <Button
            variant="outline"
            onClick={onNavigateToDIYDownload}
            className="w-full text-sm border-dashed border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400"
          >
            🧪 Skip to Download Page (Test Mode)
          </Button>
        </div>

        {/* Payment Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            💳 Secure payment powered by Stripe • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default DIYPreview;
