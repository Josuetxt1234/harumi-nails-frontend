import { ReactNode } from 'react';

interface PageContentProps {
  children: ReactNode;
}

export function PageContent({ children }: PageContentProps) {
  return (
    <div className="flex w-full flex-1 flex-col overflow-y-auto lg:min-h-0 lg:overflow-hidden">
      {children}
    </div>
  );
}
