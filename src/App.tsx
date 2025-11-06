import React, { useState, useEffect } from 'react';
import { MainLandingPage } from './components/main-landing-page';
import { HomePage } from './components/home-page';
import { LandingPage } from './components/landing-page';
import { ThermometerProcessing } from './components/ThermometerProcessing';
import { PreviewPage } from './components/preview-page';
import ReportPage from './components/report-page';
import PricingPage from './components/pricing-page';
import { DIYLanding } from './components/diy/DIYLanding';
import { DIYCreate } from './components/diy/DIYCreate';
import { DIYProcessing } from './components/diy/DIYProcessing';
import { DIYPreview } from './components/diy/DIYPreview';
import { DIYDownload } from './components/diy/DIYDownload';
import { DIYProvider } from './contexts/DIYContext';
import { Toaster } from './components/ui/sonner';
import './styles/globals.css';
import faviconImage from 'figma:asset/a340d3568f822aca402a0826caf01ad7806480ba.png';

type Screen = 
  | 'home' 
  | 'thermometer'
  | 'thermometer-processing'
  | 'thermometer-preview'
  | 'thermometer-report'
  | 'pricing'
  | 'diy'
  | 'diy-create'
  | 'diy-processing'
  | 'diy-preview'
  | 'diy-download';

interface ScanData {
  scan_id?: string;
  scores?: any;
  score_total?: number;
  letter_grade?: string;
  flags?: any;
  preview?: any;
  full_report?: any;
  status?: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('diy-download');
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [fullReportData, setFullReportData] = useState<any>(null);
  const [analyzingUrl, setAnalyzingUrl] = useState<string>('');

  // Set favicon
  useEffect(() => {
    const setFavicon = () => {
      // Remove existing favicons
      const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
      existingFavicons.forEach(icon => icon.remove());

      // Add new favicon
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      link.href = faviconImage;
      document.head.appendChild(link);

      // Also set apple-touch-icon
      const appleTouchIcon = document.createElement('link');
      appleTouchIcon.rel = 'apple-touch-icon';
      appleTouchIcon.href = faviconImage;
      document.head.appendChild(appleTouchIcon);
    };

    setFavicon();
  }, []);

