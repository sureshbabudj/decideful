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
import { cn } from "@/lib/utils";

export default function ActionPage({
  className,
  ...rest
}: React.ComponentProps<"div">) {
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
    await confirmPasswordReset(auth, oobCode!, password);
    router.push("/login");
  };

  if (valid === null) return <p>Checking code…</p>;
  if (valid === false) return <p>Invalid or expired link.</p>;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...rest}>
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
