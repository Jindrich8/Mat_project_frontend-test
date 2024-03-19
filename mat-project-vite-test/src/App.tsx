

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import './App.css';
import '@mantine/core/styles.css';
import '@mantine/code-highlight/styles.css';
import 'mantine-datatable/styles.css';
import '@mantine/dates/styles.css';


import { MantineProvider,createTheme } from '@mantine/core';
import { Home } from './pages/Home';
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import axios from 'axios';
import { Create } from './pages/task/Create';
import { Csrf } from './pages/Csrf';
import { Take } from './pages/task/Take';
import { AuthContextProvider } from './components/Auth/AuthContextProvider';
import { AuthProtectionCmp } from './components/AuthProtectionCmp';
import { Layout } from './pages/Layout';
import { ProfileInfo } from './pages/profile/ProfileInfo';
import { TaskList } from './pages/task/TaskList';
import { TaskDetail } from './pages/task/TaskDetail';
import { Update } from './pages/task/Update';
import { MyTaskList } from './pages/task/MyTaskList';
import { MyTaskDetail } from './pages/task/MyTaskDetail';
import { ReviewDetail } from './pages/review/ReviewDetail';
import { ReviewList } from './pages/review/ReviewList';
import { GetReview } from './pages/review/GetReview';

const theme = createTheme({
  /** Your theme override here */
});


/*
 <Route
      path="/"
      element={<Home />}
      loader={({params}) => ()}
      action={rootAction}
      errorElement={<ErrorPage />}
    >
    */

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
    element={<Layout/>}
    >
      <Route path="/login" 
      element={<Login/>}
      />
      <Route path="/register" element={<Register/>}/>
      <Route path="/csrf" element={<Csrf/>}/>
      <Route path="/profile/info" element={<AuthProtectionCmp><ProfileInfo/></AuthProtectionCmp>}/>
      <Route path="/task/list" element={<TaskList />} />
      <Route path="/task/myList" element={<MyTaskList />} />
      <Route path="/task/:taskId/myDetail" element={<MyTaskDetail />} />
      <Route path="/task/create" element={<AuthProtectionCmp allowedRole={'teacher'}><Create/></AuthProtectionCmp>}/>
      <Route path="/task/review/list" element={<AuthProtectionCmp><ReviewList/></AuthProtectionCmp>}/>
      <Route path="/task/review/:reviewId/show" element={<AuthProtectionCmp><GetReview/></AuthProtectionCmp>}/>
      <Route path="/task/review/:reviewId/detail" element={<AuthProtectionCmp><ReviewDetail/></AuthProtectionCmp>}/>
      <Route path="/task/:taskId/take" element={<Take/>}/>
      <Route path="/task/:taskId/detail" element={<TaskDetail/>}/>
      <Route path="/task/:taskId/update" element={<AuthProtectionCmp allowedRole={'teacher'}><Update /></AuthProtectionCmp>} />
     <Route index
     element={<Home />}
     />
    </Route>
  )
);

function App() {
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;
  return (<AuthContextProvider>
      <MantineProvider theme={theme}>
        <RouterProvider router={router} />
      </MantineProvider>
    </AuthContextProvider>);
}



export default App
