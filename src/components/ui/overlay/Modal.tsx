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
  maxWidth?: 'md' | 'lg';
}

const MAX_WIDTH_CLASSES = {
  md: 'max-w-md',
  lg: 'max-w-lg',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-heading/40 px-4 backdrop-blur-sm">
      <div
        className={`scrollbar-hide max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ${MAX_WIDTH_CLASSES[maxWidth]}`}
      >
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-start gap-3">
            {icon ? (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                {icon}
              </div>
            ) : null}
            <div>
              <h2 className="font-outfit text-xl font-bold text-slate-heading">
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
            className="rounded-lg p-2 text-slate-muted transition hover:bg-slate-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
