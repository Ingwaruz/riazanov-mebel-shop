import React from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';
import './Modal.scss';

/**
 * Базовый компонент модального окна
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.show - Флаг отображения модального окна
 * @param {Function} props.onHide - Обработчик закрытия окна
 * @param {string} props.title - Заголовок модального окна
 * @param {ReactNode} props.children - Содержимое модального окна
 * @param {boolean} props.centered - Центрирование модального окна (по умолчанию true)
 * @param {string} props.size - Размер модального окна (lg, sm, xl)
 * @returns {JSX.Element}
 */
const Modal = ({ 
    show, 
    onHide, 
    title, 
    children, 
    centered = true, 
    size 
}) => {
    return (
        <BootstrapModal
            show={show}
            onHide={onHide}
            centered={centered}
            size={size}
            className="custom-modal"
        >
            {title && (
                <BootstrapModal.Header closeButton>
                    <BootstrapModal.Title className="modal-title">
                        {title}
                    </BootstrapModal.Title>
                </BootstrapModal.Header>
            )}
            <BootstrapModal.Body>
                {children}
            </BootstrapModal.Body>
        </BootstrapModal>
    );
};

export default Modal; 