// src/app/subscribe/page.tsx
'use client';

import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { loadScript } from '@clerk/shared';

// Define the Paddle type for TypeScript
declare global {
  interface Window { Paddle: any; }
}

export default function SubscribePage() {
  const { isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paddle, setPaddle] = useState<any>(null);

  useEffect(() => {
    const paddleClientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!paddleClientToken) {
      setError("Paddle client token is not configured.");
      return;
    }
    loadScript('https://cdn.paddle.com/paddle/paddle.js')
      .then(() => {
        if (window.Paddle) {
          window.Paddle.Setup({ token: paddleClientToken });
          setPaddle(window.Paddle);
        }
      })
      .catch(() => {
        setError("Could not load payment provider.");
      });
  }, []);

  const handleSubscribe = async () => {
    if (!isSignedIn || !user || !paddle) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:3001/api/create-payment-link', {
        userEmail: user.primaryEmailAddress?.emailAddress,
        userId: user.id
      });
      const { checkoutUrl } = response.data;

      if (checkoutUrl) {
        paddle.Checkout.open({
          override: checkoutUrl,
          eventCallback: (data: { event: string }) => {
            if (data.event === 'checkout.completed') {
              window.location.href = '/dashboard';
            }
          }
        });
      } else {
        throw new Error("Did not receive a checkout URL.");
      }
    } catch (subscribeError) {
      setError("Could not initiate subscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen text-foreground">
      {/* ... Navbar and Main Content ... */}
    </div>
  );
}