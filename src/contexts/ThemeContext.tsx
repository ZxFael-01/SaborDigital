import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

type ThemeType = {
  bgColor: string;
  textColor: string;
  accentColor: string;
  backgroundImage: string;
  logoUrl: string;
};

type ThemeContextType = {
  theme: ThemeType;
  updateTheme: (newTheme: Partial<ThemeType>) => void;
};

const defaultTheme: ThemeType = {
  bgColor: 'bg-primary',
  textColor: 'text-white',
  accentColor: 'text-accent',
  backgroundImage: '',
  logoUrl: ''
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>(defaultTheme);

  useEffect(() => {
    // Fetch theme settings from Supabase when available
    const fetchThemeSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('theme_settings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (error || !data) {
          console.log('Using default theme settings');
          return;
        }
        
        setTheme({
          bgColor: `bg-[${data.primary_color || '#1E1E1E'}]`,
          textColor: 'text-white',
          accentColor: `text-[${data.accent_color || '#FFD700'}]`,
          backgroundImage: data.background_image || '',
          logoUrl: data.logo_url || ''
        });
        
      } catch (error) {
        console.error('Error fetching theme settings:', error);
      }
    };
    
    fetchThemeSettings();
  }, []);

  const updateTheme = (newTheme: Partial<ThemeType>) => {
    setTheme(currentTheme => ({ ...currentTheme, ...newTheme }));
    
    // In a real implementation, this would also update the database
    // but we'll keep it client-side for now until Supabase is connected
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}