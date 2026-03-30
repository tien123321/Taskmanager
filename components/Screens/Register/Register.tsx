import React, { useState, useCallback, useContext } from 'react';
import {
  Layout,
  Text,
  Input,
  Button,
  Icon,
} from '@ui-kitten/components';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { registerUser } from '../../../Service/UserService';
import { login } from '../../../redux/slide/userSlide';
import { useDispatch } from 'react-redux';
import { ThemeContext } from '../../../hooks/theme';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

const windowHeight = Dimensions.get('window').height;

const Register = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  const toggleSecureEntry = useCallback(() => {
    setSecureText(prev => !prev);
  }, []);

  const toggleSecureConfirm = useCallback(() => {
    setSecureConfirm(prev => !prev);
  }, []);

  const renderPasswordIcon = (isConfirm = false) => (props: any) => (
    <TouchableOpacity onPress={isConfirm ? toggleSecureConfirm : toggleSecureEntry}>
      <Icon {...props} name={(isConfirm ? secureConfirm : secureText) ? 'eye-off' : 'eye'} />
    </TouchableOpacity>
  );

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }
    try {
      const newUser = await registerUser({
        id: '',
        name,
        email,
        password,
        avatar: '',
        role: false,
        diachi: '',
        SDT: '',
        story: '',
      });
      Alert.alert('Thành công', 'Đăng ký thành công!');
      navigation.navigate('AccountManagementScreen');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Lỗi', 'Đăng ký thất bại');
    }
  };

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1A2138' : '#fff'}
      />
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
          Thêm tài khoản
        </Text>

        <View style={styles.form}>
          <Input
            placeholder="Nhập họ tên"
            value={name}
            onChangeText={setName}
            style={styles.input}
            accessoryLeft={(props) => <Icon {...props} name="person-outline" />}
          />
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
            accessoryRight={renderPasswordIcon(false)}
          />
          <Input
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={secureConfirm}
            style={styles.input}
            accessoryLeft={(props) => <Icon {...props} name="lock-outline" />}
            accessoryRight={renderPasswordIcon(true)}
          />

          <Button style={styles.loginBtn} onPress={handleRegister} size="large">
            Thêm tài khoản
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
  loginBtn: {
    alignSelf: 'center',
    alignItems: 'center',
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
    marginTop: -5,
    padding: 8,
    color: '#FF3D71',
    marginLeft: 5,
    fontWeight: '600',
  },
  bottomImage: {
    width: '120%',
    height: windowHeight * 0.25,
    marginTop: 10,
  },
});

export default Register;
