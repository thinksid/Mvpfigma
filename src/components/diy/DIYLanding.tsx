import { Navigation } from '../Navigation';
import { Upload, Eye, Code2, ArrowRight, X, Check } from 'lucide-react';
import { Button } from '../ui/button-simple';
import { ThinkSidsCarousel } from '../ThinkSidsCarousel';
import { CodePreview } from '../CodePreview';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import carouselPreviewImage from '../../assets/00ba47538c52501c3f143a608514979f2c1f6213.png';
import image_066079ea76dbb1c4070b0fbcf6c6b88ae9766072 from '../../assets/066079ea76dbb1c4070b0fbcf6c6b88ae9766072.png';
import image_4a18ae42701be2fc15037d37d296a7ce66a36686 from '../../assets/4a18ae42701be2fc15037d37d296a7ce66a36686.png';
import image_f44254d0d6e22d9d926524de6c35bc2f7cf74b9b from '../../assets/f44254d0d6e22d9d926524de6c35bc2f7cf74b9b.png';
import image_1e13ed9b8f1270426370ad9ff3f88e9cba33ecb8 from '../../assets/1e13ed9b8f1270426370ad9ff3f88e9cba33ecb8.png';
import { trackDIYStart, trackDIYCreateStarted } from '../../utils/analytics';

interface DIYLandingProps {
  onNavigateHome: () => void;
  onNavigateToThermometer: () => void;
  onNavigateToDIY: () => void;
  onNavigateToPricing: () => void;
  onNavigateToDIYCreate: () => void;
}

export const customerStories = [
  {
    headline: "47% Increase in Lead Quality with DIY Carousel",
    name: "Marcus Chen",
    location: "Bio-Nutrient Solutions, California",
    photo: "https://images.unsplash.com/photo-1543879739-ab87be3df369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGJ1c2luZXNzJTIwbWFuJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MjMzNDM2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    challenge: "Generic testimonials weren't converting website visitors into qualified leads.",
    solution: "Used think SID's DIY Social Proof Carousel to showcase farmer results with specific metrics.",
    metrics: [
      "47% Increase in Lead Quality",
      "22% More Demo Requests"
    ],
    fullStory: {
      farmContext: "Organic Fertilizer Vendor | CA",
      challengeDetail: "Marcus Chen's company, Bio-Nutrient Solutions, had plenty of happy customers but struggled to convert website traffic. Generic testimonials like 'great product!' weren't compelling enough for skeptical farmers who needed proof before investing thousands in a new soil amendment program.",
      solutionDetail: "Marcus used think SID's DIY Social Proof Carousel tool to transform vague praise into data-rich success stories. He plugged in farmer testimonials with specific yield increases, cost savings, and soil health metrics. The carousel automatically formatted everything into a professional, conversion-optimized design.",
      results: [
        "Lead quality score increased by 47% - more qualified prospects reaching out.",
        "Demo requests jumped 22% within the first month of deployment.",
        "Reduced sales cycle by 18% because prospects arrived pre-convinced by peer success stories.",
        "Implementation took just 45 minutes from start to website deployment."
      ],
      quote: "I was shocked how easy it was. I just pasted in our farmer results, customized the colors to match our brand, and had a professional carousel live on our site the same afternoon. The quality of our inbound leads improved immediately."
    }
  },
  {
    headline: "61% Conversion Rate Lift with Guided Implementation",
    name: "Jennifer Martinez",
    location: "PrecisionAg Systems, Iowa",
    photo: "https://images.unsplash.com/photo-1692459411840-f396f46a0524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXRpbmElMjBidXNpbmVzc3dvbWFuJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MjMzODI0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    challenge: "Had testimonials but didn't know how to tell compelling stories that drive sales.",
    solution: "Partnered with think SID's Do It With You service for storytelling strategy and deployment.",
    metrics: [
      "61% Homepage Conversion Increase",
      "38% Higher Email Opt-ins"
    ],
    fullStory: {
      farmContext: "Precision Ag Technology | IA",
      challengeDetail: "Jennifer's team at PrecisionAg Systems sold drone mapping and soil analysis services. They had customer success data but struggled to craft narratives that resonated with their target audience. Their website had a 2.1% conversion rate - well below industry benchmarks for ag tech.",
      solutionDetail: "Think SID's Do It With You service provided strategic guidance on testimonial collection, helped identify the most compelling customer stories, and worked with Jennifer's team to structure case studies that highlighted ROI. They received templates, storytelling frameworks, and hands-on support during implementation.",
      results: [
        "Homepage conversion rate jumped from 2.1% to 3.4% (61% relative increase).",
        "Email newsletter opt-ins increased by 38% thanks to gated case study downloads.",
        "Sales team reported prospects mentioning specific customer stories during discovery calls.",
        "Jennifer's team learned a repeatable framework for collecting and showcasing testimonials going forward."
      ],
      quote: "The think SID team didn't just hand us templates - they taught us how to think about social proof strategically. We now have a system for continuously collecting farmer success stories and turning them into sales assets. Best investment we made this year."
    }
  },
  {
    headline: "83% More Qualified Demos with Full-Service Package",
    name: "David Kowalski",
    location: "SoilHealth Innovations, Nebraska",
    photo: "https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc21hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjMxODYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    challenge: "No time to collect testimonials or build social proof infrastructure themselves.",
    solution: "Think SID's Done For You service handled everything from testimonial collection to deployment.",
    metrics: [
      "83% Increase in Demo Requests",
      "52% Shorter Sales Cycles"
    ],
    fullStory: {
      farmContext: "Regenerative Agriculture Consulting | NE",
      challengeDetail: "David Kowalski founded SoilHealth Innovations to help farmers transition to regenerative practices, but his small team was overwhelmed. They had no marketing bandwidth to properly showcase customer wins, and their website featured outdated, generic content. Prospects often asked for 'proof it works' before committing to $15K+ consulting packages.",
      solutionDetail: "Think SID's Done For You service took the entire burden off David's team. They conducted video interviews with SoilHealth's top customers, extracted compelling metrics, crafted data-driven case studies, designed custom social proof elements, and deployed everything on the website - all within 6 weeks.",
      results: [
        "Demo requests increased by 83% in the first quarter after launch.",
        "Sales cycle shortened by 52% because prospects arrived already convinced of ROI.",
        "Customer acquisition cost dropped 29% due to higher conversion rates.",
        "David's team gained 15+ hours per week previously spent explaining 'why regenerative ag works' - now the website does that job.",
        "Case study page became the second-most visited page on the entire website."
      ],
      quote: "I couldn't believe how hands-off this was. Think SID interviewed our customers, wrote the stories, designed everything, and even handled the technical deployment. We went from zero social proof to a conversion machine in 6 weeks. The ROI was immediate and measurable."
    }
  }
];

