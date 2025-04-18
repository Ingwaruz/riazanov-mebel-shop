import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import UserStore from "./entities/user/model/UserStore";
import ProductStore from "./entities/product/model/ProductStore";
import { BasketStore } from './entities/basket';

export const Context = createContext(null)
console.log(process.env.REACT_APP_API_URL)

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