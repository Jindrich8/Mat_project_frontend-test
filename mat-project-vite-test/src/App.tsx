import './App.css'

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/code-highlight/styles.css'

import { MantineProvider,createTheme } from '@mantine/core';
import { Home } from './pages/Home';

const theme = createTheme({
  /** Your theme override here */
});

function App() {

  return <MantineProvider theme={theme}>
    <Home data={['1','2','3','4','5']} />
    </MantineProvider>;
}

export default App
