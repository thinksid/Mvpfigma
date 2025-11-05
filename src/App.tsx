import React, { useState } from 'react';
import { MainLandingPage } from './components/main-landing-page';
import { HomePage } from './components/home-page';
import { LandingPage } from './components/landing-page';
import { PreviewPage } from './components/preview-page';
import ReportPage from './components/report-page';
import PricingPage from './components/pricing-page';
import { Toaster } from './components/ui/sonner';
import './styles/globals.css';

type Screen = 'home' | 'diy' | 'thermometer' | 'preview' | 'report' | 'pricing';

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
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [fullReportData, setFullReportData] = useState<any>(null);

  const handleThermometerSuccess = (data: ScanData) => {
    setScanData(data);
    setCurrentScreen('preview');
  };

  const handleUnlockSuccess = (data: any) => {
    setFullReportData(data);
    setCurrentScreen('report');
  };

  const handleNavigateHome = () => {
    setCurrentScreen('home');
  };

  const handleNavigateToThermometer = () => {
    setCurrentScreen('thermometer');
  };

  const handleNavigateToDIY = () => {
    setCurrentScreen('diy');
  };

  const handleNavigateToPricing = () => {
    setCurrentScreen('pricing');
  };

  return (
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
        <HomePage 
          onNavigateHome={handleNavigateHome}
          onNavigateToThermometer={handleNavigateToThermometer}
          onNavigateToDIY={handleNavigateToDIY}
          onNavigateToPricing={handleNavigateToPricing}
        />
      )}
      {currentScreen === 'thermometer' && (
        <LandingPage 
          onSuccess={handleThermometerSuccess}
          onNavigateHome={handleNavigateHome}
          onNavigateToThermometer={handleNavigateToThermometer}
          onNavigateToDIY={handleNavigateToDIY}
          onNavigateToPricing={handleNavigateToPricing}
        />
      )}
      {currentScreen === 'preview' && scanData && (
        <PreviewPage 
          data={scanData} 
          onUnlockSuccess={handleUnlockSuccess}
          onNavigateHome={handleNavigateHome}
          onNavigateToThermometer={handleNavigateToThermometer}
          onNavigateToDIY={handleNavigateToDIY}
          onNavigateToPricing={handleNavigateToPricing}
        />
      )}
      {currentScreen === 'report' && fullReportData && (
        <ReportPage 
          data={fullReportData}
          onNavigateHome={handleNavigateHome}
          onNavigateToThermometer={handleNavigateToThermometer}
          onNavigateToDIY={handleNavigateToDIY}
          onNavigateToPricing={handleNavigateToPricing}
        />
      )}
      {currentScreen === 'pricing' && (
        <PricingPage 
          onNavigateHome={handleNavigateHome}
          onNavigateToThermometer={handleNavigateToThermometer}
          onNavigateToDIY={handleNavigateToDIY}
          onNavigateToPricing={handleNavigateToPricing}
        />
      )}
    </div>
  );
}
