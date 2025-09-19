import Link from "next/link";

export function Navigation() {
  return (
    <nav className="flex items-center gap-8">
      <Link
        className="text-sm font-medium text-foreground/60 hover:text-primary"
        href="#"
      >
        Home
      </Link>
      <Link
        className="text-sm font-medium text-foreground/60 hover:text-primary"
        href="#"
      >
        Decisions
      </Link>
      <Link
        className="text-sm font-medium text-foreground/60 hover:text-primary"
        href="#"
      >
        Insights
      </Link>
      <Link
        className="text-sm font-medium text-foreground/60 hover:text-primary"
        href="#"
      >
        Templates
      </Link>
    </nav>
  );
}
