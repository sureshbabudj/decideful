"use client";

import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Trophy } from "lucide-react";
import { format } from "date-fns";
import { convertTimeStamp } from "@/lib/utils";
import { updateProfile } from "firebase/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REVIEW_REMINDER } from "@/data/form-data";

interface UserProfile {
  name: string;
  email: string;
  createdAt: Date;
  decisionCount: number;
  preferences: {
    categories: string[];
    reviewFrequency: string;
  };
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    preferences: { categories: [] as string[], reviewFrequency: "monthly" },
  });

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const q = query(
            collection(db, "decisions"),
            where("userId", "==", user.uid)
          );
          const snapshot = await getCountFromServer(q);
          const count = snapshot.data().count;

          setProfile({
            ...data,
            createdAt: convertTimeStamp(data.createdAt),
            email: user.email,
            decisionCount: count,
          } as UserProfile);

          setFormData({ name: data.name, preferences: data.preferences });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      await updateProfile(user, { displayName: formData.name });
      await updateDoc(doc(db, "users", user.uid), {
        name: formData.name,
        preferences: formData.preferences,
      });

      setProfile((prev) =>
        prev
          ? { ...prev, name: formData.name, preferences: formData.preferences }
          : null
      );
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!profile) {
    return <div className="flex justify-center p-8">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground/90">Profile</h1>
        {!editing && (
          <Button onClick={() => setEditing(true)}>Edit Profile</Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.photoURL || undefined} />
                <AvatarFallback className="text-xl">
                  {profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-foreground/60">{profile.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  disabled={!editing}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email} disabled />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-foreground/40" />
                  <div>
                    <p className="text-sm text-foreground/60">Member since</p>
                    <p className="font-medium">
                      {format(profile.createdAt, "MMM yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-foreground/40" />
                  <div>
                    <p className="text-sm text-foreground/60">Decisions made</p>
                    <p className="font-medium">{profile.decisionCount || 0}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Review Frequency</Label>
                <Select
                  disabled={!editing}
                  onValueChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        reviewFrequency: val,
                      },
                    }))
                  }
                  defaultValue={formData.preferences.reviewFrequency}
                >
                  <SelectTrigger className="disabled:opacity-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REVIEW_REMINDER.map(({ value, label }) => (
                      <SelectItem value={value} key={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {editing && (
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFormData({
                    name: profile.name,
                    preferences: profile.preferences,
                  });
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
