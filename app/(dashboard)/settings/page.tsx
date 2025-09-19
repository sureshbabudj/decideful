"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Globe, Shield, Download, Upload, Trash2 } from "lucide-react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { useAuthStore } from "@/lib/store/auth-store";
import { db } from "@/lib/firebase/client";
import {
  AppUserProfile,
  NotificationSettings,
  PrivacySettings,
  ReminderSettings,
  UserSettings,
} from "@/types";
import { useRouter } from "next/navigation";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const { user, setToken, setFireBaseToken, setUser } = useAuthStore();
  const [profile, setProfile] = useState<AppUserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    notificationSettings: {
      emailNotifications: false,
      pushNotifications: false,
      smsNotifications: false,
    },
    reminderSettings: { reviewReminders: false, milestoneAlerts: false },
    privacySettings: {
      profileVisibility: false,
      shareAnalytics: false,
      personalizedAds: false,
    },
    language: "en",
    timezone: "utc",
    theme: "system",
  });
  const [loading, setLoading] = useState(false);

  const updateUserProfile = async (settings: UserSettings) => {
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        settings,
      });
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (
    section: "notification" | "reminder" | "privacy" | "root",
    key:
      | keyof NotificationSettings
      | keyof ReminderSettings
      | keyof PrivacySettings
      | "language"
      | "timezone"
      | "theme",
    value: boolean | string
  ) => {
    const prev = { ...settings };
    if (
      section === "root" &&
      (key === "language" || key === "timezone" || key === "theme")
    ) {
      const update = {
        ...prev,
        [key]: value,
      };
      setSettings(update);
      updateUserProfile(update);
      return;
    }

    const settingSection = `${section}Settings`;
    if (
      settingSection !== "notificationSettings" &&
      settingSection !== "reminderSettings" &&
      settingSection !== "privacySettings"
    ) {
      return;
    }

    const update = {
      ...prev,
      [settingSection]: {
        ...prev[settingSection],
        [key]: value,
      },
    };
    setSettings(update);
    updateUserProfile(update);
  };

  const deleteAccount = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Delete user decisions from Firestore
      const decisionsQuery = query(
        collection(db, "decisions"),
        where("userId", "==", user.uid)
      );
      const decisionsSnapshot = await getDocs(decisionsQuery);
      const batch = writeBatch(db);
      decisionsSnapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();

      // Delete user document from Firestore
      await deleteDoc(doc(db, "users", user.uid));

      // Delete user from Firebase Auth
      await user.delete();
      setFireBaseToken("");
      setUser(null);
      setToken(null);

      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({ ...data } as AppUserProfile);

          if (data.settings) {
            setSettings((prev) => {
              const {
                language = prev.language,
                theme = prev.theme,
                timezone = prev.timezone,
                notificationSettings: {
                  emailNotifications = prev.notificationSettings
                    .emailNotifications,
                  pushNotifications = prev.notificationSettings
                    .pushNotifications,
                  smsNotifications = prev.notificationSettings.smsNotifications,
                },
                privacySettings: {
                  profileVisibility = prev.privacySettings.profileVisibility,
                  shareAnalytics = prev.privacySettings.shareAnalytics,
                  personalizedAds = prev.privacySettings.personalizedAds,
                },
                reminderSettings: {
                  reviewReminders = prev.reminderSettings.reviewReminders,
                  milestoneAlerts = prev.reminderSettings.milestoneAlerts,
                },
              } = data.settings as UserSettings;

              return {
                notificationSettings: {
                  emailNotifications,
                  pushNotifications,
                  smsNotifications,
                },
                reminderSettings: {
                  reviewReminders,
                  milestoneAlerts,
                },
                privacySettings: {
                  profileVisibility,
                  shareAnalytics,
                  personalizedAds,
                },
                language,
                timezone,
                theme,
              };
            });
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground/90">Settings</h1>
        <p className="text-foreground/60 mt-1">
          Manage your account preferences and settings.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-foreground/60">
                  Receive updates via email
                </p>
              </div>
              <Switch
                checked={settings.notificationSettings.emailNotifications}
                onCheckedChange={(checked) =>
                  handleSettingsChange(
                    "notification",
                    "emailNotifications",
                    checked
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-foreground/60">
                  Get notified on your device
                </p>
              </div>
              <Switch
                checked={settings.notificationSettings.pushNotifications}
                onCheckedChange={(checked) =>
                  handleSettingsChange(
                    "notification",
                    "pushNotifications",
                    checked
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-foreground/60">
                  Get notified via SMS on your Mobile device
                </p>
              </div>
              <Switch
                checked={settings.notificationSettings.smsNotifications}
                onCheckedChange={(checked) =>
                  handleSettingsChange(
                    "notification",
                    "smsNotifications",
                    checked
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Review Reminders</Label>
                <p className="text-sm text-foreground/60">
                  Get reminded to review decisions
                </p>
              </div>
              <Switch
                checked={settings.reminderSettings.reviewReminders}
                onCheckedChange={(checked) =>
                  handleSettingsChange("reminder", "reviewReminders", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Milestone Alerts</Label>
                <p className="text-sm text-foreground/60">
                  Celebrate decision-making milestones
                </p>
              </div>
              <Switch
                checked={settings.reminderSettings.milestoneAlerts}
                onCheckedChange={(checked) =>
                  handleSettingsChange("reminder", "milestoneAlerts", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Profile Visibility</Label>
                <p className="text-sm text-foreground/60">
                  Make your profile visible to others
                </p>
              </div>
              <Switch
                checked={settings.privacySettings.profileVisibility}
                onCheckedChange={(checked) =>
                  handleSettingsChange("privacy", "profileVisibility", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Share Analytics</Label>
                <p className="text-sm text-foreground/60">
                  Help improve Decideful with anonymous usage data
                </p>
              </div>
              <Switch
                checked={settings.privacySettings.shareAnalytics}
                onCheckedChange={(checked) =>
                  handleSettingsChange("privacy", "shareAnalytics", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language & Region
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                defaultValue={settings.language}
                onValueChange={(val) => {
                  handleSettingsChange("root", "language", val);
                }}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                defaultValue={settings.timezone}
                onValueChange={(val) => {
                  handleSettingsChange("root", "language", val);
                }}
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern Time</SelectItem>
                  <SelectItem value="cst">Central Time</SelectItem>
                  <SelectItem value="mst">Mountain Time</SelectItem>
                  <SelectItem value="pst">Pacific Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Export Data</Label>
                <p className="text-sm text-foreground/60">
                  Download all your decisions and data
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast("This feature is under construction.", {
                    description:
                      "Thanks for showing interest in using data management feature",
                  })
                }
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Import Data</Label>
                <p className="text-sm text-foreground/60">
                  Import decisions from a backup
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast("This feature is under construction.", {
                    description:
                      "Thanks for showing interest in using data management feature",
                  })
                }
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>

            <div className="pt-4 border-t">
              <ConfirmDeleteAccountModal action={deleteAccount}>
                <Button variant="destructive" size="sm" disabled={loading}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </ConfirmDeleteAccountModal>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const ConfirmDeleteAccountModal = ({
  children,
  action,
}: React.PropsWithChildren<{ action: () => void }>) => {
  const [open, setOpen] = useState(false);

  const handleAction = () => {
    setOpen(false);
    action();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you want to delete your Account?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleAction}>
            Sure, Delete my account!
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
