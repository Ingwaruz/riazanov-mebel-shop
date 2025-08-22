import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Alert, Nav, Tab } from 'react-bootstrap';
import { $authHost, $host } from '../../../shared/api';
import './ContentManagement.scss';

const ContentManagement = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingPage, setEditingPage] = useState(null);
    const [previewMode, setPreviewMode] = useState(false);
    const [formData, setFormData] = useState({
        page_key: '',
        title: '',
        content: '',
        meta_title: '',
        meta_description: '',
        is_active: true
    });

    const pageTemplates = {
        about_us: {
            title: 'О нас',
            icon: '📋',
            description: 'Информация о компании'
        },
        delivery: {
            title: 'Доставка',
            icon: '🚚',
            description: 'Условия доставки'
        },
        payment: {
            title: 'Оплата',
            icon: '💳',
            description: 'Способы оплаты'
        },
        warranty: {
            title: 'Гарантия',
            icon: '🛡️',
            description: 'Условия гарантии'
        },
        contacts: {
            title: 'Контакты',
            icon: '📞',
            description: 'Контактная информация'
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            setLoading(true);
            const { data } = await $host.get('/api/content');
            setPages(data);
        } catch (err) {
            setError('Ошибка при загрузке страниц');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleShowModal = (page = null) => {
        if (page) {
            setEditingPage(page);
            setFormData({
                page_key: page.page_key,
                title: page.title,
                content: page.content,
                meta_title: page.meta_title || '',
                meta_description: page.meta_description || '',
                is_active: page.is_active
            });
        } else {
            setEditingPage(null);
            setFormData({
                page_key: '',
                title: '',
                content: '',
                meta_title: '',
                meta_description: '',
                is_active: true
            });
        }
        setShowModal(true);
        setPreviewMode(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPage(null);
        setPreviewMode(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPage) {
                await $authHost.put(`/api/content/${editingPage.id}`, {
                    title: formData.title,
                    content: formData.content,
                    meta_title: formData.meta_title,
                    meta_description: formData.meta_description,
                    is_active: formData.is_active
                });
            } else {
                await $authHost.post('/api/content', formData);
            }
            fetchPages();
            handleCloseModal();
        } catch (err) {
            setError('Ошибка при сохранении страницы');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту страницу?')) {
            try {
                await $authHost.delete(`/api/content/${id}`);
                fetchPages();
            } catch (err) {
                setError('Ошибка при удалении страницы');
                console.error(err);
            }
        }
    };

    const handleToggleActive = async (page) => {
        try {
            await $authHost.put(`/api/content/${page.id}`, {
                ...page,
                is_active: !page.is_active
            });
            fetchPages();
        } catch (err) {
            setError('Ошибка при изменении статуса');
            console.error(err);
        }
    };

    const getPageIcon = (pageKey) => {
        return pageTemplates[pageKey]?.icon || '📄';
    };

    const getPageTitle = (pageKey) => {
        return pageTemplates[pageKey]?.title || pageKey;
    };

    // Добавление базовых HTML тегов в редактор
    const insertTag = (tag) => {
        const textarea = document.getElementById('content-editor');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);
        
        let newText = '';
        switch (tag) {
            case 'bold':
                newText = `<strong>${selectedText}</strong>`;
                break;
            case 'italic':
                newText = `<em>${selectedText}</em>`;
                break;
            case 'h2':
                newText = `<h2>${selectedText}</h2>`;
                break;
            case 'h3':
                newText = `<h3>${selectedText}</h3>`;
                break;
            case 'ul':
                newText = `<ul>\n  <li>${selectedText}</li>\n</ul>`;
                break;
            case 'p':
                newText = `<p>${selectedText}</p>`;
                break;
            case 'br':
                newText = '<br>';
                break;
            default:
                newText = selectedText;
        }
        
        const newContent = text.substring(0, start) + newText + text.substring(end);
        setFormData({ ...formData, content: newContent });
        
        // Восстанавливаем фокус и позицию курсора
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + newText.length, start + newText.length);
        }, 0);
    };

    if (loading) return <div className="text-center p-5">Загрузка...</div>;

    return (
        <div className="content-management">
            <div className="content-management__header">
                <h2>Управление страницами</h2>
                <Button variant="primary" onClick={() => handleShowModal()}>
                    Создать страницу
                </Button>
            </div>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

            <Card>
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Страница</th>
                                <th>Заголовок</th>
                                <th>Ключ</th>
                                <th>Статус</th>
                                <th>Обновлена</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages.map(page => (
                                <tr key={page.id}>
                                    <td>
                                        <span className="page-info">
                                            <span className="page-info__icon">{getPageIcon(page.page_key)}</span>
                                            {getPageTitle(page.page_key)}
                                        </span>
                                    </td>
                                    <td>{page.title}</td>
                                    <td><code>{page.page_key}</code></td>
                                    <td>
                                        <Button
                                            variant={page.is_active ? "success" : "secondary"}
                                            size="sm"
                                            onClick={() => handleToggleActive(page)}
                                        >
                                            {page.is_active ? 'Активна' : 'Неактивна'}
                                        </Button>
                                    </td>
                                    <td>{new Date(page.updatedAt).toLocaleDateString('ru-RU')}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleShowModal(page)}
                                            >
                                                Изменить
                                            </Button>
                                            <Button
                                                variant="outline-info"
                                                size="sm"
                                                href={`/content/${page.page_key}`}
                                                target="_blank"
                                            >
                                                Просмотр
                                            </Button>
                                            {!['about_us', 'delivery', 'payment', 'warranty'].includes(page.page_key) && (
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(page.id)}
                                                >
                                                    Удалить
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    
                    {pages.length === 0 && (
                        <div className="text-center py-4">
                            <p className="text-muted">Страницы не найдены</p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingPage ? 'Редактировать страницу' : 'Создать страницу'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Tab.Container defaultActiveKey="content">
                            <Nav variant="tabs" className="mb-3">
                                <Nav.Item>
                                    <Nav.Link eventKey="content">Содержание</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="seo">SEO</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="preview" onClick={() => setPreviewMode(true)}>
                                        Предпросмотр
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                            
                            <Tab.Content>
                                <Tab.Pane eventKey="content">
                                    {!editingPage && (
                                        <Form.Group className="mb-3">
                                            <Form.Label>Ключ страницы</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={formData.page_key}
                                                onChange={(e) => setFormData({ ...formData, page_key: e.target.value })}
                                                placeholder="например: privacy_policy"
                                                pattern="[a-z_]+"
                                                required
                                                disabled={editingPage}
                                            />
                                            <Form.Text className="text-muted">
                                                Только латинские буквы и подчеркивания
                                            </Form.Text>
                                        </Form.Group>
                                    )}

                                    <Form.Group className="mb-3">
                                        <Form.Label>Заголовок страницы</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Например: О компании"
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Содержание страницы</Form.Label>
                                        <div className="editor-toolbar">
                                            <Button size="sm" variant="outline-secondary" onClick={() => insertTag('bold')}>
                                                <strong>B</strong>
                                            </Button>
                                            <Button size="sm" variant="outline-secondary" onClick={() => insertTag('italic')}>
                                                <em>I</em>
                                            </Button>
                                            <Button size="sm" variant="outline-secondary" onClick={() => insertTag('h2')}>
                                                H2
                                            </Button>
                                            <Button size="sm" variant="outline-secondary" onClick={() => insertTag('h3')}>
                                                H3
                                            </Button>
                                            <Button size="sm" variant="outline-secondary" onClick={() => insertTag('p')}>
                                                P
                                            </Button>
                                            <Button size="sm" variant="outline-secondary" onClick={() => insertTag('ul')}>
                                                • List
                                            </Button>
                                            <Button size="sm" variant="outline-secondary" onClick={() => insertTag('br')}>
                                                BR
                                            </Button>
                                        </div>
                                        <Form.Control
                                            as="textarea"
                                            id="content-editor"
                                            rows={12}
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            placeholder="HTML содержимое страницы"
                                            required
                                        />
                                    </Form.Group>
                                </Tab.Pane>
                                
                                <Tab.Pane eventKey="seo">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Meta Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.meta_title}
                                            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                            placeholder="Заголовок для поисковых систем"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Meta Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={formData.meta_description}
                                            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                            placeholder="Описание для поисковых систем"
                                        />
                                    </Form.Group>
                                </Tab.Pane>
                                
                                <Tab.Pane eventKey="preview">
                                    <div className="content-preview">
                                        <h2>{formData.title}</h2>
                                        <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Страница активна"
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
                            {editingPage ? 'Сохранить' : 'Создать'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default ContentManagement; 