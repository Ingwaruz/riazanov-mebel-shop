import React from "react";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import Navbar from "./components/Navbar";
import MyNavbar from "./components/Navbar";


const App = () => {
  return (
    <BrowserRouter>
        <MyNavbar />
        <AppRouter />
    </BrowserRouter>
  );
}

export default App;
