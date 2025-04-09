# Схема взаимодействия компонентов

## Общая архитектура

Проект следует архитектуре Feature-Sliced Design (FSD), которая разделяет код на следующие слои:

1. **App** - конфигурация и инициализация приложения
2. **Processes** - бизнес-процессы, охватывающие несколько функциональностей
3. **Pages** - страницы приложения
4. **Widgets** - составные компоненты, использующиеся на страницах
5. **Features** - пользовательские интерфейсы, решающие задачи пользователя
6. **Entities** - бизнес-сущности
7. **Shared** - переиспользуемые модули

## Поток данных

```
App → Pages → Widgets → Features → Entities → Shared
```

## Взаимодействие между компонентами

### Авторизация

```
Pages/Auth → Features/Auth → Entities/User → Shared/API
```

1. Страница `AuthPage` содержит форму авторизации из `features/auth/AuthForm`
2. `AuthForm` использует API методы из `features/auth/authApi`
3. API методы обновляют хранилище `entities/user/model/UserStore`
4. При успешной авторизации пользователь перенаправляется на главную страницу

### Навигация

```
App → Widgets/Navbar → Entities/User → Shared/UI
```

1. Компонент `Navbar` отображается на всех страницах приложения
2. `Navbar` включает элементы навигации и компонент `UserAuth` из `entities/user/ui`
3. `UserAuth` отображает кнопки входа/выхода в зависимости от статуса авторизации

### Защищенные маршруты

```
App/Routes → Entities/User/RequireAuth
```

1. Определение маршрутов происходит в `app/routes`
2. Защищенные маршруты оборачиваются в компонент `RequireAuth` из `entities/user/ui`
3. `RequireAuth` проверяет статус авторизации и роль пользователя

### Каталог товаров

```
Pages/Shop → Widgets/ProductList → Features/ProductFilters → Entities/Product
```

1. Страница `ShopPage` отображает каталог товаров
2. Виджет `ProductList` отображает список товаров
3. Фильтры товаров из `features/product-filters` позволяют фильтровать список
4. Карточки товаров из `entities/product/ui` отображают информацию о товарах

### Корзина

```
Pages/Basket → Features/Basket → Entities/Product
```

1. Страница `BasketPage` отображает содержимое корзины
2. Компоненты из `features/basket` отображают список товаров в корзине и управляют ими
3. Данные товаров получаются из `entities/product/model`

## Схематическое представление взаимодействия хранилищ

```
┌────────────────────┐       ┌─────────────────────┐       ┌────────────────────┐
│   UserStore        │       │   ProductStore      │       │    BasketStore     │
│ (entities/user)    │       │ (entities/product)  │       │  (features/basket) │
└─────────┬──────────┘       └──────────┬──────────┘       └──────────┬─────────┘
          │                             │                             │
          │                             │                             │
          ▼                             ▼                             ▼
    ┌────────────┐               ┌─────────────┐              ┌─────────────┐
    │  Auth API  │               │ Product API │              │  Basket UI  │
    │(features/  │               │(entities/   │              │ (features/  │
    │   auth)    │               │  product)   │              │   basket)   │
    └────────────┘               └─────────────┘              └─────────────┘
``` 