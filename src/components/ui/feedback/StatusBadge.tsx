import { useTranslation } from 'react-i18next';

interface StatusBadgeProps {
  isActive: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StatusBadge({
  isActive,
  activeLabel,
  inactiveLabel,
}: StatusBadgeProps) {
  const { t } = useTranslation('status');
  const resolvedActive = activeLabel ?? t('active');
  const resolvedInactive = inactiveLabel ?? t('inactive');

  return (
    <span
      className={[
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
        isActive
          ? 'bg-emerald-50 text-emerald-600'
          : 'bg-orange-50 text-orange-600',
      ].join(' ')}
    >
      {isActive ? resolvedActive : resolvedInactive}
    </span>
  );
}
