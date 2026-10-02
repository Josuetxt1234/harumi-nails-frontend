import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../ui/overlay/Modal';

interface VoidRegisterDialogProps {
  isOpen: boolean;
  clientName: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function VoidRegisterDialog({
  isOpen,
  clientName,
  isSubmitting = false,
  onClose,
  onConfirm,
}: VoidRegisterDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('pos:void_title')}
      subtitle={clientName}
      icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
    >
      <p className="mb-6 text-sm text-slate-body">{t('pos:void_body')}</p>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-border px-5 py-3 text-sm font-semibold text-slate-heading transition hover:bg-slate-50"
        >
          {t('common:cancel')}
        </button>
        <button
          type="button"
          onClick={() => void onConfirm()}
          disabled={isSubmitting}
          className="rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-70"
        >
          {isSubmitting ? t('pos:voiding') : t('pos:void_title')}
        </button>
      </div>
    </Modal>
  );
}
