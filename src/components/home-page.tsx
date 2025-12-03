import React from 'react';
import { Upload, Eye, Code2, ArrowRight, Zap } from 'lucide-react';
import { Button } from './ui/button-simple';
import { Navigation } from './Navigation';
import { CustomerStoryCarousel } from './CustomerStoryCarousel';
import { CodePreview } from './CodePreview';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onNavigateHome: () => void;
  onNavigateToThermometer: () => void;
  onNavigateToDIY: () => void;
  onNavigateToPricing: () => void;
}

const customerStories = [
  {
    headline: "23% Yield Boost, $45/Acre Savings",
    name: "John Anderson",
    location: "Iowa",
    photo: "https://images.unsplash.com/photo-1570966087241-20278ac27b2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhcm1lcnxlbnwxfHx8fDE3NjIzNjEyNjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    challenge: "Rising costs and poor soil quality cut into John's farm profits.",
    solution: "John switched to Premium Organic Fertilizer with tailored soil management.",
    metrics: [
      "23% Corn Yield Increase",
      "$45/acre Fertilizer Cost Savings"
    ],
    fullStory: {
      farmContext: "500 acres | Corn | IA",
      challengeDetail: "John Anderson, running a 500-acre Iowa family farm for three generations, faced declining soil health. Conventional methods led to rising fertilizer costs and poor soil quality, cutting into his profit margins and threatening long-term sustainability.",
      solutionDetail: "He switched to our Premium Organic Fertilizer program, which included customized soil testing. Our agronomist collaborated with John to develop a tailored nutrient management plan, optimizing application schedules for his farm.",
      results: [
        "Achieved a 23% increase in corn yields in the first season.",
        "Soil organic matter increased from 2.1% to 3.4% within 18 months.",
        "Reduced chemical fertilizer costs by $45 per acre."
      ],
      quote: "This product transformed my operation. I'm seeing results I haven't achieved in years."
    }
  },
  {
    headline: "31% Fertilizer Savings, 18% Yield Gain",
    name: "Sarah Mitchell",
    location: "Nebraska",
    photo: "https://images.unsplash.com/photo-1629655842433-4579f180a070?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NjIyODAyMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    challenge: "Guesswork farming caused uneven yields and wasted inputs.",
    solution: "Implemented precision agriculture consulting for data-driven decisions.",
    metrics: [
      "18% Average Field Productivity",
      "31% Fertilizer Waste Reduction"
    ],
    fullStory: {
      farmContext: "Diversified Grains | NE",
      challengeDetail: "As a first-generation farmer, Sarah managed a diversified grain operation but felt overwhelmed by modern farming technology and data. Her planting and fertilizer decisions relied on guesswork, causing uneven field yields and wasted inputs in low-productivity zones.",
      solutionDetail: "Sarah enrolled in our Precision Agriculture Consulting program. This included drone mapping, soil sampling, and variable rate application planning, providing her with expert data interpretation for informed decision-making.",
      results: [
        "Reduced fertilizer waste by 31% through variable rate application.",
        "Increased average field productivity by 18%.",
        "Saved approximately 120 hours per season on crop monitoring using drone imagery.",
        "Gained confidence and empowerment in farming decisions.",
        "Became a leader in her local farming community, teaching others about precision agriculture."
      ],
      quote: "I went from feeling overwhelmed to feeling like I have a competitive advantage. The data-driven approach transformed how I farm and gave me peace of mind."
    }
  },
  {
    headline: "42% Pesticide Cost Reduction",
    name: "Mike Rodriguez",
    location: "Kansas",
    photo: "https://images.unsplash.com/photo-1761839257144-297ce252742e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmYXJtaW5nJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjIzNTExMDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    challenge: "Pest resistance made chemical control costly and ineffective on 800 acres.",
    solution: "Implemented Integrated Pest Management; reduced chemicals, boosted beneficial insects.",
    metrics: [
      "67% Beneficial Insect Increase",
      "42% Pesticide Cost Savings"
    ],
    fullStory: {
      farmContext: "800 acres | Wheat & Soybeans | KS",
      challengeDetail: "Mike Rodriguez, who manages an 800-acre wheat and soybean operation, was spending thousands annually on pesticides. Chemical resistance meant his pest control became increasingly expensive and less effective. He also sought to reduce his reliance on harsh chemicals and improve environmental impact.",
      solutionDetail: "Mike implemented our Integrated Pest Management Program. This comprehensive approach combined biological controls, strategic crop rotation, and targeted chemical applications. Pesticide use was only initiated when necessary, based on precise scouting data.",
      results: [
        "Cut pesticide costs by 42% in the first year.",
        "Reduced chemical applications from 8 per season to 3.",
        "Improved beneficial insect populations by 67% according to field surveys.",
        "Maintained or increased crop yields while reducing input costs.",
        "Significantly reduced environmental footprint through sustainable pest management."
      ],
      quote: "I was skeptical about reducing pesticide use, but the IPM program actually worked better than my old approach. My costs went down and my yields went up. It's a win-win."
    }
  }
];

