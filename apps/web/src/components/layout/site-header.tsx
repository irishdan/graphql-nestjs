import { Button } from '@/components/ui/button.tsx';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import Logo from '@/components/ui/logo.tsx';

export function SiteHeader() {
  const { theme, setTheme } = useApp();

  const toggleTheme = () => {
    if (theme === 'Dark') {
      setTheme('Light');
    } else {
      setTheme('Dark');
    }
  };

  return (
    <header className="md:mb-2 bg-sidebar flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <Logo />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={toggleTheme}>
            {theme === 'Dark' ? <MoonIcon /> : <SunIcon />}
          </Button>
        </div>
      </div>
    </header>
  );
}
