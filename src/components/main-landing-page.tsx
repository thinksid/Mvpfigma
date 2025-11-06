import image_cff0762a6794db634da4baa2ef71750dfd161e77 from 'figma:asset/cff0762a6794db634da4baa2ef71750dfd161e77.png';
import React from 'react';
import { ArrowRight, TrendingUp, Wrench, Sparkles, Check, Linkedin, Twitter } from 'lucide-react';
import { Button } from './ui/button';
import { Navigation } from './Navigation';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logo from 'figma:asset/d2305a08b87429395ab71a84cfa59ed81967566b.png';
import { ThinkSidsCarousel } from './ThinkSidsCarousel';
import { customerStories } from './diy/DIYLanding';

interface MainLandingPageProps {
  onNavigateToThermometer: () => void;
  onNavigateToDIY: () => void;
  onNavigateToPricing: () => void;
}

export const MainLandingPage: React.FC<MainLandingPageProps> = ({
  onNavigateToThermometer,
  onNavigateToDIY,
  onNavigateToPricing,
}) => {
  const handleNavigateHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* NAVIGATION BAR */}
      <Navigation
        onNavigateHome={handleNavigateHome}
        onNavigateToThermometer={onNavigateToThermometer}
        onNavigateToDIY={onNavigateToDIY}
        onNavigateToPricing={onNavigateToPricing}
        currentPage="home"
      />

      {/* Spacer for fixed nav */}
      <div style={{ height: '80px' }} />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#1c1c60] py-20 md:py-32 px-8">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c60] via-[#2a3f6f] to-[#1c1c60] opacity-90" />
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070"
            alt="Agricultural field"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1200px] mx-auto text-center">
          {/* Eyebrow */}
          <p className="text-[#ebff82] text-sm font-semibold uppercase tracking-widest mb-4">
            Turn Your Customer Success into Sales
          </p>

          {/* Main Headline */}
          <h1 className="text-white mb-6 leading-tight max-w-[900px] mx-auto font-[IBM_Plex_Sans] font-bold font-normal text-[48px]">
            We Help Agricultural Vendors Sell More with Proven Social Proof
          </h1>

          {/* Subheadline */}
          <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-[800px] mx-auto mb-10">
            Farmers trust other farmers - that's that. We help you turn your clients' success stories into compelling evidence that will help you land more sales.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Button
              onClick={onNavigateToThermometer}
              size="lg"
              className="h-14 px-10 bg-[#ebff82] text-[#1c1c60] hover:bg-[#e0f570] hover:-translate-y-0.5 rounded-lg shadow-lg text-lg"
            >
              Get Free Assessment
            </Button>
            <Button
              onClick={onNavigateToPricing}
              size="lg"
              variant="outline"
              className="h-14 px-10 bg-transparent border-2 border-white/30 text-white hover:border-white hover:bg-white/10 rounded-lg text-lg"
            >
              View Pricing
            </Button>
          </div>

          {/* Trust Badge */}
          <p className="text-white/70 text-sm">
            ✓ Free • No Credit Card • 2 Min Assessment
          </p>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="bg-white py-16 md:py-20 px-8">
        <div className="max-w-[1000px] mx-auto">
          {/* Section Label */}
          <p className="text-[#5b81ff] text-sm font-semibold uppercase tracking-widest text-center mb-4">
            The Problem
          </p>

          {/* Heading */}
          <h2 className="text-[#1c1c60] text-center mb-6 text-3xl md:text-4xl leading-tight">
            Your Customers Trust Other Farmers, Not Marketing Claims
          </h2>

          {/* Description */}
          <p className="text-[#475569] text-lg leading-relaxed text-center max-w-[800px] mx-auto mb-12">
            Your biggest challenge: your products need proof. Farmers won't invest their hard-earned cash without seeing real results from other farmers like them.
          </p>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl p-8 text-center">
              <div className="text-[#EF4444] text-5xl mb-3">73%</div>
              <p className="text-[#64748B] text-[16px] leading-relaxed">
                of ag vendors lack compelling social proof on their websites
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl p-8 text-center">
              <div className="text-[#10B981] text-5xl mb-3">5x</div>
              <p className="text-[#64748B] text-[16px] leading-relaxed">
                more likely to convert with farmer success stories vs generic claims
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl p-8 text-center">
              <div className="text-[#5b81ff] text-5xl mb-3">&lt; 2min</div>
              <p className="text-[#64748B] text-[16px] leading-relaxed">
                to assess your current social proof strength with our free tool
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="bg-gradient-to-b from-[#F8F9FA] to-white py-16 md:py-20 px-8 bg-[rgb(243,243,243)]">
        <div className="max-w-[1200px] mx-auto">
          {/* Section Label */}
          <p className="text-[#5b81ff] text-sm font-semibold uppercase tracking-widest text-center mb-4">
            Our Solution
          </p>

          {/* Heading */}
          <h2 className="text-[#1c1c60] text-center mb-16 text-3xl md:text-4xl">
            Three Ways to Build Trust and Convert More Customers
          </h2>

          {/* Offering Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Free Thermometer */}
            <button
              onClick={onNavigateToThermometer}
              className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-10 hover:border-[#ebff82] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 text-left"
            >
              {/* Icon */}
              <div className="w-20 h-20 bg-[#5b81ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-12 h-12 text-[#5b81ff]" />
              </div>

              {/* Badge */}
              <div className="inline-block bg-[#10B981] text-white text-xs px-3 py-1 rounded-full mb-4">
                FREE
              </div>

              {/* Title */}
              <h3 className="text-[#1c1c60] mb-3" style={{ fontSize: '24px' }}>
                Social Proof Thermometer
              </h3>

              {/* Description */}
              <p className="text-[#64748B] text-[16px] leading-relaxed mb-6">
                Get a free 2-minute assessment of your website's social proof strength. See exactly where you're losing trust and credibility.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {[
                  'Instant website analysis',
                  'Actionable recommendations',
                  'Detailed score breakdown',
                  'No signup required'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                    <span className="text-[#475569] text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-[#5b81ff] font-semibold flex items-center gap-2 mt-6">
                Try Free Tool
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Card 2: DIY Tool */}
            <button
              onClick={onNavigateToDIY}
              className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-10 hover:border-[#ebff82] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 text-left"
            >
              {/* Icon */}
              <div className="w-20 h-20 bg-[#5b81ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wrench className="w-12 h-12 text-[#5b81ff]" />
              </div>

              {/* Badge */}
              <div className="inline-block bg-[#F59E0B] text-white text-xs px-3 py-1 rounded-full mb-4">
                COMING SOON
              </div>

              {/* Title */}
              <h3 className="text-[#1c1c60] mb-3" style={{ fontSize: '24px' }}>
                DIY Social Proof Carousel
              </h3>

              {/* Description */}
              <p className="text-[#64748B] text-[16px] leading-relaxed mb-6">
                Build your own customer success carousel in minutes. Plug your testimonials into our template and get ready-to-use HTML code.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {[
                  'Pre-built templates',
                  'Customizable styles',
                  'Copy-paste HTML',
                  'Launch: This week'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                    <span className="text-[#475569] text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-[#5b81ff] font-semibold flex items-center gap-2 mt-6">
                Start now
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Card 3: Done For You */}
            <button
              onClick={() => window.open('https://calendar.notion.so/meet/santiagothinksid/5j8824oqb', '_blank')}
              className="bg-white border-2 border-[#E2E8F0] rounded-2xl p-10 hover:border-[#ebff82] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 text-left"
            >
              {/* Icon */}
              <div className="w-20 h-20 bg-[#5b81ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-[#5b81ff]" />
              </div>

              {/* Badge */}
              <div className="inline-block bg-[#ebff82] text-[#1c1c60] text-xs px-3 py-1 rounded-full mb-4">
                MOST POPULAR
              </div>

              {/* Title */}
              <h3 className="text-[#1c1c60] mb-3" style={{ fontSize: '24px' }}>
                Professional Implementation
              </h3>

              {/* Description */}
              <p className="text-[#64748B] text-[16px] leading-relaxed mb-6">
                Let us handle everything. From collecting testimonials to deploying custom social proof on your site.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {[
                  'Full testimonial collection',
                  'Custom storytelling',
                  'Professional design',
                  'Complete deployment'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                    <span className="text-[#475569] text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-[#5b81ff] font-semibold flex items-center gap-2 mt-6">
                Book a call
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-white py-16 md:py-20 px-8">
        <div className="max-w-[1200px] mx-auto">
          {/* Heading */}
          <h2 className="text-[#1c1c60] text-center mb-16 text-3xl md:text-4xl">
            From Assessment to Results in 3 Simple Steps
          </h2>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="bg-[#1c1c60]/10 border border-[#1c1c60]/20 rounded-xl p-8 backdrop-blur-sm hover:bg-[rgba(28,28,96,0.85)] transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#ebff82] rounded-full flex items-center justify-center mb-5">
                <span className="text-[#1c1c60] text-2xl">1</span>
              </div>
              <h3 className="text-[#1c1c60] group-hover:text-white mb-3 transition-colors duration-300" style={{ fontSize: '24px' }}>
                Assess
              </h3>
              <p className="text-[#1c1c60]/80 group-hover:text-white/90 text-[16px] leading-relaxed transition-colors duration-300">
                Run our free thermometer on your website. Get your social proof score in 2 minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#1c1c60]/10 border border-[#1c1c60]/20 rounded-xl p-8 backdrop-blur-sm hover:bg-[rgba(28,28,96,0.85)] transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#ebff82] rounded-full flex items-center justify-center mb-5">
                <span className="text-[#1c1c60] text-2xl">2</span>
              </div>
              <h3 className="text-[#1c1c60] group-hover:text-white mb-3 transition-colors duration-300" style={{ fontSize: '24px' }}>
                Choose
              </h3>
              <p className="text-[#1c1c60]/80 group-hover:text-white/90 text-[16px] leading-relaxed transition-colors duration-300">
                Pick your implementation path: DIY with templates or done-for-you professional service.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#1c1c60]/10 border border-[#1c1c60]/20 rounded-xl p-8 backdrop-blur-sm hover:bg-[rgba(28,28,96,0.85)] transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#ebff82] rounded-full flex items-center justify-center mb-5">
                <span className="text-[#1c1c60] text-2xl">3</span>
              </div>
              <h3 className="text-[#1c1c60] group-hover:text-white mb-3 transition-colors duration-300" style={{ fontSize: '24px' }}>
                Convert
              </h3>
              <p className="text-[#1c1c60]/80 group-hover:text-white/90 text-[16px] leading-relaxed transition-colors duration-300">
                Deploy proven social proof on your site and watch your conversion rates climb.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF SECTION */}
      <section className="bg-white py-16 md:py-20 px-8">
        <div className="max-w-[1100px] mx-auto">
          {/* Heading */}
          <h2 className="text-[#1c1c60] text-center mb-12 text-3xl">
            Trusted by Growing Ag Vendors
          </h2>

          {/* ThinkSids Carousel */}
          <ThinkSidsCarousel stories={customerStories} />
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="bg-[#1c1c60] py-16 md:py-20 px-8">
        <div className="max-w-[800px] mx-auto text-center">
          {/* Heading */}
          <h2 className="text-white mb-6 text-3xl md:text-4xl">
            Ready to Turn Farmer Success into Your Sales Engine?
          </h2>

          {/* Description */}
          <p className="text-white text-lg leading-relaxed mb-10">
            Start with a free 2-minute assessment. No signup, no credit card, just instant insights.
          </p>

          {/* CTA Button */}
          <Button
            onClick={onNavigateToThermometer}
            size="lg"
            className="h-14 px-12 bg-[#ebff82] text-[#1c1c60] hover:bg-[#e0f570] hover:-translate-y-0.5 rounded-lg shadow-xl text-lg"
          >
            Get Your Free Assessment
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1c1c60] border-t border-white/10 py-16 md:py-20 px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Column 1: Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={image_cff0762a6794db634da4baa2ef71750dfd161e77} alt="think SID" className="h-8 w-auto" />
                <span className="text-white text-xl font-semibold">think SID</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Strategy  |  Innovation  |  Design
              </p>
              <div className="flex items-center gap-4">
              </div>
            </div>

            {/* Column 2: Products */}
            <div>
              <h3 className="text-white font-semibold mb-4">Products</h3>
              <div className="space-y-3">
                <button
                  onClick={onNavigateToThermometer}
                  className="block text-white/70 hover:text-white hover:underline transition-colors text-sm"
                >
                  Thermometer
                </button>
                <button
                  onClick={onNavigateToDIY}
                  className="block text-white/70 hover:text-white hover:underline transition-colors text-sm"
                >
                  DIY Tool
                </button>
                <button
                  onClick={onNavigateToPricing}
                  className="block text-white/70 hover:text-white hover:underline transition-colors text-sm"
                >
                  Pricing
                </button>
              </div>
            </div>

            {/* Column 3: Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <div className="space-y-3">
                <a
                  href="mailto:hello@thinksid.co"
                  className="block text-white/70 hover:text-white hover:underline transition-colors text-sm"
                >
                  Contact
                </a>
                <a
                  href="https://drive.google.com/file/d/17A4h3190dkpvh68Yj0yVbZXs4Z8HJ3Dg/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/70 hover:text-white hover:underline transition-colors text-sm"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-6">
            <p className="text-white/50 text-sm text-center">
              © 2025 Think SID. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};