import React,{useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { ThemeContext, ThemeProvider } from '../hooks/theme';
import LoginScreen from '../components/Screens/Login/LoginScreen';
import ForgotSubmitScreen from '../components/Screens/Forgotpass/ForgotsubmidScreen';
import RegisterScreen from '../components/Screens/Register/Register';
import DashboardScreens from '../components/Screens/User/HomeDashboard/Dashboard';
import MyTask from '@/components/Screens/User/MyTask/MyTask';
import Information from '@/components/Screens/User/Profile/Information';
import UserDetails from '@/components/Screens/User/Profile/UserDetail';
import AboutScreen from '@/components/Screens/User/Profile/Retire';
import HomeAdScreen from '../components/Screens/Admin/Home/Home';
import Taskproject from '@/components/Screens/Admin/Taskproject/TaskProject';
import ProjectDetails from '@/components/Screens/Admin/Home/Projectdetail';
import TaskList from '@/components/Screens/Admin/Taskproject/Tasklist';
import AddProjectScreen from '@/components/Screens/Admin/Home/AddProject';
import UpdateProject from '@/components/Screens/Admin/Home/UpdateProject';
import SettingUI from '@/components/Screens/User/Profile/SettingUI';
import AccountManagementScreen from '@/components/Screens/Admin/QLacount/Account';
import Profile from '@/components/Screens/Admin/profile/Profile';
import TaskDetail from '@/components/Screens/Admin/Taskproject/TaskDetail';
import Projectdetailuser from '../components/Screens/User/HomeDashboard/Dashboarđetail';
import NotificationadScreen from '@/components/Screens/Admin/inforadmin/notificationad';

import NotificationuserScreen from '@/components/Screens/Notification/Notificationuser';

export type RootStackParamList = {
  Login: undefined;
  Forgotsubmit: undefined;
  Register: undefined;
  Home: undefined;
  MyTask: undefined;
  Information: undefined;
  UserDetails: undefined;
  AboutScreen: undefined;
  SettingUI: undefined;
  HomeAd: undefined;
  ProjectsAd: undefined;
  ProjectDetails: undefined;
  TaskList: undefined;
  AddProjectScreen: undefined;
  UpdateProject: undefined;
  AccountManagementScreen: undefined;
  Profile:undefined;
  TaskDetail:undefined;
  Projectdetailuser:undefined;
  NotificationuserScreen:undefined;
  NotificationadScreen: undefined;
  SettingScreen:undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = () => {
   const { theme } = useContext(ThemeContext); 
      const isDarkMode = theme === 'dark';

  return (
    <>
      <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={isDarkMode ? '#1A2138' : '#fff'}
            />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          {/* Định nghĩa các màn hình */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Forgotsubmit" component={ForgotSubmitScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />

          {/* Các màn hình cho user */}
          <Stack.Screen name="Home" component={DashboardScreens} />
          <Stack.Screen name="MyTask" component={MyTask} />
          <Stack.Screen name="Information" component={Information} />
          <Stack.Screen name="UserDetails" component={UserDetails} />
          <Stack.Screen name="AboutScreen" component={AboutScreen} />
          <Stack.Screen name="SettingScreen" component={SettingUI} />
          <Stack.Screen name="Projectdetailuser" component={Projectdetailuser} />

          {/* Các màn hình cho admin */}
          <Stack.Screen name="HomeAd" component={HomeAdScreen} />
          <Stack.Screen name="ProjectsAd" component={Taskproject} />
          <Stack.Screen name="ProjectDetails" component={ProjectDetails} />
          <Stack.Screen name="TaskList" component={TaskList} />
          <Stack.Screen name="AddProjectScreen" component={AddProjectScreen} />
          <Stack.Screen name="UpdateProject" component={UpdateProject} />
          <Stack.Screen name="AccountManagementScreen" component={AccountManagementScreen} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="TaskDetail" component={TaskDetail} />
          <Stack.Screen name="NotificationuserScreen" component={NotificationuserScreen} />
          <Stack.Screen name="NotificationadScreen" component={NotificationadScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default AppNavigation;
