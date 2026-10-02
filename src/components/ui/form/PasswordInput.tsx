import { Eye, EyeOff } from 'lucide-react';
import { InputHTMLAttributes, useState } from 'react';
import { useTranslation } from 'react-i18next';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

const DEFAULT_CLASS_NAME =
  'w-full rounded-xl border border-slate-border bg-white px-4 py-3 pr-12 text-sm text-slate-heading outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:bg-slate-50 disabled:text-slate-muted';

export function PasswordInput({
  className,
  autoComplete = 'new-password',
  ...props
}: PasswordInputProps) {
  const { t } = useTranslation('common');
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={isVisible ? 'text' : 'password'}
        autoComplete={autoComplete}
        className={className ?? DEFAULT_CLASS_NAME}
      />
      <button
        type="button"
        aria-label={isVisible ? t('hide_password') : t('show_password')}
        onClick={() => setIsVisible((current) => !current)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-muted transition hover:text-slate-heading"
      >
        {isVisible ? (
          <EyeOff className="h-5 w-5" strokeWidth={1.75} />
        ) : (
          <Eye className="h-5 w-5" strokeWidth={1.75} />
        )}
      </button>
    </div>
  );
}
