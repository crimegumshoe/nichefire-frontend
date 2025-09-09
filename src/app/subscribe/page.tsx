// src/app/subscribe/page.tsx
'use client';

import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { loadScript } from '@clerk/shared';

declare global {
  interface Window { Paddle: any; }
}

export default function SubscribePage() {
  const { isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paddle, setPaddle] = useState<any>();

  // Load the official Paddle.js script and initialize it
  useEffect(() => {
    const paddleClientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

    if (!paddleClientToken) {
      setError("FATAL: Paddle client token is not configured in .env.local");
      return;
    }

    loadScript('https://cdn.paddle.com/paddle/paddle.js')
      .then(() => {
        window.Paddle.Setup({ token: paddleClientToken });
        setPaddle(window.Paddle);
      })
      .catch(() => {
        setError("Could not load payment provider. Please check your internet connection and refresh.");
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
          eventCallback: function(data: any) {
            if (data.event === 'checkout.completed') {
              window.location.href = '/dashboard';
            }
          }
        });
      } else {
        throw new Error("Did not receive a checkout URL.");
      }
    } catch (err) {
      setError("Could not initiate subscription. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen text-foreground">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">NicheFire</h1>
          <div>{isSignedIn && <UserButton afterSignOutUrl="/" />}</div>
        </div>
      </header>

      <main className="container mx-auto p-4 md-p-6 flex flex-col items-center">
        <div className="text-center my-12 max-w-2xl">
          <h2 className="text-5xl font-bold tracking-tight">One Last Step!</h2>
          <p className="text-muted-foreground mt-4 text-lg">Welcome, {user?.firstName}! Unlock the full power of NicheFire.</p>
        </div>
        <div className="border rounded-lg p-8 w-full max-w-md bg-card">
          <h3 className="text-2xl font-semibold">NicheFire Pro</h3>
          <p className="text-muted-foreground my-2">Monthly Subscription</p>
          <div className="my-6"><span className="text-6xl font-bold">$18</span><span className="text-muted-foreground">/month</span></div>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-x-2">✔ Unlimited Outlier Discovery</li>
            <li className="flex items-center gap-x-2">✔ 24/7 Data Collection</li>
          </ul>
          <Button className="w-full mt-8" size="lg" onClick={handleSubscribe} disabled={isLoading || !paddle}>
            {isLoading ? 'Processing...' : 'Subscribe Now'}
          </Button>
          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        </div>
      </main>
    </div>
  );
}