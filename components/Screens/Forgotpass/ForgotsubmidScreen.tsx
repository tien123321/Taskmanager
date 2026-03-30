import React, { useState, useContext } from 'react';
import {
  Layout,
  Text,
  Input,
  Button,
  Icon,
} from '@ui-kitten/components';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { ThemeContext } from '../../../hooks/theme';
import { changePaswsordByEmail } from '@/Service/UserService';

type ForgotPasswordScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  'Forgotsubmit'
>;

const windowHeight = Dimensions.get('window').height;

const ForgotSubmitScreen = () => {
  const navigation = useNavigation<ForgotPasswordScreenProp>();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureNewPassword, setSecureNewPassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  const handleSubmit = async () => {
    if (!email || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp!');
      return;
    }
    setLoading(true);
    await changePaswsordByEmail(email,newPassword)
    try {
      Alert.alert('Thành công', 'Mật khẩu đã được thay đổi!');
      navigation.goback();
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi!');
    } finally {
      setLoading(false);
    }
  };

  const renderEyeIcon = (
    secure: boolean,
    setSecure: React.Dispatch<React.SetStateAction<boolean>>
  ) => (props: any) => (
    <TouchableOpacity onPress={() => setSecure(!secure)}>
      <Icon {...props} name={secure ? 'eye-off' : 'eye'} />
    </TouchableOpacity>
  );

  return (
    <Layout
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#1A2138' : '#fff' },
      ]}
    >
      <Text
        style={[
          styles.headerText,
          { color: isDarkMode ? '#FF708D' : '#FF3D71' },
        ]}
      >
        TESS SKILL APP
      </Text>
      <Text
        category="h4"
        style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}
      >
        Đổi mật khẩu
      </Text>
      <Text
        style={[
          styles.warningParagraph,
          { color: isDarkMode ? '#CED4DA' : '#6B7280' },
        ]}
      >
        Vui lòng sử dụng mật khẩu có độ mạnh cao gồm ít nhất 8 ký tự, bao gồm
        chữ hoa, chữ thường, số và ký tự đặc biệt. Không sử dụng lại mật khẩu
        cũ hoặc thông tin dễ đoán như ngày sinh. Mật khẩu mạnh giúp bảo vệ tài
        khoản khỏi nguy cơ bị truy cập trái phép. Nếu nghi ngờ tài khoản bị xâm
        nhập, hãy liên hệ hỗ trợ để được trợ giúp kịp thời.
      </Text>

      <View style={styles.form}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
          accessoryLeft={(props) => <Icon {...props} name="email-outline" />}
        />
        <Input
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={secureNewPassword}
          style={styles.input}
          accessoryLeft={(props) => <Icon {...props} name="lock-outline" />}
          accessoryRight={renderEyeIcon(
            secureNewPassword,
            setSecureNewPassword
          )}
        />
        <Input
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={secureConfirmPassword}
          style={styles.input}
          accessoryLeft={(props) => <Icon {...props} name="lock-outline" />}
          accessoryRight={renderEyeIcon(
            secureConfirmPassword,
            setSecureConfirmPassword
          )}
        />

        <Button
          style={styles.resetBtn}
          onPress={handleSubmit}
          size="large"
          accessoryRight={
            loading ? (props) => <Icon {...props} name="loader-outline" /> : undefined
          }
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận'}
        </Button>

        <TouchableOpacity
          style={styles.backToLogin}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={[styles.backText, { color: isDarkMode ? '#fff' : '#3366FF' }]}
          >
            ← Quay lại đăng nhập
          </Text>
        </TouchableOpacity>
      </View>

      <Image
        resizeMode="contain"
        style={styles.bottomImage}
        source={require('../../../assets/images/images.png')}
      />
    </Layout>
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
  resetBtn: {
    alignSelf: 'center',
    width: '60%',
    marginTop: 20,
    borderRadius: 25,
  },
  backToLogin: {
    marginTop: 20,
    alignItems: 'center',
  },
  backText: {
    fontWeight: '600',
  },
  bottomImage: {
    width: '120%',
    height: windowHeight * 0.25,
    marginTop: 10,
  },
  warningParagraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 2,
    textAlign: 'left',
  },
});

export default ForgotSubmitScreen;
