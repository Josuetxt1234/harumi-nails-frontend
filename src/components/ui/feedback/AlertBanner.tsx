interface AlertBannerProps {
  message: string;
  tone?: 'error' | 'success';
}

const TONE_CLASSES = {
  error: 'border-red-200 bg-red-50 text-red-600',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export function AlertBanner({ message, tone = 'error' }: AlertBannerProps) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${TONE_CLASSES[tone]}`}
    >
      {message}
    </div>
  );
}
