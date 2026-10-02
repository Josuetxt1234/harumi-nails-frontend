import { useTranslation } from 'react-i18next';
import type { AdvanceStatus } from '../../../types/advance.types';

const STATUS_STYLES: Record<AdvanceStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  APPLIED: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-slate-100 text-slate-500',
};

const STATUS_KEYS: Record<AdvanceStatus, 'pending' | 'applied' | 'cancelled'> = {
  PENDING: 'pending',
  APPLIED: 'applied',
  CANCELLED: 'cancelled',
};

export function AdvanceStatusBadge({
  status,
  title,
  onClick,
}: {
  status: AdvanceStatus;
  title?: string;
  onClick?: () => void;
}) {
  const { t } = useTranslation('status');
  const className = `inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`;
  const label = t(STATUS_KEYS[status]);

  if (onClick) {
    return (
      <button
        type="button"
        title={title}
        onClick={onClick}
        className={`${className} cursor-pointer underline-offset-2 hover:underline`}
      >
        {label}
      </button>
    );
  }

  return (
    <span className={className} title={title}>
      {label}
    </span>
  );
}
