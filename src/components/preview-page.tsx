import React, { useState } from 'react';
import { AlertTriangle, Lock, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button-simple';
import { Input } from './ui/input';
import { Label } from './ui/label-simple';
import { Navigation } from './Navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog-simple';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from './ui/drawer-simple';
import { Progress } from './ui/progress-simple';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { trackThermometerReportPreviewed, trackThermometerReportUnlocked } from '../utils/analytics';
import reportMainImage from '../assets/68e8700d46218dcd58aeb2ee0583aac11b87479a.png';
import unlockButtonImage from '../assets/7c9209bb39cd5c2044a3e3834b9348d12a9dc0be.png';

interface PreviewPageProps {
  data: {
    scan_id: string;
    url: string;
    letter: string;
    score_total: number;
    status: string;
    preview: {
      top3: string[];
      total: number;
      letter: string;
      headline: string;
    };
  };
  onUnlockSuccess: (fullReportData: any) => void;
  onNavigateHome: () => void;
  onNavigateToThermometer: () => void;
  onNavigateToDIY: () => void;
  onNavigateToPricing: () => void;
}

export function PreviewPage({ 
  data, 
  onUnlockSuccess,
  onNavigateHome,
  onNavigateToThermometer,
  onNavigateToDIY,
  onNavigateToPricing
}: PreviewPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track page view on mount
  React.useEffect(() => {
    trackThermometerReportPreviewed();
  }, [data.scan_id, data.score_total, data.letter]);

  const handleUnlockClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setName('');
    setEmail('');
    setNameError('');
    setEmailError('');
    setSubmitError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setNameError('');
    setEmailError('');
    setSubmitError('');

    // Validation
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    let hasError = false;

    if (!trimmedName) {
      setNameError('Please enter your name');
      hasError = true;
    }

    if (!trimmedEmail) {
      setEmailError('Please enter your email');
      hasError = true;
    } else if (!trimmedEmail.includes('@')) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (hasError) return;

    // Submit to webhook
    setIsLoading(true);

    try {
      const response = await fetch('https://thinksid.app.n8n.cloud/webhook/api/unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scan_id: data.scan_id,
          name: trimmedName,
          email: trimmedEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();

      console.log('=== UNLOCK RESPONSE DATA ===');
      console.log('Full response:', responseData);
      console.log('Full report:', responseData.full_report);
      console.log('Scores:', responseData.full_report?.scores);
      console.log('Findings:', responseData.full_report?.findings);

      // Close modal and navigate to report page
      handleCloseModal();
      onUnlockSuccess(responseData);
      trackThermometerReportUnlocked();
    } catch (error) {
      console.error('Error unlocking report:', error);
      setSubmitError('Failed to unlock report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Form content (shared between Dialog and Drawer)
  const formContent = (
    <div className="space-y-6 px-6 pb-6">

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#1c1c60]" style={{ fontSize: '14px' }}>
            Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`h-12 ${nameError ? 'border-red-500 border-2' : 'border-[#E2E8F0] border-2'} rounded-lg focus:border-[#5b81ff]`}
            disabled={isLoading}
          />
          {nameError && (
            <p className="text-red-600 text-sm" role="alert">
              {nameError}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#1c1c60]" style={{ fontSize: '14px' }}>
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`h-12 ${emailError ? 'border-red-500 border-2' : 'border-[#E2E8F0] border-2'} rounded-lg focus:border-[#5b81ff]`}
            disabled={isLoading}
          />
          {emailError && (
            <p className="text-red-600 text-sm" role="alert">
              {emailError}
            </p>
          )}
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center gap-2" role="alert">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <p className="text-red-600 text-sm">{submitError}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-[#1c1c60] hover:bg-[#2a3f6f] text-white rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Unlocking...
            </>
          ) : (
            'Unlock Report'
          )}
        </Button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Navigation Bar */}
      <Navigation
        onNavigateHome={onNavigateHome}
        onNavigateToThermometer={onNavigateToThermometer}
        onNavigateToDIY={onNavigateToDIY}
        onNavigateToPricing={onNavigateToPricing}
        currentPage="other"
      />

      {/* Spacer for fixed nav */}
      <div style={{ height: '80px' }} />

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        {/* SECTION 1: SCORE CARD (Hero) */}
        <div className="bg-[#1c1c60] rounded-xl shadow-lg p-8 md:p-12 text-center relative overflow-hidden">
          {/* Background Image with Transparency */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1722336450188-8d3fb3a5b2cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRyYW5zcGFyZW50JTIwZ3JhZGllbnR8ZW58MXx8fHwxNzYyMzg1Njk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10">
            <h1 className="text-white mb-6">Your Social Proof Score</h1>

            {/* Score Display */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="text-white" style={{ fontSize: '64px', lineHeight: '1' }}>
                {data.score_total}
              </div>
              <div className="bg-[#ebff82] text-[#1c1c60] rounded-lg px-6 py-4" style={{ fontSize: '40px', lineHeight: '1' }}>
                {data.letter}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ebff82] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${data.score_total}%` }}
                />
              </div>
            </div>

            {/* Preview Headline */}
            <p className="text-white/90 max-w-2xl mx-auto" style={{ fontSize: '16px' }}>
              {data.preview.headline}
            </p>
          </div>
        </div>

        {/* SECTION 2: UNLOCK CTA CARD */}
        <div className="bg-[rgb(255,255,255)] border border-[#1c1c60] rounded-xl p-6 md:p-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Report Screenshots Preview - Hidden on mobile */}
            <div className="hidden md:flex md:w-2/5 flex-shrink-0 gap-2">
              <ImageWithFallback
                src="https://oqjgvzaedlwarmyjlsoz.supabase.co/storage/v1/object/sign/wensite%20images/Screenshot%202025-11-26%20at%201.04.11%20PM.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNmRjMTg3My1mODg0LTQwYmMtOGJiYS03MzNlZWU5YWM4YzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3ZW5zaXRlIGltYWdlcy9TY3JlZW5zaG90IDIwMjUtMTEtMjYgYXQgMS4wNC4xMSBQTS5wbmciLCJpYXQiOjE3NjQxODAzOTQsImV4cCI6MjA3OTU0MDM5NH0.oWMq-xF0t0SShRjeF1jTjrOp1X2PwSlcXe-F6C1AV4Q"
                alt="Report preview 1"
                className="rounded-lg shadow-md w-1/3 object-cover"
              />
              <ImageWithFallback
                src="https://oqjgvzaedlwarmyjlsoz.supabase.co/storage/v1/object/sign/wensite%20images/Screenshot%202025-11-26%20at%201.04.21%20PM.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNmRjMTg3My1mODg0LTQwYmMtOGJiYS03MzNlZWU5YWM4YzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3ZW5zaXRlIGltYWdlcy9TY3JlZW5zaG90IDIwMjUtMTEtMjYgYXQgMS4wNC4yMSBQTS5wbmciLCJpYXQiOjE3NjQxODA0MTIsImV4cCI6MTc5NTcxNjQxMn0.IqyuSVbrex2OL_4MEiN1-OOcCOnbuQRonnw-IRSjaeU"
                alt="Report preview 2"
                className="rounded-lg shadow-md w-1/3 object-cover"
              />
              <ImageWithFallback
                src="https://oqjgvzaedlwarmyjlsoz.supabase.co/storage/v1/object/sign/wensite%20images/Screenshot%202025-11-26%20at%201.04.32%20PM.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNmRjMTg3My1mODg0LTQwYmMtOGJiYS03MzNlZWU5YWM4YzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3ZW5zaXRlIGltYWdlcy9TY3JlZW5zaG90IDIwMjUtMTEtMjYgYXQgMS4wNC4zMiBQTS5wbmciLCJpYXQiOjE3NjQxODA0MTksImV4cCI6MTc5NTcxNjQxOX0.F8FM7epF8SWcoSCssX9J0Hg5FVrBJOxeBPKgX59Qk44"
                alt="Report preview 3"
                className="rounded-lg shadow-md w-1/3 object-cover"
              />
            </div>

            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-[rgb(28,28,96)] mb-3">Get Your Report For Free</h2>
              <p className="text-[#1c1c60] text-base leading-relaxed">
                Unlock detailed insights, evidence-based scores for each dimension, and actionable recommendations to improve your website
              </p>
            </div>

            {/* CTA Button */}
            <div className="w-full md:w-auto md:flex-shrink-0">
              <Button
                onClick={handleUnlockClick}
                className="w-full md:w-auto bg-[#ebff82] hover:bg-[#d4e66f] text-[#1c1c60] !text-[#1c1c60] px-8 py-3 rounded-lg font-semibold whitespace-nowrap"
              >
                <Lock className="mr-2 h-5 w-5" />
                Unlock Report
              </Button>
            </div>
          </div>
        </div>

        {/* SECTION 3: TOP FINDINGS CARD */}
        <div className="bg-white border border-[#1c1c60] rounded-xl p-6 md:p-8">
          <h2 className="text-[#1c1c60] mb-6 font-semibold">A few takeaways from the full report</h2>

          {/* Findings List */}
          <div className="space-y-4 mb-6">
            {data.preview.top3.map((finding, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-[#5b81ff] flex-shrink-0 mt-2" />
                <p className="text-[#475569] text-base leading-relaxed">
                  {finding}
                </p>
              </div>
            ))}
          </div>

          {/* Locked Indicator */}
          <div className="bg-[#F8F9FA] border-2 border-dashed border-[#E2E8F0] rounded-lg p-6 flex items-center justify-center gap-2">
            <Lock className="h-5 w-5 text-[#94A3B8]" />
            <p className="text-[#64748B]" style={{ fontSize: '14px' }}>
              Unlock the full report to see detailed findings and recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Modal/Drawer for Email Capture */}
      {isMobile ? (
        <Drawer open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DrawerContent className="max-h-[90vh] px-6 pb-8">
            <DrawerHeader className="relative px-0 pt-6">
              <DrawerTitle className="mb-2" style={{ fontSize: '24px', color: '#1c1c60' }}>
                Unlock Your Full Report
              </DrawerTitle>
              <DrawerDescription className="text-[#64748B]" style={{ fontSize: '14px' }}>
                Enter your details to access the complete analysis and recommendations
              </DrawerDescription>
              <DrawerClose asChild>
                <button
                  className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
                  onClick={handleCloseModal}
                >
                  <X className="h-6 w-6 text-[#94A3B8] hover:text-[#475569]" />
                  <span className="sr-only">Close</span>
                </button>
              </DrawerClose>
            </DrawerHeader>
            {formContent}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md" onEscapeKeyDown={handleCloseModal}>
            <button
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
              onClick={handleCloseModal}
            >
              <X className="h-6 w-6 text-[#94A3B8] hover:text-[#475569]" />
              <span className="sr-only">Close</span>
            </button>
            <DialogHeader>
              <DialogTitle className="mb-2" style={{ fontSize: '24px', color: '#1c1c60' }}>
                Unlock Your Full Report
              </DialogTitle>
              <DialogDescription className="text-[#64748B]" style={{ fontSize: '14px' }}>
                Enter your details to access the complete analysis and recommendations
              </DialogDescription>
            </DialogHeader>
            {formContent}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}