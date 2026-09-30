import { Camera } from 'lucide-react';
import { useRef } from 'react';
import { UserAvatar } from '../display/UserAvatar';

interface AvatarUploadFieldProps {
  firstName: string;
  lastName: string;
  previewUrl: string | null;
  onChange: (file: File | null) => void;
  size?: 'md' | 'lg';
  helperText?: string;
}

export function AvatarUploadField({
  firstName,
  lastName,
  previewUrl,
  onChange,
  size = 'lg',
  helperText = 'JPG, PNG or WEBP. Max 5MB.',
}: AvatarUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarSize = size === 'lg' ? 'lg' : 'md';

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-border bg-slate-50 px-4 py-5">
      <div className="relative">
        <UserAvatar
          firstName={firstName}
          lastName={lastName}
          avatarUrl={previewUrl}
          size={avatarSize}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-sm transition hover:bg-brand-dark"
          aria-label="Upload avatar"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-heading">Profile photo</p>
        <p className="text-xs text-slate-body">{helperText}</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
    </div>
  );
}
