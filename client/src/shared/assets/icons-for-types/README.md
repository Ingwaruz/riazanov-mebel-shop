# SVG Иконки для типов товаров

Эта папка содержит иконки для различных типов товаров в интернет-магазине мебели.

## Структура

```
icons-for-types/
├── index.js          # Экспорт всех иконок типов
├── armchair.svg      # Кресла
├── bed.svg           # Кровати  
├── lamp.svg          # Аксессуары (лампы)
├── sofa.svg          # Диваны
├── stool.svg         # Стулья и табуреты
├── table.svg         # Столы
└── README.md         # Этот файл
```

## Соответствие типов товаров

- **armchair.svg** - для кресел
- **bed.svg** - для кроватей
- **lamp.svg** - для аксессуаров
- **sofa.svg** - для диванов
- **stool.svg** - для стульев и табуретов
- **table.svg** - для столов

## Использование

### Импорт иконок

```jsx
// Импорт конкретных иконок
import { 
    ArmchairIcon, 
    BedIcon, 
    LampIcon, 
    SofaIcon, 
    StoolIcon,
    TableIcon
} from '../shared/assets/icons-for-types';

// Использование в компоненте фильтра по типам
function ProductTypeFilter() {
    return (
        <div className="product-type-filter">
            <button>
                <img src={ArmchairIcon} alt="Кресла" />
                Кресла
            </button>
            <button>
                <img src={BedIcon} alt="Кровати" />
                Кровати
            </button>
            <button>
                <img src={LampIcon} alt="Аксессуары" />
                Аксессуары
            </button>
            <button>
                <img src={SofaIcon} alt="Диваны" />
                Диваны
            </button>
            <button>
                <img src={StoolIcon} alt="Стулья" />
                Стулья
            </button>
            <button>
                <img src={TableIcon} alt="Столы" />
                Столы
            </button>
        </div>
    );
}
```

### Как React компонент (рекомендуется)

```jsx
import { ReactComponent as Armchair } from '../shared/assets/icons-for-types/armchair.svg';
import { ReactComponent as Bed } from '../shared/assets/icons-for-types/bed.svg';
import { ReactComponent as Lamp } from '../shared/assets/icons-for-types/lamp.svg';
import { ReactComponent as Sofa } from '../shared/assets/icons-for-types/sofa.svg';
import { ReactComponent as Stool } from '../shared/assets/icons-for-types/stool.svg';
import { ReactComponent as Table } from '../shared/assets/icons-for-types/table.svg';

function ProductTypeFilter() {
    return (
        <div className="product-type-filter">
            <button className="type-button">
                <Armchair className="type-icon" />
                <span>Кресла</span>
            </button>
            <button className="type-button">
                <Bed className="type-icon" />
                <span>Кровати</span>
            </button>
            <button className="type-button">
                <Lamp className="type-icon" />
                <span>Аксессуары</span>
            </button>
            <button className="type-button">
                <Sofa className="type-icon" />
                <span>Диваны</span>
            </button>
            <button className="type-button">
                <Stool className="type-icon" />
                <span>Стулья</span>
            </button>
            <button className="type-button">
                <Table className="type-icon" />
                <span>Столы</span>
            </button>
        </div>
    );
}
```

### Стилизация иконок

```css
.type-icon {
    width: 32px;
    height: 32px;
    fill: #666;
    transition: fill 0.2s ease;
}

.type-button:hover .type-icon {
    fill: #007bff;
}

.type-button.active .type-icon {
    fill: #007bff;
}
```

## Примечания

- Все иконки взяты из SVG Repo и оптимизированы для использования в проекте
- Иконки поддерживают изменение цвета через CSS свойство `fill`
- Рекомендуемый размер для отображения: 24px-32px 