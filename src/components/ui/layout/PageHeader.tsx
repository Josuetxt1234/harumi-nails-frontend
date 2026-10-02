import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NotificationBell } from '../navigation/NotificationBell';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function PageHeader({
  title,
  subtitle,
  searchPlaceholder,
  searchValue = '',
  onSearchChange,
}: PageHeaderProps) {
  const { t } = useTranslation('common');
  const resolvedPlaceholder = searchPlaceholder ?? t('search');

  return (
    <header className="mb-4 flex shrink-0 flex-col gap-4 sm:mb-6 lg:mb-8 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <h1 className="font-outfit text-2xl font-bold text-slate-heading sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-body">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {onSearchChange ? (
          <div className="relative min-w-0 flex-1 lg:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={resolvedPlaceholder}
              className="w-full rounded-full border border-slate-border bg-white py-3 pl-11 pr-4 text-sm text-slate-heading shadow-input outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
        ) : null}

        <div className="hidden md:block">
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
