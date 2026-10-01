import { ReactNode } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getDefaultRouteForRoles } from '../../../lib/get-default-route';

interface ProfileShellProps {
  children: ReactNode;
}

export function ProfileShell({ children }: ProfileShellProps) {
  const { user, logout } = useAuth();
  const backRoute = getDefaultRouteForRoles(user?.roles ?? [], user?.permissions);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-border bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-outfit text-lg font-bold text-slate-heading">
                My Profile
              </p>
              <p className="text-xs text-slate-body">Harumi Nails</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={backRoute}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-border px-4 py-2 text-sm font-semibold text-slate-heading transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-xl border border-slate-border px-4 py-2 text-sm font-semibold text-slate-heading transition hover:bg-slate-50"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
