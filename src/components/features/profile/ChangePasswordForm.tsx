import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChangeOwnPassword } from '../../../hooks/useChangeOwnPassword';
import i18n from '../../../i18n';
import { AlertBanner } from '../../ui/feedback/AlertBanner';
import {
  PasswordFormFields,
  PasswordFormValues,
  validatePasswordForm,
} from '../../ui/form/PasswordFormFields';

const EMPTY_VALUES: PasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

type Feedback = { message: string; tone: 'error' | 'success' | 'info' };

export function ChangePasswordForm() {
  const { t } = useTranslation();
  const { submit, isSubmitting } = useChangeOwnPassword();
  const [values, setValues] = useState<PasswordFormValues>(EMPTY_VALUES);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const validationError = validatePasswordForm(values, 'change-own');
    if (validationError) {
      setFeedback({ message: validationError, tone: 'error' });
      return;
    }

    const outcome = await submit({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });

    if (outcome.status === 'failed') {
      setFeedback({ message: outcome.message, tone: 'error' });
      return;
    }

    // The password changed in both remaining outcomes, so the typed values are
    // stale either way and must not be left on screen.
    setValues(EMPTY_VALUES);

    setFeedback(
      outcome.status === 'changed'
        ? { message: i18n.t('notifications:password_updated'), tone: 'success' }
        : {
            message: i18n.t('notifications:password_updated_session_lost'),
            tone: 'info',
          },
    );
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {feedback ? (
        <AlertBanner message={feedback.message} tone={feedback.tone} />
      ) : null}

      <PasswordFormFields
        values={values}
        onChange={setValues}
        mode="change-own"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-70"
      >
        {isSubmitting ? t('common:saving') : t('users:update_password')}
      </button>
    </form>
  );
}
