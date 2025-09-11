// src/app/api/checkout/route.ts
import { Paddle } from '@paddle/paddle-node-sdk';

// Initialize Paddle with your API Key from environment variables
const paddle = new Paddle(process.env.PADDLE_API_KEY);

export async function POST(request: Request) {
  try {
    // We will get the user's information from the frontend later
    const priceId = process.env.PADDLE_PRICE_ID; // Your NicheFire Pro Price ID

    if (!priceId) {
      throw new Error("Paddle Price ID is not configured.");
    }
    
    // Create a transaction to generate a checkout link
    const transaction = await paddle.transactions.create({
      items: [{
        price_id: priceId,
        quantity: 1
      }],
      // The checkout object is not needed for a simple redirect
    });

    const checkoutUrl = transaction.checkout.url;
    if (!checkoutUrl) {
      throw new Error("Paddle did not return a checkout URL.");
    }

    // Return the secure checkout URL to the frontend
    return new Response(JSON.stringify({ checkoutUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Paddle API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to create checkout session." }), {
      status: 500,
    });
  }
}