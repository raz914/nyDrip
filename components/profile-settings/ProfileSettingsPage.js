"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { ArrowIcon } from "@/components/dashboard/icons";
import { LogoutButton, SaveButton } from "@/components/profile-settings/ProfileActions";
import { PasswordInput, ProfileTextInput } from "@/components/profile-settings/ProfileInputs";
import ProfileSidebar from "@/components/profile-settings/ProfileSidebar";
import {
  changeUserPassword,
  getUserProfile,
  saveUserProfile,
} from "@/lib/profile";

const initialProfileValues = {
  displayName: "",
  email: "",
  phone: "",
  address: "",
};

const initialPasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function BackButton() {
  return (
    <Link
      href="/dashboard"
      aria-label="Back to dashboard"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f2f5] text-[#111111] transition-colors hover:bg-[#e2e4e8] md:h-12 md:w-12"
    >
      <ArrowIcon className="h-4 w-4 rotate-180 md:h-5 md:w-5" />
    </Link>
  );
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, loading, signOut, refreshUser } = useAuth();
  const [profileValues, setProfileValues] = useState(initialProfileValues);
  const [passwordValues, setPasswordValues] = useState(initialPasswordValues);
  const [profileLoading, setProfileLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    let isActive = true;

    async function loadProfile() {
      setProfileLoading(true);
      setError("");

      try {
        const profile = await getUserProfile(user.uid);

        if (!isActive) {
          return;
        }

        setProfileValues({
          displayName: profile?.displayName ?? user.displayName ?? "",
          email: user.email ?? profile?.email ?? "",
          phone: profile?.phone ?? "",
          address: profile?.address ?? "",
        });
      } catch (nextError) {
        if (isActive) {
          setError(nextError.message);
        }
      } finally {
        if (isActive) {
          setProfileLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [user]);

  function handleProfileChange(event) {
    const { name, value } = event.target;
    setProfileValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;
    setPasswordValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      return;
    }

    const wantsPasswordChange = Object.values(passwordValues).some(Boolean);

    if (wantsPasswordChange) {
      if (
        !passwordValues.currentPassword ||
        !passwordValues.newPassword ||
        !passwordValues.confirmPassword
      ) {
        setError("Fill out all password fields to change your password.");
        setMessage("");
        return;
      }

      if (passwordValues.newPassword !== passwordValues.confirmPassword) {
        setError("New password and confirmation do not match.");
        setMessage("");
        return;
      }
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await saveUserProfile(user, profileValues);

      if (wantsPasswordChange) {
        await changeUserPassword(
          user,
          passwordValues.currentPassword,
          passwordValues.newPassword,
        );
        setPasswordValues(initialPasswordValues);
      }

      await refreshUser();
      setMessage("Profile settings saved.");
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await signOut();
      router.push("/login");
    } catch (nextError) {
      setError(nextError.message);
      setSubmitting(false);
    }
  }

  const isBusy = loading || profileLoading || submitting;

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <section className="px-5 pb-[60px] pt-16 md:ml-[484px] md:min-h-screen md:px-10 md:py-10">
        <div className="mx-auto max-w-[948px]">
          <header className="flex items-center gap-3 md:gap-4">
            <BackButton />
            <h1 className="text-[20px] font-medium leading-none md:text-[36px]">
              Profile
            </h1>
          </header>

          <form onSubmit={handleSubmit} className="mt-10 md:mt-[92px]">
            <div className="grid gap-9 md:gap-[52px]">
              <ProfileTextInput
                label="Full Name"
                name="displayName"
                value={profileValues.displayName}
                onChange={handleProfileChange}
                autoComplete="name"
              />
              <ProfileTextInput
                label="E-mail Address"
                name="email"
                type="email"
                value={profileValues.email}
                onChange={handleProfileChange}
                readOnly
                autoComplete="email"
              />
              <ProfileTextInput
                label="Phone Number"
                name="phone"
                type="tel"
                value={profileValues.phone}
                onChange={handleProfileChange}
                autoComplete="tel"
              />
              <ProfileTextInput
                label="Customer Address"
                name="address"
                value={profileValues.address}
                onChange={handleProfileChange}
                autoComplete="street-address"
              />
            </div>

            <section className="mt-[60px] md:mt-20">
              <h2 className="text-[18px] font-semibold leading-none md:text-[20px]">
                Change Password
              </h2>
              <div className="mt-6 grid gap-9 md:mt-10 md:grid-cols-3 md:gap-5">
                <PasswordInput
                  label="Current Password"
                  name="currentPassword"
                  value={passwordValues.currentPassword}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                />
                <PasswordInput
                  label="New Password"
                  name="newPassword"
                  value={passwordValues.newPassword}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                />
                <PasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  value={passwordValues.confirmPassword}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                />
              </div>
            </section>

            {error ? <p className="mt-6 text-sm text-[#d83f3f]">{error}</p> : null}
            {message ? (
              <p className="mt-6 text-sm text-[var(--color-primary)]">{message}</p>
            ) : null}

            <div className="mt-10 flex items-center justify-between gap-4 md:mt-[96px]">
              <LogoutButton onClick={handleLogout} disabled={isBusy} />
              <SaveButton disabled={isBusy} />
            </div>
          </form>
        </div>
      </section>

      <ProfileSidebar />
    </main>
  );
}
