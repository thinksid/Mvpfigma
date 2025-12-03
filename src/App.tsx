import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './styles/globals.css';
import { MainLandingPage } from './components/main-landing-page';
import { LandingPage } from './components/landing-page';
import { PreviewPage } from './components/preview-page';
import ReportPage from './components/report-page';
import { DIYLanding } from './components/diy/DIYLanding';
import { DIYCreate } from './components/diy/DIYCreate';
import { DIYPreview } from './components/diy/DIYPreview';
import { DIYDownload } from './components/diy/DIYDownload';
import PricingPage from './components/pricing-page';
import { DIYProvider } from './contexts/DIYContext';
import { initGA, trackPageView } from './utils/analytics';

// Analytics wrapper component
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
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
            // For now, redirect to a placeholder - the actual scan logic would need to be implemented
            window.location.href = '/thermometer/preview?id=placeholder';
          }}
          onNavigateHome={navigateToHome}
          onNavigateToThermometer={navigateToThermometer}
          onNavigateToDIY={navigateToDIY}
          onNavigateToPricing={navigateToPricing}
        />
      } />

      <Route path="/thermometer/preview" element={
        <PreviewPage
          data={{
            scan_id: 'placeholder',
            url: 'placeholder',
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
          onUnlockSuccess={(data) => {
            window.location.href = '/thermometer/report?id=placeholder';
          }}
          onNavigateHome={navigateToHome}
          onNavigateToThermometer={navigateToThermometer}
          onNavigateToDIY={navigateToDIY}
          onNavigateToPricing={navigateToPricing}
        />
      } />

      <Route path="/thermometer/report" element={
        <ReportPage
          onNavigateHome={navigateToHome}
          onNavigateToDIY={navigateToDIY}
          onNavigateToPricing={navigateToPricing}
        />
      } />

      <Route path="/diy" element={
        <DIYLanding
          onNavigateHome={navigateToHome}
          onNavigateToThermometer={navigateToThermometer}
          onNavigateToPricing={navigateToPricing}
          onStartDIY={() => window.location.href = '/diy/create'}
        />
      } />

      <Route path="/diy/create" element={
        <DIYCreate
          onNavigateHome={navigateToHome}
          onNavigateToThermometer={navigateToThermometer}
          onNavigateToPricing={navigateToPricing}
          onNext={() => window.location.href = '/diy/preview'}
        />
      } />

      <Route path="/diy/preview" element={
        <DIYPreview
          onNavigateHome={navigateToHome}
          onNavigateToThermometer={navigateToThermometer}
          onNavigateToPricing={navigateToPricing}
          onBack={() => window.location.href = '/diy/create'}
          onNext={() => window.location.href = '/diy/download'}
        />
      } />

      <Route path="/diy/download" element={
        <DIYDownload
          onNavigateHome={navigateToHome}
          onNavigateToThermometer={navigateToThermometer}
          onNavigateToPricing={navigateToPricing}
        />
      } />

      <Route path="/pricing" element={
        <PricingPage
          onNavigateHome={navigateToHome}
          onNavigateToThermometer={navigateToThermometer}
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
  // Initialize Google Analytics
  useEffect(() => {
    initGA();
  }, []);

  return (
    <Router>
      <AnalyticsTracker />
      <DIYProvider>
        <AppContent />
      </DIYProvider>
    </Router>
  );
}