'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

declare global {
  interface Window { Paddle: any; }
}

export default function SubscribePage() {
  const { isSignedIn, user } = useUser();
  const [paddleLoaded, setPaddleLoaded] = useState(false);

  // Paddle config
  const PADDLE_CLIENT_TOKEN = "test_29340be2ba7a1f654579d69bc42"; // sandbox token
  const PRICE_ID = "pri_01k4qkx9cx572011ftrrzp420b"; // sandbox price id

  useEffect(() => {
    // Load Paddle.js script
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      if (window.Paddle) {
        window.Paddle.Setup({ token: PADDLE_CLIENT_TOKEN });
        setPaddleLoaded(true);
      }
    };
    document.body.appendChild(script);

    return () => { document.body.removeChild(script); };
  }, []);

  const handleSubscribe = () => {
    if (!paddleLoaded) return;
    window.Paddle.Checkout.open({
      items: [{ priceId: PRICE_ID, quantity: 1 }],
      // Optional callback
      successCallback: () => {
        alert("Subscription complete! Redirecting to dashboard...");
        window.location.href = "/dashboard";
      },
      closeCallback: () => {
        console.log("Checkout closed without payment.");
      },
    });
  };

  return (
    <div className="bg-background min-h-screen text-foreground">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/"><h1 className="text-xl font-bold">NicheFire</h1></Link>
          <div>{isSignedIn && <UserButton afterSignOutUrl="/" />}</div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 flex flex-col items-center">
        <div className="text-center my-12 max-w-2xl">
          <h2 className="text-5xl font-bold tracking-tight">One Last Step!</h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Welcome, {user?.firstName}! Unlock the full power of NicheFire.
          </p>
        </div>

        <div className="border rounded-lg p-8 w-full max-w-md bg-card flex flex-col items-center gap-6">
          <h3 className="text-2xl font-semibold">NicheFire Pro</h3>
          <p className="text-muted-foreground my-2">Monthly Subscription</p>
          <div className="my-6 text-center"><span className="text-6xl font-bold">$18</span><span className="text-muted-foreground">/month</span></div>
          <ul className="space-y-2 text-muted-foreground text-left w-full">
            <li className="flex items-center gap-x-2">✔ Unlimited Outlier Discovery</li>
            <li className="flex items-center gap-x-2">✔ 24/7 Data Collection</li>
            <li className="flex items-center gap-x-2">✔ High-Speed Data Enrichment</li>
          </ul>

          <Button
            size="lg"
            className="w-full"
            onClick={handleSubscribe}
            disabled={!paddleLoaded}
          >
            {paddleLoaded ? "Subscribe Now" : "Loading payment system..."}
          </Button>
        </div>
      </main>
    </div>
  );
}
