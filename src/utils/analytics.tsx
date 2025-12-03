// Google Analytics 4 Tracking
// Property ID: G-6MV1K9S3JP

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

// Initialize gtag if not already initialized
export const initializeGA = () => {
  if (typeof window === 'undefined') return;
  
  // Add gtag script if not already added
  if (!window.gtag) {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-6MV1K9S3JP';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-6MV1K9S3JP', {
        'send_page_view': false
      });
    `;
    document.head.appendChild(script2);
  }
};

// Track page views
export const trackPageView = (pageName: string, pageUrl: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'page_view', {
    page_title: pageName,
    page_location: pageUrl,
    page_path: pageUrl,
  });
  
  console.log('📊 GA4 Page View:', pageName, pageUrl);
};

// THERMOMETER Workstream Events
export const trackThermometerStart = () => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'thermometer_start', {
    workstream: 'THERMOMETER',
    event_category: 'engagement',
    event_label: 'Started free social proof scanner'
  });
  
  console.log('📊 GA4 Event: thermometer_start');
};

export const trackThermometerURLSubmitted = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'thermometer_url_submitted', {
    workstream: 'THERMOMETER',
    event_category: 'engagement',
    event_label: 'URL submitted for scanning',
    url_domain: new URL(url).hostname
  });
  
  console.log('📊 GA4 Event: thermometer_url_submitted', url);
};

export const trackThermometerReportPreviewed = (scanId: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'thermometer_report_previewed', {
    workstream: 'THERMOMETER',
    event_category: 'engagement',
    event_label: 'Report preview viewed',
    scan_id: scanId
  });
  
  console.log('📊 GA4 Event: thermometer_report_previewed', scanId);
};

export const trackThermometerReportUnlocked = (scanId: string, email: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'thermometer_report_unlocked', {
    workstream: 'THERMOMETER',
    event_category: 'conversion',
    event_label: 'Full report unlocked',
    scan_id: scanId,
    user_email: email
  });
  
  console.log('📊 GA4 Event: thermometer_report_unlocked', scanId, email);
};

// DIY Workstream Events (self-service paid tool)
export const trackDIYStart = () => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'diy_start', {
    workstream: 'DIY',
    event_category: 'engagement',
    event_label: 'DIY landing page visited'
  });
  
  console.log('📊 GA4 Event: diy_start');
};

export const trackDIYCreateStarted = () => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'diy_create_started', {
    workstream: 'DIY',
    event_category: 'engagement',
    event_label: 'Started creating testimonials'
  });
  
  console.log('📊 GA4 Event: diy_create_started');
};

export const trackDIYTestimonialAdded = (testimonialCount: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'diy_testimonial_added', {
    workstream: 'DIY',
    event_category: 'engagement',
    event_label: 'Testimonial added',
    testimonial_count: testimonialCount
  });
  
  console.log('📊 GA4 Event: diy_testimonial_added', testimonialCount);
};

export const trackDIYCheckoutInitiated = (generationId: string, amount: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'begin_checkout', {
    workstream: 'DIY',
    event_category: 'conversion',
    currency: 'USD',
    value: amount,
    items: [{
      item_id: 'testimonial_carousel',
      item_name: 'Testimonial Carousel Generator',
      price: amount,
      quantity: 1
    }],
    generation_id: generationId
  });
  
  console.log('📊 GA4 Event: begin_checkout (DIY)', generationId, amount);
};

export const trackDIYPaymentCompleted = (generationId: string, amount: number, customerEmail: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'purchase', {
    workstream: 'DIY',
    event_category: 'conversion',
    currency: 'USD',
    value: amount,
    transaction_id: generationId,
    items: [{
      item_id: 'testimonial_carousel',
      item_name: 'Testimonial Carousel Generator',
      price: amount,
      quantity: 1
    }],
    customer_email: customerEmail
  });
  
  console.log('📊 GA4 Event: purchase (DIY)', generationId, amount, customerEmail);
};

export const trackDIYCodeDownloaded = (generationId: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'diy_code_downloaded', {
    workstream: 'DIY',
    event_category: 'engagement',
    event_label: 'Carousel code downloaded',
    generation_id: generationId
  });
  
  console.log('📊 GA4 Event: diy_code_downloaded', generationId);
};

// DIWY Workstream Events (consultation - "book a call" clicks)
export const trackDIWYCTAClicked = (source: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'diwy_cta_clicked', {
    workstream: 'DIWY',
    event_category: 'conversion',
    event_label: 'Book a call clicked (consultation)',
    source: source
  });
  
  console.log('📊 GA4 Event: diwy_cta_clicked', source);
};

// DIFY Workstream Events (full service - "book a call" clicks)
export const trackDIFYCTAClicked = (source: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'dify_cta_clicked', {
    workstream: 'DIFY',
    event_category: 'conversion',
    event_label: 'Book a call clicked (full service)',
    source: source
  });
  
  console.log('📊 GA4 Event: dify_cta_clicked', source);
};

// Pricing Page Events
export const trackPricingPageView = () => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'pricing_page_view', {
    event_category: 'engagement',
    event_label: 'Pricing page viewed'
  });
  
  console.log('📊 GA4 Event: pricing_page_view');
};

export const trackPricingCTAClicked = (plan: string, action: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'pricing_cta_clicked', {
    event_category: 'conversion',
    event_label: `${plan} - ${action}`,
    plan: plan,
    action: action
  });
  
  console.log('📊 GA4 Event: pricing_cta_clicked', plan, action);
};
