import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Loader2, Download, Copy, CheckCircle2, Mail } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useDIY } from '../../contexts/DIYContext';
import { Navigation } from '../Navigation';

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

export const DIYDownload: React.FC<DIYDownloadProps> = ({
  sessionId: propSessionId,
  generationId: propGenerationId,
  onNavigateHome,
  onNavigateToThermometer,
  onNavigateToDIY,
  onNavigateToPricing,
}) => {
  const { generationId: contextGenerationId, htmlCode: contextHtmlCode } = useDIY();
  const [sessionId, setSessionId] = useState<string | null>(propSessionId || null);
  const [generationId, setGenerationId] = useState<string | null>(propGenerationId || null);
  const [isTestMode, setIsTestMode] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [generationData, setGenerationData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // Get parameters from URL if not provided via props
    const urlParams = new URLSearchParams(window.location.search);
    const urlSessionId = urlParams.get('session_id');
    const urlGenerationId = urlParams.get('generation_id');

    if (!sessionId && urlSessionId) {
      setSessionId(urlSessionId);
    }

    if (!generationId && urlGenerationId) {
      setGenerationId(urlGenerationId);
    }

    // ✅ NEW: Check if we have context data (test mode / dev skip)
    const hasContextData = contextGenerationId && contextHtmlCode;
    
    // If we have either sessionId or generationId from URL, proceed with payment verification
    if (sessionId || urlSessionId || generationId || urlGenerationId) {
      verifyPaymentAndLoadCode(urlSessionId || sessionId, urlGenerationId || generationId);
    } 
    // ✅ NEW: If no URL params but we have context data, use it (test mode)
    else if (hasContextData) {
      console.log('📺 Test mode: Using context data');
      setIsTestMode(true);
      loadFromContext();
    }
    else {
      toast.error('No payment session found');
      onNavigateToDIY();
    }
  }, []);

  const verifyPaymentAndLoadCode = async (sid: string | null, gid: string | null) => {
    try {
      setIsLoading(true);

      if (!gid) {
        throw new Error('No generation ID found');
      }

      const kvKey = `diy_generation:${gid}`;

      // Fetch generation data from KV store
      const response = await fetch(`${SUPABASE_URL}/rest/v1/kv_store_1da61fc8?key=eq.${kvKey}`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      const data = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error('Generation not found');
      }

      const generation = data[0].value;
      setGenerationData(generation);

      // Mark as paid in KV store
      const updatedValue = {
        ...generation,
        paid: true,
        stripe_session_id: sid || 'manual',
        updated_at: new Date().toISOString()
      };

      await fetch(`${SUPABASE_URL}/rest/v1/kv_store_1da61fc8?key=eq.${kvKey}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          value: updatedValue
        })
      });

      // Auto-send email
      await sendCodeToEmail(generation);

    } catch (error) {
      console.error('Verification error:', error);
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
          email: data.customer_email,
          name: data.customer_name,
          html_code: data.html_code,
          generation_id: data.generation_id
        })
      });

      setEmailSent(true);
      toast.success(`Code sent to ${data.customer_email}!`);
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
  };

  const loadFromContext = () => {
    if (!contextGenerationId || !contextHtmlCode) return;
    
    setGenerationData({
      generation_id: contextGenerationId,
      html_code: contextHtmlCode,
      customer_email: 'test@example.com',
      customer_name: 'Test User'
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
                Code sent to {generationData.customer_email}
              </span>
            )}
          </p>
        </div>

        {/* Code Display */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl text-[#1c1c60] mb-4">Your HTML Code</h2>
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

        {/* Instructions */}
        <Card className="p-6">
          <h3 className="text-lg text-[#1c1c60] mb-4">How to Add to Your Website</h3>
          <ol className="space-y-3 text-gray-700">
            <li>
              <strong>1. Copy the code above</strong>
            </li>
            <li>
              <strong>2. Paste it into your website's HTML</strong>
              <p className="text-sm text-gray-600 ml-4">Add it where you want the carousel to appear</p>
            </li>
            <li>
              <strong>3. Save and publish your changes</strong>
            </li>
          </ol>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>💡 Tip:</strong> For WordPress, use a Custom HTML block. For Wix/Squarespace, use an Embed code element.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DIYDownload;