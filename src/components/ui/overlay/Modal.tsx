import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl';
}

const MAX_WIDTH_CLASSES = {
  md: 'max-w-lg',
  lg: 'max-w-lg',
  xl: 'max-w-3xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = 'md',
}: ModalProps) {
  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-heading/40 p-2 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className={`mx-auto flex max-h-[90vh] w-[95vw] flex-col overflow-hidden rounded-2xl bg-white shadow-xl ${MAX_WIDTH_CLASSES[maxWidth]}`}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 px-5 pt-5 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            {icon ? (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                {icon}
              </div>
            ) : null}
            <div className="min-w-0">
              <h2 className="font-outfit text-lg font-bold text-slate-heading sm:text-xl">
                {title}
              </h2>
              {subtitle ? (
                <p className="mt-1 text-sm text-slate-body">{subtitle}</p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg text-slate-muted transition hover:bg-slate-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
