import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@17.4.0';

const app = new Hono();

// Supabase configuration
const SUPABASE_URL = 'https://oqjgvzaedlwarmyjlsoz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xamd2emFlZGx3YXJteWpsc296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODYxMDYsImV4cCI6MjA3Nzc2MjEwNn0.GqxEM1JbbCcBj5m2sORBIvWX_JD5JrdYkkdidvp5Hzc';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xamd2emFlZGx3YXJteWpsc296Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE4NjEwNiwiZXhwIjoyMDc3NzYyMTA2fQ.ws7NZh57vRt9l56guyeRMR0I1ZhwWPIl-lv89bFPfrI';

// Stripe configuration
const STRIPE_SECRET_KEY = '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';
const STRIPE_PRICE_ID = 'price_1SQ8t71epFGDXBkyRlgR1DVI';

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: (origin) => origin || "*",
    allowHeaders: ["Content-Type", "Authorization", "x-client-info", "apikey"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Health check endpoint
app.get("/make-server-1da61fc8/health", (c) => {
  return c.json({ status: "ok" });
});

// DIY Generation endpoints
// Get DIY generation data
app.get("/make-server-1da61fc8/diy/:generation_id", async (c) => {
  try {
    const generation_id = c.req.param("generation_id");
    
    if (!generation_id) {
      return c.json({ error: "generation_id is required" }, 400);
    }

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

    const { data, error: dbError } = await supabase
      .from('diy_generations')
      .select('*')
      .eq('generation_id', generation_id)
      .maybeSingle();

    if (dbError || !data) {
      console.error('❌ Failed to fetch generation from diy_generations table:', dbError);
      return c.json({ error: "Generation not found" }, 404);
    }

    console.log('✅ Generation data fetched successfully:', generation_id);
    return c.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching DIY generation:", error);
    return c.json({ error: "Failed to fetch generation data" }, 500);
  }
});

// Update vendor info (name and email) before checkout
app.post("/make-server-1da61fc8/diy/update-vendor", async (c) => {
  try {
    const body = await c.req.json();
    const { generation_id, vendor_name, vendor_email } = body;

    if (!generation_id || !vendor_name || !vendor_email) {
      return c.json({ error: "generation_id, vendor_name, and vendor_email are required" }, 400);
    }

    // ✅ Use SERVICE_ROLE_KEY to bypass RLS (same as N8N writes)
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    console.log('🔄 Updating vendor info for generation:', generation_id);
    console.log('   - Vendor Name:', vendor_name);
    console.log('   - Vendor Email:', vendor_email);

    // Update the diy_generations table
    const { data, error: dbError } = await supabase
      .from('diy_generations')
      .update({
        vendor_name,
        vendor_email,
        updated_at: new Date().toISOString(),
      })
      .eq('generation_id', generation_id)
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      return c.json({ error: `Database error: ${dbError.message}` }, 500);
    }

    if (!data) {
      console.error('❌ No data returned - generation not found');
      return c.json({ error: "Generation not found" }, 404);
    }

    console.log(`✅ Vendor info updated for generation ${generation_id}:`, { vendor_name, vendor_email });

    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating vendor info:", error);
    return c.json({ error: "Failed to update vendor info" }, 500);
  }
});

// Create Stripe Checkout Session with generation_id in metadata
app.post("/make-server-1da61fc8/stripe/create-checkout-session", async (c) => {
  try {
    const body = await c.req.json();
    const { generation_id } = body;

    if (!generation_id) {
      return c.json({ error: "generation_id is required" }, 400);
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });

    console.log('🛒 Creating Stripe Checkout Session for generation:', generation_id);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${c.req.header('origin') || 'https://oqjgvzaedlwarmyjlsoz.supabase.co'}/diy-download?session_id={CHECKOUT_SESSION_ID}&generation_id=${generation_id}`,
      cancel_url: `${c.req.header('origin') || 'https://oqjgvzaedlwarmyjlsoz.supabase.co'}/diy-preview?id=${generation_id}`,
      metadata: {
        generation_id: generation_id,
      },
    });

    console.log('✅ Checkout Session created:', session.id);
    console.log('   - URL:', session.url);
    console.log('   - Metadata:', session.metadata);

    return c.json({ success: true, url: session.url, session_id: session.id });
  } catch (error) {
    console.error("❌ Error creating Stripe Checkout Session:", error);
    return c.json({ error: "Failed to create checkout session" }, 500);
  }
});

// Stripe webhook handler - captures payment success
app.post("/make-server-1da61fc8/stripe/webhook", async (c) => {
  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });

    const signature = c.req.header('stripe-signature');
    const body = await c.req.text();

    let event;

    // For now, parse without signature verification (can add STRIPE_WEBHOOK_SECRET later)
    event = JSON.parse(body);

    console.log('📨 Stripe webhook event received:', event.type);

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      console.log('💳 Checkout session completed:', session.id);
      console.log('📧 Customer email:', session.customer_details?.email);
      console.log('👤 Customer name:', session.customer_details?.name);
      console.log('🔖 Metadata:', session.metadata);

      const generation_id = session.metadata?.generation_id;
      const customer_email = session.customer_details?.email;
      const customer_name = session.customer_details?.name;

      if (!generation_id) {
        console.error('❌ No generation_id in Stripe session metadata');
        return c.json({ error: 'Missing generation_id in metadata' }, 400);
      }

      // Update the database with customer info and mark as paid
      const supabase = createClient(
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY
      );

      const { data, error: dbError } = await supabase
        .from('diy_generations')
        .update({
          customer_email,
          customer_name,
          paid: true,
          stripe_session_id: session.id,
          updated_at: new Date().toISOString(),
        })
        .eq('generation_id', generation_id)
        .select()
        .single();

      if (dbError || !data) {
        console.error('❌ Failed to update payment status in diy_generations table:', dbError);
        return c.json({ error: 'Database update failed' }, 500);
      }

      console.log(`✅ Payment recorded for generation ${generation_id}`);
      console.log(`   - Customer: ${customer_name} (${customer_email})`);
      console.log(`   - Stripe Session: ${session.id}`);

      return c.json({ success: true, received: true });
    }

    // Acknowledge other event types
    return c.json({ success: true, received: true });

  } catch (error) {
    console.error("❌ Error processing Stripe webhook:", error);
    return c.json({ error: "Webhook processing failed" }, 500);
  }
});

Deno.serve(app.fetch);