import React from 'react';
import './pagination.scss';
import ButtonM2 from '../../../shared/ui/buttons/button-m2';
import ButtonM1 from '../../../shared/ui/buttons/button-m1';
import ButtonM4 from '../../../shared/ui/buttons/button-m4';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];
    
    // Генерируем массив страниц для отображения
    const generatePageNumbers = () => {
        if (totalPages <= 7) {
            // Если страниц меньше 7, показываем все
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Всегда показываем первую страницу
            pages.push(1);
            
            if (currentPage > 3) {
                pages.push('...');
            }
            
            // Показываем страницы вокруг текущей
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
                pages.push(i);
            }
            
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            
            // Всегда показываем последнюю страницу
            pages.push(totalPages);
        }
        
        return pages;
    };

    return (
        <div className="pagination mb-4 mt-2">
            <ButtonM4
                height="3rem" 
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                text="Назад"
            />
            
            <div className="pagination__pages">
                {generatePageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="l-text mt-4">...</span>
                        ) : (
                            <ButtonM4
                                width="3rem"
                                height="3rem"   
                                onClick={() => onPageChange(page)}
                                variant={currentPage === page ? 'primary' : 'outline'}
                                text={page}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
            
            <ButtonM4
                height="3rem" 
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                text="Вперед"
            />
            
        </div>
    );
};

export default Pagination; 