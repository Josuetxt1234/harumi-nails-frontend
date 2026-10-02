import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';

export type ConfirmDialogType = 'deactivate' | 'activate' | 'delete';

interface ConfirmDialogProps {
  isOpen: boolean;
  type: ConfirmDialogType;
  subjectName: string;
  isSubmitting?: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const COPY_KEYS: Record<
  ConfirmDialogType,
  { title: string; description: string; confirmLabel: string; tone: string }
> = {
  deactivate: {
    title: 'suspend_title',
    description: 'suspend_body',
    confirmLabel: 'suspend_action',
    tone: 'bg-orange-500 hover:bg-orange-600',
  },
  activate: {
    title: 'activate_title',
    description: 'activate_body',
    confirmLabel: 'activate_action',
    tone: 'bg-emerald-500 hover:bg-emerald-600',
  },
  delete: {
    title: 'delete_title',
    description: 'delete_body',
    confirmLabel: 'delete_action',
    tone: 'bg-red-500 hover:bg-red-600',
  },
};

export function ConfirmDialog({
  isOpen,
  type,
  subjectName,
  isSubmitting = false,
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const { t } = useTranslation('confirm');
  const { t: tCommon } = useTranslation('common');
  const copy = COPY_KEYS[type];
  const resolvedTitle = title ?? t(copy.title);
  const resolvedDescription = description ?? t(copy.description);
  const resolvedConfirmLabel = confirmLabel ?? t(copy.confirmLabel);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={resolvedTitle}
      subtitle={subjectName}
      icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
    >
      <p className="mb-6 text-sm text-slate-body">{resolvedDescription}</p>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-border px-5 py-3 text-sm font-semibold text-slate-heading transition hover:bg-slate-50"
        >
          {tCommon('cancel')}
        </button>
        <button
          type="button"
          onClick={() => void onConfirm()}
          disabled={isSubmitting}
          className={`rounded-xl px-5 py-3 text-sm font-bold text-white transition disabled:opacity-70 ${copy.tone}`}
        >
          {isSubmitting ? tCommon('processing') : resolvedConfirmLabel}
        </button>
      </div>
    </Modal>
  );
}
