import image_606061009c53a75486f86348358a6812983190ed from '../assets/606061009c53a75486f86348358a6812983190ed.png';
import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Button } from './ui/button-simple';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from './ui/sheet-simple';
import { VisuallyHidden } from './ui/visually-hidden';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logo from '../assets/d2305a08b87429395ab71a84cfa59ed81967566b.png';

interface NavigationProps {
  onNavigateHome: () => void;
  onNavigateToThermometer: () => void;
  onNavigateToDIY: () => void;
  onNavigateToPricing: () => void;
  currentPage?: 'home' | 'thermometer' | 'diy' | 'pricing' | 'other';
}

export const Navigation: React.FC<NavigationProps> = ({
  onNavigateHome,
  onNavigateToThermometer,
  onNavigateToDIY,
  onNavigateToPricing,
  currentPage = 'other',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isCurrentPage = (page: string) => currentPage === page;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
      style={{ height: '80px' }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Left: Logo + Brand */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
        >
          <ImageWithFallback src={image_606061009c53a75486f86348358a6812983190ed} alt="Think SID Logo" className="h-10 sm:h-12 w-auto" />
        </button>

        {/* Right: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={onNavigateToThermometer}
            className={`text-[16px] font-medium transition-colors ${
              isCurrentPage('thermometer')
                ? 'text-[#1c1c60] underline'
                : 'text-[#475569] hover:text-[#1c1c60] hover:underline'
            }`}
          >
            Social Proof Thermometer
          </button>
          <button
            onClick={onNavigateToDIY}
            className={`text-[16px] font-medium transition-colors ${
              isCurrentPage('diy')
                ? 'text-[#1c1c60] underline'
                : 'text-[#475569] hover:text-[#1c1c60] hover:underline'
            }`}
          >
            DIY Social Proof Carousel
          </button>
          <button
            onClick={onNavigateToPricing}
            className={`text-[16px] font-medium transition-colors ${
              isCurrentPage('pricing')
                ? 'text-[#1c1c60] underline'
                : 'text-[#475569] hover:text-[#1c1c60] hover:underline'
            }`}
          >
            Pricing
          </button>
          <a
            href="https://thinksid.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[16px] font-medium text-[#475569] hover:text-[#1c1c60] hover:underline transition-colors"
          >
            Blog
          </a>
          <Button
            onClick={onNavigateToThermometer}
            className="h-11 px-6 !bg-[#ebff82] !text-[#1c1c60] hover:!bg-[#e0f570] hover:-translate-y-0.5 rounded-lg transition-all"
          >
            Try Free Tool
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-[#1c1c60]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Choose a page to navigate to</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-8">
                <button
                  onClick={() => {
                    onNavigateToThermometer();
                    setMobileMenuOpen(false);
                  }}
                  className={`text-lg font-medium text-left ${
                    isCurrentPage('thermometer')
                      ? 'text-[#1c1c60] underline'
                      : 'text-[#475569] hover:text-[#1c1c60]'
                  }`}
                >
                  Thermometer
                </button>
                <button
                  onClick={() => {
                    onNavigateToDIY();
                    setMobileMenuOpen(false);
                  }}
                  className={`text-lg font-medium text-left ${
                    isCurrentPage('diy')
                      ? 'text-[#1c1c60] underline'
                      : 'text-[#475569] hover:text-[#1c1c60]'
                  }`}
                >
                  DIY Tool
                </button>
                <button
                  onClick={() => {
                    onNavigateToPricing();
                    setMobileMenuOpen(false);
                  }}
                  className={`text-lg font-medium text-left ${
                    isCurrentPage('pricing')
                      ? 'text-[#1c1c60] underline'
                      : 'text-[#475569] hover:text-[#1c1c60]'
                  }`}
                >
                  Pricing
                </button>
                <a
                  href="https://thinksid.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-left text-[#475569] hover:text-[#1c1c60]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </a>
                <Button
                  onClick={() => {
                    onNavigateToThermometer();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full h-12 bg-[#ebff82] !text-[#1c1c60] hover:bg-[#e0f570] rounded-lg"
                >
                  Try Free Tool
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};