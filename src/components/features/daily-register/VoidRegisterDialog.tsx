import { AlertTriangle } from 'lucide-react';
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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Anular registro"
      subtitle={clientName}
      icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
    >
      <p className="mb-6 text-sm text-slate-body">
        Esta acción realiza una anulación (soft delete). El registro dejará de
        aparecer en los listados, pero quedará en auditoría con tu usuario.
      </p>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-border px-5 py-3 text-sm font-semibold text-slate-heading transition hover:bg-slate-50"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => void onConfirm()}
          disabled={isSubmitting}
          className="rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-70"
        >
          {isSubmitting ? 'Anulando...' : 'Anular registro'}
        </button>
      </div>
    </Modal>
  );
}
