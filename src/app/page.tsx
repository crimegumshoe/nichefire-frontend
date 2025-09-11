// src/app/page.tsx
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Bot, Zap, BarChart4, Check } from "lucide-react";

function Features() {
  const features = [
    { name: "Autonomous Scouting", description: "Our bots scan YouTube 24/7 to discover emerging trends.", icon: Bot },
    { name: "High-Speed Enrichment", description: "Leads are processed at lightning speed with rich data.", icon: Zap },
    { name: "Intelligent Analysis", description: "Our analyst engine finds true outliers with a custom Viral Score.", icon: BarChart4 },
  ];

  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.name} className="flex flex-col gap-y-3 items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold leading-7">{feature.name}</h3>
                <p className="text-base leading-7 text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">The Right Price For You</p>
        </div>
        <div className="mx-auto mt-16 max-w-md">
          <div className="rounded-3xl p-8 ring-1 ring-border xl:p-10 bg-card">
            <h3 className="text-2xl font-bold tracking-tight">NicheFire Pro</h3>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-5xl font-bold tracking-tight">$18</span>
              <span className="text-sm font-semibold text-muted-foreground">/month</span>
            </p>
            <Link href="/subscribe" passHref>
              <Button size="lg" className="w-full mt-10">Get Started</Button>
            </Link>
            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground xl:mt-10">
              <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-primary" />Unlimited Outlier Discovery</li>
              <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-primary" />24/7 Autonomous Scouting</li>
              <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-primary" />High-Speed Data Enrichment</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-background min-h-screen text-foreground">
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-x-2">
            <BarChart4 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">NicheFire</h1>
          </Link>
          <div className="flex items-center gap-x-2">
            <SignedOut>
              <Link href="/sign-in"><Button variant="ghost">Sign In</Button></Link>
              <Link href="/sign-up"><Button>Sign Up</Button></Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="container mx-auto text-center p-4 md:p-6 mt-16 md:mt-24">
        <h2 className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
          Find The Next Viral Hit.
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
          NicheFire uses a fleet of autonomous bots to scan YouTube Shorts 24/7, identifying viral outliers before they hit the mainstream. Stop guessing, start discovering.
        </p>
        <div className="mt-8">
          <SignedOut>
            <Link href="/sign-up"><Button size="lg">Get Started Now</Button></Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard"><Button size="lg">Go to Your Dashboard</Button></Link>
          </SignedIn>
        </div>
      </main>

      <Features />
      <Pricing />
    </div>
  );
}
