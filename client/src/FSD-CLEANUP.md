# Очистка после рефакторинга на FSD

## Выполненные работы

В процессе рефакторинга по архитектуре FSD были перенесены файлы в новую структуру, но старые файлы оставались на местах, что приводило к дублированию кода. Ниже приведен список выполненных работ по очистке:

## 1. Удаление дублирующихся страниц

- Удален файл `pages/Auth.js` (заменен на `pages/Auth/ui/AuthPage.jsx`)
- Удален файл `pages/Shop.jsx` (заменен на `pages/Shop/ui/ShopPage.jsx`)
- Удален файл `pages/ProductPage.jsx` (заменен на `pages/ProductPage/ui/ProductPage.jsx`)
- Удален файл `pages/Basket.js` (заменен на `pages/Basket/ui/BasketPage.jsx`)

## 2. Обновление App.js

- Обновлены импорты в `app/App.js` для использования компонентов из новой структуры
- Изменен импорт AppRouter из `entities/components/AppRouter` на `app/providers/AppRouter`
- Изменен импорт MyNavbar на `widgets/Navbar`
- Изменен импорт Footer на `widgets/Footer`

## 3. Удаление дублирующихся файлов хранения состояния

- Удален пустой файл `App.js` из корня `src`
- Удалены пустые файлы из `store/`:
  - `UserStore.js`
  - `ProductStore.js`
- Удалены дублирующиеся файлы из `entities/store/`:
  - `UserStore.js` (заменен на `entities/user/model/UserStore.js`)
  - `ProductStore.js` (заменен на `entities/product/model/ProductStore.js`)

## 4. Обновление ссылок на хранилища

- Обновлены импорты хранилищ в `index.js` на новые из соответствующих моделей в FSD структуре

## 5. Удаление прочих дублирующихся файлов

- Удален файл `entities/components/AppRouter.jsx` (заменен на `app/providers/AppRouter.jsx`)
- Удален файл `entities/utils/consts.js` (заменен на `shared/config/route-constants.js`)

## Результат

В результате проведенной работы:
- Устранено дублирование кода
- Поддерживается единый стиль архитектуры FSD
- Исключена возможность импортирования устаревших компонентов
- Система стала более поддерживаемой и соответствует заявленной архитектуре 