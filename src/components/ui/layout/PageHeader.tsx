import { Bell, HelpCircle, Search } from 'lucide-react';

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
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
}: PageHeaderProps) {
  return (
    <header className="mb-8 flex shrink-0 flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="font-outfit text-3xl font-bold text-slate-heading">{title}</h1>
        <p className="mt-1 text-sm text-slate-body">{subtitle}</p>
      </div>

      {onSearchChange ? (
        <div className="flex items-center gap-3">
          <div className="relative w-full min-w-[280px] lg:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-full border border-slate-border bg-white py-3 pl-11 pr-4 text-sm text-slate-heading shadow-input outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-border bg-white text-slate-body transition hover:text-brand"
          >
            <Bell className="h-5 w-5" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            aria-label="Help"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-border bg-white text-slate-body transition hover:text-brand"
          >
            <HelpCircle className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      ) : null}
    </header>
  );
}
