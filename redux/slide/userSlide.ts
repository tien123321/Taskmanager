// redux/slices/userSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string | number;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: boolean;
  diachi:string;
  SDT: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
}

const USER_KEY = 'app_user';

const initialState: UserState = {
  user: null,
  isLoading: true, // dùng để xác định đang loading từ AsyncStorage
};

// Async thunk: Load user khi app khởi động
export const loadUserFromStorage = createAsyncThunk(
  'user/loadUserFromStorage',
  async () => {
    const json = await AsyncStorage.getItem(USER_KEY);
    if (json) {
      return JSON.parse(json) as User;
    }
    return null;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      AsyncStorage.setItem(USER_KEY, JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      AsyncStorage.removeItem(USER_KEY);
    },
    update: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        AsyncStorage.setItem(USER_KEY, JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUserFromStorage.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    });
    builder.addCase(loadUserFromStorage.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(loadUserFromStorage.pending, (state) => {
      state.isLoading = true;
    });
  },
});

export const { login, logout, update } = userSlice.actions;
export default userSlice.reducer;
