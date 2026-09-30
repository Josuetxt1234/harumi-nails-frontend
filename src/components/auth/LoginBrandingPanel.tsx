import { Sparkles } from 'lucide-react';
import coverImage from '../../assets/images/UnasPortada.jpg';

export function LoginBrandingPanel() {
  return (
    <aside className="relative hidden min-h-screen w-full overflow-hidden lg:flex lg:w-1/2">
      <img
        src={coverImage}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-brand/40 via-brand/30 to-brand/45" />

      <header className="relative z-10 flex w-full flex-col items-center px-10 pt-16 text-center text-white">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg">
          <Sparkles className="h-7 w-7 text-brand" strokeWidth={1.75} />
        </div>

        <h1 className="font-outfit text-4xl font-bold tracking-tight">Harumi Nails</h1>
        <p className="mt-1 font-outfit text-base font-medium leading-tight text-white/95">
          By Emily Medina
        </p>
      </header>

      <footer className="absolute bottom-8 left-0 right-0 z-10 px-10 text-center text-xs font-light text-white/90">
        © 2026 Harumi Nails Beauty Center. Todos los derechos reservados.
      </footer>
    </aside>
  );
}
