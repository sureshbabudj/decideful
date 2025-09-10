import { SITE_NAME, Logo } from "@/components/common/Header";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
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
    </div>
  );
}
