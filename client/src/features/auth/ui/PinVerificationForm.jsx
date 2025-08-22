import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './PinVerificationForm.scss';

const PinVerificationForm = ({ email, onVerify, onResend, onBack, devPinCode }) => {
    const [pinCode, setPinCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60); // Таймер для повторной отправки
    const [canResend, setCanResend] = useState(false);
    const [copied, setCopied] = useState(false);

    // Таймер обратного отсчета
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    // Если есть devPinCode, автоматически заполняем поля
    useEffect(() => {
        if (devPinCode && devPinCode.length === 6) {
            setPinCode(devPinCode.split(''));
        }
    }, [devPinCode]);

    // Обработка ввода пин-кода
    const handlePinChange = (index, value) => {
        if (value.length > 1) return; // Только один символ
        if (!/^\d*$/.test(value)) return; // Только цифры

        const newPinCode = [...pinCode];
        newPinCode[index] = value;
        setPinCode(newPinCode);

        // Автоматический переход к следующему полю
        if (value && index < 5) {
            document.getElementById(`pin-${index + 1}`)?.focus();
        }

        // Очищаем ошибку при вводе
        if (error) setError('');
    };

    // Обработка клавиши Backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pinCode[index] && index > 0) {
            document.getElementById(`pin-${index - 1}`)?.focus();
        }
    };

    // Вставка из буфера обмена
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.replace(/\D/g, '').slice(0, 6);
        
        if (digits.length === 6) {
            setPinCode(digits.split(''));
            document.getElementById('pin-5')?.focus();
        }
    };

    // Отправка пин-кода на проверку
    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullPinCode = pinCode.join('');
        
        if (fullPinCode.length !== 6) {
            setError('Введите полный пин-код');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onVerify(fullPinCode);
        } catch (err) {
            setError(err.message || 'Неверный пин-код');
            setPinCode(['', '', '', '', '', '']);
            document.getElementById('pin-0')?.focus();
        } finally {
            setLoading(false);
        }
    };

    // Повторная отправка пин-кода
    const handleResend = async () => {
        if (!canResend) return;
        
        setLoading(true);
        setError('');
        
        try {
            await onResend();
            setTimer(60);
            setCanResend(false);
            setPinCode(['', '', '', '', '', '']);
            document.getElementById('pin-0')?.focus();
        } catch (err) {
            setError(err.message || 'Ошибка при отправке пин-кода');
        } finally {
            setLoading(false);
        }
    };

    // Копирование пин-кода в буфер обмена
    const handleCopyDevPin = () => {
        if (devPinCode) {
            navigator.clipboard.writeText(devPinCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div 
            className="pin-verification-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="pin-verification-form__header">
                <div className="pin-verification-form__back-row">
                    <button 
                        type="button" 
                        className="pin-verification-form__back-btn"
                        onClick={onBack}
                        disabled={loading}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Назад
                    </button>
                </div>
                <h2 className="pin-verification-form__title">Подтверждение email</h2>
            </div>

            <p className="pin-verification-form__description">
                Мы отправили 6-значный код на <strong>{email}</strong>
            </p>

            {/* Dev Mode PIN Display */}
            {devPinCode && (
                <div className="pin-verification-form__dev-mode">
                    <div className="pin-verification-form__dev-pin-container">
                        <span className="pin-verification-form__dev-pin">
                            <span className="pin-verification-form__dev-label">Режим разработки: </span>
                            <span className="pin-verification-form__dev-value">{devPinCode}</span>
                        </span>
                        <button 
                            type="button" 
                            className="pin-verification-form__copy-btn"
                            onClick={handleCopyDevPin}
                        >
                            {copied ? 'Скопировано!' : 'Копировать'}
                        </button>
                    </div>
                    <p className="pin-verification-form__dev-hint">
                        Это сообщение видно только в режиме разработки
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="pin-verification-form__form">
                <div className="pin-verification-form__inputs">
                    {pinCode.map((digit, index) => (
                        <input
                            key={index}
                            id={`pin-${index}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handlePinChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            className={`pin-verification-form__input ${error ? 'pin-verification-form__input--error' : ''}`}
                            disabled={loading}
                            autoFocus={index === 0 && !devPinCode}
                        />
                    ))}
                </div>

                {error && (
                    <motion.div 
                        className="pin-verification-form__error"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                    >
                        {error}
                    </motion.div>
                )}

                <button 
                    type="submit" 
                    className="pin-verification-form__submit-btn"
                    disabled={loading || pinCode.join('').length !== 6}
                >
                    {loading ? 'Проверка...' : 'Подтвердить'}
                </button>
            </form>

            <div className="pin-verification-form__resend">
                {canResend ? (
                    <button 
                        type="button" 
                        className="pin-verification-form__resend-btn"
                        onClick={handleResend}
                        disabled={loading}
                    >
                        Отправить код повторно
                    </button>
                ) : (
                    <p className="pin-verification-form__timer">
                        Отправить повторно через {formatTime(timer)}
                    </p>
                )}
            </div>

            <p className="pin-verification-form__hint">
                Не получили код? Проверьте папку "Спам"
            </p>
        </motion.div>
    );
};

export default PinVerificationForm; 