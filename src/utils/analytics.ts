// Google Analytics 4 implementation
const GA_MEASUREMENT_ID = 'G-6MV1K9S3JP';

// Initialize GA4
export const initGA = () => {
  if (typeof window !== 'undefined') {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);

    // Make gtag available globally
    (window as any).gtag = gtag;
  }
};

// Track page views
export const trackPageView = (page_path: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: page_path,
    });
  }
};

// Track events
export const trackEvent = (event_name: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event_name, parameters);
  }
};

// Specific tracking functions for your app
export const trackThermometerStart = () => {
  trackEvent('thermometer_start');
};

export const trackThermometerURLSubmitted = () => {
  trackEvent('thermometer_url_submitted');
};

export const trackThermometerReportPreviewed = () => {
  trackEvent('thermometer_report_previewed');
};

export const trackThermometerReportUnlocked = () => {
  trackEvent('thermometer_report_unlocked');
};

export const trackDIYStart = () => {
  trackEvent('diy_start');
};

export const trackDIYCreateStarted = () => {
  trackEvent('diy_create_started');
};

export const trackDIYTestimonialAdded = () => {
  trackEvent('diy_testimonial_added');
};

export const trackDIYCheckoutInitiated = () => {
  trackEvent('diy_checkout_initiated');
};

export const trackDIYPaymentCompleted = (generationId: string) => {
  trackEvent('diy_payment_completed', {
    generation_id: generationId,
  });
};

export const trackDIYCodeDownloaded = (generationId: string) => {
  trackEvent('diy_code_downloaded', {
    generation_id: generationId,
  });
};

export const trackDIYWCTAClicked = () => {
  trackEvent('diy_wcta_clicked');
};

export const trackDIFYCTAClicked = () => {
  trackEvent('diy_ycta_clicked');
};

export const trackPricingCTAClicked = () => {
  trackEvent('pricing_cta_clicked');
};

export const trackPricingPageView = () => {
  trackEvent('pricing_page_view');
};

// Declare global types
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}