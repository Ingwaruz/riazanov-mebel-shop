import React, {useContext, useEffect, useState} from "react";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "../entities/components/AppRouter";
import Navbar from "../widgets/Navbar";
import MyNavbar from "../widgets/Navbar";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {check} from "../processes/userAPI";
import {Spinner} from "react-bootstrap";
import '../shared/styles/fonts.scss';
import '../shared/styles/commonStyles.scss';
import '../shared/styles/colors.scss';
import Footer from "../widgets/Footer";


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
