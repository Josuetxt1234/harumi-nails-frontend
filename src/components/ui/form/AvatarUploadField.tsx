import { Camera } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { UserAvatar } from '../display/UserAvatar';

interface AvatarUploadFieldProps {
  firstName: string;
  lastName: string;
  previewUrl: string | null;
  onChange: (file: File | null) => void;
  size?: 'md' | 'lg';
  helperText?: string;
  disabled?: boolean;
}

export function AvatarUploadField({
  firstName,
  lastName,
  previewUrl,
  onChange,
  size = 'lg',
  helperText,
  disabled = false,
}: AvatarUploadFieldProps) {
  const { t } = useTranslation('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarSize = size === 'lg' ? 'lg' : 'md';
  const resolvedHelper = helperText ?? t('photo_hint');

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-border bg-slate-50 px-4 py-5">
      <div className="relative">
        <UserAvatar
          firstName={firstName}
          lastName={lastName}
          avatarUrl={previewUrl}
          size={avatarSize}
        />
        {disabled ? null : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white shadow-sm transition hover:bg-brand-dark"
            aria-label={t('upload_aria')}
          >
            <Camera className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-heading">{t('photo')}</p>
        <p className="text-xs text-slate-body">{resolvedHelper}</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        disabled={disabled}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
    </div>
  );
}
