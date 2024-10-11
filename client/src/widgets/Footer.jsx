import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';

export default function Footer() {
    return (
        <MDBFooter className='text-center text-lg-start text-muted mt-5 bg-color-gray color-white'>
            <div className={'container-fluid'}>
                <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
                    <div className='me-5 d-none d-lg-block'>
                        <span>Следите за нами в социальных сетях:</span>
                    </div>

                    <div>
                        <a href='' className='me-4 text-reset bg-color-gray color-white'>
                            <MDBIcon fab icon="facebook-f"/>
                        </a>
                        <a href='' className='me-4 text-reset'>
                            <MDBIcon fab icon="twitter"/>
                        </a>
                        <a href='' className='me-4 text-reset'>
                            <MDBIcon fab icon="google"/>
                        </a>
                        <a href='' className='me-4 text-reset'>
                            <MDBIcon fab icon="instagram"/>
                        </a>
                        <a href='' className='me-4 text-reset'>
                            <MDBIcon fab icon="linkedin"/>
                        </a>
                        <a href='' className='me-4 text-reset'>
                            <MDBIcon fab icon="github"/>
                        </a>

                        <a href='' className='me-4 text-reset'>
                            <MDBIcon fab icon="github"/>
                        </a>
                    </div>
                </section>

                <section className=''>
                    <MDBContainer className='text-center text-md-start mt-5'>
                        <MDBRow className='mt-3'>
                            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
                                <h6 className='text-uppercase fw-bold mb-4'>
                                    <MDBIcon icon="gem" className="me-3" />
                                    МЕБЕЛЬ ОТ РЯЗАНОВА
                                </h6>
                                <p>
                                    Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet,
                                    consectetur adipisicing elit.
                                </p>
                            </MDBCol>

                            <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
                                <h6 className='text-uppercase fw-bold mb-4'>ПАРТНЁРЫ</h6>
                                <p>
                                    <a href='https://www.ardoni.ru/' className='text-reset'>
                                        Ardoni
                                    </a>
                                </p>
                                <p>
                                    <a href='https://geniuspark.ru/' className='text-reset'>
                                        Geniuspark
                                    </a>
                                </p>
                                <p>
                                    <a href='https://www.orimex.ru/' className='text-reset'>
                                        Оримэкс
                                    </a>
                                </p>
                                <p>
                                    <a href='https://melodiasna.ru/' className='text-reset'>
                                        Мелодия сна
                                    </a>
                                </p>
                                <p>
                                    <a href='https://sonum.ru/' className='text-reset'>
                                        Сонум
                                    </a>
                                </p>
                            </MDBCol>

                            <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
                                <h6 className='text-uppercase fw-bold mb-4'>Ссылки</h6>
                                <p>
                                    <a href='#!' className='text-reset'>
                                        Где купить
                                    </a>
                                </p>
                                <p>
                                    <a href='#!' className='text-reset'>
                                        Распродажа
                                    </a>
                                </p>
                                <p>
                                    <a href='#!' className='text-reset'>
                                        Доставка
                                    </a>
                                </p>
                                <p>
                                    <a href='#!' className='text-reset'>
                                        Контакты
                                    </a>
                                </p>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </section>

                <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                    © 2024 Copyright:
                    <a className='text-reset fw-bold' href='https://mdbootstrap.com/'>
                        MDBootstrap.com
                    </a>
                </div>
            </div>
        </MDBFooter>
    );
}