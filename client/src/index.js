import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import UserStore from "./entities/store/UserStore";
import ProductStore from "./entities/store/ProductStore";

export const Context = createContext(null)
console.log(process.env.REACT_APP_API_URL)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Context.Provider value={{
          user: new UserStore(),
          product: new ProductStore(),
      }}>
          <App />
      </Context.Provider>
  </React.StrictMode>
);