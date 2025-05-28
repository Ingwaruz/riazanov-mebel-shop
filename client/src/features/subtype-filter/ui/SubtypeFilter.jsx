import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { fetchSubtypesByType } from '../../product-filters/api/filterApi';
import { getTypeIcon } from './TypeIcons';
import './SubtypeFilter.scss';

const SubtypeFilter = ({ selectedTypes, currentFilters, onSubtypeSelect }) => {
    const [subtypesByType, setSubtypesByType] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadSubtypes = async () => {
            if (!selectedTypes || selectedTypes.length === 0) {
                setSubtypesByType({});
                return;
            }

            setLoading(true);
            const newSubtypesByType = {};

            try {
                for (const type of selectedTypes) {
                    const subtypes = await fetchSubtypesByType(type.id);
                    if (subtypes && subtypes.length > 0) {
                        newSubtypesByType[type.id] = {
                            typeName: type.name,
                            subtypes: subtypes
                        };
                    }
                }
                setSubtypesByType(newSubtypesByType);
            } catch (error) {
                console.error('Ошибка при загрузке подтипов:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSubtypes();
    }, [selectedTypes]);

    const handleSubtypeClick = (subtypeId) => {
        const currentSubtypes = currentFilters.selectedSubtypes || [];
        let newSubtypes;
        
        if (isSubtypeSelected(subtypeId)) {
            // Убираем подтип из выбранных
            newSubtypes = currentSubtypes.filter(id => id !== subtypeId.toString());
        } else {
            // Добавляем подтип к выбранным
            newSubtypes = [...currentSubtypes, subtypeId.toString()];
        }
        
        onSubtypeSelect(newSubtypes);
    };

    const isSubtypeSelected = (subtypeId) => {
        const selectedSubtypes = currentFilters.selectedSubtypes || [];
        return selectedSubtypes.includes(subtypeId.toString());
    };

    if (loading) {
        return <div className="subtype-filter-container mb-4 ms-4">Загрузка подтипов...</div>;
    }
    
    if (!selectedTypes || selectedTypes.length === 0) {
        return null;
    }
    
    if (Object.keys(subtypesByType).length === 0) {
        return null;
    }

    return (
        <div className="subtype-filter-container my-1 ms-4">
            {Object.entries(subtypesByType).map(([typeId, data]) => (
                <div key={typeId} className="type-subtype-group mb-3">
                    <div className="type-header mb-2">
                        <span className="type-icon">
                            {getTypeIcon(data.typeName, 20, '#333333')}
                        </span>
                        <span className="type-name">{data.typeName}</span>
                    </div>
                    <Row className="subtype-chips">
                        {data.subtypes.map((subtype) => (
                            <Col xs="auto" key={subtype.id} className="mb-2">
                                <Button
                                    variant={isSubtypeSelected(subtype.id) ? "primary" : "outline-primary"}
                                    size="sm"
                                    className={`subtype-chip ${isSubtypeSelected(subtype.id) ? 'active' : ''}`}
                                    onClick={() => handleSubtypeClick(subtype.id)}
                                >
                                    {subtype.name}
                                </Button>
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}
        </div>
    );
};

export default SubtypeFilter; 