import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-1da61fc8/health", (c) => {
  return c.json({ status: "ok" });
});

// DIY Generation endpoints
// Save DIY generation data
app.post("/make-server-1da61fc8/diy/save", async (c) => {
  try {
    const body = await c.req.json();
    const { generation_id, data } = body;

    if (!generation_id) {
      return c.json({ error: "generation_id is required" }, 400);
    }

    // Store in KV with prefix for easy retrieval
    const key = `diy_generation:${generation_id}`;
    await kv.set(key, data);

    return c.json({ success: true, generation_id });
  } catch (error) {
    console.error("Error saving DIY generation:", error);
    return c.json({ error: "Failed to save generation data" }, 500);
  }
});

// Get DIY generation data
app.get("/make-server-1da61fc8/diy/:generation_id", async (c) => {
  try {
    const generation_id = c.req.param("generation_id");
    
    if (!generation_id) {
      return c.json({ error: "generation_id is required" }, 400);
    }

    const key = `diy_generation:${generation_id}`;
    const data = await kv.get(key);

    if (!data) {
      return c.json({ error: "Generation not found" }, 404);
    }

    return c.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching DIY generation:", error);
    return c.json({ error: "Failed to fetch generation data" }, 500);
  }
});

// Update HTML code for a generation
app.put("/make-server-1da61fc8/diy/:generation_id/html", async (c) => {
  try {
    const generation_id = c.req.param("generation_id");
    const body = await c.req.json();
    const { html_code } = body;

    if (!generation_id) {
      return c.json({ error: "generation_id is required" }, 400);
    }

    if (!html_code) {
      return c.json({ error: "html_code is required" }, 400);
    }

    // Get existing generation data
    const key = `diy_generation:${generation_id}`;
    const existingData = await kv.get(key);

    if (!existingData) {
      return c.json({ error: "Generation not found" }, 404);
    }

    // Update html_code
    const updatedData = {
      ...existingData,
      html_code,
      updated_at: new Date().toISOString(),
    };

    await kv.set(key, updatedData);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating HTML code:", error);
    return c.json({ error: "Failed to update HTML code" }, 500);
  }
});

// Save customer info after payment
app.post("/make-server-1da61fc8/diy/customer", async (c) => {
  try {
    const body = await c.req.json();
    const { generation_id, customer_info } = body;

    if (!generation_id || !customer_info) {
      return c.json({ error: "generation_id and customer_info are required" }, 400);
    }

    // Get existing generation data
    const key = `diy_generation:${generation_id}`;
    const existingData = await kv.get(key);

    if (!existingData) {
      return c.json({ error: "Generation not found" }, 404);
    }

    // Merge customer info into existing data
    const updatedData = {
      ...existingData,
      customer_info,
      updated_at: new Date().toISOString(),
    };

    await kv.set(key, updatedData);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving customer info:", error);
    return c.json({ error: "Failed to save customer info" }, 500);
  }
});

Deno.serve(app.fetch);