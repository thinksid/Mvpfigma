import React, { useState, useEffect, useRef } from 'react';
import { Navigation } from '../Navigation';
import { ProgressIndicator } from './ProgressIndicator';
import { useDIY } from '../../contexts/DIYContext';
import { diyProjectId, diyPublicAnonKey, getDIYSupabaseClient } from '../../utils/supabase/diy-client';
import { Card } from '../ui/card';
import { Button } from '../ui/button-simple';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from '../ui/sonner';
import { HTMLEditor } from './HTMLEditor';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog-simple';
import { Input } from '../ui/input';
import { Label } from '../ui/label-simple';
import { trackDIYCheckoutInitiated } from '../../utils/analytics';

interface DIYPreviewProps {
  onNavigateHome: () => void;
  onNavigateToThermometer: () => void;
  onNavigateToDIY: () => void;
  onNavigateToPricing: () => void;
  onNavigateToDIYDownload: (generationId?: string) => void;
  onNavigateToDIYCreate: () => void;
}

const SERVER_URL = `https://${diyProjectId}.supabase.co/functions/v1/make-server-1da61fc8`;

// Stripe configuration - LIVE KEYS
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51SQ8RN1epFGDXBkybYp7vZzL0d73nEGxk7PHPsuX9trliPFpUTKFMkkTs0f1llKjZeYs9kDKHiHYfrpS1I2XwEE300ai8lQfJr';
const STRIPE_BUY_BUTTON_ID = 'buy_btn_1SQInZ1epFGDXBkyWumuKai2';

