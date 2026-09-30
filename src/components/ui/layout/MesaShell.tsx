import { LogOut, LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { UserAvatar } from '../display/UserAvatar';
import type { DashboardShellConfig, NavItem } from '../../../constants/navigation.constants';

interface MesaShellProps {
  children: React.ReactNode;
  config: DashboardShellConfig;
  sessionLabel?: string;
}

export function MesaShell({ children, config, sessionLabel }: MesaShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <MesaSidebar
        brandIcon={config.brandIcon}
        brandSubtitle={config.brandSubtitle}
        roleLabel={config.roleLabel}
        navItems={config.navItems}
        sessionLabel={sessionLabel}
      />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

function MesaSidebar({
  brandIcon: BrandIcon,
  brandSubtitle,
  roleLabel,
  navItems,
  sessionLabel,
}: {
  brandIcon: LucideIcon;
  brandSubtitle: string;
  roleLabel: string;
  navItems: NavItem[];
  sessionLabel?: string;
}) {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-slate-border bg-white px-5 py-6">
      <div className="mb-6 flex items-center gap-3 px-2">
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

      {sessionLabel ? (
        <div className="mb-6 rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
            Sesión activa
          </p>
          <p className="mt-1 font-outfit text-sm font-semibold text-slate-heading">
            {sessionLabel}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-emerald-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            En línea
          </p>
        </div>
      ) : null}

      <nav className="space-y-1">
        {navItems.map((item) => {
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
            onClick={() => logout()}
            aria-label="Cerrar sesión"
            className="rounded-lg p-2 text-slate-muted transition hover:bg-slate-50 hover:text-brand"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  );
}
