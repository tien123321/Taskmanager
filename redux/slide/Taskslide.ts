import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskModal } from '@/Modal/TaskModal';

// Định nghĩa kiểu dữ liệu cho Task


// Định nghĩa state ban đầu với một task
interface TaskState {
  task: TaskModal | null;
}

const initialState: TaskState = {
  task: null, // Ban đầu không có task
};

// Tạo taskSlice
const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    // Thêm task mới hoặc cập nhật task nếu đã có
    setTask: (state, action: PayloadAction<TaskModal>) => {
      state.task = action.payload;
    },
    // Xóa task
    clearTask: (state) => {
      state.task = null;
    },
  },
});

// Export các action và reducer
export const { setTask, clearTask } = taskSlice.actions;
export default taskSlice.reducer;