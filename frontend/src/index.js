import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals'; // Commentez ou supprimez cette ligne
import { BrowserRouter } from 'react-router-dom'; // <-- ajoute cet import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>   {/* <-- entoure App avec BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// reportWebVitals(); // Commentez ou supprimez cette ligne
