import React from 'react';
import './pagination.scss';

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
        <div className="pagination">
            <button 
                className="pagination__button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Назад
            </button>
            
            <div className="pagination__pages">
                {generatePageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="pagination__dots">...</span>
                        ) : (
                            <button
                                className={`pagination__page ${currentPage === page ? 'pagination__page--active' : ''}`}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>
            
            <button 
                className="pagination__button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Вперед
            </button>
        </div>
    );
};

export default Pagination; 