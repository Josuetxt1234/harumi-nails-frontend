import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
  getRememberedEmail,
  getRememberMePreference,
} from '../../lib/auth-storage';
import { getDefaultRouteForRoles } from '../../lib/get-default-route';
import { getApiErrorMessage } from '../../lib/get-api-error';
import { PasswordInput } from '../ui/form/PasswordInput';
import { LanguageSwitcher } from '../ui/navigation/LanguageSwitcher';

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation('auth');
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

      navigate(
        getDefaultRouteForRoles(
          authenticatedUser.roles,
          authenticatedUser.permissions,
        ),
        {
          replace: true,
        },
      );
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'auth:invalid_credentials'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col">
      <header className="mb-10">
        <div className="mb-6 flex justify-end">
          <LanguageSwitcher />
        </div>
        <h2 className="text-3xl font-bold text-slate-heading">{t('hello_again')}</h2>
        <p className="mt-2 text-sm text-slate-body">{t('login_subtitle')}</p>
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
            {t('email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t('email_placeholder')}
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
              {t('password')}
            </label>
            <a
              href="#"
              className="text-sm font-medium text-brand transition hover:text-brand-dark"
              onClick={(event) => event.preventDefault()}
            >
              {t('forgot_password')}
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
          <span className="text-sm font-medium text-slate-body">
            {t('remember_me')}
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-brand px-4 py-3.5 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? t('signing_in') : t('login')}
        </button>
      </form>

      <p className="mt-auto pt-16 text-center text-sm text-slate-body">
        {t('login_help')}
      </p>
    </div>
  );
}
