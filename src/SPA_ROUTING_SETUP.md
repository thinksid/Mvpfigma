# SPA Routing Configuration Guide

## The Problem

Your website is getting **404 errors** when accessing routes like `/diy-download` directly or after redirects from Stripe. This happens because your web server doesn't know these are Single Page Application (SPA) routes.

### What's Happening:
1. User/Stripe tries to access `https://social.thinksid.co/diy-download?id=xxx`
2. Web server looks for a physical file at `/diy-download`
3. File doesn't exist → Server returns 404
4. **React app never loads**, so your routing code never runs
5. Console is empty because the HTML/JavaScript never executes

## The Solution

Configure your web server to serve `index.html` for ALL routes that don't match actual files. This lets your React router handle the routing.

---

## Configuration by Platform

### **Vercel** (Recommended)
Create a `vercel.json` file in your project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### **Netlify**
Create a `_redirects` file in your `/public` folder:

```
/*    /index.html   200
```

Or create a `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **Nginx**
Add to your server configuration:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### **Apache**
Create/update `.htaccess` in your root:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### **AWS S3 + CloudFront**
In S3 bucket settings:
- Error document: `index.html`

In CloudFront distribution:
- Custom error responses: 403 and 404 → return `/index.html` with 200 status

### **Firebase Hosting**
In `firebase.json`:

```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### **GitHub Pages**
Create a `404.html` that's a copy of your `index.html`, or add a script to `404.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <script>
      sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/'">
  </head>
  <body></body>
</html>
```

Then in your `index.html`, add before your React script:

```html
<script>
  (function(){
    var redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (redirect && redirect != location.href) {
      history.replaceState(null, null, redirect);
    }
  })();
</script>
```

---

## How to Test

After configuring your server:

1. **Clear browser cache** and do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. Try accessing `/diy-download?id=test123` directly
3. Check browser console - you should see your detailed debug logs
4. If you see the logs, the routing is working!

---

## Debugging Checklist

If you're still getting 404s:

- [ ] Server configuration file is in the correct location
- [ ] You've redeployed after adding the configuration
- [ ] Browser cache is cleared
- [ ] Check server logs for any configuration errors
- [ ] Verify the configuration syntax is correct for your hosting platform
- [ ] Test with a simple route first (e.g., `/test`)

---

## Current Implementation

Your React app already has proper routing configured in `/App.tsx`. The routing code:

```typescript
if (path === '/diy-download') {
  console.log('✅ Detected: DIY DOWNLOAD page');
  return 'diy-download';
}
```

This code is correct - it just needs the server to let it run!

---

## Next Steps

1. **Identify your hosting platform** (Vercel, Netlify, AWS, etc.)
2. **Apply the configuration** from the relevant section above
3. **Deploy the changes**
4. **Test the route** and check the console logs
5. **Look for the detailed debug logs** we added - if you see them, it's working!

---

## Emergency Workaround

If you can't configure the server immediately, you can temporarily use hash-based routing:

In your Stripe redirect URLs, change:
```
/diy-download?id=xxx
```
To:
```
/#/diy-download?id=xxx
```

And update your routing to check `window.location.hash` instead of `window.location.pathname`.

**This is NOT recommended** for production - proper server configuration is the correct solution.
