# Vercel Deployment Instructions

## Prerequisites
- You have a Vercel account
- You have a GitHub account
- Your project is pushed to a GitHub repository

## Step-by-Step Deployment

### 1. Connect Your GitHub Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository (search for your repository name)
4. Click "Import"

### 2. Configure Build Settings

Vercel should automatically detect your settings, but verify:

- **Framework Preset**: Vite
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build`
- **Output Directory**: `dist` (should be auto-detected)
- **Install Command**: `npm install`

### 3. Set Environment Variables

In your Vercel project dashboard, go to Settings → Environment Variables and add:

```
# Supabase
VITE_SUPABASE_URL=https://oqjgvzaedlwarmyjlsoz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xamd2emFlZGx3YXJteWpsc296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODYxMDYsImV4cCI6MjA3Nzc2MjEwNn0.GqxEM1JbbCcBj5m2sORBIvWX_JD5JrdYkkdidvp5Hzc

# Stripe (if needed for client-side operations)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SQ8RV0X2npEw2wvqvuYm2L8v8ZcKHqYvqMrPz5K0VfJj5gH3XqYL8tQq7VfQz7QQH8v8ZcKHqYvqMrPz5K0VfJj00xYvqMrPz
```

### 4. Configure Domain

1. In your Vercel project dashboard, go to Settings → Domains
2. Add your custom domain: `thinksid.co`
3. Follow Vercel's DNS configuration instructions

### 5. Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be live at `thinksid.co`

## Post-Deployment Checklist

### ✅ Verify Core Functionality
- [ ] Homepage loads correctly
- [ ] Navigation works between pages
- [ ] Social Proof Thermometer flow works
- [ ] DIY tool flow works
- [ ] Pricing page loads

### ✅ Test Stripe Integration
- [ ] DIY checkout redirects work correctly
- [ ] Success URL goes to `/diy/download?id={CHECKOUT_SESSION_ID}`
- [ ] Stripe webhooks are configured (if needed)

### ✅ Check Analytics
- [ ] Google Analytics 4 is tracking page views
- [ ] Custom events are firing (DIY starts, checkouts, etc.)

### ✅ SEO & Performance
- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] Meta tags are correct
- [ ] Page load times are reasonable
- [ ] Mobile responsiveness works

## Troubleshooting

### Build Fails
- Check that all dependencies are installed: `npm install`
- Verify build works locally: `npm run build`
- Check for any missing environment variables

### Routing Issues
- Ensure `vercel.json` is in your project root
- Verify all routes are properly configured in `App.tsx`
- Test client-side navigation works

### Stripe Redirects Not Working
- Verify the success URL in your Stripe dashboard is: `https://thinksid.co/diy/download?id={CHECKOUT_SESSION_ID}`
- Check that the Supabase function is deployed and accessible

### Analytics Not Working
- Verify GA4 Measurement ID is correct: `G-6MV1K9S3JP`
- Check browser console for GA4 errors
- Ensure `initGA()` is called in `App.tsx`

## Maintenance

### Updating Your Site
1. Make changes to your code
2. Commit and push to your GitHub repository
3. Vercel will automatically redeploy

### Monitoring
- Check Vercel dashboard for build status and errors
- Monitor Google Analytics for user behavior
- Set up error tracking if needed

## Support
If you encounter issues:
1. Check Vercel build logs
2. Verify environment variables are set correctly
3. Test locally first: `npm run dev`
4. Check browser developer tools for errors

Your site should now be live and fully functional! 🎉