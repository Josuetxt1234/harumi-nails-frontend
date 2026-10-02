import { useTranslation } from 'react-i18next';

const OPTIONS = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
] as const;

interface LanguageSwitcherProps {
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation('common');
  const current = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';

  if (compact) {
    const next = current === 'es' ? 'en' : 'es';
    const label = current.toUpperCase();

    return (
      <button
        type="button"
        onClick={() => void i18n.changeLanguage(next)}
        aria-label={t('language')}
        className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-slate-border bg-white text-[11px] font-bold tracking-wide text-slate-heading"
      >
        {label}
      </button>
    );
  }

  return (
    <div
      className="inline-flex rounded-xl border border-slate-border bg-slate-50 p-0.5"
      role="group"
      aria-label={t('language')}
    >
      {OPTIONS.map((option) => {
        const isActive = current === option.code;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => void i18n.changeLanguage(option.code)}
            className={[
              'min-h-[44px] min-w-[44px] rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-wide transition',
              isActive
                ? 'bg-brand text-white'
                : 'text-slate-body hover:bg-white hover:text-slate-heading',
            ].join(' ')}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
