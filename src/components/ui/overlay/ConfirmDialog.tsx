import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export type ConfirmDialogType = 'deactivate' | 'activate' | 'delete';

interface ConfirmDialogProps {
  isOpen: boolean;
  type: ConfirmDialogType;
  subjectName: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const COPY: Record<
  ConfirmDialogType,
  { title: string; description: string; confirmLabel: string; tone: string }
> = {
  deactivate: {
    title: 'Suspend User',
    description:
      'This user will lose access to the platform until reactivated.',
    confirmLabel: 'Suspend User',
    tone: 'bg-orange-500 hover:bg-orange-600',
  },
  activate: {
    title: 'Activate User',
    description: 'This user will regain access to the platform.',
    confirmLabel: 'Activate User',
    tone: 'bg-emerald-500 hover:bg-emerald-600',
  },
  delete: {
    title: 'Delete User',
    description:
      'This action performs a soft delete. The account will be removed from active lists but preserved for audit history.',
    confirmLabel: 'Delete User',
    tone: 'bg-red-500 hover:bg-red-600',
  },
};

export function ConfirmDialog({
  isOpen,
  type,
  subjectName,
  isSubmitting = false,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const copy = COPY[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={copy.title}
      subtitle={subjectName}
      icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
    >
      <p className="mb-6 text-sm text-slate-body">{copy.description}</p>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-border px-5 py-3 text-sm font-semibold text-slate-heading transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void onConfirm()}
          disabled={isSubmitting}
          className={`rounded-xl px-5 py-3 text-sm font-bold text-white transition disabled:opacity-70 ${copy.tone}`}
        >
          {isSubmitting ? 'Processing...' : copy.confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
