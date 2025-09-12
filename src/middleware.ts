import { NextRequest, NextResponse } from "next/server";
import {
  verifyEmulatorToken,
  verifyProductionToken,
} from "@/lib/firebase/edge-verifier";

/* ---------- config ---------- */
const AUTH_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];
const PUBLIC_PREFIX = /^\/(_next|static|favicon|api\/)/;

async function getUser(req: NextRequest) {
  const token = req.cookies.get("__session")?.value;
  if (!token) return null;

  try {
    if (process.env.NEXT_PUBLIC_USE_EMULATORS === "true") {
      return await verifyEmulatorToken(token);
    }
    return await verifyProductionToken(token);
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // static assets / next internals / homepage
  if (PUBLIC_PREFIX.test(pathname) || pathname === "/") {
    return NextResponse.next();
  }

  const user = await getUser(req);

  // explicit auth pages
  if (AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    if (user) {
      // already authenticated → home
      console.log("User already authenticated, redirecting to home");
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // not authenticated → login
  if (!user) {
    console.log("User not found, redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // not verified → verify-email
  if (user.email_verified || user.emailVerified) {
    return NextResponse.next();
  } else {
    console.log("User not verified, redirecting to verify-email");
    return NextResponse.redirect(new URL("/verify-email", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
