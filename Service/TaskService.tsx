import { ref, get,set,push,update ,remove,child } from 'firebase/database';
import { database } from '../Firebase/FirebaseConfig';
import { TaskModal } from '@/Modal/TaskModal';
type Project = {
  id: string;
  name: string;
  creator: string;
  TIme:string;
  tasks: TaskModal[];
};
export async function getAllTasksByProjectId(projectId: string): Promise<TaskModal[]> {
  try {
    const tasksRef = ref(database, 'tasks');
    const snapshot = await get(tasksRef);

    if (!snapshot.exists()) {
      console.warn('Không có task nào trong database');
      return [];
    }

    const allTasks = snapshot.val();
    const filteredTasks: TaskModal[] = Object.keys(allTasks).reduce((acc: TaskModal[], key) => {
      const task = allTasks[key];
      if (task.ProjectId === projectId) {
        acc.push({
          ...task,
          taskId: key, // Assuming the taskId is the key of the task in Firebase
        });
      }
      return acc;
    }, []);

    return filteredTasks;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách task:', error);
    return [];
  }
}

// Hàm sinh taskId mới
const generateNewTaskId = async (): Promise<string> => {
  const snapshot = await get(ref(database, 'tasks'));
  if (!snapshot.exists()) return 'TS_01';  // Nếu không có task nào thì bắt đầu từ TS_01

  const tasks = snapshot.val();
  const ids = Object.keys(tasks)
    .filter(id => id.startsWith('TS_'))
    .map(id => parseInt(id.replace('TS_', ''), 10))
    .filter(num => !isNaN(num));

  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  return `TS_${(maxId + 1).toString().padStart(2, '0')}`;
};

// Hàm thêm task mới
export const addTask = async (task: TaskModal) => {
  try {
    // Sinh taskId mới
    const taskId = await generateNewTaskId()

    // Tạo task đầy đủ
    const newTask: TaskModal = {
      ...task,
      taskId,
    };

    // Ghi vào Firebase
    const tasksRef = ref(database, 'tasks/' + taskId);
    await set(tasksRef, newTask);
  } catch (error: any) {
    console.error('Lỗi khi thêm task:', error);
  }
};
  
