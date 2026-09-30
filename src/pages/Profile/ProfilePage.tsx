import { FormEvent, useEffect, useState } from 'react';
import { ChangePasswordForm } from '../../components/features/profile/ChangePasswordForm';
import { ProfileShell } from '../../components/ui/layout/ProfileShell';
import { UserAvatar } from '../../components/ui/display/UserAvatar';
import { AlertBanner } from '../../components/ui/feedback/AlertBanner';
import { EmptyState } from '../../components/ui/feedback/EmptyState';
import { StatusBadge } from '../../components/ui/feedback/StatusBadge';
import { AvatarUploadField } from '../../components/ui/form/AvatarUploadField';
import { getRoleLabel } from '../../constants/roles.constants';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateMyProfile } from '../../services/users.service';
import type { ManagedUser } from '../../types/user.types';

export function ProfilePage() {
  const { refreshProfile } = useAuth();
  const [profile, setProfile] = useState<ManagedUser | null>(null);
  const [phone, setPhone] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await getMyProfile();

        if (isMounted) {
          setProfile(data);
          setPhone(data.phone ?? '');
          setAvatarPreview(data.avatarUrl);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Unable to load profile.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleAvatarChange = (file: File | null) => {
    if (avatarPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview);
    }

    if (!file) {
      setAvatarFile(null);
      setAvatarPreview(profile?.avatarUrl ?? null);
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updatedProfile = await updateMyProfile({
        phone,
        avatarFile,
      });

      setProfile(updatedProfile);
      setAvatarFile(null);
      setAvatarPreview(updatedProfile.avatarUrl);
      await refreshProfile();
      setSuccessMessage('Profile updated successfully.');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to update profile.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ProfileShell>
        <EmptyState title="Loading profile..." dashed />
      </ProfileShell>
    );
  }

  if (!profile) {
    return (
      <ProfileShell>
        <AlertBanner message={errorMessage || 'Profile not available.'} />
      </ProfileShell>
    );
  }

  return (
    <ProfileShell>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-slate-border bg-white p-6 shadow-sm">
          <h2 className="font-outfit text-xl font-bold text-slate-heading">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-slate-body">
            Your account details and current status in the salon.
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <UserAvatar
                firstName={profile.firstName}
                lastName={profile.lastName}
                avatarUrl={avatarPreview}
                size="md"
              />
              <div>
                <p className="font-outfit text-lg font-semibold text-slate-heading">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="text-sm text-slate-body">{profile.email}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-border px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-body">
                  Role
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-heading">
                  {getRoleLabel(profile.role)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-border px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-body">
                  Status
                </p>
                <div className="mt-2">
                  <StatusBadge isActive={profile.isActive} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-border bg-white p-6 shadow-sm">
          <h2 className="font-outfit text-xl font-bold text-slate-heading">
            Contact & Avatar
          </h2>
          <p className="mt-1 text-sm text-slate-body">
            Update your phone number and profile photo.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleProfileSubmit}>
            {errorMessage ? <AlertBanner message={errorMessage} /> : null}
            {successMessage ? (
              <AlertBanner message={successMessage} tone="success" />
            ) : null}

            <AvatarUploadField
              firstName={profile.firstName}
              lastName={profile.lastName}
              previewUrl={avatarPreview}
              onChange={handleAvatarChange}
            />

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-heading">
                Phone
              </label>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="0991234567"
                className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </section>
      </div>

      <section className="mt-6 rounded-[28px] border border-slate-border bg-white p-6 shadow-sm">
        <h2 className="font-outfit text-xl font-bold text-slate-heading">
          Security
        </h2>
        <p className="mt-1 text-sm text-slate-body">
          Change your password using your current credentials.
        </p>

        <div className="mt-6 max-w-md">
          <ChangePasswordForm />
        </div>
      </section>
    </ProfileShell>
  );
}
