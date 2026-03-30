
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// Firebase config của bạn
const firebaseConfig = {
  apiKey: 'AIzaSyBtbb89VXvorL3ekqJvTIo6vjx4RjN_QEY',
  authDomain: 'myapp-7c2e1.firebaseapp.com',
  projectId: 'myapp-7c2e1',
  storageBucket: 'myapp-7c2e1.appspot.com', // <-- sửa lại ".app" thành ".appspot.com"
  messagingSenderId: '33778247817',
  appId: '1:33778247817:web:65b2646209e164f381fe58',
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Auth
const auth = getAuth(app);

export { auth };
export const database = getDatabase(app);