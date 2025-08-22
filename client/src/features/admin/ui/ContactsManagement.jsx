import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { $authHost, $host } from '../../../shared/api';
import './ContactsManagement.scss';

const ContactsManagement = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [formData, setFormData] = useState({
        type: 'phone',
        value: '',
        label: '',
        is_active: true,
        sort_order: 0
    });

    const contactTypes = [
        { value: 'phone', label: 'Телефон', icon: '📞' },
        { value: 'email', label: 'Email', icon: '📧' },
        { value: 'address', label: 'Адрес', icon: '📍' },
        { value: 'social', label: 'Соцсеть', icon: '🌐' },
        { value: 'messenger', label: 'Мессенджер', icon: '💬' }
    ];

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const { data } = await $host.get('/api/contacts');
            setContacts(data);
        } catch (err) {
            setError('Ошибка при загрузке контактов');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleShowModal = (contact = null) => {
        if (contact) {
            setEditingContact(contact);
            setFormData({
                type: contact.type,
                value: contact.value,
                label: contact.label,
                is_active: contact.is_active,
                sort_order: contact.sort_order
            });
        } else {
            setEditingContact(null);
            setFormData({
                type: 'phone',
                value: '',
                label: '',
                is_active: true,
                sort_order: contacts.length
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingContact(null);
        setFormData({
            type: 'phone',
            value: '',
            label: '',
            is_active: true,
            sort_order: 0
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingContact) {
                await $authHost.put(`/api/contacts/${editingContact.id}`, formData);
            } else {
                await $authHost.post('/api/contacts', formData);
            }
            fetchContacts();
            handleCloseModal();
        } catch (err) {
            setError('Ошибка при сохранении контакта');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот контакт?')) {
            try {
                await $authHost.delete(`/api/contacts/${id}`);
                fetchContacts();
            } catch (err) {
                setError('Ошибка при удалении контакта');
                console.error(err);
            }
        }
    };

    const handleToggleActive = async (contact) => {
        try {
            await $authHost.put(`/api/contacts/${contact.id}`, {
                ...contact,
                is_active: !contact.is_active
            });
            fetchContacts();
        } catch (err) {
            setError('Ошибка при изменении статуса');
            console.error(err);
        }
    };

    const getContactIcon = (type) => {
        const contactType = contactTypes.find(t => t.value === type);
        return contactType ? contactType.icon : '📋';
    };

    const moveContact = async (contact, direction) => {
        const currentIndex = contacts.findIndex(c => c.id === contact.id);
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        
        if (newIndex < 0 || newIndex >= contacts.length) return;
        
        const newContacts = [...contacts];
        [newContacts[currentIndex], newContacts[newIndex]] = [newContacts[newIndex], newContacts[currentIndex]];
        
        // Обновляем sort_order для всех контактов
        const updates = newContacts.map((c, index) => ({
            id: c.id,
            sort_order: index
        }));
        
        try {
            await $authHost.put('/api/contacts/order/update', { contacts: updates });
            fetchContacts();
        } catch (err) {
            setError('Ошибка при изменении порядка');
            console.error(err);
        }
    };

    if (loading) return <div className="text-center p-5">Загрузка...</div>;

    return (
        <div className="contacts-management">
            <div className="contacts-management__header">
                <h2>Управление контактами</h2>
                <Button variant="primary" onClick={() => handleShowModal()}>
                    Добавить контакт
                </Button>
            </div>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

            <Card>
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Тип</th>
                                <th>Название</th>
                                <th>Значение</th>
                                <th>Статус</th>
                                <th>Порядок</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((contact, index) => (
                                <tr key={contact.id}>
                                    <td>
                                        <span className="contact-type">
                                            <span className="contact-type__icon">{getContactIcon(contact.type)}</span>
                                            {contactTypes.find(t => t.value === contact.type)?.label || contact.type}
                                        </span>
                                    </td>
                                    <td>{contact.label}</td>
                                    <td className="contact-value">{contact.value}</td>
                                    <td>
                                        <Button
                                            variant={contact.is_active ? "success" : "secondary"}
                                            size="sm"
                                            onClick={() => handleToggleActive(contact)}
                                        >
                                            {contact.is_active ? 'Активен' : 'Неактивен'}
                                        </Button>
                                    </td>
                                    <td>
                                        <div className="sort-controls">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                disabled={index === 0}
                                                onClick={() => moveContact(contact, 'up')}
                                            >
                                                ↑
                                            </Button>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                disabled={index === contacts.length - 1}
                                                onClick={() => moveContact(contact, 'down')}
                                            >
                                                ↓
                                            </Button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleShowModal(contact)}
                                            >
                                                Изменить
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(contact.id)}
                                            >
                                                Удалить
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    
                    {contacts.length === 0 && (
                        <div className="text-center py-4">
                            <p className="text-muted">Контакты не найдены</p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingContact ? 'Редактировать контакт' : 'Добавить контакт'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Тип контакта</Form.Label>
                            <Form.Select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                required
                            >
                                {contactTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.icon} {type.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Название</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                placeholder="Например: Основной телефон"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Значение</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                placeholder="Например: +7 (495) 123-45-67"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Активен"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Отмена
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingContact ? 'Сохранить' : 'Добавить'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default ContactsManagement; 