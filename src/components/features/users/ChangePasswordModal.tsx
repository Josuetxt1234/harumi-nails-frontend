import { KeyRound } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../ui/overlay/Modal';
import { AlertBanner } from '../../ui/feedback/AlertBanner';
import {
  PasswordFormFields,
  PasswordFormValues,
  validatePasswordForm,
} from '../../ui/form/PasswordFormFields';

interface ChangePasswordModalProps {
  isOpen: boolean;
  userName: string;
  onClose: () => void;
  onSubmit: (newPassword: string) => Promise<void>;
}

const EMPTY_VALUES: PasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export function ChangePasswordModal({
  isOpen,
  userName,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const { t } = useTranslation();
  const [values, setValues] = useState<PasswordFormValues>(EMPTY_VALUES);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setValues(EMPTY_VALUES);
    setErrorMessage('');
  }, [isOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validatePasswordForm(values, 'reset');
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await onSubmit(values.newPassword);
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t('errors:users_password'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('users:reset_password')}
      subtitle={userName}
      icon={<KeyRound className="h-5 w-5" />}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {errorMessage ? <AlertBanner message={errorMessage} /> : null}

        <PasswordFormFields
          values={values}
          onChange={setValues}
          mode="reset"
          showGenerate
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-border px-5 py-3 text-sm font-semibold text-slate-heading transition hover:bg-slate-50"
          >
            {t('common:cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-70"
          >
            {isSubmitting ? t('common:saving') : t('users:update_password')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
