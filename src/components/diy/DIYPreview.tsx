import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Check, Loader2, ArrowLeft, Lock } from 'lucide-react';
import { CarouselPreview } from './CarouselPreview';
import { ProgressIndicator } from './ProgressIndicator';
import { EmailCaptureModal } from './EmailCaptureModal';
import { getSupabaseClient } from '../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { CarouselSlide } from '../../types/diy';

// ✅ YOUR REAL CREDENTIALS
const SUPABASE_URL = 'https://dbojiegvkyvbmbivmppi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRib2ppZWd2a3l2Ym1iaXZtcHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NDA0NDMsImV4cCI6MjA3NzQxNjQ0M30.vdXxqOosxNSzrt3c-VaQbeDuAltLtaP5Tj-UKx-sWQQ';

// ✅ YOUR REAL STRIPE CREDENTIALS
const STRIPE_BUY_BUTTON_ID = 'buy_btn_1SQInZ1epFGDXBkyWumuKai2';
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51SQ8RN1epFGDXBkybYp7vZzL0d73nEGxk7PHPsuX9trliPFpUTKFMkkTs0f1llKjZeYs9kDKHiHYfrpS1I2XwEE300ai8lQfJr';

// Declare Stripe Buy Button for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'buy-button-id': string;
        'publishable-key': string;
        'client-reference-id': string;
      };
    }
  }
}

interface DIYPreviewProps {
  generationId?: string;
  onNavigateHome: () => void;
  onNavigateToThermometer: () => void;
  onNavigateToDIY: () => void;
  onNavigateToPricing: () => void;
  onNavigateToDIYDownload: () => void;
  onNavigateToDIYCreate: () => void;
}

