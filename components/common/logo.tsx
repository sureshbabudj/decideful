import { cn } from "@/lib/utils";

export function Logo({
  className,
  ...rest
}: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      className={cn("h-6 w-6 text-primary", className)}
      fill="none"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g clipPath="url(#clip0_6_535)">
        <path
          clipRule="evenodd"
          d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="clip0_6_535">
          <rect fill="white" height="48" width="48" />
        </clipPath>
      </defs>
    </svg>
  );
}
