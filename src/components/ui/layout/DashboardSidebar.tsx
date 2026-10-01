import { LogOut, LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NavItem } from '../../../constants/navigation.constants';
import { useAuth } from '../../../context/AuthContext';
import { canAccessNavItem } from '../../../lib/navigation-access';
import { UserAvatar } from '../display/UserAvatar';

interface DashboardSidebarProps {
  brandIcon: LucideIcon;
  brandSubtitle: string;
  roleLabel: string;
  navItems: NavItem[];
}

export function DashboardSidebar({
  brandIcon: BrandIcon,
  brandSubtitle,
  roleLabel,
  navItems,
}: DashboardSidebarProps) {
  const { user, logout } = useAuth();
  const visibleNavItems = navItems.filter((item) =>
    canAccessNavItem(item, user?.permissions),
  );

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-slate-border bg-white px-5 py-6">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand shadow-sm">
          <BrandIcon className="h-5 w-5 text-white" strokeWidth={1.75} />
        </div>
        <div>
          <p className="font-outfit text-lg font-bold leading-tight text-slate-heading">
            Harumi Nails
          </p>
          <p className="font-outfit text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            {brandSubtitle}
          </p>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto scrollbar-hide">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;

          if (!item.enabled) {
            return (
              <div
                key={item.path}
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-muted opacity-60"
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
                {item.label}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition',
                  isActive
                    ? 'bg-brand/10 text-brand'
                    : 'text-slate-body hover:bg-slate-50 hover:text-slate-heading',
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <SidebarUserFooter
        roleLabel={roleLabel}
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
          aria-label="Log out"
          className="rounded-lg p-2 text-slate-muted transition hover:bg-slate-50 hover:text-brand"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
