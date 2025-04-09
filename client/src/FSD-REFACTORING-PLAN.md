# План рефакторинга для перехода на FSD

## 1. Реорганизация слоя App

- [x] Создать папку `app/providers` и перенести провайдеры из корня проекта
- [x] Перенести роуты из `app/routes.js` в `app/routes/index.js`
- [x] Перенести `AppRouter` из `entities/components` в `app/providers`
- [x] Создать индексный файл `app/index.js`

## 2. Переработка слоя Features

- [x] Создать слайс `features/auth` и перенести логику авторизации
- [x] Создать слайс `features/product-filters` и перенести логику фильтрации
- [x] Создать слайс `features/basket` и перенести логику корзины
- [x] Добавить слайс `features/product-view` для просмотра деталей товара
- [x] Добавить слайс `features/checkout` для оформления заказа

## 3. Реорганизация слоя Entities

- [x] Создать структуру `entities/product`
  - [x] Перенести модели и типы в `entities/product/model`
  - [x] Перенести компоненты отображения в `entities/product/ui`
  - [x] Перенести API в `entities/product/api`
  - [x] Создать индексный файл
- [x] Создать структуру `entities/user`
  - [x] Перенести Store в `entities/user/model`
  - [x] Перенести компоненты в `entities/user/ui`
  - [x] Создать индексный файл
- [x] Перенести типы и константы из `entities/utils` в `shared/config`

## 4. Реорганизация слоя Pages

- [x] Разбить страницу `Auth.js` на компоненты:
  - [x] Создать `pages/Auth/ui/AuthPage.jsx`
  - [x] Использовать компоненты из `features/auth`
  - [x] Создать индексный файл
- [x] Разбить страницу `ProductPage.jsx`:
  - [x] Создать `pages/ProductPage/ui/ProductPage.jsx`
  - [x] Использовать компоненты из `features/product-view`
  - [x] Вынести галерею в отдельный компонент
  - [x] Создать индексный файл
- [x] Разбить страницу `Shop.jsx`:
  - [x] Создать `pages/Shop/ui/ShopPage.jsx`
  - [x] Использовать компоненты из `features/product-filters`
  - [x] Создать индексный файл
- [x] Разбить страницу `Basket.js`:
  - [x] Создать `pages/Basket/ui/BasketPage.jsx`
  - [x] Использовать компоненты из `features/basket`
  - [x] Создать индексный файл

## 5. Реорганизация слоя Widgets

- [x] Перенести `Navbar.jsx` в `widgets/Navbar/ui/Navbar.jsx`
- [x] Перенести `Footer.jsx` в `widgets/Footer/ui/Footer.jsx`
- [x] Перенести `ProductList.jsx` в `widgets/ProductList/ui/ProductList.jsx`
- [x] Перенести модальные окна из `widgets/modals` в `widgets/Modals/ui`
- [x] Создать индексные файлы для каждого виджета

## 6. Развитие слоя Shared

- [x] Создать папку `shared/api` и перенести туда HTTP-клиент
- [x] Создать папку `shared/lib` для утилит
- [x] Организовать `shared/ui` по типам компонентов:
  - [x] Перенести кнопки в `shared/ui/buttons`
  - [x] Перенести модальные окна в `shared/ui/modals`
  - [x] Перенести формы в `shared/ui/forms`
- [x] Создать папку `shared/config` для конфигурации и констант

## 7. Реорганизация стилей

- [x] Перенести глобальные стили из `app/styles` в `shared/styles`
- [x] Создать локальные стили для каждого компонента
- [x] Стандартизировать использование переменных SCSS

## 8. Тестирование и документация

- [x] Добавить README.md для каждого слоя
- [x] Обновить документацию по компонентам
- [x] Создать схему взаимодействия компонентов

## 9. Рефакторинг хранения состояния

- [x] Перенести хранилище из корня src в соответствующие слайсы
- [x] Разделить хранилище на домены (user, product, cart)
- [x] Обновить импорты во всех компонентах

## 10. Обновление роутинга

- [x] Реорганизовать файлы маршрутов в соответствии с FSD
- [x] Обновить защищенные маршруты
- [x] Использовать lazy-loading для страниц 