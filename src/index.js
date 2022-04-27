import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '/node_modules/primeflex/primeflex.css';
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primereact/resources/themes/saga-orange/theme.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import {UserProvider} from "./contexts/UserContext";

ReactDOM.render(
    <React.StrictMode>
        <UserProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </UserProvider>
    </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