const sampleHTMLCode = `<!-- DIY Social Proof Carousel -->
<div class="testimonial-carousel">
  <div class="testimonial-card">
    <div class="stars">★★★★★</div>
    <p class="quote">
      "Since switching to organic fertilizer, 
      our yield increased 25% while reducing 
      costs. Best decision we've made."
    </p>
    <div class="author">
      <strong>John Peterson</strong>
      <span>Peterson Family Farm</span>
    </div>
  </div>
</div>

<script src="testimonial-carousel.js"></script>`;

export const HomePage: React.FC<HomePageProps> = ({ 
  onNavigateHome,
  onNavigateToThermometer, 
  onNavigateToDIY,
  onNavigateToPricing 
}) => {
  return (
    <div className="min-h-screen bg-white">
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1c1c60] via-[#1c1c60] to-[#5b81ff] text-white">
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1761839257144-297ce252742e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmYXJtaW5nJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjIzNTExMDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Modern farming"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
          <h1 className="mb-6 max-w-4xl mx-auto text-5xl md:text-6xl text-[48px]">
            Turn Your Customers' Success Into Sales
          </h1>
          <p className="mb-8 max-w-2xl mx-auto text-xl text-white/80">
            Transform customer testimonials into beautiful, embeddable carousels that build trust and drive conversions on your agricultural vendor website.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={onNavigateToPricing}
              size="lg" 
              className="bg-[#ebff82] !text-[#1c1c60] hover:bg-[#ebff82]/90 px-8 py-6 text-lg group"
            >
              Start now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section className="py-24 bg-[#f3f3f3]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl text-[#1c1c60]">How It Works</h2>
            <p className="text-xl text-[#717182]">
              Three simple steps to showcase your success stories
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative bg-white p-8 rounded-xl shadow-sm border-2 border-transparent hover:border-[#5b81ff] transition-colors">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#5b81ff] rounded-full flex items-center justify-center">
                <span className="text-white">1</span>
              </div>
              <div className="mb-6 w-16 h-16 bg-[#5b81ff]/10 rounded-lg flex items-center justify-center">
                <Upload className="w-8 h-8 text-[#5b81ff]" />
              </div>
              <h3 className="mb-3 text-[#1c1c60]">Upload your customer stories</h3>
              <p className="text-[#717182]">
                Simply paste your customer testimonials, reviews, or success stories. Our AI refines them into compelling narratives.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white p-8 rounded-xl shadow-sm border-2 border-transparent hover:border-[#5b81ff] transition-colors">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#5b81ff] rounded-full flex items-center justify-center">
                <span className="text-white">2</span>
              </div>
              <div className="mb-6 w-16 h-16 bg-[#ebff82]/20 rounded-lg flex items-center justify-center">
                <Eye className="w-8 h-8 text-[#1c1c60]" />
              </div>
              <h3 className="mb-3 text-[#1c1c60]">Preview your Carousel</h3>
              <p className="text-[#717182]">
                See exactly how your testimonials will look on your site. Customize colors, fonts, and layout to match your brand.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white p-8 rounded-xl shadow-sm border-2 border-transparent hover:border-[#5b81ff] transition-colors">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#5b81ff] rounded-full flex items-center justify-center">
                <span className="text-white">3</span>
              </div>
              <div className="mb-6 w-16 h-16 bg-[#5b81ff]/10 rounded-lg flex items-center justify-center">
                <Code2 className="w-8 h-8 text-[#5b81ff]" />
              </div>
              <h3 className="mb-3 text-[#1c1c60]">Paste the custom HTML code into your Website</h3>
              <p className="text-[#717182]">
                Get a simple HTML snippet that works anywhere. No technical knowledge required—just copy and paste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Stories Carousel Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl text-[#1c1c60]">What Our Customers Say</h2>
            <p className="text-xl text-[#717182]">
              Agricultural vendors who transformed their sales with social proof
            </p>
          </div>

          <CustomerStoryCarousel stories={customerStories} />
        </div>
      </section>

      {/* Code Preview & Demo Section */}
      <section className="py-24 bg-[#f3f3f3]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl text-[#1c1c60]">See It In Action</h2>
            <p className="text-xl text-[#717182]">
              This is what you'll plug in and what you'll see on your site
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Code on the left */}
            <div>
              <h3 className="mb-4 text-[#1c1c60]">The Code</h3>
              <CodePreview code={sampleHTMLCode} />
            </div>

            {/* Preview on the right */}
            <div>
              <h3 className="mb-4 text-[#1c1c60]">The Result</h3>
              <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-[#5b81ff]/20">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-2xl text-[#ebff82]">★</span>
                  ))}
                </div>
                <p className="mb-6 text-lg text-[#1c1c60]">
                  "Since switching to organic fertilizer, our yield increased 25% while reducing costs. Best decision we've made."
                </p>
                <div>
                  <p className="text-[#1c1c60]">John Peterson</p>
                  <p className="text-[#717182]">Peterson Family Farm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECONDARY CTA - Social Proof Thermometer (Barrier-Breaking Tool) */}
      <section className="py-20 bg-gradient-to-br from-[#ebff82] via-[#ebff82] to-[#d4e86f]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-[#1c1c60]/10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Icon/Visual */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-[#5b81ff] to-[#1c1c60] rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-12 h-12 text-[#ebff82]" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block bg-[#5b81ff]/10 text-[#5b81ff] px-4 py-1 rounded-full text-sm mb-3">
                  100% Free Tool
                </div>
                <h2 className="mb-3 text-3xl md:text-4xl text-[#1c1c60]">
                  Not Ready to Invest Yet?
                </h2>
                <p className="text-lg text-[#717182] mb-6">
                  Try our free <span className="text-[#1c1c60]">Social Proof Thermometer</span> first. Get an instant assessment of how your website's social proof is performing and discover what's holding back your conversions.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Button
                    onClick={onNavigateToThermometer}
                    size="lg"
                    className="bg-[#1c1c60] text-white hover:bg-[#2a3f6f] px-8 py-6 text-lg group shadow-lg"
                  >
                    Try the Free Thermometer
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="text-sm text-[#717182] self-center">
                    Takes less than 2 minutes • No credit card required
                  </p>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 pt-8 border-t border-[#E2E8F0] grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl text-[#5b81ff] mb-1">500+</p>
                <p className="text-sm text-[#717182]">Websites Analyzed</p>
              </div>
              <div>
                <p className="text-2xl text-[#5b81ff] mb-1">Instant</p>
                <p className="text-sm text-[#717182]">Results in 60 Seconds</p>
              </div>
              <div>
                <p className="text-2xl text-[#5b81ff] mb-1">Free</p>
                <p className="text-sm text-[#717182]">Detailed Report</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA + Footer Section - Seamless Gradient */}
      <section className="relative bg-gradient-to-b from-[#5b81ff] via-[#1c1c60] to-[#0f0f30]">
        {/* Subtle accent gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ebff82]/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tl from-[#5b81ff]/10 via-transparent to-transparent pointer-events-none" />
        
        {/* CTA Content */}
        <div className="relative py-24 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="mb-6 text-4xl">Ready to boost your sales?</h2>
            <p className="mb-8 text-xl text-white/80">
              Join hundreds of agricultural vendors using social proof to convert more customers.
            </p>
            <Button 
              onClick={onNavigateToPricing}
              size="lg" 
              className="bg-[#ebff82] !text-[#1c1c60] hover:bg-[#ebff82]/90 px-8 py-6 text-lg group"
            >
              Start now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative py-12 text-white border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
              <button
                onClick={onNavigateToThermometer}
                className="text-white/80 hover:text-white transition-colors underline"
              >
                Social Proof Thermometer
              </button>
              <span className="hidden md:inline text-white/40">•</span>
              <button
                onClick={onNavigateToPricing}
                className="text-white/80 hover:text-white transition-colors underline"
              >
                Pricing
              </button>
            </div>
            <p className="text-white/60">
              © 2025 DIY Social Proof Carousel. Built for agricultural vendors who value trust.
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
};