import React, { useState } from 'react';
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
import { initializeGA, trackPageView } from './utils/analytics';
import { ErrorBoundary } from './components/ErrorBoundary';

// ✅ CRITICAL: Log at the very top of the module
console.log('🚀 ========== APP.TSX MODULE LOADED ==========');
console.log('📅 Timestamp:', new Date().toISOString());
console.log('🌐 Window location:', window.location.href);
console.log('📍 Pathname:', window.location.pathname);
console.log('🔍 Search params:', window.location.search);
console.log('🔗 Hash:', window.location.hash);
console.log('================================================');

// Step 4: Adding DIY flow and Pricing components
type Page = 'home' | 'thermometer-landing' | 'thermometer-processing' | 'thermometer-preview' | 'thermometer-report' | 'diy-landing' | 'diy-create' | 'diy-processing' | 'diy-preview' | 'diy-download' | 'pricing';

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
  // Initialize Google Analytics on mount
  React.useEffect(() => {
    initializeGA();
    console.log('✅ Google Analytics initialized (G-6MV1K9S3JP)');
  }, []);

  // Check if this is a sitemap request
  if (window.location.pathname === '/sitemap.xml') {
    return <Sitemap />;
  }

  // ✅ CRITICAL: Detect initial page from URL path
  const getInitialPage = (): Page => {
    // Check hash first (for hash-based routing)
    const hash = window.location.hash;
    const path = window.location.pathname;
    
    console.log('🔍 Detecting initial page from URL:', path);
    console.log('🔗 Hash:', hash);
    
    // If hash exists, use hash-based routing
    if (hash) {
      if (hash === '#/diy-download' || hash.startsWith('#/diy-download?')) {
        console.log('✅ Detected DIY Download page from HASH!');
        console.log('  - Full URL:', window.location.href);
        console.log('  - Hash:', hash);
        return 'diy-download';
      }
      if (hash === '#/diy-preview' || hash.startsWith('#/diy-preview?')) return 'diy-preview';
      if (hash === '#/diy-processing') return 'diy-processing';
      if (hash === '#/diy-create') return 'diy-create';
      if (hash === '#/diy' || hash === '#/diy-landing') return 'diy-landing';
      if (hash === '#/thermometer') return 'thermometer-landing';
      if (hash === '#/pricing') return 'pricing';
      if (hash === '#/' || hash === '#') return 'home';
    }
    
    // Fallback to path-based routing
    if (path === '/' || path === '') return 'home';
    if (path === '/thermometer' || path.startsWith('/thermometer-')) return 'thermometer-landing';
    if (path === '/diy' || path === '/diy-landing') return 'diy-landing';
    if (path === '/diy-create') return 'diy-create';
    if (path === '/diy-processing') return 'diy-processing';
    if (path === '/diy-preview') return 'diy-preview';
    if (path === '/diy-download') {
      console.log('✅ Detected DIY Download page from URL!');
      console.log('  - Full URL:', window.location.href);
      console.log('  - Search params:', window.location.search);
      return 'diy-download';
    }
    if (path === '/pricing') return 'pricing';
    
    console.log('⚠️ Unknown path, defaulting to home');
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage());
  const [scanId, setScanId] = useState<string | null>(null);
  const [scanUrl, setScanUrl] = useState<string>('');
  const [scanData, setScanData] = useState<any>(null);
  
  // Helper function to set page AND scroll to top
  const navigateToPage = (page: Page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };
  
  // Track page views when page changes
  React.useEffect(() => {
    const pageNameMap: Record<Page, string> = {
      'home': 'Home',
      'thermometer-landing': 'Social Proof Thermometer',
      'thermometer-processing': 'Thermometer Processing',
      'thermometer-preview': 'Thermometer Preview',
      'thermometer-report': 'Thermometer Report',
      'diy-landing': 'DIY Tool',
      'diy-create': 'DIY Create',
      'diy-processing': 'DIY Processing',
      'diy-preview': 'DIY Preview',
      'diy-download': 'DIY Download',
      'pricing': 'Pricing',
    };
    
    trackPageView(pageNameMap[currentPage], `/${currentPage === 'home' ? '' : currentPage}`);
  }, [currentPage]);
  
  console.log('App rendering, current page:', currentPage);

  // Simple placeholder components to test routing
  const renderPage = () => {
    console.log('Rendering page:', currentPage);
    
    switch (currentPage) {
      case 'home':
        return (
          <MainLandingPage
            onNavigateToThermometer={() => navigateToPage('thermometer-landing')}
            onNavigateToDIY={() => navigateToPage('diy-landing')}
            onNavigateToPricing={() => navigateToPage('pricing')}
          />
        );
      
      case 'thermometer-landing':
        return (
          <LandingPage
            onSuccess={(url) => {
              setScanUrl(url);
              navigateToPage('thermometer-processing');
            }}
            onNavigateHome={() => navigateToPage('home')}
            onNavigateToThermometer={() => navigateToPage('thermometer-landing')}
            onNavigateToDIY={() => navigateToPage('diy-landing')}
            onNavigateToPricing={() => navigateToPage('pricing')}
          />
        );
      
      case 'thermometer-processing':
        return (
          <ThermometerProcessing
            url={scanUrl}
            onSuccess={(data) => {
              setScanData(data);
              setScanId(data.scan_id);
              navigateToPage('thermometer-preview');
            }}
            onError={() => navigateToPage('thermometer-landing')}
            onNavigateHome={() => navigateToPage('home')}
            onNavigateToThermometer={() => navigateToPage('thermometer-landing')}
            onNavigateToDIY={() => navigateToPage('diy-landing')}
            onNavigateToPricing={() => navigateToPage('pricing')}
          />
        );
      
      case 'thermometer-preview':
        return (
          <PreviewPage
            data={scanData}
            onUnlockSuccess={(fullReportData) => {
              setScanData(fullReportData);
              navigateToPage('thermometer-report');
            }}
            onNavigateHome={() => navigateToPage('home')}
            onNavigateToThermometer={() => navigateToPage('thermometer-landing')}
            onNavigateToDIY={() => navigateToPage('diy-landing')}
            onNavigateToPricing={() => navigateToPage('pricing')}
          />
        );
      
      case 'thermometer-report':
        return (
          <ReportPage
            data={scanData}
            onNavigateHome={() => navigateToPage('home')}
            onNavigateToDIY={() => navigateToPage('diy-landing')}
            onNavigateToPricing={() => navigateToPage('pricing')}
          />
        );
      
      case 'diy-landing':
        return (
          <DIYLanding
            onNavigateHome={() => navigateToPage('home')}
            onNavigateToThermometer={() => navigateToPage('thermometer-landing')}
            onNavigateToDIY={() => navigateToPage('diy-landing')}
            onNavigateToPricing={() => navigateToPage('pricing')}
            onNavigateToDIYCreate={() => navigateToPage('diy-create')}
          />
        );
      
      case 'diy-create':
        return (
          <DIYCreate
            onNavigateHome={() => navigateToPage('home')}
            onNavigateToThermometer={() => navigateToPage('thermometer-landing')}
            onNavigateToDIY={() => navigateToPage('diy-landing')}
            onNavigateToPricing={() => navigateToPage('pricing')}
            onNavigateToDIYProcessing={() => navigateToPage('diy-processing')}
          />
        );
      
      case 'diy-processing':
        return (
          <DIYProcessing
            onNavigateHome={() => navigateToPage('home')}
            onNavigateToThermometer={() => navigateToPage('thermometer-landing')}
            onNavigateToDIY={() => navigateToPage('diy-landing')}
            onNavigateToPricing={() => navigateToPage('pricing')}
            onNavigateToDIYPreview={(generationId?: string) => {
              // ✅ CRITICAL: Add generation_id to HASH URL so it persists through page loads
              if (generationId) {
                window.location.hash = `#/diy-preview?id=${generationId}`;
                console.log('✅ Navigation to DIY Preview with generation_id (HASH):', generationId);
              }
              navigateToPage('diy-preview');
            }}
            onNavigateToDIYCreate={() => navigateToPage('diy-create')}
          />
        );
      
      case 'diy-preview':
        return (
          <DIYPreview
            onNavigateHome={() => navigateToPage('home')}
            onNavigateToThermometer={() => navigateToPage('thermometer-landing')}
            onNavigateToDIY={() => navigateToPage('diy-landing')}
            onNavigateToPricing={() => navigateToPage('pricing')}
            onNavigateToDIYCreate={() => navigateToPage('diy-create')}
            onNavigateToDIYDownload={(generationId?: string) => {
              // ✅ CRITICAL: Add generation_id to HASH URL for Stripe redirects
              if (generationId) {
                window.location.hash = `#/diy-download?id=${generationId}`;
                console.log('✅ Navigation to DIY Download with generation_id (HASH):', generationId);
              }
              navigateToPage('diy-download');
            }}
          />
        );
      
      case 'diy-download':
        return (
          <DIYDownload
            onNavigateHome={() => navigateToPage('home')}
            onNavigateToThermometer={() => navigateToPage('thermometer-landing')}
            onNavigateToDIY={() => navigateToPage('diy-landing')}
            onNavigateToPricing={() => navigateToPage('pricing')}
          />
        );
      
      case 'pricing':
        return (
          <PricingPage
            onNavigateHome={() => navigateToPage('home')}
            onNavigateToThermometer={() => navigateToPage('thermometer-landing')}
            onNavigateToDIY={() => navigateToPage('diy-landing')}
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

  return <DIYProvider><ErrorBoundary>{renderPage()}</ErrorBoundary></DIYProvider>;
}