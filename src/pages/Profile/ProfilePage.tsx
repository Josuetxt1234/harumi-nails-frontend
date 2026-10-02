import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { ChangePasswordForm } from '../../components/features/profile/ChangePasswordForm';
import { ProfileShell } from '../../components/ui/layout/ProfileShell';
import { UserAvatar } from '../../components/ui/display/UserAvatar';
import { AlertBanner } from '../../components/ui/feedback/AlertBanner';
import { EmptyState } from '../../components/ui/feedback/EmptyState';
import { StatusBadge } from '../../components/ui/feedback/StatusBadge';
import { AvatarUploadField } from '../../components/ui/form/AvatarUploadField';
import { getRoleLabel } from '../../constants/roles.constants';
import { PERMISSIONS } from '../../constants/permissions.constants';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../lib/get-api-error';
import { getMyProfile, updateMyProfile } from '../../services/users.service';
import type { ManagedUser } from '../../types/user.types';

export function ProfilePage() {
  const { t } = useTranslation();
  const { refreshProfile, hasPermission } = useAuth();
  const canUpdateProfile = hasPermission(PERMISSIONS.PROFILE_UPDATE);
  const canChangePassword = hasPermission(PERMISSIONS.PROFILE_CHANGE_PASSWORD);
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
            getApiErrorMessage(error, 'errors:profile_load'),
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

    if (!canUpdateProfile) {
      return;
    }
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
      setSuccessMessage(i18n.t('notifications:profile_updated'));
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'errors:profile_update'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ProfileShell>
        <EmptyState title={t('profile:loading')} dashed />
      </ProfileShell>
    );
  }

  if (!profile) {
    return (
      <ProfileShell>
        <AlertBanner message={errorMessage || t('profile:unavailable')} />
      </ProfileShell>
    );
  }

  return (
    <ProfileShell>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-slate-border bg-white p-6 shadow-sm">
          <h2 className="font-outfit text-xl font-bold text-slate-heading">
            {t('profile:personal')}
          </h2>
          <p className="mt-1 text-sm text-slate-body">
            {t('profile:personal_hint')}
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
                  {t('users:role')}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-heading">
                  {getRoleLabel(profile.role)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-border px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-body">
                  {t('common:status')}
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
            {t('profile:contact')}
          </h2>
          <p className="mt-1 text-sm text-slate-body">
            {canUpdateProfile
              ? t('profile:contact_can_edit')
              : t('profile:contact_readonly')}
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
              disabled={!canUpdateProfile}
            />

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-heading">
                {t('users:phone')}
              </label>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder={t('users:placeholder_phone')}
                disabled={!canUpdateProfile}
                className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:bg-slate-50 disabled:text-slate-muted"
              />
            </div>

            {canUpdateProfile ? (
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-70"
              >
                {isSaving ? t('common:saving') : t('common:save')}
              </button>
            ) : null}
          </form>
        </section>
      </div>

      {canChangePassword ? (
        <section className="mt-6 rounded-[28px] border border-slate-border bg-white p-6 shadow-sm">
          <h2 className="font-outfit text-xl font-bold text-slate-heading">
            {t('profile:security')}
          </h2>
          <p className="mt-1 text-sm text-slate-body">
            {t('profile:security_hint')}
          </p>

          <div className="mt-6 max-w-md">
            <ChangePasswordForm />
          </div>
        </section>
      ) : null}
    </ProfileShell>
  );
}
