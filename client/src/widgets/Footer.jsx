import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import '../app/styles/colors.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Footer() {
    return (
        <MDBFooter className='text-center text-lg-start text-muted mt-5 bg-main_color color_white'>
            <div className={'container-fluid p-0'}>
                <section className='d-flex c justify-content-lg-between p-3 border-bottom'>
                    <div className='d-none d-lg-block d-flex justify-content-center l-text color_white'>
                        <span>Следите за нами в социальных сетях:</span>
                    </div>

                    <div>
                        <a href='https://t.me/mebel_blg_ostrova'
                            className='me-4 text-reset fa-2x'>
                            <MDBIcon fab icon="telegram"/>
                        </a>
                        <a href='https://l.instagram.com/?u=https%3A%2F%2Fwww.instagram.com%2Fdivan_premium_blg%2Fprofilecard%2F%3Figsh%3DMWEybW9hdDdtM2Nseg%253D%253D%26fbclid%3DPAZXh0bgNhZW0CMTEAAaYCJZf9Ha6tot5mzcuRnia04CmpztSoCnYtazSkg1n4Ux5M1amdHKXApzQ_aem_nZK_4-NznvSwCcJxPUaCWA&e=AT3qrgV6o2PxHpL0SRlvD7EUpTuQZ8NWXXGS9JLuP7qS9AZMwF6_J6UnX3GJcHZaRwIkrdCpgzOQdKNkFFg4u5bSv66pgE9mLvmvGf5aHWg1xCWV8Pc4p58'
                            className='me-4 text-reset fa-2x'>
                            <MDBIcon fab icon="instagram"/>
                        </a>
                        <a href='https://l.instagram.com/?u=https%3A%2F%2Fwww.instagram.com%2Forimex_blg%2Fprofilecard%2F%3Figsh%3DMzZxNW5yaWU1OXdh%26fbclid%3DPAZXh0bgNhZW0CMTEAAaZ6AhcUO1euo0Uox7pgrpkCeA6UR6wS6sX81cfNZcMrC6oNgg5CWgGGLOc_aem_Y7zBA36zYXyQb9UCtxPKBA&e=AT3a7fOMHynKgonE-ZLkSg8a-FCuDMoyT4qf9uT1iH7R78lWfl3Z0I9TQ87H_66Ocy29QexUsnxEhKmRWlgxsExHlH0vya-_4TF-iJsJ06Rto4ClOtW1HrA'
                            className='me-4 text-reset fa-2x'>
                            <MDBIcon fab icon="instagram"/>
                        </a>
                        <a href='https://l.instagram.com/?u=https%3A%2F%2Fwa.me%2F79143983470%3Ffbclid%3DPAZXh0bgNhZW0CMTEAAabLeLDV1ZH84f7Kf0xNMoXPAnaTyVfB3DuaNlexOms4sexkkhbnGep8OIg_aem_ftH0aGTz_aH8762MDBjkrg&e=AT3e_QKFocyG007LWAQd5eLKqn3S9wZrJE6PKKYEGP7-UQi7B8qTHYAg8TwwEHRaNBehlgTztWZsWU72R4m6yOGIiEvG-aNvr0_GMuAt0BGWwPfJANmvObg'
                            className='me-4 text-reset fa-2x'>
                            <MDBIcon fab icon="whatsapp"/>
                        </a>
                    </div>
                </section>

                <section className=''>
                    <MDBContainer className='text-center text-md-start mt-5'>
                        <MDBRow className='mt-3'>
                            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
                                <h6 className='text-uppercase mb-4 m-text color_white'>
                                    <MDBIcon icon="gem" className="me-3" />
                                    МЕБЕЛЬ ОТ РЯЗАНОВА
                                </h6>
                                <p className='mb-4 m-text color_white'>
                                    Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet,
                                    consectetur adipisicing elit.
                                </p>
                            </MDBCol>

                            <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
                                <h6 className='text-uppercase mb-4 m-text color_white'>ПАРТНЁРЫ</h6>
                                <p>
                                    <a href='https://www.ardoni.ru/' className=' text-uppercase m-text color_white'>
                                        Ardoni
                                    </a>
                                </p>
                                <p>
                                    <a href='https://geniuspark.ru/' className='text-uppercase m-text color_white'>
                                        Geniuspark
                                    </a>
                                </p>
                                <p>
                                    <a href='https://www.orimex.ru/' className='text-uppercase m-text color_white'>
                                        Оримэкс
                                    </a>
                                </p>
                                <p>
                                    <a href='https://melodiasna.ru/' className='text-uppercase m-text color_white'>
                                        Мелодия сна
                                    </a>
                                </p>
                                <p>
                                    <a href='https://sonum.ru/' className='text-uppercase m-text color_white'>
                                        Сонум
                                    </a>
                                </p>
                            </MDBCol>

                            <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
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

                <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>

                </div>
            </div>
        </MDBFooter>
    );
}