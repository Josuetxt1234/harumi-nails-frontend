import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { UserAvatar } from '../display/UserAvatar';
import { LanguageSwitcher } from '../navigation/LanguageSwitcher';
import { NotificationBell } from '../navigation/NotificationBell';

interface MobileAppBarProps {
  onMenuClick: () => void;
  brandSubtitle: string;
}

export function MobileAppBar({ onMenuClick, brandSubtitle }: MobileAppBarProps) {
  const { t } = useTranslation('nav');
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex shrink-0 items-center gap-2 border-b border-slate-border bg-white px-3 py-2 md:hidden">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label={t('open_menu')}
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-border text-slate-heading"
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate font-outfit text-sm font-bold leading-tight text-slate-heading">
          Harumi Nails
        </p>
        <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">
          {brandSubtitle}
        </p>
      </div>

      <LanguageSwitcher compact />
      <NotificationBell />
      {user ? (
        <UserAvatar
          firstName={user.firstName}
          lastName={user.lastName}
          avatarUrl={user.avatarUrl}
        />
      ) : (
        <UserAvatar firstName="H" lastName="N" />
      )}
    </header>
  );
}
