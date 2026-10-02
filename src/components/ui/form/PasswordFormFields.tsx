import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
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
  newPasswordLabel,
  confirmPasswordLabel,
}: PasswordFormFieldsProps) {
  const { t } = useTranslation('users');
  const resolvedNew = newPasswordLabel ?? t('new_password');
  const resolvedConfirm = confirmPasswordLabel ?? t('confirm_password');

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
            {t('current_password')}
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
            {resolvedNew}
          </label>
          {showGenerate ? (
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand transition hover:text-brand-dark"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {t('generate')}
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
          {resolvedConfirm}
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
    return i18n.t('users:password_required');
  }

  if (values.newPassword.length < 8) {
    return i18n.t('users:password_min');
  }

  if (values.newPassword !== values.confirmPassword) {
    return i18n.t('users:password_mismatch');
  }

  return null;
}
