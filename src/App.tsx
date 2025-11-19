import React, { useState } from 'react';
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

// Step 4: Adding DIY flow and Pricing components
type Page = 'home' | 'thermometer-landing' | 'thermometer-preview' | 'thermometer-report' | 'diy-landing' | 'diy-create' | 'diy-preview' | 'diy-download' | 'pricing';

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

export default function App() {
  // Check if this is a sitemap request
  if (window.location.pathname === '/sitemap.xml') {
    return <Sitemap />;
  }

  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [scanId, setScanId] = useState<string | null>(null);
  
  console.log('App rendering, current page:', currentPage);

  // Simple placeholder components to test routing
  const renderPage = () => {
    console.log('Rendering page:', currentPage);
    
    switch (currentPage) {
      case 'home':
        return (
          <MainLandingPage
            onNavigateToThermometer={() => setCurrentPage('thermometer-landing')}
            onNavigateToDIY={() => setCurrentPage('diy-landing')}
            onNavigateToPricing={() => setCurrentPage('pricing')}
          />
        );
      
      case 'thermometer-landing':
        return (
          <LandingPage
            onNavigateHome={() => setCurrentPage('home')}
            onNavigateToDIY={() => setCurrentPage('diy-landing')}
            onNavigateToPricing={() => setCurrentPage('pricing')}
            onScanComplete={(id) => {
              setScanId(id);
              setCurrentPage('thermometer-preview');
            }}
          />
        );
      
      case 'thermometer-preview':
        return (
          <PreviewPage
            scanId={scanId}
            onNavigateHome={() => setCurrentPage('home')}
            onNavigateToDIY={() => setCurrentPage('diy-landing')}
            onNavigateToPricing={() => setCurrentPage('pricing')}
            onEmailSubmit={() => setCurrentPage('thermometer-report')}
          />
        );
      
      case 'thermometer-report':
        return (
          <ReportPage
            scanId={scanId}
            onNavigateHome={() => setCurrentPage('home')}
            onNavigateToDIY={() => setCurrentPage('diy-landing')}
            onNavigateToPricing={() => setCurrentPage('pricing')}
          />
        );
      
      case 'diy-landing':
        return (
          <DIYLanding
            onNavigateHome={() => setCurrentPage('home')}
            onNavigateToThermometer={() => setCurrentPage('thermometer-landing')}
            onNavigateToPricing={() => setCurrentPage('pricing')}
            onStartDIY={() => setCurrentPage('diy-create')}
          />
        );
      
      case 'diy-create':
        return (
          <DIYCreate
            onNavigateHome={() => setCurrentPage('home')}
            onNavigateToThermometer={() => setCurrentPage('thermometer-landing')}
            onNavigateToPricing={() => setCurrentPage('pricing')}
            onNext={() => setCurrentPage('diy-preview')}
          />
        );
      
      case 'diy-preview':
        return (
          <DIYPreview
            onNavigateHome={() => setCurrentPage('home')}
            onNavigateToThermometer={() => setCurrentPage('thermometer-landing')}
            onNavigateToPricing={() => setCurrentPage('pricing')}
            onBack={() => setCurrentPage('diy-create')}
            onNext={() => setCurrentPage('diy-download')}
          />
        );
      
      case 'diy-download':
        return (
          <DIYDownload
            onNavigateHome={() => setCurrentPage('home')}
            onNavigateToThermometer={() => setCurrentPage('thermometer-landing')}
            onNavigateToPricing={() => setCurrentPage('pricing')}
          />
        );
      
      case 'pricing':
        return (
          <PricingPage
            onNavigateHome={() => setCurrentPage('home')}
            onNavigateToThermometer={() => setCurrentPage('thermometer-landing')}
            onNavigateToDIY={() => setCurrentPage('diy-landing')}
          />
        );
      
      default:
        return (
          <div className="min-h-screen bg-white p-8">
            <h1>Page not found</h1>
          </div>
        );
    }
  };

  return <DIYProvider>{renderPage()}</DIYProvider>;
}