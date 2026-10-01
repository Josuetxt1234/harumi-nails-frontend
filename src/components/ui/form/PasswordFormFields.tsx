import { RefreshCw } from 'lucide-react';
import { generateRandomPassword } from '../../../lib/generate-password';
import { PasswordInput } from './PasswordInput';

export interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordFormFieldsProps {
  values: PasswordFormValues;
  onChange: (values: PasswordFormValues) => void;
  mode: 'reset' | 'change-own';
  showGenerate?: boolean;
  newPasswordLabel?: string;
  confirmPasswordLabel?: string;
}

export function PasswordFormFields({
  values,
  onChange,
  mode,
  showGenerate = false,
  newPasswordLabel = 'New Password',
  confirmPasswordLabel = 'Confirm Password',
}: PasswordFormFieldsProps) {
  const updateField = (field: keyof PasswordFormValues, value: string) => {
    onChange({ ...values, [field]: value });
  };

  const handleGenerate = () => {
    const generated = generateRandomPassword();
    onChange({
      ...values,
      newPassword: generated,
      confirmPassword: generated,
    });
  };

  return (
    <>
      {mode === 'change-own' ? (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-heading">
            Current Password
          </label>
          <PasswordInput
            value={values.currentPassword}
            onChange={(event) =>
              updateField('currentPassword', event.target.value)
            }
            autoComplete="current-password"
            required
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-heading">
            {newPasswordLabel}
          </label>
          {showGenerate ? (
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand transition hover:text-brand-dark"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Generate
            </button>
          ) : null}
        </div>
        <PasswordInput
          value={values.newPassword}
          onChange={(event) => updateField('newPassword', event.target.value)}
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-heading">
          {confirmPasswordLabel}
        </label>
        <PasswordInput
          value={values.confirmPassword}
          onChange={(event) =>
            updateField('confirmPassword', event.target.value)
          }
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>
    </>
  );
}

export function validatePasswordForm(
  values: PasswordFormValues,
  mode: 'reset' | 'change-own',
): string | null {
  if (mode === 'change-own' && !values.currentPassword) {
    return 'Current password is required.';
  }

  if (values.newPassword.length < 8) {
    return 'New password must be at least 8 characters long.';
  }

  if (values.newPassword !== values.confirmPassword) {
    return 'Passwords do not match.';
  }

  return null;
}
