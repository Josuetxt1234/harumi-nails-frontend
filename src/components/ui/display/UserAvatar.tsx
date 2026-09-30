interface UserAvatarProps {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-20 w-20 text-xl',
  lg: 'h-24 w-24 text-xl',
};

export function UserAvatar({
  firstName,
  lastName,
  avatarUrl,
  size = 'sm',
  className = '',
}: UserAvatarProps) {
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  const sizeClass = SIZE_CLASSES[size];

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`${firstName} ${lastName}`}
        className={`rounded-full object-cover ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-brand/15 font-outfit font-bold text-brand ${sizeClass} ${className}`}
    >
      {initials || 'HN'}
    </div>
  );
}
