interface EmptyStateProps {
  title: string;
  description?: string;
  dashed?: boolean;
}

export function EmptyState({
  title,
  description,
  dashed = false,
}: EmptyStateProps) {
  return (
    <div
      className={[
        'rounded-2xl bg-white px-6 py-16 text-center',
        dashed ? 'border border-dashed border-slate-border' : 'border border-slate-border',
      ].join(' ')}
    >
      <p className="font-outfit text-lg font-semibold text-slate-heading">
        {title}
      </p>
      {description ? (
        <p className="mt-2 text-sm text-slate-body">{description}</p>
      ) : null}
    </div>
  );
}
