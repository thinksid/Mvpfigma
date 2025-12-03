# Vercel Deployment Guide

This guide will walk you through deploying your ThinkSid application to Vercel.

## Prerequisites

- You have a Vercel account
- Your domain `thinksid.co` is configured in Vercel
- Your Supabase and Stripe accounts are set up

## Step 1: Prepare Your Environment Variables

Before deploying, you need to set up environment variables in Vercel. Go to your Vercel dashboard and create a new project or update an existing one.

### Required Environment Variables:

1. **Supabase Configuration:**
   - `VITE_SUPABASE_URL`: `https://oqjgvzaedlwarmyjlsoz.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

2. **Stripe Configuration:**
   - `STRIPE_SECRET_KEY`: Your Stripe secret key (starts with `sk_test_` for test mode)
   - `STRIPE_PRICE_ID`: `price_1SQIpcGi1epFGDXBkypOPO9Tl`

3. **Google Analytics:**
   - `VITE_GA_MEASUREMENT_ID`: `G-6MV1K9S3JP`

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI if you haven't already:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel --prod
   ```

4. Follow the prompts to configure your project:
   - Project name: `thinksid` or your preferred name
   - Directory: `./` (current directory)
   - Build command: `npm run vercel-build`
   - Output directory: `dist`
   - Install command: `npm install`

### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository (if using Git) or upload your project files
4. Configure the project:
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## Step 3: Configure Domain

1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your domain: `thinksid.co`
3. Follow Vercel's instructions to update your DNS records

## Step 4: Set Environment Variables

In your Vercel project dashboard:

1. Go to "Settings" > "Environment Variables"
2. Add all the environment variables listed in Step 1
3. Make sure to set them for "Production", "Preview", and "Development" environments

## Step 5: Update Stripe Webhook URL

1. In your Stripe dashboard, go to "Developers" > "Webhooks"
2. Update your webhook endpoint URL to:
   ```
   https://oqjgvzaedlwarmyjlsoz.supabase.co/functions/v1/make-server-1da61fc8/stripe/webhook
   ```
   (Keep using your Supabase Edge Function URL for webhooks)

## Step 6: Test Your Deployment

1. Visit `https://thinksid.co` to ensure your site loads
2. Test the DIY flow:
   - Go to `/diy`
   - Complete the creation process
   - Test the Stripe checkout
   - Verify the redirect to `/diy-download?id=...` works correctly

## Step 7: Update DNS (if needed)

If you're migrating from Figma hosting:

1. Update your DNS records to point to Vercel
2. Wait for DNS propagation (can take up to 48 hours)
3. Test that all URLs work correctly

## Troubleshooting

### Common Issues:

1. **404 Errors on Direct Links:**
   - This is expected for SPAs. The `vercel.json` file handles routing.
   - Make sure `vercel.json` is in your project root.

2. **Environment Variables Not Working:**
   - Ensure variables are set for the correct environments
   - Redeploy after adding environment variables

3. **Stripe Redirect Issues:**
   - Check that the success URL in Stripe matches: `https://thinksid.co/diy-download?id={CHECKOUT_SESSION_ID}`
   - Verify the checkout session creation is using the correct URLs

4. **Analytics Not Working:**
   - Check that `VITE_GA_MEASUREMENT_ID` is set correctly
   - Verify GA4 property is configured for your domain

### Testing Commands:

```bash
# Test build locally
npm run build

# Preview build locally
npm run preview

# Check for any issues
npm run vercel-build
```

## Post-Deployment Checklist

- [ ] Site loads at `https://thinksid.co`
- [ ] All pages are accessible (/diy, /pricing, etc.)
- [ ] Stripe checkout works
- [ ] Stripe redirect goes to correct page
- [ ] Google Analytics is tracking events
- [ ] Supabase connections work
- [ ] Email notifications are sent
- [ ] Sitemap is accessible at `/sitemap.xml`

## Support

If you encounter any issues:

1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Test Supabase and Stripe connections
4. Check browser console for JavaScript errors

Your application should now be successfully deployed to Vercel!