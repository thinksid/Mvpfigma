# COMPLETE BUTTON AUDIT - ALL NEON YELLOW BUTTONS

## NEON YELLOW BUTTONS (#ebff82) THAT NEED DARK BLUE TEXT (!text-[#1c1c60])

### Navigation.tsx
- Line 99: Try Free Tool button - ✅ HAS !text-[#1c1c60]
- Line 172: Try Free Tool button (mobile) - ✅ HAS !text-[#1c1c60]

### DIY Landing Page (DIYLanding.tsx)
- Line 155: "Start Creating" button - ✅ HAS !text-[#1c1c60]
- Line 389: "Start Creating" button (second CTA) - ❌ MISSING ! - has text-[#1c1c60]

### Home Page (home-page.tsx)
- Line 150: "Start now" button - ✅ HAS !text-[#1c1c60]
- Line 342: "Start now" button (second CTA) - ❌ MISSING ! - has text-[#1c1c60]

### Landing Page (landing-page.tsx)
- Line 180: "Analyze Website" button - ✅ HAS !text-[#1c1c60]

### Main Landing Page (main-landing-page.tsx)
- Line 74: "Get Free Assessment" button - ✅ HAS !text-[#1c1c60]
- Line 437: "Get Your Free Assessment" button - ✅ HAS !text-[#1c1c60]

### Preview Page (preview-page.tsx)
- Line 313: "Unlock Report" button - ✅ HAS !text-[#1c1c60]

### Pricing Page (pricing-page.tsx)
- Line 261: "Start Now" button (DIY) - ✅ HAS !text-[#1c1c60]
- Line 307: "Book a call" button (DIWY) - ✅ HAS !text-[#1c1c60]
- Line 354: "Book a call" button (DIFY) - ✅ HAS !text-[#1c1c60]
- Line 448: Email submission button - ✅ HAS !text-[#1c1c60]

### Report Page (report-page.tsx)
- Line 525: "Start Building for $49.99" button - ✅ HAS !text-[#1c1c60]
- Line 765: Email confirmation button - ❌ MISSING ! - has text-[#1c1c60]

## BUTTONS TO FIX:
1. DIYLanding.tsx line 389 - ADD !important
2. home-page.tsx line 342 - ADD !important
3. report-page.tsx line 765 - ADD !important

## PAGE NAVIGATION - ADD SCROLL TO TOP:
All onClick handlers that change pages need: window.scrollTo(0, 0);

This includes:
- onNavigateHome
- onNavigateToThermometer  
- onNavigateToDIY
- onNavigateToPricing
- onNavigateToDIYCreate
- onNavigateToDIYPreview
- onNavigateToDIYDownload
- etc.
