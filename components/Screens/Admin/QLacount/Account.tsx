import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme, Icon, Layout } from '@ui-kitten/components';
import Footer from '@/components/Footer/FooterAdmin';
import { useNavigation } from '@react-navigation/native';
import { getAllUsers,deleteUser,updateUser } from '@/Service/UserService'; // đường dẫn đến hàm getAllUsers
import { User } from '@/Modal/UserModal';
import EditStoryModal from '../QLacount/Updatemodal';

const FullScreenLoader = () => (
  <View style={stylesload.loadingOverlay}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={stylesload.loadingText}>Đang xử lý...</Text>
  </View>
);


const Account = () => {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const navigation = useNavigation();
  const theme = useTheme();
  
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers();
      setAccounts(users);
      setLoading(false);
    };
  
    fetchUsers();
  }, [loading]);

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa người dùng này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteUser(id);
              Alert.alert('Xóa thành công', 'Người dùng đã được xóa.');
              // Sau khi xóa, làm mới danh sách người dùng
            } catch (error: any) {
              Alert.alert('Lỗi', error.message || 'Không thể xóa người dùng.');
            }
          },
        },
      ]
    );
  };

  const handleAddAccount = () => {
    navigation.navigate("Register");
  };

  const handleEditStory = (newStory: string) => {
    if (!selectedUser) return;

    try {
      selectedUser.story= newStory;
      updateUser(selectedUser);
      Alert.alert(selectedUser.story);
      setModalVisible(false);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật chức vụ.');
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles(theme).accountCard}>
      <View style={styles(theme).accountInfo}>
        <View style={styles(theme).accountText}>
          <Text style={styles(theme).name}>Họ và tên : {item.name}</Text>
          <Text style={styles(theme).email}>Email: {item.email}</Text>
          <Text style={styles(theme).role}>
            Quyền: {item.role ? 'Quyền quản trị' : 'Quyền người dùng'}
          </Text>
          <Text style={styles(theme).story}>Chức vụ : {item.story}</Text>
        </View>

        <View style={styles(theme).actionButtons}>
          {/* Icon sửa */}
          <TouchableOpacity
            style={styles(theme).editButton}
            onPress={() => {
              console.log(item.story)
              setSelectedUser(item);
              setModalVisible(true);
            }}
          >
            <Icon name="edit-2-outline" fill={theme['text-basic-color']} style={styles(theme).icon} />
          </TouchableOpacity>

          {/* Icon xoá */}
          <TouchableOpacity onPress={() => handleDelete(item?.id)} style={styles(theme).deleteButton}>
            <Icon name="trash-2-outline" fill={theme['text-basic-color']} style={styles(theme).icon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Layout style={{ width: "100%", height: "100%" }}>
      <View style={styles(theme).root}>
        <Text style={styles(theme).title}>Quản lý tài khoản</Text>

        {/* Hiển thị danh sách tài khoản */}
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          style={styles(theme).list}
        />

        {/* Icon thêm tài khoản (di chuyển xuống dưới) */}
        <TouchableOpacity onPress={handleAddAccount} style={styles(theme).addButton}>
          <Icon name="plus" fill={theme['text-basic-color']} style={styles(theme).addIcon} />
        </TouchableOpacity>
      </View>

      {/* Footer component */}
      <Footer navigation={navigation} />
      {loading && <FullScreenLoader />}

      {/* Sử dụng modal ngoài */}
      <EditStoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleEditStory}
        initialStory={selectedUser ? selectedUser.story : ''}
      />
    </Layout>
  );
};
const styles = (theme: any) =>
  StyleSheet.create({
    root: {
      flex: 1,
      padding: 16,
      backgroundColor: theme['background-basic-color-1'],
      justifyContent: 'space-between', // Ensure content stretches to top and footer stays at the bottom
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme['text-basic-color'],
      textAlign: 'center',
    },
    addButton: {
      position: 'absolute',
      bottom: 100, // Move button to the bottom
      right: 16,
      backgroundColor: theme['color-primary-500'],
      padding: 14,
      borderRadius: 50,
      shadowColor: theme['color-basic-800'],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 3,
    },
    addIcon: {
      width: 28,
      height: 28,
    },
    list: {
      marginBottom: 80, // Ensure enough space for the footer
    },
    accountCard: {
      padding: 18,
      backgroundColor: theme['background-basic-color-2'],
      marginBottom: 12,
      borderRadius: 12,
      shadowColor: theme['color-basic-900'],
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
    
      elevation: 8, 
    
      borderWidth: 1,
      borderColor: theme['color-basic-300'],
    },
    accountInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    accountText: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme['text-basic-color'],
    },
    email: {
      fontSize: 14,
      color: theme['text-hint-color'],
      marginVertical: 6,
    },
    role: {
      fontSize: 14,
      color: theme['text-basic-color'],
      marginBottom: 18,
    },
    // Updated Story styles
    story: {
      fontSize: 14,
      color: theme['text-hint-color'],
      marginBottom: 18,
      fontStyle: 'italic',  // Make it stand out
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    editButton: {
      padding: 8,
      backgroundColor: theme['color-info-500'],
      borderRadius: 50,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deleteButton: {
      padding: 8,
      backgroundColor: theme['color-danger-500'],
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      width: 20,
      height: 20,
    },
  });
  const stylesload = StyleSheet.create({
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
  })
export default Account;
