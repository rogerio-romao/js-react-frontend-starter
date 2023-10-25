// packages
import React from 'react';
import ReactDOM from 'react-dom';

// components
import App from '@/pages/App.jsx';

// styles
import '@/css/global.css';

ReactDOM.createRoot(document.querySelector('#root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
