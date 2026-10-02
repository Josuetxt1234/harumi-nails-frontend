import { Users, UserCheck, UserX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UsersMetricsCardsProps {
  total: number;
  active: number;
  inactive: number;
}

export function UsersMetricsCards({
  total,
  active,
  inactive,
}: UsersMetricsCardsProps) {
  const { t } = useTranslation();
  const cards = [
    {
      label: t('users:total'),
      value: total,
      icon: Users,
      accent: 'bg-brand/10 text-brand',
    },
    {
      label: t('status:active'),
      value: active,
      icon: UserCheck,
      accent: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: t('status:inactive'),
      value: inactive,
      icon: UserX,
      accent: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-border bg-white px-5 py-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-body">{card.label}</p>
                <p className="mt-1 font-outfit text-2xl font-bold text-slate-heading">
                  {card.value}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.accent}`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
