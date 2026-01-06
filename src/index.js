import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './client/components/themes.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function Root() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={currentTheme}>
          <App toggleTheme={() => setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light')} currentTheme={currentTheme} />
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);

reportWebVitals();