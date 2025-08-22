import React, { useState } from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import '../../../app/styles/colors.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CenteredModal } from '../../modals';
import { useContacts } from '../../../entities/contacts/hooks';
import useContent from '../../../entities/contacts/hooks/useContent';
import './Footer.scss';

export default function Footer() {
    const [modalData, setModalData] = useState({ show: false, title: '', content: '' });
    const { phones, emails, addresses, socials, messengers, loading } = useContacts();
    const aboutPageContent = useContent('about_us');

    const handleModalShow = (title, content) => {
        setModalData({ show: true, title, content });
    };

    const handleModalClose = () => {
        setModalData({ ...modalData, show: false });
    };

    // Получаем первые контакты каждого типа для отображения
    const mainPhone = phones[0];
    const mainEmail = emails[0];
    const mainAddress = addresses[0];
    
    // Находим социальные сети и мессенджеры
    const telegram = socials.find(s => s.value.includes('t.me') || s.value.includes('telegram'));
    const instagram = socials.find(s => s.value.includes('instagram'));
    const whatsapp = messengers.find(m => m.value.includes('whatsapp') || m.value.includes('wa.me'));

    // Модальное содержимое
    const deliveryContent = (
        <div>
                <h4>Условия доставки</h4>
                <p>Мы осуществляем доставку по всей России.</p>
                {mainPhone && (
                    <p>Для уточнения деталей доставки, свяжитесь с нами по телефону: 
                        <a href={`tel:${mainPhone.value.replace(/\D/g, '')}`}> {mainPhone.value}</a>
                    </p>
                )}
            </div>
    );

    const contactsContent = (
        <div>
                <h4>Наши контакты</h4>
                {mainAddress && <p><strong>Адрес:</strong> {mainAddress.value}</p>}
                {mainPhone && (
                    <p><strong>Телефон:</strong> 
                        <a href={`tel:${mainPhone.value.replace(/\D/g, '')}`}> {mainPhone.value}</a>
                    </p>
                )}
                {mainEmail && (
                    <p><strong>Email:</strong> 
                        <a href={`mailto:${mainEmail.value}`}> {mainEmail.value}</a>
                    </p>
                )}
                <p><strong>Режим работы:</strong></p>
                <p>Ежедневно с 10:00 до 21:00</p>
                
                {/* Дополнительные телефоны */}
                {phones.length > 1 && (
                    <>
                        <p className="mt-3"><strong>Дополнительные телефоны:</strong></p>
                        {phones.slice(1).map((phone, index) => (
                            <p key={index}>
                                {phone.label}: 
                                <a href={`tel:${phone.value.replace(/\D/g, '')}`}> {phone.value}</a>
                            </p>
                        ))}
                    </>
                )}
            </div>
    );

    const aboutContent = (
        <div>
                <p>
                «ДОМУ МЕБЕЛЬ» — ведущий дистрибьютор премиальной мебели, предлагающий эксклюзивные коллекции от лучших Российских производителей. Мы тщательно отбираем предметы интерьера, сочетающие в себе безупречное качество, элегантный дизайн и функциональность, чтобы создать пространства, отражающие ваш стиль и статус.
                </p>
                <p>
                    Наша миссия — обеспечивать клиентов мебелью премиум-класса, которая превращает дом в место настоящего комфорта и роскоши. Мы работаем с дизайнерами, архитекторами и частными заказчиками, предлагая индивидуальный подход и профессиональные решения для любых интерьерных задач.
                </p>
                <h4>Почему выбирают нас?</h4>
                <ul>
                    <li>Высокое качество материалов</li>
                    <li>Широкий ассортимент: от классики до современных трендов</li>
                    <li>Персональный сервис и помощь в подборе мебели</li>
                    <li>Гарантия на всю продукцию</li>
                </ul>
            </div>
    );

    if (loading) {
        return null; // Или можно показать скелетон footer
    }

    return (
        <>
            <MDBFooter className='text-center text-lg-start text-muted mt-5 bg-main_color color_white footer'>
                <div className='container-fluid p-0'>
                    <section className='d-flex justify-content-lg-between justify-content-center p-3 border-bottom'>
                        <div className='d-none d-lg-block d-flex justify-content-center l-text color_white ms-3'>
                            <span>Следите за нами в социальных сетях:</span>
                        </div>

                        <div>
                            {telegram && (
                                <a
                                    href={telegram.value}
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className='me-4 text-reset fa-2x'
                                    title={telegram.label}
                                >
                                    <MDBIcon fab icon='telegram' />
                                </a>
                            )}
                            {instagram && (
                                <a
                                    href={instagram.value}
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className='me-4 text-reset fa-2x'
                                    title={instagram.label}
                                >
                                    <MDBIcon fab icon='instagram' />
                                </a>
                            )}
                            {whatsapp && (
                                <a
                                    href={whatsapp.value}
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className='me-4 text-reset fa-2x'
                                    title={whatsapp.label}
                                >
                                    <MDBIcon fab icon='whatsapp' />
                                </a>
                            )}
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
                                    <h6 className='text-uppercase mb-4 m-text color_white'>Информация</h6>
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