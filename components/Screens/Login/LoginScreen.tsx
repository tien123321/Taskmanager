import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
  Layout,
  Text,
  Input,
  Button,
  Icon,
  CheckBox,
} from '@ui-kitten/components';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { loginUser, saveLoginInfo } from "../../../Service/UserService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../../../redux/slide/userSlide';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { ThemeContext } from '../../../hooks/theme'; 

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const windowHeight = Dimensions.get('window').height;

const LoginScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const { theme } = useContext(ThemeContext); 
  const isDarkMode = theme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [remember, setRemember] = useState(false);

  const toggleSecureEntry = useCallback(() => {
    setSecureText((prev) => !prev);
  }, []);

  const renderPasswordIcon = (props: any) => (
    <TouchableOpacity onPress={toggleSecureEntry}>
      <Icon {...props} name={secureText ? 'eye-off' : 'eye'} />
    </TouchableOpacity>
  );

  const loadLoginInfo = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('savedEmail');
      const savedPassword = await AsyncStorage.getItem('savedPassword');
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRemember(true);
      }
    } catch (error) {
      console.log('Lỗi khi lấy thông tin đăng nhập:', error);
    }
  };

  const clearLoginInfo = async () => {
    await AsyncStorage.removeItem('savedEmail');
    await AsyncStorage.removeItem('savedPassword');
  };

  useEffect(() => {
    loadLoginInfo();
  }, []);

  const handleLogin = async () => {
    try {
      const userData = await loginUser({ email, password });
      dispatch(login(userData));
      if (remember) {
        await saveLoginInfo(email, password);
      } else {
        await clearLoginInfo();
      }

      if (userData.role) {
        navigation.navigate('HomeAd');
        navigation.reset({ index: 0, routes: [{ name: 'HomeAd' }] });
      } else {
        navigation.navigate('Home');
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      }
    } catch (error: any) {
      Alert.alert('Lỗi đăng nhập', error.message);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("Forgotsubmit");
  };

  return (
    <>
      <Layout
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? '#1A2138' : '#fff' },
        ]}
      >
        <Text style={[styles.headerText, { color: isDarkMode ? '#FF708D' : '#FF3D71' }]}>
          TESS SKILL APP
        </Text>
        <Text category="h4" style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
          Đăng Nhập
        </Text>

        <View style={styles.form}>
          <Input
            placeholder="Nhập email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
            accessoryLeft={(props) => <Icon {...props} name="email-outline" />}
          />

          <Input
            placeholder="Nhập mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
            style={styles.input}
            accessoryLeft={(props) => <Icon {...props} name="lock-outline" />}
            accessoryRight={renderPasswordIcon}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          <View style={styles.row}>
            <CheckBox
              checked={remember}
              onChange={(nextChecked) => setRemember(nextChecked)}
            >
              <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Nhớ mật khẩu</Text>
            </CheckBox>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          <Button style={styles.loginBtn} onPress={handleLogin} size="large">
            Đăng Nhập
          </Button>
        </View>

        <Image
          resizeMode="contain"
          style={styles.bottomImage}
          source={require('../../../assets/images/images.png')}
        />
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    marginTop: 160,
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
    marginTop: 20,
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  forgotText: {
    color: '#3366FF',
    fontWeight: '600',
  },
  loginBtn: {
    alignSelf: 'center',
    alignItems: "center",
    justifyContent: 'center',
    width: '60%',
    marginTop: 20,
    borderRadius: 25,
    backgroundColor: '#FF3D71',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  signupText: {
    color: '#FF3D71',
    marginLeft: 5,
    fontWeight: '600',
  },
  bottomImage: {
    width: '120%',
    height: windowHeight * 0.25,
    marginTop: 60,
  },
});

export default LoginScreen;
