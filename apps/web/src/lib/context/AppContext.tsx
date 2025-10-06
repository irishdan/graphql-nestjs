import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import LocalStorageProvider from '../storage/localStorage';

interface App {
  theme: appThemeType;
  setTheme: (theme: appThemeType) => void;
}

export type appThemeType = 'Dark' | 'Light';

export const AppContext = createContext({} as App);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<appThemeType>('Dark');

  useEffect(() => {
    const load = async () => {
      const savedTheme = await LocalStorageProvider.getString('theme');

      if (savedTheme) {
        setThemeState(savedTheme as unknown as appThemeType);
      } else {
        await LocalStorageProvider.setString('theme', theme as string);
      }

      if (savedTheme === 'Light') {
        document.documentElement.classList.remove('dark');
      }
    };

    load();
  }, []);

  const setTheme = async (chosen: appThemeType) => {
    setThemeState(chosen);

    document.documentElement.classList.toggle('dark');

    await LocalStorageProvider.setString('theme', chosen as string);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useApp = () => useContext(AppContext);
