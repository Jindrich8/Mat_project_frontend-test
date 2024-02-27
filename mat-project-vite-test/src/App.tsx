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
      path="/"
    >
      <Route path="/login" 
      element={<Login/>}
      />
      <Route path="/csrf" element={<Csrf/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/task/create" element={<Create/>}/>
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
    <MantineProvider theme={theme}>
    <RouterProvider router={router}/>
   </MantineProvider>
   </Sanctum>;
}



export default App
