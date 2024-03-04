import './App.css'

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/code-highlight/styles.css'

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
import { ConfigProps as SanctumConfigProps, Sanctum} from 'react-sanctum';
import { env } from './utils/vite';
import axios from 'axios';
import { Create } from './pages/task/Create';
import { Csrf } from './pages/Csrf';
import { Take } from './pages/task/Take';
import { Review } from './pages/task/Review';
import { AuthContextProvider } from './components/Auth/AuthContextProvider';
import { AuthProtectionCmp } from './components/AuthProtectionCmp';
import { Layout } from './pages/Layout';
import { ProfileInfo } from './pages/profile/ProfileInfo';

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
      <Route path="/csrf" element={<Csrf/>}/>
      <Route path="/profile/info" element={<AuthProtectionCmp><ProfileInfo/></AuthProtectionCmp>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/task/create" element={<AuthProtectionCmp allowedRole={'teacher'}><Create/></AuthProtectionCmp>}/>
      <Route path="/task/:reviewId/review" element={<Review/>}/>
      <Route path="/task/:taskId/take" element={<Take/>}/>
     <Route index
     element={<Home />}
     />
    </Route>
  )
);

const sanctumConfig:SanctumConfigProps = {
  apiUrl: env.VITE_SANCTUM_API_URL,
  csrfCookieRoute: env.VITE_SANCTUM_CSRF_COOKIE_ROUTE,
  signInRoute: env.VITE_SIGN_IN_ROUTE,
  signOutRoute: env.VITE_SIGN_OUT_ROUTE,
  userObjectRoute: env.VITE_USER_OBJECT_ROUTE
};

function App() {
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;
  return <Sanctum config={sanctumConfig} checkOnInit={false}>
    <AuthContextProvider>
      <MantineProvider theme={theme}>
        <RouterProvider router={router} />
      </MantineProvider>
    </AuthContextProvider>
  </Sanctum>;
}



export default App
