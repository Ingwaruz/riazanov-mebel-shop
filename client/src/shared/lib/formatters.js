/**
 * Форматирует цену в российских рублях
 * @param {number} price - цена для форматирования
 * @param {boolean} showCurrency - показывать ли символ валюты
 * @returns {string} отформатированная цена
 */
export const formatPrice = (price, showCurrency = true) => {
    if (price === undefined || price === null) return '';
    
    const formattedPrice = price.toLocaleString('ru-RU');
    return showCurrency ? `${formattedPrice} ₽` : formattedPrice;
};

/**
 * Форматирует дату в российском формате
 * @param {string|Date} date - дата для форматирования
 * @returns {string} отформатированная дата
 */
export const formatDate = (date) => {
    if (!date) return '';
    
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

/**
 * Обрезает текст до указанной длины и добавляет многоточие
 * @param {string} text - текст для обрезки
 * @param {number} maxLength - максимальная длина текста
 * @returns {string} обрезанный текст
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
}; 