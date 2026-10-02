import { ServicesManagementView } from '../../components/features/services/ServicesManagementView';
import { ModulePage } from '../../components/ui/layout/ModulePage';
import { useTranslation } from 'react-i18next';

export function ServicesManagementPage() {
  const { t } = useTranslation('services');

  return (
    <ModulePage title={t('title')} subtitle={t('subtitle')}>
      <ServicesManagementView />
    </ModulePage>
  );
}
