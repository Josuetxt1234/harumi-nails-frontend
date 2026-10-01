import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getRememberedEmail,
  getRememberMePreference,
} from '../../lib/auth-storage';
import { getDefaultRouteForRoles } from '../../lib/get-default-route';
import { getApiErrorMessage } from '../../lib/get-api-error';
import { PasswordInput } from '../ui/form/PasswordInput';

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const savedRememberMe = getRememberMePreference();
    setRememberMe(savedRememberMe);

    if (savedRememberMe) {
      setEmail(getRememberedEmail());
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const authenticatedUser = await login({
        email: email.trim(),
        password,
        rememberMe,
      });

        navigate(getDefaultRouteForRoles(authenticatedUser.roles, authenticatedUser.permissions), {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'Invalid email or password. Please check your credentials and try again.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-slate-heading">¡Hola de nuevo!</h2>
        <p className="mt-2 text-sm text-slate-body">
          Ingresa tus credenciales para acceder a la plataforma.
        </p>
      </header>

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        {errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        ) : null}

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-slate-heading"
          >
            Correo Electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="admin@haruminails.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-border bg-white px-4 py-3 text-sm text-slate-heading shadow-input outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-heading"
            >
              Contraseña
            </label>
            <a
              href="#"
              className="text-sm font-medium text-brand transition hover:text-brand-dark"
              onClick={(event) => event.preventDefault()}
            >
              ¿Olvidé mi contraseña?
            </a>
          </div>

          <PasswordInput
            id="password"
            name="password"
            autoComplete={rememberMe ? 'current-password' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-border bg-white px-4 py-3 pr-12 text-sm text-slate-heading shadow-input outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            required
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="h-4 w-4 rounded border-slate-border text-brand focus:ring-brand/30"
          />
          <span className="text-sm font-medium text-slate-body">Recuérdame</span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-brand px-4 py-3.5 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p className="mt-auto pt-16 text-center text-sm text-slate-body">
        ¿Tienes problemas? Comunicate con el Administrador
      </p>
    </div>
  );
}
