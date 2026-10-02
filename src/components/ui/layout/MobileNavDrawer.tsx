import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { LucideIcon } from 'lucide-react';
import type { NavItem } from '../../../constants/navigation.constants';
import { DashboardSidebar } from './DashboardSidebar';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brandIcon: LucideIcon;
  brandSubtitleKey: string;
  roleLabelKey: string;
  navItems: NavItem[];
  sessionLabel?: string;
}

export function MobileNavDrawer({
  isOpen,
  onClose,
  brandIcon,
  brandSubtitleKey,
  roleLabelKey,
  navItems,
  sessionLabel,
}: MobileNavDrawerProps) {
  const { t } = useTranslation('nav');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label={t('close_menu')}
        className="absolute inset-0 bg-slate-heading/40"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 left-0 flex h-full w-[min(20rem,88vw)] translate-x-0 flex-col bg-white shadow-2xl transition-transform">
        <button
          type="button"
          onClick={onClose}
          aria-label={t('close_menu')}
          className="absolute right-3 top-3 z-10 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-muted"
        >
          <X className="h-5 w-5" />
        </button>
        <DashboardSidebar
          brandIcon={brandIcon}
          brandSubtitleKey={brandSubtitleKey}
          roleLabelKey={roleLabelKey}
          navItems={navItems}
          sessionLabel={sessionLabel}
          onNavigate={onClose}
          className="h-full w-full border-r-0"
        />
      </div>
    </div>,
    document.body,
  );
}
