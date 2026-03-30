import React, { useContext } from 'react';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import AppNavigator from './navigation/AppNavigator';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeContext, ThemeProvider } from './hooks/theme';
import { StatusBar } from 'react-native';
import PieChartExample from './components/Screens/Victoryby/Victoryby';

const Main = () => {
   const { theme } = useContext(ThemeContext); 
    const isDarkMode = theme === 'dark';
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva[theme]}>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </ApplicationProvider>
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  );
}
