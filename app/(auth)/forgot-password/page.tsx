"use client";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
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
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (error) {
      toast.error("Failed to send reset email. Please try again.");
      console.log(error);
    }
  };

  if (sent)
    return (
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Email Sent</CardTitle>
          <CardDescription>
            If an account exists for{" "}
            <span className="font-semibold">{email}</span>, you’ll receive an
            email with instructions to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button variant="outline" onClick={() => setSent(false)}>
            Back to Reset
          </Button>
        </CardContent>
      </Card>
    );

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="max-w-sm mx-auto space-y-4">
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button className="w-full" type="submit">
              Send reset email
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
