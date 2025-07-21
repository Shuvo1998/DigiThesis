// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; // <--- Corrected CSS import path
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);