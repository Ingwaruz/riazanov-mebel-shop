import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../app/styles/colors.scss';

const CenteredModal = ({ show, onHide, title, children }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title className='xl-text' style={{fontWeight : `600`}}>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='m-text'>
                {children}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={onHide}
                    className='m-text color_white'
                >
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CenteredModal;
