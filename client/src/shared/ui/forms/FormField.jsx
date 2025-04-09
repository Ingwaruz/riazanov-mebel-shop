import React from 'react';
import { Form } from 'react-bootstrap';
import './FormField.scss';

/**
 * Базовый компонент поля формы
 * @param {Object} props - Свойства компонента
 * @param {string} props.label - Метка поля
 * @param {string} props.name - Имя поля
 * @param {string} props.type - Тип поля (text, email, password и т.д.)
 * @param {string} props.value - Значение поля
 * @param {Function} props.onChange - Обработчик изменения значения
 * @param {string} props.error - Сообщение об ошибке
 * @param {boolean} props.required - Обязательное поле
 * @param {string} props.placeholder - Плейсхолдер
 * @param {boolean} props.disabled - Отключено ли поле
 * @returns {JSX.Element}
 */
const FormField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    required = false,
    placeholder,
    disabled = false
}) => {
    return (
        <Form.Group className="form-field mb-3">
            {label && (
                <Form.Label className="form-field-label">
                    {label}
                    {required && <span className="required-mark">*</span>}
                </Form.Label>
            )}
            <Form.Control
                className={`form-field-input ${error ? 'is-invalid' : ''}`}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
            />
            {error && (
                <Form.Control.Feedback type="invalid">
                    {error}
                </Form.Control.Feedback>
            )}
        </Form.Group>
    );
};

export default FormField; 