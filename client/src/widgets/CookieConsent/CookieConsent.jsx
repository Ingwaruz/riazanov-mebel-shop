import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import './CookieConsent.scss';

const CookieConsent = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consentGiven = localStorage.getItem('cookieConsent');
        if (!consentGiven) {
            setVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="cookie-consent">
            <div className="cookie-consent__container">
                <div className="cookie-consent__text">
                    Мы используем cookie-файлы для улучшения работы сайта и вашего опыта взаимодействия с ним.
                    Продолжая использовать наш сайт, вы соглашаетесь с использованием нами cookie-файлов.
                </div>
                <Button 
                    className="cookie-consent__button" 
                    onClick={handleAccept}
                >
                    Принять
                </Button>
            </div>
        </div>
    );
};

export default CookieConsent; 