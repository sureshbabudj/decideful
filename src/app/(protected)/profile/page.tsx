"use client";
import { reload, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState(auth.currentUser?.displayName || "");

  const save = async () => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName: name });
    await reload(auth.currentUser);
    await fetch("/api/profile", {
      method: "PUT",
      body: JSON.stringify({ displayName: name }),
    });

    const freshToken = await auth.currentUser.getIdToken(true);
    await fetch("/api/session", {
      method: "POST",
      body: JSON.stringify({ token: freshToken }),
    });
    router.push("/dashboard");
  };

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold">Update profile</h1>
      <Label>Display name</Label>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <Button onClick={save}>Save</Button>
    </div>
  );
}
