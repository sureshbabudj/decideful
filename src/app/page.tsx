import Link from "next/link";
import { Header, SITE_NAME } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { GitCompareArrows, Milestone, PenToolIcon } from "lucide-react";
import { Footer } from "@/components/common/footer";

export default function Home() {
  return (
    <div
      data-testid="home-page"
      className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground"
    >
      <Header />
      <main className="flex-grow">
        <section className="relative flex h-[70vh] items-center justify-center text-center">
          <div className="absolute inset-0 bg-cover bg-center bg-gradient-to-t from-green-100 to-green-50" />
          <div className="relative z-10 mx-auto max-w-3xl px-6">
            <h1 className="text-4xl drop-shadow font-bold leading-tight tracking-tight md:text-6xl">
              Make Better Decisions, One Entry at a Time
            </h1>
            <p className="mt-6 text-lg leading-8">
              {SITE_NAME} is your personal decision-making journal. Track your
              reasoning, expected outcomes, and actual results to learn from
              your choices and improve your future decisions.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="text-lg px-6 py-3">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight sm:text-4xl md:mx-auto">
            <span className="relative inline-block">
              <svg
                viewBox="0 0 52 24"
                fill="currentColor"
                className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
              >
                <defs>
                  <pattern
                    id="df31b9f6-a505-42f8-af91-d2b7c3218e5c"
                    x={0}
                    y={0}
                    width=".135"
                    height=".30"
                  >
                    <circle cx={1} cy={1} r=".7" />
                  </pattern>
                </defs>
                <rect
                  fill="url(#df31b9f6-a505-42f8-af91-d2b7c3218e5c)"
                  width={52}
                  height={24}
                />
              </svg>
              <span className="relative">The</span>
            </span>{" "}
            quick and easy way to track your life decisions!
          </h2>
          <p className="text-base md:text-lg">
            {SITE_NAME} is your personal{" "}
            <span className="text-primary font-black">decision-making </span>{" "}
            journal.
          </p>
        </div>
        <div className="grid gap-8 row-gap-8 lg:grid-cols-3">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-accent mx-auto sm:w-24 sm:h-24">
              <PenToolIcon className="text-accent-foreground w-6 h-6 sm:w-10 sm:h-10" />
            </div>
            <h6 className="mb-2 font-semibold leading-5">
              Log important decisions
            </h6>
            <p className="max-w-md mb-3 text-sm sm:mx-auto">
              Log important decisions with context, and track your reasoning,
              expected outcomes, and actual results to learn from your choices
            </p>
            <Link
              href="/"
              aria-label=""
              className="inline-flex items-center font-semibold transition-colors duration-200 text-accent-foreground hover:text-deep-purple-800"
            >
              Learn more
            </Link>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-accent mx-auto sm:w-24 sm:h-24">
              <Milestone className="text-accent-foreground w-6 h-6 sm:w-10 sm:h-10" />
            </div>
            <h6 className="mb-2 font-semibold leading-5">
              Set milestones & review dates
            </h6>
            <p className="max-w-md mb-3 text-sm sm:mx-auto">
              Set milestones and review dates to track your progress and and
              keep analysing your decisions on fixed timeframe
            </p>
            <Link
              href="/"
              aria-label=""
              className="inline-flex items-center font-semibold transition-colors duration-200 text-accent-foreground hover:text-deep-purple-800"
            >
              Learn more
            </Link>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-accent mx-auto sm:w-24 sm:h-24">
              <GitCompareArrows className="text-accent-foreground w-6 h-6 sm:w-10 sm:h-10" />
            </div>
            <h6 className="mb-2 font-semibold leading-5">
              Compare expectations vs reality
            </h6>
            <p className="max-w-md mb-3 text-sm sm:mx-auto">
              Compare expectations and reality to learn from your choices and
              Learn from your decision patterns and plan for the future
            </p>
            <Link
              href="/"
              aria-label=""
              className="inline-flex items-center font-semibold transition-colors duration-200 text-accent-foreground hover:text-deep-purple-800"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
