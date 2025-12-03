import React, { useState } from 'react';
import { Search, ArrowRight, TrendingUp, BarChart3, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button-simple';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox-simple';
import { Label } from './ui/label-simple';
import { Navigation } from './Navigation';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logo from 'figma:asset/d2305a08b87429395ab71a84cfa59ed81967566b.png';
import newLogo from 'figma:asset/new-uploaded-logo.png';
import { trackThermometerStart, trackThermometerURLSubmitted } from '../utils/analytics';

interface LandingPageProps {
  onSuccess: (url: string) => void;
  onNavigateHome: () => void;
  onNavigateToThermometer: () => void;
  onNavigateToDIY: () => void;
  onNavigateToPricing: () => void;
}

export function LandingPage({ 
  onSuccess, 
  onNavigateHome,
  onNavigateToThermometer,
  onNavigateToDIY,
  onNavigateToPricing 
}: LandingPageProps) {
  const [url, setUrl] = useState('');
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [checkboxError, setCheckboxError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setUrlError('');
    setCheckboxError('');

    // Validation
    let trimmedUrl = url.trim();
    let hasError = false;

    if (!trimmedUrl) {
      setUrlError('Please enter a website URL');
      hasError = true;
    }

    if (!agreedToPrivacy) {
      setCheckboxError('You must agree to the Privacy Policy before analyzing a website');
      hasError = true;
    }

    if (hasError) return;

    // Ensure URL has http:// or https:// protocol
    if (trimmedUrl && !trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      trimmedUrl = 'https://' + trimmedUrl;
    }

    // Pass URL to processing page
    onSuccess(trimmedUrl);
    trackThermometerURLSubmitted(trimmedUrl);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <Navigation
        onNavigateHome={onNavigateHome}
        onNavigateToThermometer={onNavigateToThermometer}
        onNavigateToDIY={onNavigateToDIY}
        onNavigateToPricing={onNavigateToPricing}
        currentPage="thermometer"
      />

      {/* Spacer for fixed nav */}
      <div style={{ height: '80px' }} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1c1c60] via-[#1c1c60] to-[#5b81ff] text-white">
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXRhJTIwdmlzdWFsaXphdGlvbnxlbnwxfHx8fDE3NjIyNzAyNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Analytics background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          {/* Logo */}
          <div className="text-center mb-12">
            <a href="/" className="inline-block">
              {/* Logo removed */}
            </a>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="mb-6 text-3xl md:text-4xl lg:text-5xl" style={{ fontWeight: '700', letterSpacing: '-0.02em' }}>
              Website Social Proof Thermometer
            </h1>
            <p className="mb-12 text-xl md:text-2xl text-white/90">
              Evaluate your website's storytelling and social proof effectiveness in seconds
            </p>

            {/* Form Card */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* URL Input */}
                <div>
                  <div className="relative">
                    <Search 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" 
                      size={20}
                    />
                    <Input
                      type="text"
                      placeholder="Enter your website URL"
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        setUrlError('');
                      }}
                      className={`h-14 pl-12 pr-4 bg-[#f3f3f3] border-2 rounded-lg transition-colors text-[#1c1c60] ${
                        urlError 
                          ? 'border-[#EF4444] focus-visible:ring-[#EF4444]' 
                          : 'border-transparent focus-visible:ring-[#5b81ff] focus-visible:border-[#5b81ff]'
                      }`}
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                  {urlError && (
                    <p role="alert" className="mt-2 text-[#EF4444] text-left" style={{ fontSize: '14px' }}>
                      {urlError}
                    </p>
                  )}
                </div>

                {/* Privacy Checkbox */}
                <div>
                  <div className="flex items-start space-x-3 text-left">
                    <Checkbox
                      id="privacy"
                      checked={agreedToPrivacy}
                      onCheckedChange={(checked) => {
                        setAgreedToPrivacy(checked as boolean);
                        setCheckboxError('');
                      }}
                      className={`mt-0.5 h-5 w-5 ${
                        checkboxError 
                          ? 'border-[#EF4444]' 
                          : 'border-[#cbd5e1]'
                      }`}
                    />
                    <Label
                      htmlFor="privacy"
                      className="cursor-pointer text-[#475569] leading-tight"
                      style={{ fontSize: '14px', fontWeight: '400' }}
                    >
                      I agree to the{' '}
                      <a
                        href="https://drive.google.com/file/d/17A4h3190dkpvh68Yj0yVbZXs4Z8HJ3Dg/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#5b81ff] underline hover:text-[#5b81ff]/80"
                      >
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
                  {checkboxError && (
                    <p role="alert" className="mt-2 text-[#EF4444] text-left" style={{ fontSize: '14px' }}>
                      {checkboxError}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-14 bg-[#ebff82] hover:bg-[#e0f570] !text-[#1c1c60] rounded-lg shadow-md hover:shadow-lg transition-all group"
                  style={{ fontSize: '16px', fontWeight: '700' }}
                >
                  Analyze Website
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="py-24 bg-[#f3f3f3]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl md:text-4xl text-[#1c1c60]" style={{ fontWeight: '700' }}>What You'll Discover</h2>
            <p className="text-xl text-[#1c1c60]" style={{ fontWeight: '700' }}>
              Get instant insights into your website's persuasion power
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-transparent hover:border-[#5b81ff] transition-all hover:shadow-lg">
              <div className="mb-6 w-16 h-16 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#1c1c60] to-[#5b81ff]">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3 text-[#1c1c60]">Social Proof Score</h3>
              <p className="text-[#717182]">
                Get a comprehensive grade on how well your website leverages testimonials, reviews, and trust signals.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-transparent hover:border-[#5b81ff] transition-all hover:shadow-lg">
              <div className="mb-6 w-16 h-16 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#1c1c60] to-[#5b81ff]">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3 text-[#1c1c60]">Detailed Analysis</h3>
              <p className="text-[#717182]">
                Understand what's working and what's missing with actionable insights across key trust factors.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-transparent hover:border-[#5b81ff] transition-all hover:shadow-lg">
              <div className="mb-6 w-16 h-16 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#1c1c60] to-[#5b81ff]">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3 text-[#1c1c60]">Improvement Roadmap</h3>
              <p className="text-[#717182]">
                Receive specific recommendations to strengthen your website's credibility and increase conversions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[#717182] mb-4">
            © 2025 Think SID. Built to help businesses build trust through social proof.
          </p>
          {onNavigateToPricing && (
            <button
              onClick={onNavigateToPricing}
              className="text-[#5b81ff] hover:text-[#1c1c60] underline transition-colors"
            >
              View Pricing
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}