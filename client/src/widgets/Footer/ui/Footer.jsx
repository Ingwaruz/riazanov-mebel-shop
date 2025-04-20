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

    // Модальное содержимое
    const deliveryContent = (
        <div>
            <h4>Условия доставки</h4>
            <p>Мы осуществляем доставку по всей России.</p>
            <ul>
                <li>Доставка по Москве - бесплатно (при заказе от 5000 руб)</li>
                <li>Доставка по Московской области - от 500 руб</li>
                <li>Доставка в регионы - по тарифам транспортных компаний</li>
            </ul>
            <p>Сроки доставки: 1-3 дня по Москве, 3-7 дней по России.</p>
            <p>Для уточнения деталей доставки, свяжитесь с нами по телефону: <a href="tel:+78001234567">8 (800) 123-45-67</a></p>
        </div>
    );

    const contactsContent = (
        <div>
            <h4>Наши контакты</h4>
            <p><strong>Адрес:</strong> г. Москва, ул. Мебельная, д. 123</p>
            <p><strong>Телефон:</strong> <a href="tel:+78001234567">8 (800) 123-45-67</a></p>
            <p><strong>Email:</strong> <a href="mailto:info@dommebel.ru">info@dommebel.ru</a></p>
            <p><strong>Режим работы:</strong></p>
            <p>Пн-Пт: 9:00 - 20:00<br />Сб-Вс: 10:00 - 18:00</p>
        </div>
    );

    const aboutContent = (
        <div>
            <h4>О нас</h4>
            <p>Компания "ДОМУ МЕБЕЛЬ" - это семейный бизнес с многолетней историей. Мы производим и продаем качественную мебель для дома и офиса с 2005 года.</p>
            <p>Наша миссия - создавать комфортное пространство для жизни и работы наших клиентов.</p>
            <p>Преимущества компании:</p>
            <ul>
                <li>Собственное производство</li>
                <li>Экологически чистые материалы</li>
                <li>Гарантия на всю продукцию</li>
                <li>Индивидуальный подход к каждому клиенту</li>
            </ul>
        </div>
    );

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
                                        <div className="logo-text">
                                            <span className="logo-text-first">ДОМУ</span>
                                            <span className="logo-text-second">МЕБЕЛЬ</span>
                                        </div>
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
                                        <a href="#about" onClick={(e) => {e.preventDefault(); handleModalShow('О нас', aboutContent);}} className='m-text color_white cursor-pointer'>
                                            О нас
                                        </a>
                                    </p>
                                    <p>
                                        <a href="#contacts" onClick={(e) => {e.preventDefault(); handleModalShow('Контакты', contactsContent);}} className='m-text color_white cursor-pointer'>
                                            Контакты
                                        </a>
                                    </p>
                                    <p>
                                        <a href="#delivery" onClick={(e) => {e.preventDefault(); handleModalShow('Доставка', deliveryContent);}} className='m-text color_white cursor-pointer'>
                                            Доставка
                                        </a>
                                    </p>
                                </MDBCol>
                            </MDBRow>
                        </MDBContainer>
                    </section>
                </div>
                <div className="disclaimer-container text-center py-3 border-top">
                    <p className="mb-1 s-text color_white">Опубликованные на сайте цены не являются публичной офертой.</p>
                    <p className="mb-0 s-text color_white">ДОМУ МЕБЕЛЬ не является официальным сайтом представленных производителей мебели.</p>
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