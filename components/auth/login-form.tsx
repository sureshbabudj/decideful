"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { loginSchema, LoginInput } from "@/lib/schemas/auth.schema";
import { auth, db } from "@/lib/firebase/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { initializeUserDocument, signInGoogle } from "@/lib/utils/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser, setToken, setFireBaseToken } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setLoading(true);
      setError(null);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Get the ID token
      const token = await userCredential.user.getIdToken();

      // Store user and token
      setUser(userCredential.user);
      setToken(token);

      // Store token in cookie for middleware
      setFireBaseToken(token);

      router.push("/decisions");
    } catch (error: unknown) {
      setError((error as Error).message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const invokeGoogleLogin = async () => {
    try {
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

      const docRef = doc(db, "users", user.uid as string);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        initializeUserDocument(user, {
          name: user.displayName || "No Name",
          email: user.email || "No Email",
        });
      } else {
        await updateDoc(docRef, {
          email: user.email,
          name: user.displayName,
        });
      }

      router.push("/decisions");
    } catch (error) {
      toast.error("Google sign-in failed. Please try again.");
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Login with your or Google account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={invokeGoogleLogin}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Login with Google
          </Button>
        </div>
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
            <div className="flex ">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="ml-auto text-xs underline-offset-4 hover:underline flex-end"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
        <CardFooter className="pt-4">
          <p className="w-full flex gap-1 justify-center items-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Button asChild variant="ghost">
              <Link href="/register">Sign up</Link>
            </Button>
          </p>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
