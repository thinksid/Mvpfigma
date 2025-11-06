import React, { useState } from 'react';
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

type Screen = 
  | 'home' 
  | 'thermometer'
  | 'thermometer-processing'
  | 'preview' 
  | 'report' 
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
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [fullReportData, setFullReportData] = useState<any>(null);
  const [analyzingUrl, setAnalyzingUrl] = useState<string>('');

  const handleThermometerSubmit = (url: string) => {
    setAnalyzingUrl(url);
    setCurrentScreen('thermometer-processing');
  };

  const handleThermometerSuccess = (data: ScanData) => {
    setScanData(data);
    setCurrentScreen('preview');
  };

  const handleThermometerError = () => {
    setCurrentScreen('thermometer');
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

  const handleNavigateToDIYCreate = () => {
    setCurrentScreen('diy-create');
  };

  const handleNavigateToDIYProcessing = () => {
    setCurrentScreen('diy-processing');
  };

  const handleNavigateToDIYPreview = () => {
    setCurrentScreen('diy-preview');
  };

  const handleNavigateToDIYDownload = () => {
    setCurrentScreen('diy-download');
  };

  const handleNavigateToPricing = () => {
    setCurrentScreen('pricing');
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
