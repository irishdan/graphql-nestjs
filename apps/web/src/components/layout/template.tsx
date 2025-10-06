import * as React from 'react';
import { SiteHeader } from '@/components/layout/site-header.tsx';
import { Main } from '@/components/layout/main.tsx';

interface Props {
  title?: string;
  children: React.ReactNode;
}

const Template = ({ children }: Props) => {
  return (
    <div>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <Main>{children}</Main>
      </div>
    </div>
  );
};

export default Template;
