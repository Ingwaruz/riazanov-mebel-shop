import React, {useContext, useEffect, useState} from "react";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import Navbar from "./components/Navbar";
import MyNavbar from "./components/Navbar";
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import {check} from "./http/userAPI";
import {Spinner} from "react-bootstrap";
import './styles/fonts.scss';
import './styles/commonStyles.scss';
import './styles/colors.scss';
import Footer from "./components/Footer";


const App = observer(() => {
    const {user} = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        check().then(data => {
            user.setUser(true)
            user.setIsAuth(true)
        }).finally(() => setLoading(false))
    }, []);

    // необходимо для адекватной отрисовки компонентов при ожидании ответа сервера
    if (loading) {
        return <Spinner animation={'grow'}/>
    }

    return (
    <BrowserRouter>
        <MyNavbar />
        <AppRouter />
        <Footer />
    </BrowserRouter>
  );
});

export default App;
