// theme-context.tsx
import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => { },
});

export const ThemeProvider = ({ children}) => {
  const [theme, setTheme] = useState('light');

  const loadTheme = async () => {
    const savedTheme = await AsyncStorage.getItem('theme');
    setTheme(savedTheme||Appearance.getColorScheme()||  'light');
  };

  useEffect(() => {
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};