import React, { useState, useEffect } from 'react';
import { Lightbulb, Wrench, Handshake, Sparkles, ArrowUp, Check, X, Loader2, AlertCircle, Star, Users, Award, MessageSquare, TrendingUp, Shield } from 'lucide-react';
import { Button } from './ui/button-simple';
import { Input } from './ui/input';
import { Label } from './ui/label-simple';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog-simple';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from './ui/sonner';
import { getFreebieSupabaseClient } from '../utils/supabase/freebie-client';

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
  onNavigateToDIY?: () => void;
}

const ReportPage: React.FC<ReportPageProps> = ({ data, onNavigateToPricing, onNavigateToDIY }) => {
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

  // Handle booking a call - opens calendar and updates leads table
  const handleBookCall = async (service: 'diwy' | 'dify') => {
    try {
      // Update the leads table based on which service was selected
      const supabase = getFreebieSupabaseClient();
      
      const updateData = service === 'diwy' 
        ? { diwy_requestedat: new Date().toISOString() }
        : { dify_requestedat: new Date().toISOString() };
      
      const { error: updateError } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', data.lead_id);

      if (updateError) {
        console.error('Error updating lead:', updateError);
      }

      // Open calendar link
      window.open('https://calendar.notion.so/meet/santiagothinksid/flashcall', '_blank');
      
      toast.success('Opening calendar... Book a time that works for you!');
    } catch (error) {
      console.error('Error in handleBookCall:', error);
      // Still open the calendar even if the database update fails
      window.open('https://calendar.notion.so/meet/santiagothinksid/flashcall', '_blank');
    }
  };

  // Handle DIY start - updates leads table and navigates
  const handleDIYStart = async () => {
    try {
      // Update the leads table to mark that they started DIY
      const supabase = getFreebieSupabaseClient();
      
      const { error: updateError } = await supabase
        .from('leads')
        .update({ diy_requestedat: new Date().toISOString() })
        .eq('id', data.lead_id);

      if (updateError) {
        console.error('Error updating lead for DIY:', updateError);
      }

      // Navigate to DIY tool
      if (onNavigateToDIY) {
        onNavigateToDIY();
      }
    } catch (error) {
      console.error('Error in handleDIYStart:', error);
      // Still navigate even if the database update fails
      if (onNavigateToDIY) {
        onNavigateToDIY();
      }
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

  // Debug: Log the data structure
  useEffect(() => {
    console.log('=== REPORT PAGE DATA ===');
    console.log('Full Report:', data.full_report);
    console.log('Scores object:', data.full_report.scores);
    console.log('Score keys:', Object.keys(data.full_report.scores || {}));
    console.log('Findings:', data.full_report.findings);
    console.log('Findings count:', data.full_report.findings.length);
    console.log('Unique dimensions from findings:', [...new Set(data.full_report.findings.map(f => f.dimension))]);
  }, [data]);

  // Group findings by dimension
  const groupFindingsByDimension = () => {
    const grouped: { [key: string]: Finding[] } = {};
    
    data.full_report.findings.forEach((finding) => {
      if (!grouped[finding.dimension]) {
        grouped[finding.dimension] = [];
      }
      grouped[finding.dimension].push(finding);
    });

    console.log('Grouped findings:', grouped);
    return grouped;
  };

  const groupedFindings = groupFindingsByDimension();
  const dimensions = Object.keys(groupedFindings);

  // Map dimension names to icons
  const getDimensionIcon = (dimension: string) => {
    const dimLower = dimension.toLowerCase();
    if (dimLower.includes('testimonial') || dimLower.includes('review')) return Star;
    if (dimLower.includes('social') || dimLower.includes('media')) return Users;
    if (dimLower.includes('badge') || dimLower.includes('certification') || dimLower.includes('logo')) return Award;
    if (dimLower.includes('press') || dimLower.includes('mention')) return MessageSquare;
    if (dimLower.includes('data') || dimLower.includes('stat') || dimLower.includes('metric')) return TrendingUp;
    if (dimLower.includes('trust') || dimLower.includes('security')) return Shield;
    return Star; // Default
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* SECTION 1: HERO HEADER CARD */}
        <div className="bg-[rgb(28,28,96)] rounded-2xl shadow-2xl p-8 sm:p-12 mb-8 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ebff82] rounded-full blur-3xl opacity-20 -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#5b81ff] rounded-full blur-3xl opacity-10 -ml-32 -mb-32" />
          
          <div className="relative z-10">
            {/* Greeting Badge */}
            <div className="inline-block bg-[#ebff82] text-[#1c1c60] px-4 py-2 rounded-full mb-4" style={{ fontSize: '14px', fontWeight: '600' }}>
              🎉 Full Report Unlocked
            </div>

            {/* Headline */}
            <h1 className="text-[rgb(255,255,255)] mb-2 text-center">
              <span style={{ fontWeight: 'bold' }}>{data.name}</span>, here's your complete social proof analysis
            </h1>
            
            <p className="text-white mb-8 text-center" style={{ fontSize: '18px' }}>
              for <span className="font-semibold text-[rgb(255,255,255)]">{data.url}</span>
            </p>

            {/* Score Display with Slider - Centered */}
            <div className="mb-8 flex flex-col items-center">
              <div className="flex items-center gap-6 mb-6">
                <div className="text-[#f3f3f3]" style={{ fontSize: '72px', lineHeight: '1', fontWeight: 'bold' }}>
                  {data.score_total}
                </div>
                <div className="bg-gradient-to-br from-[#ebff82] to-[#d4e86f] text-[#1c1c60] rounded-2xl px-8 py-4 shadow-lg" style={{ fontSize: '48px', lineHeight: '1', fontWeight: 'bold' }}>
                  {data.letter}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-2xl">
                <div className="w-full h-4 bg-[#E2E8F0] rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-[#5b81ff] to-[#ebff82] rounded-full transition-all duration-500 ease-out shadow-lg"
                    style={{ width: `${data.score_total}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[#64748B]" style={{ fontSize: '12px' }}>
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            {/* CTA Section - Centered with Equal Width */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <Button
                onClick={handleDIYStart}
                className="bg-[#5b81ff] hover:bg-[#4a70ee] text-white h-14 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex-1"
              >
                Build More Trust Now
              </Button>
              
              <Button
                onClick={handleEmailReport}
                variant="outline"
                className="border-2 border-[#E2E8F0] text-[#64748B] hover:bg-[#F8F9FA] h-14 px-6 rounded-xl flex-1"
              >
                Email This Report
              </Button>
            </div>
          </div>
        </div>

        {/* SECTION 2: TAKEAWAYS */}
        <section className="mb-12">
          <h2 className="text-[#1c1c60] mb-4" style={{ fontWeight: 'bold' }}>
            Key Takeaways
          </h2>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-[#5b81ff]">
            {/* Card Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#E2E8F0]">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1c1c60] to-[#5b81ff] rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[#1c1c60]" style={{ fontSize: '22px', fontWeight: 'bold' }}>
                Our evaluation of your site's trust-building score
              </h3>
            </div>

            {/* Strategic Content */}
            <div className="space-y-2 bg-gradient-to-br from-[#F8F9FA] to-white p-6 rounded-xl">
              {parseStrategicText(data.full_report.strategic)}
            </div>
          </div>
        </section>

        {/* SECTION 3: DETAILED FINDINGS */}
        <section className="mb-12">
          <h2 className="text-[#1c1c60] mb-4" style={{ fontWeight: 'bold' }}>
            Detailed Findings
          </h2>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dimensions.map((dimension) => {
              const findings = groupedFindings[dimension];
              
              // Try to find the score with different key formats
              let score = data.full_report.scores[dimension];
              
              // If not found, try converting to snake_case
              if (score === null || score === undefined) {
                const snakeCaseKey = dimension.toLowerCase().replace(/\s+/g, '_');
                score = data.full_report.scores[snakeCaseKey];
              }
              
              // If still not found, try camelCase
              if (score === null || score === undefined) {
                const camelCaseKey = dimension
                  .split(' ')
                  .map((word, idx) => idx === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join('');
                score = data.full_report.scores[camelCaseKey];
              }

              console.log(`Dimension: "${dimension}", Score:`, score, 'Findings:', findings.length);

              const DimensionIcon = getDimensionIcon(dimension);
              
              return (
                <div
                  key={dimension}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-[#5b81ff]"
                >
                  {/* Dimension Title with Icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1c1c60] to-[#5b81ff] rounded-lg flex items-center justify-center flex-shrink-0">
                      <DimensionIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-[#1c1c60]" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      {dimension}
                    </h3>
                  </div>

                  {/* Score Display */}
                  <div className="mb-4 flex items-baseline gap-2">
                    {score !== null && score !== undefined ? (
                      <>
                        <span className="text-[#1c1c60]" style={{ fontSize: '32px', fontWeight: 'bold' }}>{score}</span>
                        <span className="text-[#64748B]" style={{ fontSize: '18px' }}>/ 100</span>
                      </>
                    ) : (
                      <span className="text-[#64748B]" style={{ fontSize: '16px' }}>No {dimension.toLowerCase()} found</span>
                    )}
                  </div>

                  {/* Mini Progress Bar */}
                  {score !== null && score !== undefined && (
                    <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-gradient-to-r from-[#5b81ff] to-[#ebff82] rounded-full transition-all duration-500"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  )}

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
          <h2 className="text-[#1c1c60] mb-4" style={{ fontWeight: 'bold' }}>
            Tactical Recommendations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.full_report.tacticals.map((tactical, index) => (
              <div
                key={index}
                className="bg-white border-t-4 border-[#5b81ff] rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow flex flex-col"
              >
                {/* Header with Number */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#1c1c60] rounded-full flex items-center justify-center text-white" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    {index + 1}
                  </div>
                  <h3 className="text-[#1c1c60]" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    Tactical Recommendation
                  </h3>
                </div>

                {/* Recommendation */}
                <p className="text-[#1c1c60] mb-4 leading-relaxed flex-1">
                  {tactical.tacticalRecommendation}
                </p>

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

        {/* SECTION 5: CONVERSION CTA BANNER */}
        <div className="bg-[#1c1c60] rounded-xl p-8 sm:p-12 mb-12">
          <h2 className="text-white mb-4 text-center" style={{ fontWeight: 'bold' }}>
            Ready to Transform Your Social Proof?
          </h2>
          
          <p className="text-white mb-8 max-w-2xl mx-auto text-center" style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Don't let these insights go to waste. Start building trust with your audience today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleDIYStart}
              className="bg-[#ebff82] hover:bg-[#d4e86f] text-[#1c1c60] h-14 px-10 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              style={{ fontSize: '16px', fontWeight: 'bold' }}
            >
              Start Building for $49.99
            </Button>
            <Button
              onClick={onNavigateToPricing}
              className="bg-[#5b81ff] hover:bg-[#4a70ee] text-white h-14 px-10 rounded-xl shadow-xl hover:shadow-2xl transition-all"
              style={{ fontSize: '16px', fontWeight: 'bold' }}
            >
              Explore All Options
            </Button>
          </div>
        </div>

        {/* SECTION 6: PRICING CARDS */}
        <section className="mb-12">
          <h2 className="text-[#1c1c60] mb-4" style={{ fontWeight: 'bold' }}>
            Choose Your Path
          </h2>

          <p className="text-[#1c1c60] mb-8 max-w-2xl" style={{ fontSize: '16px', fontWeight: 'bold' }}>
            Pick the solution that fits your needs and budget. All options include expert guidance to maximize your social proof impact.
          </p>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: DIY */}
            <div className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-200 flex flex-col">
              <div className="w-14 h-14 bg-gradient-to-br from-[#1c1c60] to-[#5b81ff] rounded-2xl flex items-center justify-center mb-4">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-[#1c1c60] mb-2" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                Do It Yourself
              </h3>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[#5b81ff]" style={{ fontSize: '42px', fontWeight: 'bold' }}>$49.99</span>
                <span className="text-[#64748B]" style={{ fontSize: '16px' }}>one-time</span>
              </div>
              
              <p className="text-[#64748B] text-[14px] leading-relaxed mb-6 flex-grow">
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
                onClick={handleDIYStart}
                className="w-full h-14 bg-gradient-to-r from-[#1c1c60] to-[#2a3f6f] text-white hover:from-[#2a3f6f] hover:to-[#1c1c60] rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 mt-auto"
                style={{ fontSize: '16px', fontWeight: 'bold' }}
              >
                Start Building Now →
              </Button>
            </div>

            {/* Card 2: DIWY - RECOMMENDED */}
            <div className="bg-white border-4 border-[#5b81ff] rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-200 relative flex flex-col">
              {/* Recommended Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1c1c60] to-[#2a3f6f] text-white px-6 py-2 rounded-full shadow-lg" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                ⭐ RECOMMENDED
              </div>
              
              <div className="w-14 h-14 bg-[#5b81ff]/10 rounded-2xl flex items-center justify-center mb-4 mt-2">
                <Handshake className="w-8 h-8 text-[#5b81ff]" />
              </div>
              
              <h3 className="text-[#1c1c60] mb-2" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                Do It With Some Help
              </h3>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[#5b81ff]" style={{ fontSize: '42px', fontWeight: 'bold' }}>$299</span>
              </div>
              
              <p className="text-[#64748B] text-[14px] leading-relaxed mb-6 flex-grow">
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
                onClick={() => handleBookCall('diwy')}
                className="w-full h-14 bg-[#1c1c60] text-white hover:bg-[#2a3f6f] rounded-xl shadow-lg hover:shadow-xl transition-all mt-auto"
                style={{ fontSize: '16px', fontWeight: 'bold' }}
              >
                Book a Call →
              </Button>
            </div>

            {/* Card 3: DIFY */}
            <div className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-8 hover:border-[#5b81ff] hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 flex flex-col">
              <div className="w-14 h-14 bg-[#5b81ff]/10 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-[#5b81ff]" />
              </div>
              
              <h3 className="text-[#1c1c60] mb-2" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                We Do It For You
              </h3>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[#5b81ff]" style={{ fontSize: '42px', fontWeight: 'bold' }}>$499</span>
                <span className="text-[#64748B]" style={{ fontSize: '18px' }}>- $999</span>
              </div>
              
              <p className="text-[#64748B] text-[14px] leading-relaxed mb-6 flex-grow">
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
                onClick={() => handleBookCall('dify')}
                className="w-full h-14 bg-[#1c1c60] text-white hover:bg-[#2a3f6f] rounded-xl shadow-lg hover:shadow-xl transition-all mt-auto"
                style={{ fontSize: '16px', fontWeight: 'bold' }}
              >
                Book a Call →
              </Button>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-2 border-[#E2E8F0]">
          <p className="text-[#64748B] mb-4" style={{ fontSize: '16px' }}>
            Have questions? We're here to help you succeed.
          </p>
          <Button
            onClick={onNavigateToPricing}
            className="bg-[#5b81ff] hover:bg-[#4a70ee] text-white h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Schedule a Consultation
          </Button>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-[#ebff82] to-[#d4e86f] text-[#1c1c60] rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-200 flex items-center justify-center z-50"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6 font-bold" />
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