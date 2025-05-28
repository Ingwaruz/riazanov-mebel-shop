# SVG Иконки

Эта папка содержит SVG иконки для проекта.

## Структура

```
icons/
├── index.js          # Экспорт всех иконок
├── left-arrow.svg    # Стрелка влево
├── right-arrow.svg   # Стрелка вправо
├── cart.svg          # Корзина покупок
├── user.svg          # Пользователь/профиль
├── search.svg        # Поиск
├── heart.svg         # Избранное/лайк
├── menu.svg          # Меню (гамбургер)
├── close.svg         # Закрыть (крестик)
└── README.md         # Этот файл
```

## Использование

### Импорт иконок

```jsx
// Импорт конкретных иконок
import { 
    LeftArrowIcon, 
    RightArrowIcon, 
    CartIcon, 
    UserIcon, 
    SearchIcon,
    HeartIcon,
    MenuIcon,
    CloseIcon 
} from '../shared/assets/icons';

// Использование в компоненте
function MyComponent() {
    return (
        <div>
            <img src={CartIcon} alt="Корзина" />
            <img src={UserIcon} alt="Профиль" />
            <img src={SearchIcon} alt="Поиск" />
        </div>
    );
}
```

### Как React компонент (рекомендуется)

```jsx
import { ReactComponent as Cart } from '../shared/assets/icons/cart.svg';
import { ReactComponent as User } from '../shared/assets/icons/user.svg';
import { ReactComponent as Search } from '../shared/assets/icons/search.svg';

function MyComponent() {
    return (
        <div>
            <Cart className="icon" />
            <User className="icon" />
            <Search className="icon" />
        </div>
    );
}
```

### Стилизация иконок

```css
.icon {
    width: 24px;
    height: 24px;
    color: #333; /* Цвет иконки */
    transition: color 0.2s ease;
}

.icon:hover {
    color: #007bff; /* Цвет при наведении */
}
```

## Добавление новых иконок

1. Поместите SVG файл в эту папку
2. Добавьте экспорт в `index.js`
3. Обновите этот README при необходимости

## Рекомендации

- Используйте kebab-case для названий файлов (например: `user-profile.svg`)
- Оптимизируйте SVG файлы перед добавлением
- Используйте осмысленные названия для иконок
- Добавляйте alt текст при использовании как img
- Используйте `currentColor` для stroke и fill чтобы иконки наследовали цвет текста
- Размер по умолчанию: 24x24px 