export const DIYPreview: React.FC<DIYPreviewProps> = ({
  generationId: propGenerationId,
  onNavigateHome,
  onNavigateToThermometer,
  onNavigateToDIY,
  onNavigateToPricing,
  onNavigateToDIYDownload,
  onNavigateToDIYCreate,
}) => {
  const sb = getSupabaseClient();
  const [generationId, setGenerationId] = useState<string | null>(propGenerationId || null);
  
  const [previewData, setPreviewData] = useState<CarouselSlide[] | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [alreadyPaid, setAlreadyPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    // Try to get generation_id from URL query params if not provided via props
    if (!generationId) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlGenerationId = urlParams.get('id');
      if (urlGenerationId) {
        setGenerationId(urlGenerationId);
      } else {
        onNavigateToDIYCreate();
        return;
      }
    }
  }, []);

  useEffect(() => {
    if (generationId) {
      loadPreview();
      loadStripeScript();
    }
  }, [generationId]);

  const loadStripeScript = () => {
    if (document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]')) {
      setStripeLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    script.onload = () => setStripeLoaded(true);
    script.onerror = () => {
      toast.error('Payment system error. Please refresh the page');
    };
    document.body.appendChild(script);
  };

  const loadPreview = async () => {
    if (!generationId) return;
    
    try {
      const kvKey = `diy_generation:${generationId}`;
      
      const { data, error } = await sb
        .from('kv_store_1da61fc8')
        .select('value')
        .eq('key', kvKey)
        .maybeSingle();
      
      if (error || !data) {
        toast.error('Preview not found. Please generate a new carousel');
        onNavigateToDIYCreate();
        return;
      }
      
      const generationData = data.value as any;
      setPreviewData(generationData.preview_data as CarouselSlide[]);
      setAlreadyPaid(generationData.paid || false);

      // Check if email already captured
      if (generationData.customer_email && generationData.customer_name) {
        setEmailCaptured(true);
        setCustomerEmail(generationData.customer_email);
        setCustomerName(generationData.customer_name);
      }
    } catch (error) {
      console.error('Load preview error:', error);
      onNavigateToDIYCreate();
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (email: string, name: string) => {
    if (!generationId) return;
    
    try {
      const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-1da61fc8`;
      const kvKey = `diy_generation:${generationId}`;
      
      // First, get the existing data from server
      const getResponse = await fetch(`${SERVER_URL}/diy/${generationId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (!getResponse.ok) {
        throw new Error('Failed to fetch generation');
      }

      const existingData = await getResponse.json();

      // Update the value with customer info
      const updatedData = {
        ...existingData.data,
        customer_email: email,
        customer_name: name,
        updated_at: new Date().toISOString()
      };

      // Save using server endpoint
      const saveResponse = await fetch(`${SERVER_URL}/diy/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          generation_id: generationId,
          data: updatedData,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save information');
      }

      setCustomerEmail(email);
      setCustomerName(name);
      setEmailCaptured(true);
      setShowEmailModal(false);

      toast.success('Information saved! ✓ You can now proceed to payment');
    } catch (error) {
      console.error('Error saving email:', error);
      throw error;
    }
  };

  const handlePaymentClick = () => {
    if (!emailCaptured) {
      setShowEmailModal(true);
    }
    // If email captured, Stripe button will show automatically
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#5b81ff]" />
      </div>
    );
  }

  if (!previewData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProgressIndicator currentStep={alreadyPaid ? 3 : 2} />
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl text-[#1c1c60] mb-2">
            {alreadyPaid ? 'Your Social Proof Carousel' : 'Your Social Proof Carousel is Ready!'}
          </h1>
          <p className="text-lg text-gray-600">
            {alreadyPaid 
              ? 'View your carousel below'
              : 'Preview it below, then unlock the code with a one-time $50 payment'
            }
          </p>
        </div>
        
        {/* Carousel Preview */}
        <div className="mb-12">
          <CarouselPreview slides={previewData} />
        </div>
        
        {/* Payment Section - Only show if not paid */}
        {!alreadyPaid && (
          <Card className="max-w-2xl mx-auto border border-gray-200 shadow-lg">
            <CardHeader className="bg-white">
              <CardTitle className="text-2xl text-center text-[#1c1c60]">
                Love it? Get Your Code for $50
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="text-[#5b81ff] h-5 w-5 flex-shrink-0" />
                  <span className="text-gray-700">Instant download of HTML code</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-[#5b81ff] h-5 w-5 flex-shrink-0" />
                  <span className="text-gray-700">Works on any website (WordPress, custom, etc.)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-[#5b81ff] h-5 w-5 flex-shrink-0" />
                  <span className="text-gray-700">No recurring fees - one-time payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-[#5b81ff] h-5 w-5 flex-shrink-0" />
                  <span className="text-gray-700">30-day money-back guarantee</span>
                </div>
              </div>

              {/* Payment Button */}
              <div className="space-y-4">
                {!emailCaptured ? (
                  // Show "Get Your Code" button before email capture
                  <Button
                    onClick={handlePaymentClick}
                    className="w-full h-12 bg-[#5b81ff] hover:bg-[#4a6fd9] text-white text-lg"
                  >
                    Get Your Code for $50 →
                  </Button>
                ) : stripeLoaded ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-center text-green-600 font-medium">
                      ✓ Ready to proceed, {customerName}!
                    </p>
                    
                    {/* ✅ CORRECTED: Use client-reference-id to track generation */}
                    <stripe-buy-button
                      buy-button-id={STRIPE_BUY_BUTTON_ID}
                      publishable-key={STRIPE_PUBLISHABLE_KEY}
                      client-reference-id={generationId}
                    />
                    
                    <p className="text-xs text-center text-gray-500 mt-2">
                      💡 Stripe will ask for your email during checkout
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-12 bg-gray-100 text-gray-600 rounded-md">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading payment...
                  </div>
                )}
              </div>

              {/* Security badge */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  <Lock className="inline h-4 w-4 mr-1" />
                  Secure payment powered by Stripe
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back button */}
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={onNavigateToDIYCreate}
            className="text-gray-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Edit
          </Button>
        </div>
      </div>

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
      />
    </div>
  );
};

export default DIYPreview;