import React, { useContext } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Pagination } from "react-bootstrap";

const Pages = observer(() => {
    const { product } = useContext(Context);
    const pageCount = Math.ceil(product.totalCount / product.limit); // Общее количество страниц
    const pages = [];

    // Заполняем массив страниц для рендера
    for (let i = 0; i < pageCount; i++) {
        pages.push(i + 1);
    }

    return (
        <Pagination className={'mt-5'}>
            {/* Кнопка "First" */}
            <Pagination.First
                onClick={() => product.setPage(1)}
                disabled={product.page === 1} // Делаем неактивной на первой странице
            />

            {/* Кнопка "Prev" */}
            <Pagination.Prev
                onClick={() => product.page > 1 && product.setPage(product.page - 1)}
                disabled={product.page === 1} // Делаем неактивной на первой странице
            />

            {/* Первая страница */}
            <Pagination.Item
                active={product.page === 1}
                onClick={() => product.setPage(1)}
            >
                {1}
            </Pagination.Item>

            {/* Эллипсис до основной части пагинации */}
            {product.page > 3 && <Pagination.Ellipsis />}

            {/* Основные страницы */}
            {pages
                .filter(page => page !== 1 && page !== pageCount) // исключаем первую и последнюю страницы
                .filter(page => page >= product.page - 1 && page <= product.page + 1) // показываем страницы вокруг текущей
                .map(page =>
                    <Pagination.Item
                        key={page}
                        active={product.page === page}
                        onClick={() => product.setPage(page)}
                    >
                        {page}
                    </Pagination.Item>
                )
            }

            {/* Эллипсис после основной части пагинации */}
            {product.page < pageCount - 2 && <Pagination.Ellipsis />}

            {/* Последняя страница */}
            {pageCount > 1 && (
                <Pagination.Item
                    active={product.page === pageCount}
                    onClick={() => product.setPage(pageCount)}
                >
                    {pageCount}
                </Pagination.Item>
            )}

            {/* Кнопка "Next" */}
            <Pagination.Next
                onClick={() => product.page < pageCount && product.setPage(product.page + 1)}
                disabled={product.page === pageCount} // Делаем неактивной на последней странице
            />

            {/* Кнопка "Last" */}
            <Pagination.Last
                onClick={() => product.setPage(pageCount)}
                disabled={product.page === pageCount} // Делаем неактивной на последней странице
            />
        </Pagination>
    );
});

export default Pages;
