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
      <Route path="/register" element={<Register/>}/>
     <Route index
     element={<Home />}
     />
    </Route>
  )
);

function App() {

  return <MantineProvider theme={theme}>
    <RouterProvider router={router}/>
    </MantineProvider>;
}

export default App