// Declare Stripe Buy Button custom element for TypeScript
declare global {
  interface Window {
    Stripe: any;
  }
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': any;
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
  const getSb = () => getDIYSupabaseClient();
  const { generationId: contextGenerationId, htmlCode: contextHtmlCode } = useDIY();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [testimonialCount, setTestimonialCount] = useState<number>(0);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Modal and form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [isSavingVendorInfo, setIsSavingVendorInfo] = useState(false);
  const [isVendorInfoSaved, setIsVendorInfoSaved] = useState(false);
  const [currentGenerationId, setCurrentGenerationId] = useState<string>('');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

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
      console.error('Failed to load Stripe Buy Button script');
      toast.error('Failed to load payment system. Please refresh the page.');
    };
    document.body.appendChild(script);
  };

  const loadPreview = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use HTML from context if available
      if (contextHtmlCode && contextHtmlCode.trim().length > 0) {
        console.log('✅ Using HTML from context');
        setHtmlCode(contextHtmlCode);
        setLoading(false);
        return;
      }

      // Try to get generation_id from context first, then URL
      const urlParams = new URLSearchParams(window.location.search);
      const urlGenerationId = urlParams.get('id');
      const sessionId = urlParams.get('session_id'); // Stripe redirects with session_id
      const idToFetch = contextGenerationId || urlGenerationId;

      console.log('🔍 Looking for generation ID...');
      console.log('  - Context generation ID:', contextGenerationId);
      console.log('  - URL generation ID:', urlGenerationId);
      console.log('  - Stripe session ID:', sessionId);
      console.log('  - ID to fetch:', idToFetch);

      // If we have a Stripe session ID but no generation ID, we need to look it up
      if (sessionId && !idToFetch) {
        console.log('💳 Stripe payment detected, looking up generation from session...');
        
        // Query the database to find the generation associated with this session
        const { data: generationData, error: lookupError } = await getSb()
          .from('diy_generations')
          .select('*')
          .eq('stripe_session_id', sessionId)
          .maybeSingle();

        if (lookupError || !generationData) {
          console.error('❌ Failed to find generation by session ID:', lookupError);
          throw new Error('Unable to find your carousel. Please contact support with your order ID.');
        }

        console.log('✅ Found generation from session:', generationData.generation_id);
        
        // Update context with found data
        if (generationData.html_code) {
          setHtmlCode(generationData.html_code);
          setTestimonialCount(generationData.testimonial_count || 0);
          setLoading(false);
          return;
        }
      }

      if (!idToFetch) {
        console.error('❌ No generation ID found');
        throw new Error('No generation ID found. Please create a carousel first.');
      }

      console.log('📡 Fetching generation from database...');

      // Fetch from diy_generations table
      const { data, error: dbError } = await getSb()
        .from('diy_generations')
        .select('*')
        .eq('generation_id', idToFetch)
        .maybeSingle();

      if (dbError || !data) {
        console.error('❌ Failed to load carousel:', dbError);
        throw new Error('Carousel not found. Please generate a new one.');
      }

      if (!data.html_code) {
        console.error('❌ HTML code not found in generation data');
        throw new Error('HTML code not found. Please wait for processing to complete.');
      }

      console.log('✅ Successfully loaded carousel');
      setHtmlCode(data.html_code);
      setTestimonialCount(data.testimonial_count || 0);
      setLoading(false);
    } catch (err) {
      console.error('💥 Error loading preview:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setLoading(false);
      toast.error('Failed to load carousel preview');
    }
  };

  // Update iframe when HTML changes
  useEffect(() => {
    if (iframeRef.current && htmlCode) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlCode);
        iframeDoc.close();
      }
    }
  }, [htmlCode]);

  // Handle opening the checkout modal
  const handleProceedToCheckout = () => {
    // Get generation ID and store it
    const urlParams = new URLSearchParams(window.location.search);
    const urlGenerationId = urlParams.get('id');
    const generationId = contextGenerationId || urlGenerationId;
    
    if (generationId) {
      setCurrentGenerationId(generationId);
      // Store in localStorage as backup
      localStorage.setItem('pending_generation_id', generationId);
      
      // Track checkout initiation
      trackDIYCheckoutInitiated(generationId, testimonialCount);
    }
    
    setIsModalOpen(true);
  };

  // Validate form
  const isFormValid = () => {
    return (
      vendorName.trim().length > 0 &&
      vendorEmail.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendorEmail) // Basic email validation
    );
  };

  // Save vendor info to database before allowing Stripe checkout
  const handleSaveVendorInfo = async () => {
    if (!isFormValid()) {
      toast.error('Please fill in all fields with valid information');
      return;
    }

    // Get generation ID from context or URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlGenerationId = urlParams.get('id');
    const generationId = contextGenerationId || urlGenerationId;

    if (!generationId) {
      console.error('❌ No generation ID available');
      console.error('  - Context generation ID:', contextGenerationId);
      console.error('  - URL generation ID:', urlGenerationId);
      toast.error('Generation ID not found. Please try again.');
      return;
    }

    setIsSavingVendorInfo(true);

    try {
      console.log('💾 Saving vendor info directly to database...');
      console.log('  - Generation ID:', generationId);
      console.log('  - Vendor Name:', vendorName);
      console.log('  - Vendor Email:', vendorEmail);

      // Save directly to Supabase using the DIY client
      const { error: updateError } = await getSb()
        .from('diy_generations')
        .update({
          vendor_name: vendorName,
          vendor_email: vendorEmail,
          updated_at: new Date().toISOString()
        })
        .eq('generation_id', generationId);

      if (updateError) {
        console.error('❌ Database error:', updateError);
        throw new Error('Failed to save vendor information');
      }

      // ✅ CRITICAL: Store generation ID in localStorage for Stripe Buy Button redirect
      localStorage.setItem('pending_generation_id', generationId);
      console.log('✅ Stored generation ID in localStorage:', generationId);

      console.log('✅ Vendor info saved successfully');
      toast.success('Information saved! You can now proceed to checkout.');
      
      setIsSavingVendorInfo(false);
      setIsVendorInfoSaved(true);
      
    } catch (error) {
      console.error('❌ Error saving vendor info:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save information');
      setIsSavingVendorInfo(false);
    }
  };

  // Handle Stripe Checkout redirect
  const handleStripeCheckout = async () => {
    // Get generation ID from context or URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlGenerationId = urlParams.get('id');
    const generationId = contextGenerationId || urlGenerationId;

    if (!generationId) {
      toast.error('Generation ID not found. Please try again.');
      return;
    }

    setIsProcessingCheckout(true);

    try {
      console.log('🛒 Creating Stripe Checkout Session...');
      console.log('  - Generation ID:', generationId);
      console.log('  - Server URL:', SERVER_URL);

      // ✅ CRITICAL: Use HASH-based routing for GoDaddy compatibility
      // Hash routing works without server configuration
      const successUrl = `${window.location.origin}/#/diy-download?id=${generationId}`;
      const cancelUrl = `${window.location.origin}/#/diy-preview?id=${generationId}`;

      console.log('  - Success URL (HASH-BASED):', successUrl);
      console.log('  - Cancel URL (HASH-BASED):', cancelUrl);
      
      // ✅ CRITICAL: Store in multiple places for maximum reliability
      localStorage.setItem('pending_generation_id', generationId);
      sessionStorage.setItem('pending_generation_id', generationId);
      console.log('✅ Stored generation ID in localStorage AND sessionStorage:', generationId);

      const response = await fetch(`${SERVER_URL}/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${diyPublicAnonKey}`,
          'apikey': diyPublicAnonKey,
        },
        body: JSON.stringify({
          generation_id: generationId,
          success_url: successUrl,
          cancel_url: cancelUrl,
        }),
      }).catch(err => {
        console.error('❌ Network error:', err);
        throw new Error(`Network error: ${err.message}`);
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      const data = await response.json();
      console.log('📡 Response data:', data);

      if (!response.ok || !data.success || !data.url) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      console.log('✅ Checkout Session created successfully');
      console.log('  - Session ID:', data.session_id);
      console.log('  - Redirecting to:', data.url);

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('❌ Error creating checkout session:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout');
      setIsProcessingCheckout(false);
    }
  };

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

          {/* Proceed to Checkout Button */}
          <Button
            onClick={handleProceedToCheckout}
            disabled={!stripeLoaded}
            className="bg-[#5b81ff] text-white hover:bg-[#4a6fe0] h-12"
          >
            {stripeLoaded ? (
              'Proceed to Checkout'
            ) : (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading payment...
              </>
            )}
          </Button>
        </div>

        {/* Vendor Info Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#1c1c60]">Complete Your Purchase</DialogTitle>
              <DialogDescription>
                Please provide your information to proceed with checkout.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Vendor Name Input */}
              <div className="space-y-2">
                <Label htmlFor="vendor-name">Your Name</Label>
                <Input
                  id="vendor-name"
                  placeholder="John Smith"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  disabled={isSavingVendorInfo}
                />
              </div>

              {/* Vendor Email Input */}
              <div className="space-y-2">
                <Label htmlFor="vendor-email">Email Address</Label>
                <Input
                  id="vendor-email"
                  type="email"
                  placeholder="john@example.com"
                  value={vendorEmail}
                  onChange={(e) => setVendorEmail(e.target.value)}
                  disabled={isSavingVendorInfo}
                />
              </div>

              {/* Info Note */}
              <p className="text-xs text-gray-500">
                We'll use this email to send your download link and receipt.
              </p>

              {/* Confirm Button */}
              <div className="pt-2 flex justify-center">
                <Button
                  onClick={handleSaveVendorInfo}
                  disabled={!isFormValid() || isSavingVendorInfo || isVendorInfoSaved}
                  className="w-full max-w-md bg-[#ebff82] !text-[#1c1c60] hover:bg-[#e0f570] disabled:bg-gray-300 disabled:text-gray-500"
                >
                  {isSavingVendorInfo ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : isVendorInfoSaved ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirmed
                    </>
                  ) : (
                    'Confirm'
                  )}
                </Button>
              </div>

              {/* Stripe Checkout Button */}
              <div className="pt-2 flex justify-center">
                {isVendorInfoSaved && stripeLoaded ? (
                  <div className="w-full max-w-md">
                    <div className="flex justify-center">
                      <stripe-buy-button
                        buy-button-id={STRIPE_BUY_BUTTON_ID}
                        publishable-key={STRIPE_PUBLISHABLE_KEY}
                        client-reference-id={currentGenerationId}
                      />
                    </div>
                    {/* Payment Info */}
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-500">
                        💳 Secure payment powered by Stripe
                      </p>
                    </div>
                  </div>
                ) : isVendorInfoSaved && !stripeLoaded ? (
                  <div className="w-full max-w-md h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2 text-gray-400" />
                    <span className="text-gray-500 text-sm">Loading payment...</span>
                  </div>
                ) : (
                  <div className="w-full max-w-md h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-sm border-2 border-gray-300 border-dashed">
                    Click Confirm to enable checkout
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

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
      </div>
    </div>
  );
};

export default DIYPreview;