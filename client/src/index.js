import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import UserStore from "./entities/user/model/UserStore";
import ProductStore from "./entities/product/model/ProductStore";
import { BasketStore } from './entities/basket';

export const Context = createContext(null)

// Отладочная информация
console.log('=== ENVIRONMENT DEBUG ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('All REACT_APP_ vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
console.log('========================');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Context.Provider value={{
          user: new UserStore(),
          product: new ProductStore(),
          basket: new BasketStore()
      }}>
          <App />
      </Context.Provider>
  </React.StrictMode>
);