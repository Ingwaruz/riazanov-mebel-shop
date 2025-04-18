import React, {useContext, useEffect, useState} from "react";
import {BrowserRouter} from "react-router-dom";
import {AppRouter} from "./providers";
import {Navbar} from "../widgets/Navbar";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {check} from "../features/auth/api/authApi";
import {Spinner} from "react-bootstrap";
import './styles/index.scss';
import {Footer} from "../widgets/Footer";
import {CookieConsent} from "../widgets/CookieConsent";
import {YandexMetrika} from "../widgets/YandexMetrika";

const App = observer(() => {
    const {user} = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const data = await check();
                if (data) {
                    user.setUser(data);
                    user.setIsAuth(true);
                }
            } catch (error) {
                localStorage.removeItem('token');
                user.setUser({});
                user.setIsAuth(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [user]);

    if (loading) {
        return <Spinner animation={'grow'}/>
    }

    return (
        <BrowserRouter>
            <YandexMetrika />
            <Navbar />
            <AppRouter/>
            <Footer />
            <CookieConsent />
        </BrowserRouter>
    );
});

export default App;
