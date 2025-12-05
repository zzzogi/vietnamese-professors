"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Lock,
  Bell,
  Trash2,
  Save,
  Loader2,
  Shield,
  Crown,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  // Profile settings
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [bio, setBio] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio,
          university,
          major,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      await update(); // Refresh session
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailNotifications,
          marketingEmails,
        }),
      });

      if (!response.ok) throw new Error("Failed to update notifications");

      toast.success("Notification preferences updated!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/user/account", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete account");

      toast.success("Account deleted successfully");
      router.push("/");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!session) {
    return null;
  }

  const isPro = session.user?.isPro || false;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Subscription Status */}
      {isPro ? (
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                PRO Member
                <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                  Active
                </span>
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                You have full access to all premium features
              </p>
              <Link href="/pricing">
                <Button variant="outline" size="sm">
                  Manage Subscription
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Free Plan</h3>
              <p className="text-sm text-gray-600 mb-3">
                Upgrade to PRO for unlimited features
              </p>
              <Link href="/pricing">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to PRO
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Profile Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Profile Information
          </h2>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          {/* University */}
          <div>
            <Label htmlFor="university">University (Optional)</Label>
            <Input
              id="university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="e.g., VNU-HCM"
            />
          </div>

          {/* Major */}
          <div>
            <Label htmlFor="major">Major (Optional)</Label>
            <Input
              id="major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="e.g., Computer Science"
            />
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a bit about yourself and your research interests..."
              rows={4}
            />
          </div>

          <Button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
        </div>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="mt-1 w-4 h-4 text-purple-600 rounded"
            />
            <div className="flex-1">
              <Label htmlFor="emailNotifications" className="cursor-pointer">
                Email Notifications
              </Label>
              <p className="text-sm text-gray-600">
                Receive updates about your bookmarks and activities
              </p>
            </div>
          </div>

          {/* Marketing Emails */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="marketingEmails"
              checked={marketingEmails}
              onChange={(e) => setMarketingEmails(e.target.checked)}
              className="mt-1 w-4 h-4 text-purple-600 rounded"
            />
            <div className="flex-1">
              <Label htmlFor="marketingEmails" className="cursor-pointer">
                Marketing Emails
              </Label>
              <p className="text-sm text-gray-600">
                Receive news, tips, and special offers
              </p>
            </div>
          </div>

          <Button
            onClick={handleSaveNotifications}
            disabled={isSaving}
            variant="outline"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Security</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Change Password</h3>
            <p className="text-sm text-gray-600 mb-4">
              Update your password to keep your account secure
            </p>
            <Button variant="outline">
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-semibold text-gray-900">Danger Zone</h2>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-2">Delete Account</h3>
          <p className="text-sm text-gray-600 mb-4">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
