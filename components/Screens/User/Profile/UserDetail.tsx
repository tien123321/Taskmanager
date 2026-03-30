import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Icon, Layout } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { updateUser } from "../../../../Service/UserService"
import { uploadImageToCloudinary } from '../../../../Firebase/Cloudy/CloudyImage';
import { login } from '../../../../redux/slide/userSlide'
import { User } from '../../../../Modal/UserModal';
import { ThemeContext } from '../../../../hooks/theme';  // Import ThemeContext

const FullScreenLoader = () => (
  <View style={styles.loadingOverlay}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={styles.loadingText}>Đang xử lý...</Text>
  </View>
);

const UserDetails = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);  // Lấy theme từ context
  const isDarkMode = theme === 'dark';  // Kiểm tra chế độ sáng/tối
  const [id, setId] = useState<string>(user?.id?.toString() ?? '');
  const [name, setName] = useState<string>(user?.name ?? '');
  const [email, setEmail] = useState<string>(user?.email ?? '');
  const [phone, setPhone] = useState<string>(user?.SDT ?? '');
  const [address, setAddress] = useState<string>(user?.diachi ?? '');
  const [avatar, setAvatar] = useState<string>(typeof user?.avatar === 'string' 
    ? user?.avatar 
    : (user?.avatar && 'uri' in user.avatar ? user.avatar.uri : ''));
  const [story, setStory] = useState<string>(user?.story ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    switch (field) {
      case 'id':
        setId(value);
        break;
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'address':
        setAddress(value);
        break;
      case 'avatar':
        setAvatar(value);
        break;
      case 'story':
        setStory(value);
        break;
      default:
        break;
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      let uploadedImageUrl = avatar
        ? await uploadImageToCloudinary(avatar)
        : 'https://antimatter.vn/wp-content/uploads/2022/05/background-xanh-duong-dam-dep.jpg';
  
  
      const userData: User = {
        id,
        name,
        email,
        SDT: phone,
        diachi: address,
        avatar: uploadedImageUrl,
        story,
        role: user?.role || false,
        password: user?.password || '',
      };
      await updateUser({
        ...userData,
        oldPassword: user?.password || '',
      });
  
      dispatch(login(userData));
      navigation.navigate("Information");
    } catch (error: any) {
      console.error("Cập nhật thất bại:", error.message);
    } finally {
      setEditingField(null);
      setIsLoading(false);
    }
  };
  

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setAvatar(imageUri); // Cập nhật avatar với URI của ảnh
    }
  };

  return (
    <Layout style={[styles.layout, { backgroundColor: isDarkMode ? '#121212' : '#f9fbfd' }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Nút quay về */}
        <View style={styles.backButtonWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back-outline" style={[styles.backIcon, { tintColor: isDarkMode ? '#ffffff' : '#1565c0' }]} />
            <Text style={[styles.backText, { color: isDarkMode ? '#ffffff' : '#1565c0' }]}>Quay về</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: avatar }}  // Chắc chắn rằng source là một đối tượng với khóa 'uri'
            style={styles.avatar}
          />
          <TouchableOpacity onPress={pickImage} style={styles.avatarEditButton}>
            <Text style={styles.avatarEditText}>Sửa ảnh</Text>
          </TouchableOpacity>
        </View>

        {/* Các trường thông tin */}
        {[{ label: 'Họ tên', key: 'name', value: name },
          { label: 'Email', key: 'email', value: email },
          { label: 'Số điện thoại', key: 'phone', value: phone },
          { label: 'Địa chỉ', key: 'address', value: address },
          { label: 'Thông tin tiểu sử', key: 'story', value: story }]
          .map((item) => (
            <View key={item.key} style={[styles.infoRow, { backgroundColor: isDarkMode ? '#333' : '#ffffff' }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: isDarkMode ? '#ffffff' : '#455a64' }]}>{item.label}:</Text>
                {editingField === item.key ? (
                  <TextInput
                    style={[styles.input, { backgroundColor: isDarkMode ? '#424242' : '#fefefe', color: isDarkMode ? '#ffffff' : '#263238' }]}
                    value={item.value}
                    onChangeText={(text) => handleChange(item.key, text)}
                    placeholder={`Nhập ${item.label.toLowerCase()}`}
                  />
                ) : (
                  <Text style={[styles.value, { color: isDarkMode ? '#ffffff' : '#263238' }]}>{item.value}</Text>
                )}
              </View>

              <TouchableOpacity
                onPress={() => setEditingField(editingField === item.key ? null : item.key)}
                style={styles.editButton}
              >
                <Icon
                  name={editingField === item.key ? 'checkmark-outline' : 'edit-2-outline'}
                  style={[styles.editIcon, { tintColor: isDarkMode ? '#ffffff' : '#1976d2' }]}
                />
              </TouchableOpacity>
            </View>
          ))}

        {/* Nút cập nhật */}
        <TouchableOpacity style={[styles.updateButton, { backgroundColor: isDarkMode ? '#43a047' : '#43a047' }]} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>Cập nhật thông tin</Text>
        </TouchableOpacity>
        {isLoading && <FullScreenLoader />}
      </ScrollView>
    </Layout>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    width: '100%'
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  backButtonWrapper: {
    marginBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  backIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2.5,
    borderColor: '#1e88e5',
  },
  avatarEditButton: {
    marginTop: 12,
    backgroundColor: '#1565c0',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  avatarEditText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 22,
    padding: 14,
    borderRadius: 12,
  },
  label: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    paddingVertical: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  editButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    width: 22,
    height: 22,
  },
  updateButton: {
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    marginTop: 12,
    color: '#fff',
    fontSize: 16,
  },
});
