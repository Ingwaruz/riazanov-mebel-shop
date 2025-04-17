import React, { useState } from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import '../../../app/styles/colors.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CenteredModal } from '../../modals';
import './Footer.scss';

export default function Footer() {
    const [modalData, setModalData] = useState({ show: false, title: '', content: '' });

    const handleModalShow = (title, content) => {
        setModalData({ show: true, title, content });
    };

    const handleModalClose = () => {
        setModalData({ ...modalData, show: false });
    };

    return (
        <>
            <MDBFooter className='text-center text-lg-start text-muted mt-5 bg-main_color color_white footer'>
                <div className='container-fluid p-0'>
                    <section className='d-flex justify-content-lg-between justify-content-center p-3 border-bottom'>
                        <div className='d-none d-lg-block d-flex justify-content-center l-text color_white ms-3'>
                            <span>Следите за нами в социальных сетях:</span>
                        </div>

                        <div>
                            <a
                                href='https://t.me/mebel_blg_ostrova'
                                target="_blank" rel="noopener noreferrer" className='me-4 text-reset fa-2x'
                            >
                                <MDBIcon fab icon='telegram' />
                            </a>
                            <a
                                href='https://www.instagram.com/divan_premium_blg/profilecard/?igsh=MWEybW9hdDdtM2Nseg%3D%3D&fbclid=PAZXh0bgNhZW0CMTEAAabsLjVjPEDUFBfcxJrU0_C32iJvKrBSn6mJLWikPEBk9HdTaBwCAGOFVzY_aem_5pe7FhH0-vGs_42FQrSDhA'
                                target="_blank" rel="noopener noreferrer" className='me-4 text-reset fa-2x'
                            >
                                <MDBIcon fab icon='instagram' />
                            </a>
                            <a
                                href='https://api.whatsapp.com/send/?phone=79143983470&text&type=phone_number&app_absent=0
                                ' target="_blank" rel="noopener noreferrer" className='me-4 text-reset fa-2x'
                            >
                                <MDBIcon fab icon='whatsapp' />
                            </a>
                        </div>
                    </section>

                    <section>
                        <MDBContainer className='text-center text-md-start mt-5'>
                            <MDBRow className='mt-3'>
                                <MDBCol md='3' lg='4' xl='3' className='mx-auto mb-4'>
                                    <h6 className='text-uppercase mb-4 m-text color_white'>
                                        <MDBIcon icon='gem' className='me-3' />
                                        ДОМУ МЕБЕЛЬ
                                    </h6>
                                    <p className='mb-4 m-text color_white'>
                                    
                                        Создаем уют в каждом доме. Качественная мебель для комфортной жизни.

                                    </p>
                                </MDBCol>

                                <MDBCol md='2' lg='2' xl='2' className='mx-auto mb-4'>
                                    <h6 className='text-uppercase mb-4 m-text color_white'>ПАРТНЁРЫ</h6>
                                    <p>
                                        <a
                                            href='https://www.ardoni.ru/'
                                            className=' text-uppercase m-text color_white'
                                        >
                                            Ardoni
                                        </a>
                                    </p>
                                    <p>
                                        <a
                                            href='https://geniuspark.ru/'
                                            className='text-uppercase m-text color_white'
                                        >
                                            Geniuspark
                                        </a>
                                    </p>
                                    <p>
                                        <a
                                            href='https://www.orimex.ru/'
                                            className='text-uppercase m-text color_white'
                                        >
                                            Оримэкс
                                        </a>
                                    </p>
                                    <p>
                                        <a
                                            href='https://melodiasna.ru/'
                                            className='text-uppercase m-text color_white'
                                        >
                                            Мелодия сна
                                        </a>
                                    </p>
                                    <p>
                                        <a
                                            href='https://sonum.ru/'
                                            className='text-uppercase m-text color_white'
                                        >
                                            Сонум
                                        </a>
                                    </p>
                                </MDBCol>

                                <MDBCol md='3' lg='2' xl='2' className='mx-auto mb-4'>
                                    <h6 className='text-uppercase mb-4 m-text color_white'>Ссылки</h6>
                                    <p>
                                        <a href='#!' className='m-text color_white'>
                                            Где купить
                                        </a>
                                    </p>
                                    <p>
                                        <a href='#!' className='m-text color_white'>
                                            Распродажа
                                        </a>
                                    </p>
                                    <p>
                                        <a href='#!' className='m-text color_white'>
                                            Доставка
                                        </a>
                                    </p>
                                    <p>
                                        <a href='#!' className='m-text color_white'>
                                            Контакты
                                        </a>
                                    </p>
                                </MDBCol>
                            </MDBRow>
                        </MDBContainer>
                    </section>
                </div>
            </MDBFooter>

            {/* Модальное окно */}
            <CenteredModal
                show={modalData.show}
                title={modalData.title}
                onHide={handleModalClose}
            >
                {modalData.content}
            </CenteredModal>
        </>
    );
} 