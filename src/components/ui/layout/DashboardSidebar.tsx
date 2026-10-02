import { LogOut, LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NavItem } from '../../../constants/navigation.constants';
import { useAuth } from '../../../context/AuthContext';
import { canAccessNavItem } from '../../../lib/navigation-access';
import { UserAvatar } from '../display/UserAvatar';
import { LanguageSwitcher } from '../navigation/LanguageSwitcher';

interface DashboardSidebarProps {
  brandIcon: LucideIcon;
  brandSubtitleKey: string;
  roleLabelKey: string;
  navItems: NavItem[];
  sessionLabel?: string;
  onNavigate?: () => void;
  className?: string;
}

export function DashboardSidebar({
  brandIcon: BrandIcon,
  brandSubtitleKey,
  roleLabelKey,
  navItems,
  sessionLabel,
  onNavigate,
  className = '',
}: DashboardSidebarProps) {
  const { user, logout } = useAuth();
  const { t } = useTranslation('nav');
  const visibleNavItems = navItems.filter((item) =>
    canAccessNavItem(item, user?.permissions),
  );

  return (
    <aside
      className={[
        'flex h-screen w-72 shrink-0 flex-col border-r border-slate-border bg-white px-5 py-6',
        className,
      ].join(' ')}
    >
      <div className="mb-6 flex items-center gap-3 px-2 pr-10 md:pr-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand shadow-sm">
          <BrandIcon className="h-5 w-5 text-white" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="font-outfit text-lg font-bold leading-tight text-slate-heading">
            Harumi Nails
          </p>
          <p className="font-outfit text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            {t(brandSubtitleKey)}
          </p>
        </div>
      </div>

      <div className="mb-6 hidden px-2 md:block">
        <LanguageSwitcher />
      </div>

      {sessionLabel ? (
        <div className="mb-6 rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
            {t('active_session')}
          </p>
          <p className="mt-1 font-outfit text-sm font-semibold text-slate-heading">
            {sessionLabel}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-emerald-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {t('online')}
          </p>
        </div>
      ) : null}

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto scrollbar-hide">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const label = t(item.labelKey);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  'flex min-h-[44px] items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition',
                  isActive
                    ? 'bg-brand/10 text-brand'
                    : 'text-slate-body hover:bg-slate-50 hover:text-slate-heading',
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <SidebarUserFooter
        roleLabel={t(roleLabelKey)}
        onLogout={() => logout()}
        user={user}
      />
    </aside>
  );
}

function SidebarUserFooter({
  roleLabel,
  onLogout,
  user,
}: {
  roleLabel: string;
  onLogout: () => void;
  user: {
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
  } | null;
}) {
  const { t } = useTranslation('auth');

  return (
    <div className="mt-auto border-t border-slate-border pt-5">
      <div className="flex items-center gap-3 rounded-xl px-2 py-2">
        {user ? (
          <UserAvatar
            firstName={user.firstName}
            lastName={user.lastName}
            avatarUrl={user.avatarUrl}
          />
        ) : (
          <UserAvatar firstName="H" lastName="N" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-outfit text-sm font-semibold text-slate-heading">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="truncate text-xs text-slate-body">{roleLabel}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          aria-label={t('logout')}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-muted transition hover:bg-slate-50 hover:text-brand"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
