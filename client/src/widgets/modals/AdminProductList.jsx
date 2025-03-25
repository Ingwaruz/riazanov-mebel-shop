import React, { useContext } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Context } from "../../index";
import './AdminProductList.scss';

const AdminProductList = ({ onProductClick }) => {
    const { product } = useContext(Context);

    const handleEditClick = (item, e) => {
        e.stopPropagation();
        // Преобразуем ID в числовой формат перед передачей
        const numericId = parseInt(item.id);
        onProductClick({ ...item, id: numericId });
    };

    // Упрощенный вид товаров для админки
    return (
        <div className="admin-product-list-container">
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Изображение</th>
                        <th>Название</th>
                        <th>Тип</th>
                        <th>Цена</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {product.products.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td className="product-image-cell">
                                {item.images && item.images.length > 0 ? (
                                    <img 
                                        src={process.env.REACT_APP_API_URL + '/' + item.images[0].img} 
                                        alt={item.name} 
                                        className="admin-product-thumbnail"
                                    />
                                ) : (
                                    <div className="no-image">Нет фото</div>
                                )}
                            </td>
                            <td>{item.name}</td>
                            <td>{item.type?.name || '-'}</td>
                            <td>
                                {item.price > 0 ? (
                                    <span>{item.price} ₽</span>
                                ) : item.min_price > 0 ? (
                                    <span>от {item.min_price} ₽</span>
                                ) : (
                                    <span>Цена по запросу</span>
                                )}
                            </td>
                            <td>
                                <button 
                                    className="btn btn-sm btn-primary"
                                    onClick={(e) => handleEditClick(item, e)}
                                >
                                    Редактировать
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {product.products.length === 0 && (
                <div className="text-center my-4">Товары не найдены</div>
            )}
        </div>
    );
};

export default AdminProductList; 