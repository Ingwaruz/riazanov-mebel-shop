import { useEffect } from 'react';

const YandexMetrika = () => {
    useEffect(() => {
        // Проверка на дублирование скрипта
        if (window.ym) return;
        
        // Создание скрипта Яндекс.Метрики
        const addYandexMetrika = () => {
            // Добавление скрипта метрики
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.text = `
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                ym(101165794, "init", {
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:true,
                    ecommerce:"dataLayer"
                });
            `;
            document.head.appendChild(script);
            
            // Создание noscript-элемента
            const noscript = document.createElement('noscript');
            const img = document.createElement('img');
            img.src = "https://mc.yandex.ru/watch/101165794";
            img.style = "position:absolute; left:-9999px;";
            img.alt = "";
            const div = document.createElement('div');
            div.appendChild(img);
            noscript.appendChild(div);
            document.body.appendChild(noscript);
        };
        
        addYandexMetrika();
    }, []);

    // Компонент не рендерит ничего видимого
    return null;
};

export default YandexMetrika; 