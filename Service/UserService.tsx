import {sendPasswordResetEmail} from 'firebase/auth';
import { database } from '../Firebase/FirebaseConfig';
import { ref, set,get,remove } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from "../Modal/UserModal"
import { getDatabase, update } from "firebase/database";
export interface LoginPayload {
    email: string;
    password: string;
  }
// Request đến email người dùng 


// Dịch vụ nhớ mật khẩu

export async function saveLoginInfo  (email: string, password: string) {
    try {
      await AsyncStorage.setItem('savedEmail', email);
      await AsyncStorage.setItem('savedPassword', password);
    } catch (error) {
      console.log('Lỗi khi lưu thông tin đăng nhập:', error);
    }
  };


// Hàm đăng kí
export async function registerUser({ name, email, password, avatar, role }: User) {
  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);

    let maxId = 0;

    if (snapshot.exists()) {
      const users = snapshot.val();
      Object.keys(users).forEach((key) => {
        if (key.startsWith('user')) {
          const number = parseInt(key.replace('user', ''), 10);
          if (!isNaN(number) && number > maxId) {
            maxId = number;
          }
        }
      });
    }

    // Tạo ID mới
    const newId = `user${maxId + 1}`;

    const userData = {
      id: newId,
      name,
      email,
      avatar: avatar || '',
      password,
      role,
      diachi: "",
      SDT: "",
      story: "Nhân viên",
    };

    // Lưu dữ liệu vào Firebase
    await set(ref(database, 'users/' + newId), userData);

    return userData;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function loginUser({ email, password }: LoginPayload): Promise<User> {
  try {
    // Truy cập vào Firebase Realtime Database để lấy tất cả người dùng
    const snapshot = await get(ref(database, 'users'));
    const usersData = snapshot.val();

    // Nếu không có người dùng trong database
    if (!usersData) {
      throw new Error("Không tìm thấy người dùng trong hệ thống.");
    }

    // Duyệt qua tất cả người dùng để tìm người dùng có email và mật khẩu khớp
    for (let userId in usersData) {
      const user = usersData[userId];

      // So sánh email và mật khẩu
      if (user.email == email && user.password == password) {
        // Trả về thông tin người dùng khi tìm thấy
        return {
          id: user.id,  // Sử dụng id từ cơ sở dữ liệu
          name: user.name || '',
          email: user.email || '',
          password: password,  // Không lưu mật khẩu dưới dạng plaintext
          avatar: user.avatar || '',
          role: user.role || false,
          diachi: user.diachi || '',
          SDT: user.SDT || '',
          story: user.story || '',
        };
      }
    }

    // Nếu không tìm thấy người dùng có email và mật khẩu khớp
    throw new Error("Mật khẩu hoặc email không đúng.");
  } catch (error: any) {
    throw new Error(error.message);
  }
}




export async function updateUser(userData: User) {
  const db = getDatabase();

  // Lấy dữ liệu người dùng từ Realtime Database
  const userRef = ref(db, `users/${userData.id}`);
  const snapshot = await get(userRef);
  const currentUserData = snapshot.val();

  if (!currentUserData) {
    throw new Error("Người dùng không tồn tại trong hệ thống.");
  }

  // Nếu thay đổi email, bạn có thể cập nhật trực tiếp trong Realtime Database (không cần Authentication)
  if (userData.email && userData.email !== currentUserData.email) {
    await update(userRef, {
      email: userData.email,
    });
  }

  // Cập nhật các thông tin khác trong Realtime Database
  await update(userRef, {
    name: userData.name,
    email: userData.email,
    avatar: userData.avatar || '',
    role: userData.role,
    diachi: userData.diachi,
    SDT: userData.SDT,
    story: userData.story,
  });

  console.log("Cập nhật thông tin người dùng thành công.");
}

export async function changePaswsordByEmail(email: string, newPassword: string) {
  const db = getDatabase();

  // Lấy dữ liệu người dùng từ Realtime Database
  const userRef = ref(db, `users`);
  const snapshot = await get(userRef);
  const users = snapshot.val();

  // Kiểm tra nếu email tồn tại trong hệ thống
  const userKey = Object.keys(users).find((key) => users[key].email === email);

  if (!userKey) {
    throw new Error("Email không tồn tại trong hệ thống.");
  }

  // Lấy thông tin người dùng hiện tại
  const currentUserData = users[userKey];

  // Cập nhật mật khẩu mới trong Realtime Database
  await update(ref(db, `users/${userKey}`), {
    password: newPassword, // Cập nhật mật khẩu mới
  });

  console.log("Mật khẩu đã được thay đổi thành công.");
}
export async function getAllUsers(): Promise<User[]> {
  try {
    const db = getDatabase();
    const usersRef = ref(db, 'users'); // Tham chiếu đến node "users" trong Firebase
    const snapshot = await get(usersRef);  // Lấy tất cả dữ liệu người dùng

    const usersData = snapshot.val();  // Lấy dữ liệu của người dùng

    // Kiểm tra nếu không có người dùng nào
    if (!usersData) {
      return [];
    }

    // Chuyển đổi dữ liệu từ object thành mảng
    const users = Object.keys(usersData).map((key) => ({
      id: key,  // Lấy key là ID người dùng
      ...usersData[key], // Lấy tất cả dữ liệu của người dùng
    }));

    return users;
  } catch (error: any) {
    console.error("Lỗi khi lấy tất cả người dùng:", error.message);
    throw new Error("Không thể lấy tất cả người dùng.");
  }
}


export async function deleteUser(id: string): Promise<void> {
  try {
    const db = getDatabase();
    const userRef = ref(db, `users/${id}`);

    // Kiểm tra xem người dùng có tồn tại không
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      throw new Error("Người dùng không tồn tại.");
    }

    // Xóa người dùng khỏi Realtime Database
    await remove(userRef);
    console.log(`Đã xóa người dùng với ID: ${id}`);
  } catch (error: any) {
    console.error("Lỗi khi xóa người dùng:", error.message);
    throw new Error("Không thể xóa người dùng.");
  }
}