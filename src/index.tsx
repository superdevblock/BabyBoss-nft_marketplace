import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { CookiesProvider } from "react-cookie";
import { store } from 'state';
import { Web3ContextProvider } from 'contexts/Web3Context'
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Web3ContextProvider>
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </Web3ContextProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
