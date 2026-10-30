import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { FeedProvider } from './context/FeedContext';
import { AudioProvider } from './context/AudioContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <AudioProvider>
        <FeedProvider>
          <App />
        </FeedProvider>
      </AudioProvider>
    </ThemeProvider>
  </React.StrictMode>
);
