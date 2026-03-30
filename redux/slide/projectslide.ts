import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Project = {
  projectId: string;
  projectName: string;
  creator: string;
  startDate: string;
  endDate: string;
  description: string;
  link: string;
  projectImage: string;
};

interface ProjectState {
  project: Project | null;
}

const initialState: ProjectState = {
  project: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProject(state, action: PayloadAction<Project>) {
      state.project = action.payload;
    },
    clearProject(state) {
      state.project = null;
    },
  },
});

export const { setProject, clearProject } = projectSlice.actions;
export default projectSlice.reducer;
