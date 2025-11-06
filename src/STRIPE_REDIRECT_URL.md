# Stripe Redirect URL Configuration

## Post-Payment Redirect URL

When configuring your Stripe Buy Button, use this redirect URL to send customers to the download page after successful payment:

```
https://[YOUR_DOMAIN]/?page=diy-download&generation_id={GENERATION_ID}
```

### Important Notes:

1. **Replace `[YOUR_DOMAIN]`** with your actual domain (e.g., `yourwebsite.com`)

2. **The `{GENERATION_ID}` parameter** needs to be passed to Stripe when the customer clicks the buy button. This is currently set up in the DIYPreview component.

3. **Current Issue**: The generation_id needs to be stored and associated with the Stripe session. There are two approaches:

### Approach A: Use Client Reference ID (Recommended)
In your Stripe Buy Button configuration, you can pass custom data using client_reference_id:
- Set `client_reference_id` to the generation_id when the user clicks purchase
- After payment, Stripe redirects to your success URL with `?session_id=XXX`
- Your DIYDownload page then:
  1. Fetches the Stripe session using the session_id
  2. Extracts the generation_id from client_reference_id
  3. Loads the carousel code from your database

### Approach B: Simple URL Parameter (Currently Implemented)
```
https://[YOUR_DOMAIN]/?page=diy-download&generation_id=[GENERATION_ID]
```

For this to work, you need to dynamically generate the Stripe Buy Button redirect URL to include the generation_id.

## Dev/Test Mode URL

For testing without payment:
```
https://[YOUR_DOMAIN]/?page=diy-preview
```
Then click the "🧪 Skip to Download Page (Test Mode)" button - this now works with context data!

## Example URLs:

**Production (after payment):**
```
https://yourwebsite.com/?page=diy-download&generation_id=abc123
```

**Dev Testing:**
Just navigate through the app normally - the skip button will work!
