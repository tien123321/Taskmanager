import { ref, set, get,update,remove  } from 'firebase/database';
import { database } from '../Firebase/FirebaseConfig';
import { ProjectModal } from '../Modal/ProjectModal';
import { Alert } from 'react-native';
import { uploadImageToCloudinary } from '@/Firebase/Cloudy/CloudyImage';


const generateNewProjectId = async (): Promise<string> => {
  const snapshot = await get(ref(database, 'Project'));
  if (!snapshot.exists()) return 'DA01';

  const projects = snapshot.val();
  const ids = Object.keys(projects)
    .filter(id => id.startsWith('DA'))
    .map(id => parseInt(id.replace('DA', ''), 10))
    .filter(num => !isNaN(num));

  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  return `DA${maxId + 1}`;
};

export const addProject = async (Project: ProjectModal) => {
  try {
    // Sinh projectId mới
    const projectId = await generateNewProjectId();

    // Kiểm tra nếu trùng
    const existingProject = await getProjectIfExists(projectId);
    if (existingProject) {
      Alert.alert(
        'Trùng mã',
        `Project ID đã tồn tại với tên: ${existingProject.projectName || 'Không rõ'}. Vui lòng thử lại.`
      );
      return;
    }

    // Upload ảnh nếu có
    let imageUrl = Project.projectImage || '';
    if (imageUrl) {
      imageUrl = await uploadImageToCloudinary(imageUrl);
      if (!imageUrl) {
        Alert.alert('Lỗi', 'Không thể upload ảnh. Vui lòng thử lại.');
        return;
      }
    }

    // Tạo project đầy đủ
    const newProject: ProjectModal = {
      ...Project,
      projectId,
      projectImage: imageUrl,
      startDate: new Date().toISOString(),
    };

    // Ghi vào Firebase
    await set(ref(database, 'Project/' + projectId), newProject);
    Alert.alert('Thành công', 'Dự án và tài liệu đã được thêm!');
  } catch (error: any) {
    console.error('Lỗi khi thêm dự án:', error);
    Alert.alert('Lỗi', 'Không thể thêm dự án. Vui lòng thử lại.');
  }
};


export const getProjectIfExists = async (projectId: string): Promise<ProjectModal | null> => {
  try {
    const projectRef = ref(database, 'Project/' + projectId);
    const snapshot = await get(projectRef);

    if (snapshot.exists()) {
      const projectData = snapshot.val() as ProjectModal;
      return projectData;
    }

    return null;
  } catch (error) {
    console.error('Lỗi khi kiểm tra projectId:', error);
    return null;
  }
};


//Lấy toàn bộ dự án

export const getAllProjects = async (): Promise<ProjectModal[]> => {
  try {
    const projectRef = ref(database, 'Project');
    const snapshot = await get(projectRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const projects: ProjectModal[] = Object.keys(data).map((key) => ({
        ...data[key],
        projectId: key, // Đảm bảo giữ lại projectId
      }));
      return projects;
    }

    return [];
  } catch (error) {
    console.error('Lỗi khi lấy toàn bộ dự án:', error);
    return [];
  }
};
export const updateProject = async (project: ProjectModal) => {
  try {
    const projectRef = ref(database, 'Project/' + project.projectId);

    // Lấy dữ liệu cũ để so sánh hình ảnh
    const snapshot = await get(projectRef);
    const oldData = snapshot.val();

    let imageUrl = project.projectImage;

    // Nếu người dùng chọn ảnh mới (khác ảnh cũ), thì mới upload
    if (imageUrl && imageUrl !== oldData?.image) {
      const uploadedUrl = await uploadImageToCloudinary(imageUrl);
      if (!uploadedUrl) {
        Alert.alert('Lỗi', 'Không thể upload ảnh mới. Vui lòng thử lại.');
        return;
      }
      imageUrl = uploadedUrl;
    } else {
      imageUrl = oldData?.image || '';
    }

    const updatedProject = {
      ...project,
      image: imageUrl,
    };

    await update(projectRef, updatedProject);
    Alert.alert('Thành công', 'Cập nhật dự án thành công!');
  } catch (error: any) {
    console.error('Lỗi khi cập nhật dự án:', error);
    Alert.alert('Lỗi', 'Không thể cập nhật dự án. Vui lòng thử lại.');
  }
};


//Hàm xóa 
export const deleteProject = async (projectId: string) => {
  try {
    const projectRef = ref(database, 'Project/' + projectId);

    await remove(projectRef); // Xóa dự án theo projectId

    Alert.alert('Thành công', 'Dự án đã được xóa!');
  } catch (error: any) {
    console.error('Lỗi khi xóa dự án:', error);
    Alert.alert('Lỗi', 'Không thể xóa dự án. Vui lòng thử lại.');
  }
};