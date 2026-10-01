import { RefreshCw } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { ROLE_OPTIONS, SystemRole } from '../../../constants/roles.constants';
import { generateRandomPassword } from '../../../lib/generate-password';
import type {
  CreateUserInput,
  ManagedUser,
  UpdateUserInput,
  UserFormMode,
} from '../../../types/user.types';
import { AlertBanner } from '../../ui/feedback/AlertBanner';
import { AvatarUploadField } from '../../ui/form/AvatarUploadField';
import { ToggleSwitch } from '../../ui/form/ToggleSwitch';
import { PasswordInput } from '../../ui/form/PasswordInput';
import { Modal } from '../../ui/overlay/Modal';

interface UserFormModalProps {
  isOpen: boolean;
  mode: UserFormMode;
  user?: ManagedUser | null;
  allowedRoles?: SystemRole[];
  defaultRole?: SystemRole;
  onClose: () => void;
  onCreate: (input: CreateUserInput) => Promise<void>;
  onUpdate: (
    userId: string,
    input: UpdateUserInput,
    currentRole: string,
  ) => Promise<ManagedUser | void>;
}

export function UserFormModal({
  isOpen,
  mode,
  user,
  allowedRoles,
  defaultRole,
  onClose,
  onCreate,
  onUpdate,
}: UserFormModalProps) {
  const roleOptions = allowedRoles
    ? ROLE_OPTIONS.filter((option) => allowedRoles.includes(option.value))
    : ROLE_OPTIONS;

  const initialRole = defaultRole ?? roleOptions[0]?.value ?? 'MESA';

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: initialRole as SystemRole,
    isActive: true,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === 'edit' && user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone ?? '',
        password: '',
        role: (user.role as SystemRole) || initialRole,
        isActive: user.isActive,
      });
      setAvatarPreview(user.avatarUrl);
    } else {
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: initialRole,
        isActive: true,
      });
      setAvatarPreview(null);
    }

    setAvatarFile(null);
    setErrorMessage('');
  }, [isOpen, mode, user, initialRole]);

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
      setAvatarPreview(mode === 'edit' ? user?.avatarUrl ?? null : null);
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleGeneratePassword = () => {
    setForm((current) => ({
      ...current,
      password: generateRandomPassword(),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (mode === 'create') {
        await onCreate({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
          isActive: form.isActive,
          avatarFile,
        });
      } else if (user) {
        await onUpdate(
          user.id,
          {
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            role: form.role,
            password: form.password || undefined,
            isActive: form.isActive,
            avatarFile,
          },
          user.role,
        );
      }

      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to save user.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const showRoleSelector = roleOptions.length > 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create User' : 'Edit User'}
      subtitle={
        mode === 'create'
          ? 'Add a new team member to the platform.'
          : 'Update user information, role and profile photo.'
      }
      maxWidth="lg"
    >
      <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
        {errorMessage ? <AlertBanner message={errorMessage} /> : null}

        <AvatarUploadField
          firstName={form.firstName}
          lastName={form.lastName}
          previewUrl={avatarPreview}
          onChange={handleAvatarChange}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-heading">
              First Name
            </label>
            <input
              value={form.firstName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  firstName: event.target.value,
                }))
              }
              placeholder="Maria"
              autoComplete="off"
              className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-heading">
              Last Name
            </label>
            <input
              value={form.lastName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  lastName: event.target.value,
                }))
              }
              placeholder="Lopez"
              autoComplete="off"
              className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-heading">Email</label>
          <input
            type="email"
            name="user-email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="ejemplo@haruminails.com"
            autoComplete="off"
            disabled={mode === 'edit'}
            className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:bg-slate-50 disabled:text-slate-muted"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-heading">Phone</label>
          <input
            value={form.phone}
            onChange={(event) =>
              setForm((current) => ({ ...current, phone: event.target.value }))
            }
            placeholder="0991234567"
            autoComplete="off"
            className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

        {showRoleSelector ? (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-heading">Role</label>
            <select
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value as SystemRole,
                }))
              }
              className="w-full rounded-xl border border-slate-border px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <ToggleSwitch
          checked={form.isActive}
          onChange={(isActive) =>
            setForm((current) => ({ ...current, isActive }))
          }
          label="Active account"
          description="Inactive users cannot sign in."
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-heading">
              {mode === 'create' ? 'Password' : 'New Password (optional)'}
            </label>
            {mode === 'create' ? (
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand transition hover:text-brand-dark"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Generate
              </button>
            ) : null}
          </div>
          <PasswordInput
            name="user-password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
            placeholder={
              mode === 'create' ? 'Minimo 8 caracteres' : 'Leave blank to keep current'
            }
            autoComplete="new-password"
            required={mode === 'create'}
            minLength={mode === 'create' ? 8 : undefined}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-border px-5 py-3 text-sm font-semibold text-slate-heading transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-70"
          >
            {isSubmitting
              ? 'Saving...'
              : mode === 'create'
                ? 'Create User'
                : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
