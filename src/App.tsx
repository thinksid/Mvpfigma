import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './styles/globals.css';
import { MainLandingPage } from './components/main-landing-page';
import { LandingPage } from './components/landing-page';
import { PreviewPage } from './components/preview-page';
import ReportPage from './components/report-page';
import { DIYLanding } from './components/diy/DIYLanding';
import { DIYCreate } from './components/diy/DIYCreate';
import { DIYProcessing } from './components/diy/DIYProcessing';
import { DIYPreview } from './components/diy/DIYPreview';
import { DIYDownload } from './components/diy/DIYDownload';
import { ThermometerProcessing } from './components/ThermometerProcessing';
import PricingPage from './components/pricing-page';
import { DIYProvider } from './contexts/DIYContext';
import { initializeGA, trackPageView } from './utils/analytics.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';

// Analytics wrapper component
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname, window.location.href);
  }, [location]);

  return null;
}

// Sitemap component that renders XML
function Sitemap() {
  React.useEffect(() => {
    // Set the content type to XML
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Type';
    meta.content = 'application/xml';
    document.head.appendChild(meta);
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
      {`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://thinksid.co/</loc>
    <lastmod>2025-11-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://thinksid.co/thermometer</loc>
    <lastmod>2025-11-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://thinksid.co/diy</loc>
    <lastmod>2025-11-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://thinksid.co/pricing</loc>
    <lastmod>2025-11-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`}
    </div>
  );
}

// Navigation wrapper component for consistent navigation props
function AppContent() {
  const navigateToHome = () => window.location.href = '/';
  const navigateToThermometer = () => window.location.href = '/thermometer';
  const navigateToDIY = () => window.location.href = '/diy';
  const navigateToPricing = () => window.location.href = '/pricing';

  return (
    <Routes>
      <Route path="/" element={
        <MainLandingPage
          onNavigateToThermometer={navigateToThermometer}
          onNavigateToDIY={navigateToDIY}
          onNavigateToPricing={navigateToPricing}
        />
      } />

      <Route path="/thermometer" element={
        <LandingPage
          onSuccess={(url) => {
            window.location.href = `/thermometer/processing?url=${encodeURIComponent(url)}`;
          }}
          onNavigateHome={navigateToHome}
          onNavigateToThermometer={navigateToThermometer}
          onNavigateToDIY={navigateToDIY}
          onNavigateToPricing={navigateToPricing}
        />
      } />

      <Route path="/thermometer/processing" element={
        <ThermometerProcessing
          url={new URLSearchParams(window.location.search).get('url') || ''}
          onSuccess={(data) => {
            window.location.href = `/thermometer/preview?id=${data.scan_id}`;
          }}
          onError={() => window.location.href = '/thermometer'}
          onNavigateHome={navigateToHome}
          onNavigateToThermometer={navigateToThermometer}
          onNavigateToDIY={navigateToDIY}
          onNavigateToPricing={navigateToPricing}
        />
      } />

      <Route path="/thermometer/preview" element={
        <PreviewPage
          data={{
            scan_id: new URLSearchParams(window.location.search).get('id') || '',
            url: '',
            letter: 'A',
            score_total: 85,
            status: 'completed',
            preview: {
              top3: ['Placeholder finding 1', 'Placeholder finding 2', 'Placeholder finding 3'],
              total: 85,
              letter: 'A',
              headline: 'Your website shows strong social proof elements'
            }
          }}
          onUnlockSuccess={(fullReportData) => {
            const urlParams = new URLSearchParams(window.location.search);
            const scanId = urlParams.get('id');
            if (scanId) {
              window.location.href = `/thermometer/report?id=${scanId}`;
            }
          }}
          onNavigateHome={navigateToHome}
          onNavigateToThermometer={navigateToThermometer}
          onNavigateToDIY={navigateToDIY}
          onNavigateToPricing={navigateToPricing}
        />
      } />

      <Route path="/thermometer/report" element={
        <ReportPage
          data={{
            scan_id: new URLSearchParams(window.location.search).get('id') || '',
            lead_id: '',
            email: '',
            name: '',
            url: '',
            letter: 'A',
            score_total: 85,
            full_report: {
              findings: [],
              scores: {},
              strategic: 'Placeholder strategic content',
              tacticals: []
            }
          }}
          onNavigateToPricing={navigateToPricing}
          onNavigateToDIY={navigateToDIY}
        />
      } />

      <Route path="/diy" element={
        <DIYLanding
          onNavigateHome={navigateToHome}
          onNavigateToThermometer={navigateToThermometer}
          onNavigateToDIY={navigateToDIY}
          onNavigateToPricing={navigateToPricing}
          onNavigateToDIYCreate={() => window.location.href = '/diy/create'}
        />
      } />

      <Route path="/diy/create" element={
        <DIYCreate
          onNavigateHome={navigateToHome}
          onNavigateToThermometer={navigateToThermometer}
          onNavigateToDIY={navigateToDIY}
          onNavigateToPricing={navigateToPricing}
          onNavigateToDIYProcessing={() => window.location.href = '/diy/processing'}
        />
      } />

      <Route path="/diy/processing" element={
        <DIYProcessing
          onNavigateHome={navigateToHome}
          onNavigateToThermometer={navigateToThermometer}
          onNavigateToDIY={navigateToDIY}
          onNavigateToPricing={navigateToPricing}
          onNavigateToDIYPreview={(generationId) => {
            window.location.href = `/diy/preview?id=${generationId}`;
          }}
          onNavigateToDIYCreate={() => window.location.href = '/diy/create'}
        />
      } />

      <Route path="/diy/preview" element={
        <DIYPreview
          onNavigateHome={navigateToHome}
          onNavigateToThermometer={navigateToThermometer}
          onNavigateToDIY={navigateToDIY}
          onNavigateToPricing={navigateToPricing}
          onNavigateToDIYCreate={() => window.location.href = '/diy/create'}
          onNavigateToDIYDownload={(generationId) => {
            window.location.href = `/diy/download?id=${generationId}`;
          }}
        />
      } />

      <Route path="/diy/download" element={
        <DIYDownload
          onNavigateHome={navigateToHome}
          onNavigateToThermometer={navigateToThermometer}
          onNavigateToDIY={navigateToDIY}
          onNavigateToPricing={navigateToPricing}
        />
      } />

      <Route path="/pricing" element={
        <PricingPage
          onNavigateHome={navigateToHome}
          onNavigateToDIY={navigateToDIY}
        />
      } />

      <Route path="/sitemap.xml" element={<Sitemap />} />

      <Route path="*" element={
        <div className="min-h-screen bg-white p-8">
          <h1>Page not found</h1>
        </div>
      } />
    </Routes>
  );
}

export default function App() {
  // Initialize Google Analytics on mount
  useEffect(() => {
    initializeGA();
    console.log('✅ Google Analytics initialized (G-6MV1K9S3JP)');
  }, []);

  return (
    <Router>
      <AnalyticsTracker />
      <DIYProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </DIYProvider>
    </Router>
  );
}