  // Initialize screen from URL on mount
  useEffect(() => {
    const path = window.location.pathname;
    const screen = getScreenFromPath(path);
    setCurrentScreen(screen);
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const screen = getScreenFromPath(path);
      setCurrentScreen(screen);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Helper function to map URL paths to screens
  const getScreenFromPath = (path: string): Screen => {
    if (path === '/' || path === '/home') return 'home';
    if (path === '/thermometer') return 'thermometer';
    if (path === '/thermometer-processing') return 'thermometer-processing';
    if (path === '/thermometer/preview') return 'thermometer-preview';
    if (path === '/thermometer/report') return 'thermometer-report';
    if (path === '/pricing') return 'pricing';
    if (path === '/diy') return 'diy';
    if (path === '/diy-create') return 'diy-create';
    if (path === '/diy-processing') return 'diy-processing';
    if (path === '/diy-preview') return 'diy-preview';
    if (path === '/diy-download') return 'diy-download';
    return 'home'; // default fallback
  };

  // Helper function to navigate and update URL
  const navigateTo = (screen: Screen, path: string) => {
    setCurrentScreen(screen);
    window.history.pushState({}, '', path);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleThermometerSubmit = (url: string) => {
    setAnalyzingUrl(url);
    navigateTo('thermometer-processing', '/thermometer-processing');
  };

  const handleThermometerSuccess = (data: ScanData) => {
    setScanData(data);
    navigateTo('thermometer-preview', '/thermometer/preview');
  };

  const handleThermometerError = () => {
    navigateTo('thermometer', '/thermometer');
  };

  const handleUnlockSuccess = (data: any) => {
    setFullReportData(data);
    navigateTo('thermometer-report', '/thermometer/report');
  };

  const handleNavigateHome = () => {
    navigateTo('home', '/');
  };

  const handleNavigateToThermometer = () => {
    navigateTo('thermometer', '/thermometer');
  };

  const handleNavigateToDIY = () => {
    navigateTo('diy', '/diy');
  };

  const handleNavigateToDIYCreate = () => {
    navigateTo('diy-create', '/diy-create');
  };

  const handleNavigateToDIYProcessing = () => {
    navigateTo('diy-processing', '/diy-processing');
  };

  const handleNavigateToDIYPreview = (generationId?: string) => {
    if (generationId) {
      navigateTo('diy-preview', `/diy-preview?id=${generationId}`);
    } else {
      navigateTo('diy-preview', '/diy-preview');
    }
  };

  const handleNavigateToDIYDownload = (generationId?: string) => {
    if (generationId) {
      navigateTo('diy-download', `/diy-download?id=${generationId}`);
    } else {
      navigateTo('diy-download', '/diy-download');
    }
  };

  const handleNavigateToPricing = () => {
    navigateTo('pricing', '/pricing');
  };

  return (
    <DIYProvider>
      <div>
        <Toaster position="top-right" />
      {currentScreen === 'home' && (
        <MainLandingPage 
          onNavigateToThermometer={handleNavigateToThermometer}
          onNavigateToDIY={handleNavigateToDIY}
          onNavigateToPricing={handleNavigateToPricing}
        />
      )}
      {currentScreen === 'diy' && (
        <DIYLanding
          onNavigateHome={handleNavigateHome}
          onNavigateToThermometer={handleNavigateToThermometer}
          onNavigateToDIY={handleNavigateToDIY}
          onNavigateToPricing={handleNavigateToPricing}
          onNavigateToDIYCreate={handleNavigateToDIYCreate}
        />
      )}
      {currentScreen === 'diy-create' && (
        <DIYCreate
          onNavigateHome={handleNavigateHome}
          onNavigateToThermometer={handleNavigateToThermometer}
          onNavigateToDIY={handleNavigateToDIY}
          onNavigateToPricing={handleNavigateToPricing}
          onNavigateToDIYProcessing={handleNavigateToDIYProcessing}
        />
      )}
      {currentScreen === 'diy-processing' && (
        <DIYProcessing
          onNavigateHome={handleNavigateHome}
          onNavigateToThermometer={handleNavigateToThermometer}
          onNavigateToDIY={handleNavigateToDIY}
          onNavigateToPricing={handleNavigateToPricing}
          onNavigateToDIYPreview={handleNavigateToDIYPreview}
          onNavigateToDIYCreate={handleNavigateToDIYCreate}
        />
      )}
      {currentScreen === 'diy-preview' && (
        <DIYPreview
          onNavigateHome={handleNavigateHome}
          onNavigateToThermometer={handleNavigateToThermometer}
          onNavigateToDIY={handleNavigateToDIY}
          onNavigateToPricing={handleNavigateToPricing}
          onNavigateToDIYDownload={handleNavigateToDIYDownload}
          onNavigateToDIYCreate={handleNavigateToDIYCreate}
        />
      )}
      {currentScreen === 'diy-download' && (
        <DIYDownload
          onNavigateHome={handleNavigateHome}
          onNavigateToThermometer={handleNavigateToThermometer}
          onNavigateToDIY={handleNavigateToDIY}
          onNavigateToPricing={handleNavigateToPricing}
        />
      )}
      {currentScreen === 'thermometer' && (
        <LandingPage 
          onSuccess={handleThermometerSubmit}
          onNavigateHome={handleNavigateHome}
          onNavigateToThermometer={handleNavigateToThermometer}
          onNavigateToDIY={handleNavigateToDIY}
          onNavigateToPricing={handleNavigateToPricing}
        />
      )}
      {currentScreen === 'thermometer-processing' && (
        <ThermometerProcessing
          url={analyzingUrl}
          onSuccess={handleThermometerSuccess}
          onNavigateHome={handleNavigateHome}
          onNavigateToThermometer={handleNavigateToThermometer}
          onNavigateToDIY={handleNavigateToDIY}
          onNavigateToPricing={handleNavigateToPricing}
          onError={handleThermometerError}
        />
      )}
      {currentScreen === 'thermometer-preview' && scanData && (
        <PreviewPage 
          data={scanData} 
          onUnlockSuccess={handleUnlockSuccess}
          onNavigateHome={handleNavigateHome}
          onNavigateToThermometer={handleNavigateToThermometer}
          onNavigateToDIY={handleNavigateToDIY}
          onNavigateToPricing={handleNavigateToPricing}
        />
      )}
      {currentScreen === 'thermometer-report' && fullReportData && (
        <ReportPage 
          data={fullReportData}
          onNavigateToPricing={handleNavigateToPricing}
          onNavigateToDIY={handleNavigateToDIY}
        />
      )}
      {currentScreen === 'pricing' && (
        <PricingPage 
          onNavigateHome={handleNavigateHome}
          onNavigateToDIY={handleNavigateToDIY}
        />
      )}
      </div>
    </DIYProvider>
  );
}