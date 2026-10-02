import { DailyRegistersHistoryView } from '../../components/features/daily-register/DailyRegistersHistoryView';
import { ModulePage } from '../../components/ui/layout/ModulePage';
import { useTranslation } from 'react-i18next';

export function DailyRegistersHistoryPage() {
  const { t } = useTranslation('history');

  return (
    <ModulePage
      title={t('title')}
      subtitle={t('subtitle')}
    >
      <DailyRegistersHistoryView showHeader={false} />
    </ModulePage>
  );
}
