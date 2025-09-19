"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { registerSchema, RegisterInput } from "@/lib/schemas/auth.schema";
import { auth } from "@/lib/firebase/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { initializeUserDocument, signInGoogle } from "@/lib/utils/auth";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser, setToken, setFireBaseToken } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setLoading(true);
      setError(null);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: data.name,
      });

      // Get the ID token
      const token = await userCredential.user.getIdToken();

      // Create user document
      initializeUserDocument(userCredential.user, {
        name: data.name,
        email: data.email,
      });

      // Store user and token
      setUser(userCredential.user);
      setToken(token);

      // Store token in cookie for middleware
      setFireBaseToken(token);

      router.push("/decisions");
    } catch (error: unknown) {
      setError((error as Error).message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const invokeGoogleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await signInGoogle();
      if (!userCredential) {
        throw new Error("Google sign-in failed");
      }

      // Get the ID token
      const token = await userCredential.idToken;
      if (!token) {
        throw new Error("Failed to retrieve ID token");
      }

      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Store user and token
      setUser(user);
      setToken(token);

      // Store token in cookie for middleware
      setFireBaseToken(token);

      initializeUserDocument(user, {
        name: user.displayName || "No Name",
        email: user.email || "No Email",
      });

      router.push("/decisions");
    } catch (error: unknown) {
      setError((error as Error).message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome</CardTitle>
        <CardDescription>
          Register with your Google account or Email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={invokeGoogleSignUp}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          Register with Google
        </Button>

        <div className="my-4 after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-card text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              {...register("name")}
              type="text"
              placeholder="Enter your full name"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password")}
              type="password"
              placeholder="Create a password"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm your password"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
        <CardFooter className="pt-4">
          <p className="w-full flex gap-1 justify-center items-center text-sm text-muted-foreground">
            <span> Already have an account?</span>
            <Button asChild variant="ghost">
              <Link href="/login">Sign in</Link>
            </Button>
          </p>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
