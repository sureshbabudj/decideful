"use client";
import { useEffect, useState } from "react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useSearchParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export default function ActionPage() {
  const search = useSearchParams();
  const router = useRouter();
  const mode = search.get("mode");
  const oobCode = search.get("oobCode"); // Firebase built-in param
  const [valid, setValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (mode === "resetPassword" && oobCode) {
      verifyPasswordResetCode(auth, oobCode)
        .then(() => setValid(true))
        .catch(() => setValid(false));
    } else {
      setValid(false);
    }
  }, [mode, oobCode]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmPasswordReset(auth, oobCode!, password);
      toast.success("Password has been reset successfully.");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
      console.error(error);
    }
  };

  if (valid === null) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2Icon className="w-6 h-6 animate-spin mb-4" />
        <p>Verifying link...</p>
      </div>
    );
  }
  if (valid === false) {
    return (
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Error</CardTitle>
          <CardDescription>
            Invalid or expired link, please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="max-w-sm mx-auto space-y-4">
            <Label>New password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button className="w-full" type="submit">
              Save new password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
