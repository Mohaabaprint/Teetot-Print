
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

window.onerror = function(message, source, lineno, colno, error) {
  console.error("Global Error Captured:", message, "at", source, lineno, colno);
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