export const updateTask = async (taskId: string, updatedTask: TaskModal) => {
  try {
    // Lấy tham chiếu đến task trong Firebase
    const taskRef = ref(database, 'tasks/' + taskId);

    // Cập nhật dữ liệu task
    await update(taskRef, updatedTask);
    console.log('Cập nhật task thành công');
  } catch (error: any) {
    console.error('Lỗi khi cập nhật task:', error);
  }
};
export const deleteTask = async (taskId: string) => {
  try {
    const taskRef = ref(database, `tasks/${taskId}`);
    await remove(taskRef);
  } catch (error) {
    console.error('Lỗi khi xóa task:', error);
  }
};

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export async function getAllTasksByUserIdGroupedByProject(Username: string): Promise<Project[]> {
  try {
    // Lấy tất cả task
    const tasksRef = ref(database, 'tasks');
    const taskSnap = await get(tasksRef);
    
    // Kiểm tra xem có dữ liệu task không
    if (!taskSnap.exists()) {
      return [];
    }

    const allTasks = taskSnap.val();
    const groupedTasks: Record<string, TaskModal[]> = {};

    Object.keys(allTasks).forEach((key) => {
      const task = allTasks[key];

      // Kiểm tra điều kiện assignee
      if (task.assignee?.trim() === Username) {

        const projectId = task.ProjectId;
        if (!groupedTasks[projectId]) {
          groupedTasks[projectId] = [];
        }
        groupedTasks[projectId].push({ ...task, taskId: key });
      }
    });
    const projectsRef = ref(database, 'Project');
    const projectSnap = await get(projectsRef);
    const allProjects = projectSnap.exists() ? projectSnap.val() : {};
    const projects: Project[] = Object.keys(groupedTasks).map((projectId) => {
      const projectData = allProjects[projectId];
      if (!projectData) {
        return null;
      }
      console.log(projectData)

      return {
        id: projectId,
        name: projectData?.projectName || `Dự án ${projectId}`,
        TIme: formatDate(projectData?.startDate) +  ' - '+ projectData?.endDate ||"Chưa có hạn",
        creator: projectData?.creator || 'Không rõ người tạo',
        tasks: groupedTasks[projectId],
      };
    }).filter((project) => project !== null) as Project[];

    return projects;
  } catch (error) {
    console.error('Lỗi khi lấy tasks theo userId và nhóm theo project:', error);
    return [];
  }
}
export const fetchTaskById = async (taskId: string): Promise<TaskModal | null> => {
  try {
    const taskRef = ref(database);
    const snapshot = await get(child(taskRef, `tasks/${taskId}`));

    if (snapshot.exists()) {
      return {
        id: taskId,
        ...snapshot.val(),
      } as TaskModal;
    } else {
      console.warn(`Task with ID ${taskId} not found`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    throw error;
  }
};


// Hàm kết hợp lấy task từ database và tính số lượng task quá hạn, chưa quá hạn, và đã hoàn thành
export const getTaskCounts = async (projectId: string): Promise<{ overdue: number, notOverdue: number, completed: number }> => {
  try {
    const tasksRef = ref(database, 'tasks');
    const snapshot = await get(tasksRef);
    const tasks = snapshot.val();

    if (tasks) {
      const taskArray: TaskModal[] = Object.keys(tasks).map((key) => ({
        taskId: key,
        ...tasks[key],
      }));

      // Lọc các task theo projectId
      const filteredTasks = taskArray.filter(task => task.ProjectId === projectId);

      // Tính số lượng task quá hạn, chưa quá hạn và đã hoàn thành
      const currentDate = new Date().toISOString().split('T')[0]; // Ngày hiện tại (ISO format)
      
      // Task quá hạn và chưa hoàn thành
      const overdueTasks = filteredTasks.filter(task => {
        const taskDueDate = convertDateToISO(task.dueDate); // Chuyển đổi ngày quá hạn sang định dạng ISO
        return taskDueDate < currentDate && !task.isCompleted; // Điều kiện task quá hạn và chưa hoàn thành
      });

      // Task chưa quá hạn và chưa hoàn thành
      const notOverdueTasks = filteredTasks.filter(task => {
        const taskDueDate = convertDateToISO(task.dueDate); // Chuyển đổi ngày quá hạn sang định dạng ISO
        return taskDueDate >= currentDate && !task.isCompleted; // Điều kiện task chưa quá hạn và chưa hoàn thành
      });

      // Task đã hoàn thành
      const completedTasks = filteredTasks.filter(task => task.isCompleted); // Điều kiện task đã hoàn thành

      console.log("Task quá hạn và chưa hoàn thành:", overdueTasks); // In ra danh sách các task quá hạn và chưa hoàn thành
      console.log("Task chưa quá hạn và chưa hoàn thành:", notOverdueTasks); // In ra danh sách các task chưa quá hạn và chưa hoàn thành
      console.log("Task đã hoàn thành:", completedTasks); // In ra danh sách các task đã hoàn thành

      return {
        overdue: overdueTasks.length,       // Trả về số lượng task quá hạn và chưa hoàn thành
        notOverdue: notOverdueTasks.length, // Trả về số lượng task chưa quá hạn và chưa hoàn thành
        completed: completedTasks.length,   // Trả về số lượng task đã hoàn thành
      };
    }
    return { overdue: 0, notOverdue: 0, completed: 0 };
  } catch (error) {
    console.error('Error fetching tasks from database or counting task statuses:', error);
    return { overdue: 0, notOverdue: 0, completed: 0 };
  }
};

// Hàm chuyển đổi ngày từ định dạng DD/MM/YYYY sang YYYY-MM-DD
const convertDateToISO = (date: string): string => {
  const [day, month, year] = date.split('/'); // Chia ngày thành các phần
  return `${year}-${month}-${day}`; // Trả về định dạng ISO
};