import { useCallback, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import i18n from '../i18n';
import { getRememberMePreference } from '../lib/auth-storage';
import { changeMyPassword } from '../services/users.service';
import type { ChangeOwnPasswordInput } from '../types/user.types';

export type ChangeOwnPasswordOutcome =
  | { status: 'changed' }
  | { status: 'session_lost' }
  | { status: 'failed'; message: string };

interface UseChangeOwnPassword {
  submit: (input: ChangeOwnPasswordInput) => Promise<ChangeOwnPasswordOutcome>;
  isSubmitting: boolean;
}

/**
 * Changes the password of the signed-in account and keeps the session alive.
 *
 * The backend drops every session of the account on a successful change, so
 * the token held in memory dies with it. Signing in again with the password
 * the user just chose is what prevents the next request from bouncing them to
 * the login screen, and it keeps the revocation intact: the old sessions stay
 * dead and this one is brand new.
 */
export function useChangeOwnPassword(): UseChangeOwnPassword {
  const { user, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(
    async (input: ChangeOwnPasswordInput): Promise<ChangeOwnPasswordOutcome> => {
      if (!user) {
        return { status: 'session_lost' };
      }

      setIsSubmitting(true);

      try {
        await changeMyPassword(input);
      } catch (error) {
        setIsSubmitting(false);

        return {
          status: 'failed',
          message:
            error instanceof Error
              ? error.message
              : i18n.t('errors:users_password'),
        };
      }

      // Past this line the password already changed. Anything that fails from
      // here is a session problem, never a failed change: reporting it as one
      // would send the user back to retry with a password that no longer works.
      try {
        await login({
          email: user.email,
          password: input.newPassword,
          rememberMe: getRememberMePreference(),
        });

        return { status: 'changed' };
      } catch {
        return { status: 'session_lost' };
      } finally {
        setIsSubmitting(false);
      }
    },
    [login, user],
  );

  return { submit, isSubmitting };
}
