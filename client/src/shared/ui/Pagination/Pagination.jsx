import React, { useState, useEffect } from 'react';
import './Pagination.scss';
import ButtonM4 from '../../ui/buttons/button-m4';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 576);
    
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 576);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const generatePageNumbers = () => {
        const pages = [];
        
        if (totalPages <= (isMobile ? 5 : 7)) {
            // Если страниц меньше лимита, показываем все
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Всегда показываем первую страницу
            pages.push(1);
            
            if (currentPage > (isMobile ? 2 : 3)) {
                pages.push('...');
            }
            
            // Показываем страницы вокруг текущей
            const beforeCurrent = isMobile ? 0 : 1;
            const afterCurrent = isMobile ? 0 : 1;
            
            for (let i = Math.max(2, currentPage - beforeCurrent); 
                 i <= Math.min(currentPage + afterCurrent, totalPages - 1); i++) {
                pages.push(i);
            }
            
            if (currentPage < totalPages - (isMobile ? 1 : 2)) {
                pages.push('...');
            }
            
            // Всегда показываем последнюю страницу
            if (currentPage !== totalPages) {
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    return (
        <div className="pagination mb-4 mt-2">
            <ButtonM4
                height={isMobile ? "2.5rem" : "3rem"}
                width={isMobile ? "4rem" : "auto"}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                text={isMobile ? "<" : "Назад"}
            />
            
            <div className="pagination__pages">
                {generatePageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="l-text mt-4">...</span>
                        ) : (
                            <ButtonM4
                                width={isMobile ? "2.5rem" : "3rem"}
                                height={isMobile ? "2.5rem" : "3rem"}
                                onClick={() => onPageChange(page)}
                                variant={currentPage === page ? 'primary' : 'outline'}
                                text={page}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
            
            <ButtonM4
                height={isMobile ? "2.5rem" : "3rem"}
                width={isMobile ? "4rem" : "auto"}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                text={isMobile ? ">" : "Вперед"}
            />
        </div>
    );
};

export default Pagination; 