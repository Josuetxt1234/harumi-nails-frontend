interface StatusBadgeProps {
  isActive: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StatusBadge({
  isActive,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
}: StatusBadgeProps) {
  return (
    <span
      className={[
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
        isActive
          ? 'bg-emerald-50 text-emerald-600'
          : 'bg-orange-50 text-orange-600',
      ].join(' ')}
    >
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
}
