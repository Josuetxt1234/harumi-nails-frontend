import { useTranslation } from 'react-i18next';

interface LowStockAlertBannerProps {
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export function LowStockAlertBanner({
  count,
  isActive,
  onClick,
}: LowStockAlertBannerProps) {
  const { t } = useTranslation('inventory');

  if (count <= 0 && !isActive) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full rounded-2xl border px-5 py-4 text-left transition',
        isActive
          ? 'border-amber-300 bg-amber-100'
          : 'border-amber-100 bg-amber-50 hover:border-amber-200 hover:bg-amber-100/80',
      ].join(' ')}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-800">
        {t('low_stock_alert')}
      </p>
      <p className="mt-1 font-outfit text-2xl font-bold text-amber-900">
        {t(count === 1 ? 'low_stock_count' : 'low_stock_count_plural', { count })}
      </p>
      <p className="mt-1 text-sm text-amber-800/80">
        {isActive ? t('low_stock_filter_on') : t('low_stock_filter_off')}
      </p>
    </button>
  );
}
