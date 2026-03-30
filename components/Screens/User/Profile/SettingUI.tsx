import React, { useContext } from 'react';
import { Layout, Text, Toggle, Icon } from '@ui-kitten/components';
import { ThemeContext } from '../../../../hooks/theme';
import { View } from 'react-native';

const SettingUI: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text category="h1">Cài đặt</Text>

      <View style={{ marginTop: 20 }}>
                <Toggle
            checked={theme === 'dark'}
            onChange={toggleTheme}
            >
            {`Chế độ ${theme === 'dark' ? 'Tối' : 'Sáng'}`}
            </Toggle>

      </View>
    </Layout>
  );
};

export default SettingUI;