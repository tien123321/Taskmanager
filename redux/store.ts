// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/slide/userSlide';
import projectReducer from '../redux/slide/projectslide'
import taskReducer from '../redux/slide/Taskslide'
export const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
    task: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
