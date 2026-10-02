import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import { changeMyPassword } from '../../../services/users.service';
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

export function ChangePasswordForm() {
  const { t } = useTranslation();
  const [values, setValues] = useState<PasswordFormValues>(EMPTY_VALUES);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const validationError = validatePasswordForm(values, 'change-own');
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await changeMyPassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setValues(EMPTY_VALUES);
      setSuccessMessage(i18n.t('notifications:password_updated'));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t('errors:users_password'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {errorMessage ? <AlertBanner message={errorMessage} /> : null}
      {successMessage ? (
        <AlertBanner message={successMessage} tone="success" />
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
