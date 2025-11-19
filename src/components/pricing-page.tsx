import image_cff0762a6794db634da4baa2ef71750dfd161e77 from 'figma:asset/cff0762a6794db634da4baa2ef71750dfd161e77.png';
import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { Button } from './ui/button-simple';
import { Input } from './ui/input';
import { Label } from './ui/label-simple';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog-simple';
import { toast } from './ui/sonner';
import { getFreebieSupabaseClient } from '../utils/supabase/freebie-client';
import logo from 'figma:asset/d2305a08b87429395ab71a84cfa59ed81967566b.png';
import { ArrowLeft, Check, Wrench, Handshake, Sparkles, X, AlertCircle, Loader2 } from 'lucide-react';
import { trackDIWYCTAClicked, trackDIFYCTAClicked, trackPricingCTAClicked, trackPricingPageView } from '../utils/analytics';

interface PricingPageProps {
  onNavigateHome: () => void;
  onNavigateToDIY: () => void;
}

type PlanType = 'diy' | 'diwy' | 'dify' | null;

const PricingPage: React.FC<PricingPageProps> = ({ onNavigateHome, onNavigateToDIY }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(null);
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle plan button click
  const handlePlanClick = (plan: PlanType) => {
    setSelectedPlan(plan);
    setShowDialog(true);
    setEmailInput('');
    setEmailError('');
    
    // Track CTA clicks
    const location = 'pricing_page_main_cards';
    if (plan === 'diwy') {
      trackDIWYCTAClicked(location, 'Book a call');
    } else if (plan === 'dify') {
      trackDIFYCTAClicked(location, 'Book a call');
    } else if (plan === 'diy') {
      trackPricingCTAClicked(plan, location);
    }
  };

  // Close dialog
  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedPlan(null);
    setEmailInput('');
    setEmailError('');
  };

  // Handle email submission
  const handleSubmitEmail = async () => {
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

    setIsLoading(true);
    setEmailError('');

    // For DIWY/DIFY: Open calendar immediately, save to DB in background
    if (selectedPlan === 'diwy' || selectedPlan === 'dify') {
      // Open calendar first (don't block user experience)
      window.open('https://calendar.notion.so/meet/santiagothinksid/flashcall', '_blank');
      toast.success(`Opening calendar... Book a time that works for you! We'll follow up at ${trimmedEmail}`);
      handleCloseDialog();
      setIsLoading(false);

      // Save to database in background (non-blocking)
      saveLeadToDatabase(trimmedEmail, selectedPlan).catch(err => {
        console.error('Background save failed (non-critical):', err);
      });
      
      return;
    }

    // For DIY: Database save is critical (waitlist)
    try {
      await saveLeadToDatabase(trimmedEmail, selectedPlan);
      toast.success(`You're on the waitlist! We'll notify you at ${trimmedEmail} when the DIY tool launches.`);
      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting email:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit. Please try again.';
      setEmailError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Separate function to save lead to database
  const saveLeadToDatabase = async (email: string, plan: PlanType) => {
    const supabase = getFreebieSupabaseClient();

    // Check if lead already exists
    const { data: existingLeads, error: selectError } = await supabase
      .from('leads')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (selectError) {
      console.error('Supabase select error:', selectError);
      // Continue anyway - we'll try to insert
    }

    // Prepare update/insert data based on plan type
    const leadData: any = {
      email: email,
    };

    // Set the appropriate _requestedat timestamp based on plan
    const now = new Date().toISOString();
    if (plan === 'diy') {
      leadData.diy_requestedat = now;
    } else if (plan === 'diwy') {
      leadData.diwy_requestedat = now;
    } else if (plan === 'dify') {
      leadData.dify_requestedat = now;
    }

    if (existingLeads && existingLeads.length > 0) {
      // Update existing lead
      const { error } = await supabase
        .from('leads')
        .update(leadData)
        .eq('email', email);

      if (error) {
        console.error('Supabase error updating lead:', error);
        throw new Error('Database update failed. Please contact support.');
      }
    } else {
      // Insert new lead
      leadData.created_at = new Date().toISOString();
      const { error } = await supabase
        .from('leads')
        .insert(leadData);

      if (error) {
        console.error('Supabase error inserting lead:', error);
        throw new Error('Database insert failed. Please contact support.');
      }
    }
  };

  // Get dialog content based on selected plan
  const getDialogContent = () => {
    if (selectedPlan === 'diy') {
      return {
        title: 'Join the DIY Waitlist',
        description: 'Enter your email to be notified when our DIY tool launches later this week.',
        buttonText: 'Join Waitlist',
      };
    } else {
      return {
        title: 'Book Your Consultation',
        description: "Enter your email and we'll open our calendar for you to book a time.",
        buttonText: 'Book a Call',
      };
    }
  };

  const dialogContent = getDialogContent();

  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1: HERO SECTION */}
      <section className="relative bg-[#1c1c60] py-10 md:py-16 px-4 overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c60] via-[#2a3f6f] to-[#1c1c60] opacity-90"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-[1200px] mx-auto">
          {/* Back to Home link */}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-white mb-6 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[14px] font-medium">Back</span>
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={image_cff0762a6794db634da4baa2ef71750dfd161e77}
              alt="Think SID Logo"
              className="h-16 w-auto"
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-white text-center mb-4 text-4xl md:text-5xl">
            Choose Your Plan
          </h1>

          {/* Subheading */}
          <p className="text-white text-center text-lg md:text-xl opacity-90 max-w-[800px] mx-auto">
            Get your website's social proof working for you
          </p>
        </div>
      </section>

      {/* SECTION 2: PRICING CARDS */}
      <section className="bg-[#F8F9FA] py-12 md:py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: DIY */}
            <div className="bg-white border-2 border-[#E2E8F0] rounded-xl p-8 shadow-md hover:border-[#1c1c60] hover:-translate-y-1 hover:shadow-xl transition-all duration-200 flex flex-col">
              {/* Icon Container */}
              <div className="w-16 h-16 bg-[rgba(28,28,96,0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-8 h-8 text-[#1c1c60]" />
              </div>

              {/* Plan Name */}
              <h3 className="text-[#1c1c60] text-center mb-2" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                Do It Yourself
              </h3>

              {/* Price */}
              <div className="text-[#5b81ff] text-center mb-4" style={{ fontSize: '48px', fontWeight: 'bold' }}>
                $49
              </div>

              {/* Description */}
              <p className="text-[#64748B] text-[14px] text-center leading-relaxed mb-8">
                Plug testimonials into template fields and receive an HTML snippet ready to be plugged into your site
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8 flex-grow">
                {[
                  'Template fields for testimonials',
                  'Ready-to-use HTML snippet',
                  'Self-service implementation'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span className="text-[#475569] text-[14px] leading-snug">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                onClick={onNavigateToDIY}
                className="w-full h-12 bg-[#ebff82] text-[#1c1c60] hover:bg-[#e0f570] hover:-translate-y-0.5 hover:shadow-lg rounded-lg transition-all duration-150"
              >
                Start Now
              </Button>
            </div>

            {/* Card 2: DIWY */}
            <div className="bg-white border-2 border-[#E2E8F0] rounded-xl p-8 shadow-md hover:border-[#1c1c60] hover:-translate-y-1 hover:shadow-xl transition-all duration-200 flex flex-col">
              {/* Icon Container */}
              <div className="w-16 h-16 bg-[rgba(28,28,96,0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-8 h-8 text-[#1c1c60]" />
              </div>

              {/* Plan Name */}
              <h3 className="text-[#1c1c60] text-center mb-2" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                Do It With Some Help
              </h3>

              {/* Price */}
              <div className="text-[#5b81ff] text-center mb-4" style={{ fontSize: '48px', fontWeight: 'bold' }}>
                $299
              </div>

              {/* Description */}
              <p className="text-[#64748B] text-[14px] text-center leading-relaxed mb-8">
                Get assistance with storytelling and receive a customized HTML snippet
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8 flex-grow">
                {[
                  'Bring your own testimonials',
                  'Professional storytelling assistance',
                  'Color customization in carousel',
                  'Implementation guidance'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span className="text-[#475569] text-[14px] leading-snug">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => handlePlanClick('diwy')}
                className="w-full h-12 bg-[#ebff82] text-[#1c1c60] hover:bg-[#e0f570] hover:-translate-y-0.5 hover:shadow-lg rounded-lg transition-all duration-150"
              >
                Book a call
              </Button>
            </div>

            {/* Card 3: DIFY */}
            <div className="bg-white border-2 border-[#E2E8F0] rounded-xl p-8 shadow-md hover:border-[#1c1c60] hover:-translate-y-1 hover:shadow-xl transition-all duration-200 flex flex-col">
              {/* Icon Container */}
              <div className="w-16 h-16 bg-[rgba(28,28,96,0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-[#1c1c60]" />
              </div>

              {/* Plan Name */}
              <h3 className="text-[#1c1c60] text-center mb-2" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                We Do It For You
              </h3>

              {/* Price */}
              <div className="text-[#5b81ff] text-center mb-4" style={{ fontSize: '48px', fontWeight: 'bold' }}>
                $499-$1,499
              </div>

              {/* Description */}
              <p className="text-[#64748B] text-[14px] text-center leading-relaxed mb-8">
                Full-service social proof implementation from data collection to deployment
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8 flex-grow">
                {[
                  'Data collection from your clients',
                  'Custom storyline development',
                  'Professional social proof assets',
                  'Fully customized carousel',
                  'Website deployment'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span className="text-[#475569] text-[14px] leading-snug">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => handlePlanClick('dify')}
                className="w-full h-12 bg-[#ebff82] text-[#1c1c60] hover:bg-[#e0f570] hover:-translate-y-0.5 hover:shadow-lg rounded-lg transition-all duration-150"
              >
                Book a call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ADDITIONAL CTA */}
      <section className="bg-[rgba(243,243,243,0.5)] py-12 md:py-16 px-4">
        <div className="max-w-[900px] mx-auto text-center">
          {/* Heading */}
          <h2 className="text-[#1c1c60] mb-4 text-3xl md:text-4xl">
            Not sure which plan is right for you?
          </h2>

          {/* Description */}
          <p className="text-[#64748B] text-lg md:text-xl leading-relaxed mb-8">
            Try our free social proof thermometer to evaluate your website first
          </p>

          {/* CTA Button */}
          <Button
            onClick={onNavigateHome}
            className="h-14 px-12 bg-[#1c1c60] text-white hover:bg-[#2a3f6f] hover:-translate-y-0.5 hover:shadow-lg rounded-lg shadow-md transition-all duration-150"
          >
            Try the Social Proof Thermometer
          </Button>
        </div>
      </section>

      {/* EMAIL COLLECTION DIALOG */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[480px] p-8">
          <button
            onClick={handleCloseDialog}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#5b81ff] focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-6 w-6 text-[#94A3B8] hover:text-[#475569]" />
            <span className="sr-only">Close</span>
          </button>

          <DialogHeader>
            <DialogTitle className="text-[#1c1c60]" style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {dialogContent.title}
            </DialogTitle>
            <DialogDescription className="text-[#64748B] text-[14px] leading-relaxed">
              {dialogContent.description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">

            {/* Email Input */}
            <div className="mb-4">
              <Label htmlFor="email" className="text-[#1c1c60] text-[14px] font-medium mb-2 block">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your@email.com"
                className={`h-12 border-2 ${emailError ? 'border-red-500' : 'border-[#E2E8F0]'} focus:border-[#5b81ff] rounded-lg`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmitEmail();
                  }
                }}
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
                onClick={handleCloseDialog}
                disabled={isLoading}
                className="flex-1 h-12 bg-[#f3f3f3] text-[#1c1c60] hover:bg-[#e5e5e5] rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitEmail}
                disabled={isLoading}
                className="flex-1 h-12 bg-[#ebff82] text-[#1c1c60] hover:bg-[#e0f570] rounded-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  dialogContent.buttonText
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PricingPage;