const sampleHTMLCode = `<!-- Social Proof Carousel - Paste anywhere on your site -->
<div id="sp-carousel" style="max-width:600px;margin:0 auto;padding:20px;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
  <div class="sp-slide">
    <div style="color:#ffc107;font-size:24px;margin-bottom:12px">★★★★★</div>
    <p style="font-size:18px;color:#333;margin-bottom:16px;line-height:1.6">
      "Yield up 23%, costs down $45/acre. This organic program transformed our farm."
    </p>
    <div style="display:flex;align-items:center;gap:12px">
      <img src="farmer.jpg" style="width:48px;height:48px;border-radius:50%;object-fit:cover" alt="Farmer">
      <div>
        <strong style="display:block;color:#333">John Anderson</strong>
        <span style="color:#666;font-size:14px">500-acre Corn Farm, Iowa</span>
      </div>
    </div>
  </div>
</div>
<script src="https://cdn.thinkSID.com/carousel.min.js"></script>`;

export const DIYLanding: React.FC<DIYLandingProps> = ({
  onNavigateHome,
  onNavigateToThermometer,
  onNavigateToDIY,
  onNavigateToPricing,
  onNavigateToDIYCreate,
}) => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 lg:py-32 text-center">
          <h1 className="mb-4 sm:mb-6 max-w-4xl mx-auto text-2xl sm:text-3xl md:text-4xl lg:text-[40px] leading-tight">
            Turn Your Customers' Success Into Sales
          </h1>
          <p className="mb-6 sm:mb-8 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-white/80 px-2">
            Transform customer testimonials into beautiful plug-and-play carousels that build trust and drive conversions on your website.
          </p>
          <Button 
            size="lg" 
            className="bg-[#ebff82] !text-[#1c1c60] hover:bg-[#ebff82]/90 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg group"
            onClick={() => {
              trackDIYStart();
              onNavigateToDIYCreate();
            }}
          >
            Create Your Carousel
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Go From This to This Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="mb-3 sm:mb-4 text-[#1c1c60] text-2xl sm:text-3xl lg:text-[40px]">Transform Generic Reviews Into Conversion Machines</h2>
            <p className="text-base sm:text-lg md:text-xl text-[#717182] px-2">
              Stop wasting valuable testimonials with boring, generic displays
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 max-w-6xl mx-auto">
            {/* Left: Go from this */}
            <div className="flex flex-col">
              <h3 className="mb-6 text-[#717182] text-lg sm:text-xl text-center h-8 flex items-center justify-center">Go from this</h3>
              
              {/* Card container with fixed height */}
              <div className="flex items-center justify-center mb-12" style={{ minHeight: '280px' }}>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
                  <div className="flex gap-1 mb-3 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 text-base italic mb-3 text-center">
                    "Working with AgVendor was great!"
                  </p>
                  <p className="text-gray-500 text-sm text-center">
                    - Customer
                  </p>
                </div>
              </div>
              
              {/* X marks - problems */}
              <div className="space-y-4 w-full max-w-md mx-auto flex flex-col items-center">
                <div className="flex items-start gap-3">
                  <X className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-600 text-base sm:text-lg">Doesn't show your value</p>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-600 text-base sm:text-lg">Doesn't tell a story</p>
                </div>
                <div className="flex items-start gap-3">
                  <X className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-600 text-base sm:text-lg">5-star rating generates doubt, not trust</p>
                </div>
              </div>
            </div>

            {/* Right: To this */}
            <div className="flex flex-col">
              <h3 className="mb-6 text-[#5b81ff] text-lg sm:text-xl text-center h-8 flex items-center justify-center">To this</h3>
              
              {/* Card container with fixed height */}
              <div className="flex items-center justify-center mb-12" style={{ minHeight: '280px' }}>
                <div className="w-full max-w-md">
                  <ImageWithFallback
                    src={carouselPreviewImage}
                    alt="Professional social proof carousel showing detailed farmer testimonials with metrics"
                    className="w-full rounded-lg shadow-xl border-2 border-[#5b81ff] scale-120 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-out"
                  />
                </div>
              </div>
              
              {/* Check marks - benefits */}
              <div className="space-y-4 w-full max-w-md mx-auto flex flex-col items-center">
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-[#5b81ff] flex-shrink-0 mt-1" />
                  <p className="text-[#1c1c60] text-base sm:text-lg">Builds farmer-to-farmer trust</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-[#5b81ff] flex-shrink-0 mt-1" />
                  <p className="text-[#1c1c60] text-base sm:text-lg">Tells YOUR story for you</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-[#5b81ff] flex-shrink-0 mt-1" />
                  <p className="text-[#1c1c60] text-base sm:text-lg">Lets numbers prove your value</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section className="py-16 sm:py-24 bg-[#f3f3f3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="mb-3 sm:mb-4 text-[#1c1c60] text-2xl sm:text-3xl lg:text-[40px]">How It Works</h2>
            <p className="text-base sm:text-lg md:text-xl text-[rgb(28,28,96)] px-2">
              Three simple steps to showcase your success stories
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="relative bg-white p-6 sm:p-8 rounded-xl shadow-sm border-2 border-transparent hover:border-[#5b81ff] transition-colors">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#5b81ff] rounded-full flex items-center justify-center">
                <span className="text-white">1</span>
              </div>
              <div className="mb-6 w-16 h-16 bg-[#5b81ff]/10 rounded-lg flex items-center justify-center">
                <Upload className="w-8 h-8 text-[#5b81ff]" />
              </div>
              <h3 className="mb-3 text-[#1c1c60] text-lg sm:text-xl">Upload your customer stories</h3>
              <p className="text-[#717182] text-sm sm:text-base">
                Simply paste your customer testimonials, reviews, or success stories. Our AI refines them into compelling narratives.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white p-6 sm:p-8 rounded-xl shadow-sm border-2 border-transparent hover:border-[#5b81ff] transition-colors">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#5b81ff] rounded-full flex items-center justify-center">
                <span className="text-white">2</span>
              </div>
              <div className="mb-6 w-16 h-16 bg-[#ebff82]/20 rounded-lg flex items-center justify-center">
                <Eye className="w-8 h-8 text-[#1c1c60]" />
              </div>
              <h3 className="mb-3 text-[#1c1c60] text-lg sm:text-xl">Preview your Carousel</h3>
              <p className="text-[#717182] text-sm sm:text-base">
                See exactly how your testimonials will look on your site. Customize colors, fonts, and layout to match your brand.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white p-6 sm:p-8 rounded-xl shadow-sm border-2 border-transparent hover:border-[#5b81ff] transition-colors">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#5b81ff] rounded-full flex items-center justify-center">
                <span className="text-white">3</span>
              </div>
              <div className="mb-6 w-16 h-16 bg-[#5b81ff]/10 rounded-lg flex items-center justify-center">
                <Code2 className="w-8 h-8 text-[#5b81ff]" />
              </div>
              <h3 className="mb-3 text-[#1c1c60] text-lg sm:text-xl">Paste the custom HTML code into your Website</h3>
              <p className="text-[#717182] text-sm sm:text-base">
                Get a simple HTML snippet that works anywhere. No technical knowledge required—just copy and paste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Preview & Demo Section */}
      <section className="py-16 sm:py-24 bg-[#f3f3f3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="mb-3 sm:mb-4 text-[#1c1c60] text-2xl sm:text-3xl lg:text-[40px]">See It In Action</h2>
            <p className="text-base sm:text-lg md:text-xl text-[#717182] px-2">
              This is what you'll plug in and what you'll see on your site
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start">
            {/* Code on the left */}
            <div className="min-w-0">
              <h3 className="mb-4 text-[#1c1c60] text-lg sm:text-xl">The Code</h3>
              <CodePreview code={sampleHTMLCode} />
            </div>

            {/* Preview on the right */}
            <div className="min-w-0">
              <h3 className="mb-4 text-[#1c1c60] text-lg sm:text-xl">The Platform</h3>
              <p className="mb-6 text-[#717182] text-sm sm:text-base">
                This custom code can be easily plugged into most website managers
              </p>
              
              {/* 2x2 Grid of Platform Icons */}
              <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                {/* WordPress */}
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                  <ImageWithFallback
                    src={image_066079ea76dbb1c4070b0fbcf6c6b88ae9766072}
                    alt="WordPress"
                    className="w-full h-24 object-contain"
                  />
                </div>
                
                {/* Shopify */}
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                  <ImageWithFallback
                    src={image_4a18ae42701be2fc15037d37d296a7ce66a36686}
                    alt="Shopify"
                    className="w-full h-24 object-contain"
                  />
                </div>
                
                {/* HTML */}
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                  <ImageWithFallback
                    src={image_f44254d0d6e22d9d926524de6c35bc2f7cf74b9b}
                    alt="HTML"
                    className="w-full h-24 object-contain grayscale"
                  />
                </div>
                
                {/* 4th Platform - Placeholder */}
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                  <ImageWithFallback
                    src={image_1e13ed9b8f1270426370ad9ff3f88e9cba33ecb8}
                    alt="Platform 4"
                    className="w-full h-24 object-contain"
                  />
                </div>
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
        <div className="relative py-16 sm:py-24 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-[40px]">Ready to boost your sales?</h2>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg md:text-xl text-white/80 px-2">
              Join hundreds of agricultural vendors using social proof to convert more customers.
            </p>
            <Button 
              size="lg" 
              className="bg-[#ebff82] text-[#1c1c60] hover:bg-[#ebff82]/90 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg group"
              onClick={() => {
                trackDIYCreateStarted();
                onNavigateToDIYCreate();
              }}
            >
              Start Creating
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative py-12 text-white border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-white/60 text-sm sm:text-base">
              © 2025 DIY Social Proof Carousel. Built for agricultural vendors who value trust.
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
};