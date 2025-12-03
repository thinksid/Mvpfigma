import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button-simple';
import { Card } from '../ui/card';
import { Loader2, Download, Copy, CheckCircle2, Mail } from 'lucide-react';
import { toast } from '../ui/sonner';
import { useDIY } from '../../contexts/DIYContext';
import { Navigation } from '../Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs-simple';
import { trackDIYPaymentCompleted, trackDIYCodeDownloaded } from '../../utils/analytics';
import { DebugInfo } from './DebugInfo';

// ✅ YOUR REAL CREDENTIALS
const SUPABASE_URL = 'https://dbojiegvkyvbmbivmppi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRib2ppZWd2a3l2Ym1iaXZtcHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NDA0NDMsImV4cCI6MjA3NzQxNjQ0M30.vdXxqOosxNSzrt3c-VaQbeDuAltLtaP5Tj-UKx-sWQQ';
const N8N_WEBHOOK = 'https://thinksid.app.n8n.cloud/webhook/send-carousel-code';

interface DIYDownloadProps {
  sessionId?: string;
  generationId?: string;
  onNavigateHome: () => void;
  onNavigateToThermometer: () => void;
  onNavigateToDIY: () => void;
  onNavigateToPricing: () => void;
}

export const DIYDownload: React.FC<DIYDownloadProps> = (({
  sessionId: propSessionId,
  generationId: propGenerationId,
  onNavigateHome,
  onNavigateToThermometer,
  onNavigateToDIY,
  onNavigateToPricing,
}) => {
  console.log('🚀 ========== DIYDownload COMPONENT MOUNTED ==========');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🔍 Props:', { propSessionId, propGenerationId });
  console.log('🌐 window.location:', window.location.href);
  console.log('🔍 window.location.pathname:', window.location.pathname);
  console.log('🔍 window.location.search:', window.location.search);
  console.log('====================================================');

  const { generationId: contextGenerationId, htmlCode: contextHtmlCode } = useDIY();
  const [sessionId, setSessionId] = useState<string | null>(propSessionId || null);
  const [generationId, setGenerationId] = useState<string | null>(propGenerationId || null);
  const [isTestMode, setIsTestMode] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [generationData, setGenerationData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    console.log('🎯 ========== DIYDownload useEffect TRIGGERED ==========');
    
    try {
      // Get parameters from URL if not provided via props
      const urlParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      
      // ✅ CRITICAL: Support BOTH hash-based (?id=xxx in hash) AND path-based routing
      let urlGenerationId = urlParams.get('id'); // Check regular URL params first
      
      // If hash exists and contains query params, parse those
      if (hash && hash.includes('?')) {
        const hashQueryString = hash.split('?')[1];
        const hashParams = new URLSearchParams(hashQueryString);
        const hashId = hashParams.get('id');
        if (hashId) {
          urlGenerationId = hashId; // Use hash ID if found
        }
      }
      
      const localStorageId = localStorage.getItem('pending_generation_id'); // ✅ Fallback from localStorage
      const sessionStorageId = sessionStorage.getItem('pending_generation_id'); // ✅ Fallback from sessionStorage

      console.log('🔍 DIYDownload - Looking for generation ID...');
      console.log('  - URL id parameter:', urlGenerationId);
      console.log('  - Hash:', hash);
      console.log('  - localStorage generation ID:', localStorageId);
      console.log('  - sessionStorage generation ID:', sessionStorageId);
      console.log('  - Context generation ID:', contextGenerationId);
      console.log('  - Prop generation ID:', propGenerationId);
      console.log('  - Full window.location.href:', window.location.href);
      console.log('  - window.location.search:', window.location.search);
      console.log('  - window.location.pathname:', window.location.pathname);
      console.log('  - window.location.hash:', window.location.hash);

      // Use URL parameter first, then localStorage, then sessionStorage, then context, then props
      const finalGenerationId = urlGenerationId || localStorageId || sessionStorageId || contextGenerationId || propGenerationId;

      if (finalGenerationId) {
        console.log('✅ Found generation ID:', finalGenerationId);
        setGenerationId(finalGenerationId);
        
        // Clear localStorage after retrieving
        if (localStorageId) {
          localStorage.removeItem('pending_generation_id');
          console.log('🧹 Cleared localStorage generation ID');
        }
        
        // Clear sessionStorage after retrieving
        if (sessionStorageId) {
          sessionStorage.removeItem('pending_generation_id');
          console.log('🧹 Cleared sessionStorage generation ID');
        }
        
        loadGenerationData(finalGenerationId);
      } else {
        console.error('❌ ========== NO GENERATION ID FOUND ==========');
        console.error('   This usually means:');
        console.error('   1. Stripe did not include the generation ID in the redirect URL');
        console.error('   2. localStorage did not persist the generation ID');
        console.error('   3. User navigated directly to /diy-download without going through the flow');
        console.error('   4. URL parameters were stripped during redirect');
        console.error('');
        console.error('   Debugging info:');
        console.error('   - URL params object:', Object.fromEntries(urlParams));
        console.error('   - localStorage keys:', Object.keys(localStorage));
        console.error('   - sessionStorage keys:', Object.keys(sessionStorage));
        console.error('   - Context has data:', !!contextGenerationId);
        console.error('================================================');
        
        // Check if we have context data (test mode / dev skip)
        const hasContextData = contextGenerationId && contextHtmlCode;
        
        if (hasContextData) {
          console.log('✅ Using context data (test mode)');
          setIsTestMode(true);
          loadFromContext();
        } else {
          console.error('❌ No generation ID and no context data - cannot proceed');
          toast.error('No carousel found. Please create one first.');
          setIsLoading(false);
          
          // Redirect to DIY landing after 3 seconds
          setTimeout(() => {
            console.log('⏰ Redirecting to DIY landing page...');
            onNavigateToDIY();
          }, 3000);
        }
      }
    } catch (error) {
      console.error('💥 ========== ERROR IN DIYDownload useEffect ==========');
      console.error('Error:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      console.error('======================================================');
      
      toast.error('Failed to load download page. Please try again.');
      setIsLoading(false);
    }
  }, []);

  const loadGenerationData = async (gid: string) => {
    try {
      setIsLoading(true);

      console.log('📡 Loading generation data for ID:', gid);

      // Fetch generation data from diy_generations table using DIY Supabase client
      const { getDIYSupabaseClient } = await import('../../utils/supabase/diy-client');
      const diyClient = getDIYSupabaseClient();
      
      const { data, error: dbError } = await diyClient
        .from('diy_generations')
        .select('*')
        .eq('generation_id', gid)
        .maybeSingle();

      console.log('📡 Database response:', { data, error: dbError });
      
      if (dbError || !data) {
        console.error('❌ Failed to load generation:', dbError);
        throw new Error('Generation not found');
      }

      const generation = data;
      setGenerationData(generation);

      console.log('✅ Generation data loaded:', generation);

      // Mark as paid in diy_generations table
      await diyClient
        .from('diy_generations')
        .update({
          paid: true,
          stripe_session_id: sessionId || 'buy-button-checkout',
          updated_at: new Date().toISOString()
        })
        .eq('generation_id', gid);

      console.log('✅ Marked as paid in database');

      // Auto-send email
      await sendCodeToEmail(generation);

      // Track payment completed
      trackDIYPaymentCompleted(gid);

    } catch (error) {
      console.error('❌ Verification error:', error);
      toast.error('Failed to load your code. Please contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendCodeToEmail = async (data: any) => {
    try {
      // ✅ Trigger N8N to send email
      await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.vendor_email,
          name: data.vendor_name,
          html_code: data.html_code,
          generation_id: data.generation_id
        })
      });

      setEmailSent(true);
      toast.success(`Code sent to ${data.vendor_email}!`);
    } catch (error) {
      console.error('Email send error:', error);
      // Don't fail the whole page if email fails
    }
  };

  const handleCopyCode = () => {
    if (!generationData) return;
    
    navigator.clipboard.writeText(generationData.html_code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    if (!generationData) return;
    
    const blob = new Blob([generationData.html_code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `social-proof-carousel-${generationData.generation_id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Code downloaded!');
    trackDIYCodeDownloaded(generationData.generation_id);
  };

  const loadFromContext = () => {
    if (!contextGenerationId || !contextHtmlCode) return;
    
    setGenerationData({
      generation_id: contextGenerationId,
      html_code: contextHtmlCode,
      vendor_email: 'test@example.com',
      vendor_name: 'Test User'
    });
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#5b81ff] mx-auto mb-4" />
          <p className="text-gray-600">Verifying your payment and preparing your code...</p>
        </div>
      </div>
    );
  }

  if (!generationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Unable to load your carousel code.</p>
          <Button onClick={onNavigateHome}>Go Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug Info Panel */}
      <DebugInfo 
        generationId={generationId} 
        contextData={{ generationId: contextGenerationId, htmlCode: contextHtmlCode }} 
      />
      
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
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl text-[#1c1c60] mb-2">
            Success! Your Code is Ready 🎉
          </h1>
          <p className="text-lg text-gray-600">
            {emailSent && (
              <span className="flex items-center justify-center gap-2">
                <Mail className="h-5 w-5" />
                Code sent to {generationData.vendor_email}
              </span>
            )}
          </p>
        </div>

        {/* Code Display */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl text-[#1c1c60] mb-4">Here's the Code you need to paste in your website</h2>
          <div className="relative">
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
              <code>{generationData.html_code}</code>
            </pre>
            <Button
              onClick={handleCopyCode}
              className="absolute top-2 right-2"
              size="sm"
            >
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Button
            onClick={handleCopyCode}
            className="h-12 bg-[#5b81ff] hover:bg-[#4a6fd9]"
          >
            <Copy className="mr-2 h-5 w-5" />
            Copy to Clipboard
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="h-12"
          >
            <Download className="mr-2 h-5 w-5" />
            Download as .html
          </Button>
        </div>

        {/* Instructions with Tabs */}
        <Card className="p-6">
          <h3 className="text-lg text-[#1c1c60] mb-6">How to Add to Your Website</h3>
          
          <Tabs defaultValue="wix" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="wix">Wix</TabsTrigger>
              <TabsTrigger value="shopify">Shopify</TabsTrigger>
              <TabsTrigger value="wordpress">WordPress</TabsTrigger>
              <TabsTrigger value="manual">Manual editing</TabsTrigger>
            </TabsList>

            <TabsContent value="wix" className="mt-6">
              <a 
                href="https://youtu.be/zVqPqDkpjyM?si=1nI6KBOLHe2RgEZX" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow max-w-md mx-auto">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <img 
                      src="https://img.youtube.com/vi/zVqPqDkpjyM/maxresdefault.jpg" 
                      alt="Wix Tutorial"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm">How to add custom HTML code in Wix</p>
                  </div>
                </Card>
              </a>
            </TabsContent>

            <TabsContent value="shopify" className="mt-6">
              <a 
                href="https://youtu.be/Uns4MNC8bxk?si=Xu2oOEJcKLouxxYm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow max-w-md mx-auto">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <img 
                      src="https://img.youtube.com/vi/Uns4MNC8bxk/maxresdefault.jpg" 
                      alt="Shopify Tutorial"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm">How to add custom code in Shopify theme</p>
                  </div>
                </Card>
              </a>
            </TabsContent>

            <TabsContent value="wordpress" className="mt-6">
              <a 
                href="https://www.youtube.com/watch?v=BLX_rD11DMk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow max-w-md mx-auto">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <img 
                      src="https://img.youtube.com/vi/BLX_rD11DMk/maxresdefault.jpg" 
                      alt="WordPress Tutorial"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm">How to add custom HTML block in WordPress</p>
                  </div>
                </Card>
              </a>
              
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Note:</span> Select the <span className="font-semibold">HTML widget</span> and <span className="font-semibold italic">not</span> the custom HTML widget from the list. The latter causes issues when loading the carousel on mobile.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="mt-6">
              <a 
                href="https://www.youtube.com/watch?v=ay0_plImm6w" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow max-w-md mx-auto">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <img 
                      src="https://img.youtube.com/vi/ay0_plImm6w/maxresdefault.jpg" 
                      alt="Manual Editing Tutorial"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm">How to manually edit HTML files</p>
                  </div>
                </Card>
              </a>
            </TabsContent>
          </Tabs>

          {/* Need Help Button */}
          <div className="mt-6 text-center">
            <Button
              onClick={() => window.location.href = 'mailto:hello@thinksid.co'}
              variant="outline"
              className="h-10"
            >
              <Mail className="mr-2 h-4 w-4" />
              Need Help?
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
});

export default DIYDownload;