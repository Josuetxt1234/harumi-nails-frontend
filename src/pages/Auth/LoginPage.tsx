import { Sparkles } from 'lucide-react';
import { LoginBrandingPanel } from '../../components/auth/LoginBrandingPanel';
import { LoginForm } from '../../components/auth/LoginForm';

export function LoginPage() {
  return (
    <main className="flex min-h-screen bg-white">
      <LoginBrandingPanel />

      <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-10 lg:w-1/2 lg:px-16">
        <div className="mb-8 flex flex-col items-center text-center lg:hidden">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10">
            <Sparkles className="h-7 w-7 text-brand" strokeWidth={1.75} />
          </div>
          <h1 className="font-outfit text-2xl font-bold text-slate-heading">
            Harumi Nails
          </h1>
          <p className="mt-1 font-outfit text-sm font-medium text-slate-body">
            By Emily Medina
          </p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
