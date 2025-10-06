import * as React from 'react';
import { cn } from '@/lib/utils.ts';

export const Main = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <main
      className={cn('@container/main flex flex-1 flex-col gap-2 bg-background', 'md:rounded-tl-xl', className)}
      {...props}
    />
  );
};
