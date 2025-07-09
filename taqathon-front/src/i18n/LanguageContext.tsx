import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  language: string;
  isRTL: boolean;
  changeLanguage: (lng: string) => Promise<void>;
  availableLanguages: { code: string; name: string; nativeName: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [isRTL, setIsRTL] = useState(false);

  // RTL languages
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      setLanguage(lng);
      setIsRTL(rtlLanguages.includes(lng));
      
      // Update document direction
      document.documentElement.dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr';
      document.documentElement.lang = lng;
      
      // Store in localStorage
      localStorage.setItem('i18nextLng', lng);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  useEffect(() => {
    // Initialize RTL state based on current language
    const currentLang = i18n.language;
    const isCurrentRTL = rtlLanguages.includes(currentLang);
    setIsRTL(isCurrentRTL);
    setLanguage(currentLang);
    
    // Set initial document direction
    document.documentElement.dir = isCurrentRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, []);

  // Listen to language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLanguage(lng);
      const isNewRTL = rtlLanguages.includes(lng);
      setIsRTL(isNewRTL);
      document.documentElement.dir = isNewRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = lng;
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const value: LanguageContextType = {
    language,
    isRTL,
    changeLanguage,
    availableLanguages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext; 