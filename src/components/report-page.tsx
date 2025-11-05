import React, { useState, useEffect } from 'react';
import { Lightbulb, Wrench, Handshake, Sparkles, ArrowUp, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface Finding {
  dimension: string;
  page: string;
  evidence: string;
  explanation?: string;
}

interface Tactical {
  tacticalRecommendation: string;
  tacticalExample: string;
}

interface FullReportData {
  findings: Finding[];
  scores: { [key: string]: number | null };
  strategic: string;
  tacticals: Tactical[];
}

interface ReportPageProps {
  data: {
    scan_id: string;
    lead_id: string;
    email: string;
    name: string;
    url: string;
    letter: string;
    score_total: number;
    full_report: FullReportData;
  };
  onNavigateToPricing?: () => void;
}

const ReportPage: React.FC<ReportPageProps> = ({ data, onNavigateToPricing }) => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailInput, setEmailInput] = useState(data.email);
  const [emailError, setEmailError] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  // Track scroll position for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open email dialog
  const handleEmailReport = () => {
    setShowEmailDialog(true);
    setEmailInput(data.email);
    setEmailError('');
  };

  // Close email dialog
  const handleCloseEmailDialog = () => {
    setShowEmailDialog(false);
    setEmailError('');
    setEmailInput(data.email);
  };

  // Submit email report
  const handleConfirmEmail = async () => {
    const trimmedEmail = emailInput.trim();

    // Validation
    if (!trimmedEmail) {
      setEmailError('Please enter an email address');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Submit to webhook
    setIsEmailLoading(true);
    setEmailError('');

    try {
      const response = await fetch('https://thinksid.app.n8n.cloud/webhook/email-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scan_id: data.scan_id,
          email: trimmedEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Success
      handleCloseEmailDialog();
      toast.success(`Report sent to ${trimmedEmail}!`);
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailError('Failed to send email. Please try again.');
    } finally {
      setIsEmailLoading(false);
    }
  };

  // Parse strategic text (convert markdown-like formatting)
  const parseStrategicText = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        return;
      }

      // Check if it's a bullet point
      if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        const content = trimmedLine.substring(2).replace(/\*\*/g, '');
        elements.push(
          <li key={index} className="text-[#475569] ml-5 mb-2">
            {content}
          </li>
        );
      } else {
        // Regular paragraph
        const content = trimmedLine.replace(/\*\*/g, '');
        elements.push(
          <p key={index} className="text-[#475569] mb-3 leading-relaxed">
            {content}
          </p>
        );
      }
    });

    return elements;
  };

  // Group findings by dimension
  const groupFindingsByDimension = () => {
    const grouped: { [key: string]: Finding[] } = {};
    
    data.full_report.findings.forEach((finding) => {
      if (!grouped[finding.dimension]) {
        grouped[finding.dimension] = [];
      }
      grouped[finding.dimension].push(finding);
    });

    return grouped;
  };

  const groupedFindings = groupFindingsByDimension();
  const dimensions = Object.keys(groupedFindings);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9fc] to-white">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* SECTION 1: HEADER CARD */}
        <div className="bg-[#1c1c60] rounded-xl shadow-lg p-8 sm:p-10 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Content */}
            <div className="flex-1">
              {/* Greeting */}
              <p className="text-white mb-4">
                Hello, {data.name}.
              </p>

              {/* Headline */}
              <h1 className="text-white mb-6">
                Here's your social proof report for <span className="font-bold">{data.url}</span>
              </h1>

              {/* Score Display */}
              <div className="flex items-center gap-4">
                <div className="text-white" style={{ fontSize: '56px', lineHeight: '1', fontWeight: 'bold' }}>
                  {data.score_total}
                </div>
                <div className="bg-[#ebff82] text-[#1c1c60] px-5 py-3 rounded-lg" style={{ fontSize: '32px', fontWeight: 'bold' }}>
                  {data.letter}
                </div>
              </div>
            </div>

            {/* Right Content - Email Button */}
            <div className="lg:self-center">
              <Button
                onClick={handleEmailReport}
                className="bg-white text-[#1c1c60] border-2 border-white hover:bg-[#f3f3f3] h-12 px-8 rounded-lg w-full lg:w-auto"
              >
                Email report
              </Button>
            </div>
          </div>
        </div>

        {/* SECTION 2: TAKEAWAYS */}
        <section className="mb-12">
          <h2 className="text-[#1c1c60] mb-4">
            Takeaways
          </h2>

          <div className="bg-white border-2 border-[rgba(235,255,130,0.3)] rounded-xl shadow-md p-6 sm:p-8">
            {/* Card Header */}
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-[#ebff82]" />
              <h3 className="text-[#1c1c60]" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Our evaluation of your site's trust-building score
              </h3>
            </div>

            {/* Strategic Content */}
            <div className="space-y-2">
              {parseStrategicText(data.full_report.strategic)}
            </div>
          </div>
        </section>

        {/* SECTION 3: DETAILED FINDINGS */}
        <section className="mb-12">
          <h2 className="text-[#1c1c60] mb-4">
            Detailed Findings
          </h2>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dimensions.map((dimension) => {
              const findings = groupedFindings[dimension];
              const score = data.full_report.scores[dimension];

              return (
                <div
                  key={dimension}
                  className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  {/* Dimension Title */}
                  <h3 className="text-[#1c1c60] mb-2" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    {dimension}
                  </h3>

                  {/* Score Display */}
                  <div className="mb-4" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {score !== null && score !== undefined ? (
                      <span className="text-[#1c1c60]">{score} / 100</span>
                    ) : (
                      <span className="text-[#64748B]">No {dimension.toLowerCase()} found</span>
                    )}
                  </div>

                  {/* Findings List */}
                  <div className="space-y-4">
                    {findings.map((finding, idx) => (
                      <div key={idx}>
                        {/* Evidence */}
                        {finding.evidence && (
                          <div className="mb-3">
                            <p className="text-[#1c1c60] text-[13px] font-semibold mb-2">
                              Evidence:
                            </p>
                            <blockquote className="border-l-2 border-[rgba(91,129,255,0.3)] pl-3 text-[13px] italic text-[rgba(36,49,82,0.8)] leading-relaxed">
                              {finding.evidence}
                            </blockquote>
                          </div>
                        )}

                        {/* Explanation */}
                        {finding.explanation && (
                          <div className="mb-3">
                            <p className="text-[#1c1c60] text-[13px] font-semibold mb-2">
                              Explanation:
                            </p>
                            <p className="text-[13px] text-[rgba(36,49,82,0.8)] leading-relaxed">
                              {finding.explanation}
                            </p>
                          </div>
                        )}

                        {/* Divider (if not last) */}
                        {idx < findings.length - 1 && (
                          <hr className="border-[#E2E8F0] my-3" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: TACTICAL RECOMMENDATIONS */}
        <section className="mb-12">
          <h2 className="text-[#1c1c60] mb-4">
            🎯 Tactical Recommendations
          </h2>

          <div className="space-y-4">
            {data.full_report.tacticals.map((tactical, index) => (
              <div
                key={index}
                className="bg-white border-l-4 border-[#5b81ff] rounded-xl shadow-sm p-6"
              >
                {/* Header */}
                <p className="text-[#1c1c60] text-[12px] font-semibold uppercase tracking-wider mb-4">
                  Tactical Recommendation {index + 1}
                </p>

                {/* Recommendation with Number Badge */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#1c1c60] rounded-full flex items-center justify-center text-white" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {index + 1}
                  </div>
                  <p className="text-[#1c1c60] flex-1 leading-relaxed">
                    {tactical.tacticalRecommendation}
                  </p>
                </div>

                {/* Divider */}
                <hr className="border-[rgba(91,129,255,0.3)] my-4" />

                {/* Example Section */}
                <div>
                  <p className="text-[#1c1c60] text-[13px] font-semibold mb-2">
                    Example:
                  </p>
                  <p className="text-[rgba(36,49,82,0.8)] text-[14px] leading-relaxed">
                    {tactical.tacticalExample}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: PRICING CTA */}
        <section className="mb-12">
          <h2 className="text-[#1c1c60] mb-4">
            Ready to Level Up Your Social Proof?
          </h2>

          <p className="text-[#64748B] mb-6">
            Thank you for using our social proof scoring tool! We'd love to help you implement these recommendations with one of our assisted plans.
          </p>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: DIY */}
            <div className="bg-white border-2 border-[#E2E8F0] rounded-xl p-8 hover:border-[#5b81ff] hover:-translate-y-1 transition-all duration-200">
              <Wrench className="w-8 h-8 text-[#5b81ff] mb-4" />
              
              <h3 className="text-[#1c1c60] mb-2" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                Do It Yourself
              </h3>
              
              <div className="text-[#5b81ff] mb-4" style={{ fontSize: '36px', fontWeight: 'bold' }}>
                $49.99
              </div>
              
              <p className="text-[#64748B] text-[14px] leading-relaxed mb-6">
                Plug testimonials into template fields and receive an HTML snippet ready to be plugged into your site
              </p>
              
              <div className="space-y-3 mb-6">
                {[
                  'Template fields for testimonials',
                  'Ready-to-use HTML snippet',
                  'Self-service implementation'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <span className="text-[#475569] text-[14px]">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={onNavigateToPricing}
                className="w-full h-12 bg-[#1c1c60] text-white hover:bg-[#2a3f6f] rounded-lg"
              >
                Start now
              </Button>
            </div>

            {/* Card 2: DIWY */}
            <div className="bg-white border-2 border-[#E2E8F0] rounded-xl p-8 hover:border-[#5b81ff] hover:-translate-y-1 transition-all duration-200">
              <Handshake className="w-8 h-8 text-[#5b81ff] mb-4" />
              
              <h3 className="text-[#1c1c60] mb-2" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                Do It With Some Help
              </h3>
              
              <div className="text-[#5b81ff] mb-4" style={{ fontSize: '36px', fontWeight: 'bold' }}>
                $299
              </div>
              
              <p className="text-[#64748B] text-[14px] leading-relaxed mb-6">
                Get assistance with storytelling and receive a customized HTML snippet
              </p>
              
              <div className="space-y-3 mb-6">
                {[
                  'Bring your own testimonials',
                  'Professional storytelling assistance',
                  'Customized HTML snippet',
                  'Implementation guidance'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <span className="text-[#475569] text-[14px]">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={onNavigateToPricing}
                className="w-full h-12 bg-[#1c1c60] text-white hover:bg-[#2a3f6f] rounded-lg"
              >
                Book a call
              </Button>
            </div>

            {/* Card 3: DIFY */}
            <div className="bg-white border-2 border-[#E2E8F0] rounded-xl p-8 hover:border-[#5b81ff] hover:-translate-y-1 transition-all duration-200">
              <Sparkles className="w-8 h-8 text-[#5b81ff] mb-4" />
              
              <h3 className="text-[#1c1c60] mb-2" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                We Do It For You
              </h3>
              
              <div className="text-[#5b81ff] mb-4" style={{ fontSize: '36px', fontWeight: 'bold' }}>
                $499-$999
              </div>
              
              <p className="text-[#64748B] text-[14px] leading-relaxed mb-6">
                Full-service social proof implementation from data collection to deployment
              </p>
              
              <div className="space-y-3 mb-6">
                {[
                  'Data collection from your clients',
                  'Custom storyline development',
                  'Professional social proof assets',
                  'Complete HTML integration',
                  'Website deployment'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <span className="text-[#475569] text-[14px]">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={onNavigateToPricing}
                className="w-full h-12 bg-[#1c1c60] text-white hover:bg-[#2a3f6f] rounded-lg"
              >
                Book a call
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-[#1c1c60] text-white rounded-full shadow-lg hover:bg-[#2a3f6f] transition-all duration-200 flex items-center justify-center z-50"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Email Report Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-[480px] p-8">
          <button
            onClick={handleCloseEmailDialog}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#5b81ff] focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-6 w-6 text-[#94A3B8] hover:text-[#475569]" />
            <span className="sr-only">Close</span>
          </button>

          <DialogHeader>
            <DialogTitle className="text-[#1c1c60]" style={{ fontSize: '24px', fontWeight: 'bold' }}>
              Confirm Email Address
            </DialogTitle>
            <DialogDescription className="text-[#64748B] text-[14px] leading-relaxed">
              Enter the email address where you'd like to receive your full social proof report.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            {/* Email Input */}
            <div className="mb-6">
              <Label htmlFor="email" className="text-[#1c1c60] text-[14px] font-medium mb-2 block">
                Email address to send report to:
              </Label>
              <Input
                id="email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your@email.com"
                className={`h-12 border-2 ${emailError ? 'border-red-500' : 'border-[#E2E8F0]'} focus:border-[#5b81ff] rounded-lg`}
              />
            </div>

            {/* Error Message */}
            {emailError && (
              <div className="bg-[#FEE2E2] border border-[#EF4444] rounded-md p-3 mb-4 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                <p className="text-[#DC2626] text-[14px]">{emailError}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleCloseEmailDialog}
                disabled={isEmailLoading}
                className="flex-1 h-12 bg-[#f3f3f3] text-[#1c1c60] hover:bg-[#e5e5e5] rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmEmail}
                disabled={isEmailLoading}
                className="flex-1 h-12 bg-[#ebff82] text-[#1c1c60] hover:bg-[#e0f570] rounded-lg"
              >
                {isEmailLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportPage;
