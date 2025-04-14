import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../../../app/styles/colors.scss';
import ButtonM1 from "../../../shared/ui/buttons/button-m1";
import ButtonM2 from "../../../shared/ui/buttons/button-m2";
import './CenteredModal.scss';

const CenteredModal = ({ show, onHide, title, children }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            className="centered-modal"
            backdrop={true}
            scrollable={true}
            restoreFocus={false}
        >
            <Modal.Header closeButton>
                <Modal.Title className='xl-text modal-title'>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='m-text modal-body'>
                {children}
            </Modal.Body>
            <Modal.Footer>
                {/*<ButtonM2*/}
                {/*    text="Закрыть"*/}
                {/*    onClick={onHide}*/}
                {/*/>*/}
            </Modal.Footer>
        </Modal>
    );
};

export default CenteredModal; 