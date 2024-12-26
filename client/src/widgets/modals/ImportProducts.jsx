import React, { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import ButtonM1 from "../../shared/ui/buttons/button-m1";
import ButtonM2 from "../../shared/ui/buttons/button-m2";
import { importProducts } from '../../processes/productAPI';

const ImportProducts = ({ show, onHide }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleImport = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            
            console.log('File being sent:', file);
            console.log('FormData being sent:', formData);
            console.log('Authorization token:', localStorage.getItem('token'));
            
            const result = await importProducts(formData);
            console.log('Import result:', result);
            
            onHide();
            alert('Товары успешно импортированы');
        } catch (error) {
            console.error('Import error details:', error.response || error);
            alert('Ошибка при импорте: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Импорт товаров</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Выберите CSV файл</Form.Label>
                    <Form.Control
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                    />
                    <Form.Text className="text-muted">
                        Файл должен быть в формате CSV с разделителями-запятыми
                    </Form.Text>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <ButtonM2 onClick={onHide} text="Отмена" />
                <ButtonM2 
                    onClick={handleImport} 
                    disabled={!file || loading}
                    text={loading ? 'Импорт...' : 'Импортировать'}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default ImportProducts; 