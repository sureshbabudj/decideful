import { Logo } from "@/components/common/logo";
import { SITE_NAME } from "@/lib/utils/static_data";
import Link from "next/link";
import { GradientBackground } from "@/components/layout/gradiant-bg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GradientBackground className="h-full min-h-screen flex items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          aria-label="Go home"
          title={SITE_NAME}
          className="flex justify-center items-center font-semibold transition-colors duration-300 hover:text-muted-foreground gap-2"
        >
          <Logo className="w-6 h-6" />
          <span className="text-xl font-bold tracking-wide uppercase">
            {SITE_NAME}
          </span>
        </Link>
        {children}
      </div>
    </GradientBackground>
  );
}
