import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {themeOptions} from "./consts";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const theme = createTheme(themeOptions);

root.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
      </ThemeProvider>
  </React.StrictMode>
);