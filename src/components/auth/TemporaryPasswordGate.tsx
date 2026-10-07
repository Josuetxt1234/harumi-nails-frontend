import { ShieldAlert } from 'lucide-react';
import { FormEvent, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useChangeOwnPassword } from '../../hooks/useChangeOwnPassword';
import i18n from '../../i18n';
import { AlertBanner } from '../ui/feedback/AlertBanner';
import {
  PasswordFormFields,
  PasswordFormValues,
  validatePasswordForm,
} from '../ui/form/PasswordFormFields';
import { Modal } from '../ui/overlay/Modal';

const EMPTY_VALUES: PasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

/**
 * Holds an authenticated session on a mandatory password change while the
 * profile still carries `mustChangePassword`.
 *
 * It wraps the whole router instead of living inside the login form so that
 * reloading the page or landing on a deep link cannot skip the change: the
 * flag travels with the profile on every /auth/me and /auth/refresh response.
 */
export function TemporaryPasswordGate({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { submit, isSubmitting } = useChangeOwnPassword();
  const { t } = useTranslation();
  const [values, setValues] = useState<PasswordFormValues>(EMPTY_VALUES);
  const [errorMessage, setErrorMessage] = useState('');

  if (!user?.mustChangePassword) {
    return <>{children}</>;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validatePasswordForm(values, 'change-own');
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage('');

    const outcome = await submit({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });

    if (outcome.status === 'failed') {
      setErrorMessage(outcome.message);
      return;
    }

    setValues(EMPTY_VALUES);

    // On 'changed' the refreshed profile clears the flag and this gate
    // unmounts. On 'session_lost' the next request expires the session and
    // sends the user to the login screen, so say why before that happens.
    if (outcome.status === 'session_lost') {
      setErrorMessage(i18n.t('notifications:password_updated_session_lost'));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Modal
        isOpen
        dismissible={false}
        onClose={() => undefined}
        title={t('auth:temp_password_title')}
        subtitle={t('auth:temp_password_subtitle')}
        icon={<ShieldAlert className="h-5 w-5" />}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <p className="text-sm text-slate-body">
            {t('auth:temp_password_description')}
          </p>

          {errorMessage ? <AlertBanner message={errorMessage} /> : null}

          <PasswordFormFields
            values={values}
            onChange={setValues}
            mode="change-own"
            currentPasswordLabel={t('auth:temp_password_current_label')}
            newPasswordLabel={t('auth:temp_password_new_label')}
            confirmPasswordLabel={t('auth:temp_password_confirm_label')}
          />

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={logout}
              className="min-h-[44px] rounded-xl border border-slate-border px-5 py-3 text-sm font-semibold text-slate-heading transition hover:bg-slate-50"
            >
              {t('auth:logout')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[44px] rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? t('common:saving')
                : t('auth:temp_password_submit')}
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
