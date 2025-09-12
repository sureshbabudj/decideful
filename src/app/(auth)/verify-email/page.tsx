"use client";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { sendVerifyEmail } from "@/lib/auth/client";
import { reload } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NotVerifiedEmailDialog } from "@/components/auth/NotVerifiedEmailDialog";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { loading } = useAuthStore();
  const [dialogOpen, setDialogOpen] = useState(false);

  const checkNow = async () => {
    const user = auth.currentUser;
    if (!user) {
      router.replace("/login");
      return;
    }
    await reload(user);
    if (user.emailVerified) {
      const freshToken = await user.getIdToken(true); // force refresh
      await fetch("/api/session", {
        // overwrite cookie
        method: "POST",
        body: JSON.stringify({ token: freshToken }),
      });
      router.replace("/dashboard");
    } else {
      setDialogOpen(true);
    }
  };

  return (
    <>
      <NotVerifiedEmailDialog
        open={dialogOpen}
        closeDialog={() => setDialogOpen(false)}
      />
      <div className="max-w-sm mx-auto mt-20 space-y-4">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p>We sent a link to your inbox. Click it, then press:</p>
        <Button onClick={checkNow} disabled={loading} className="w-full">
          I&apos;ve verified → continue
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            await sendVerifyEmail();
            toast("Email resent — check spam too!");
          }}
          className="w-full"
        >
          Resend email
        </Button>
      </div>
    </>
  );
}
