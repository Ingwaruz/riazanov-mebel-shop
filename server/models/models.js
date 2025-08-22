const sequelize = require('../db')
const {DataTypes} = require('sequelize')

// Описание таблиц базы данных

// Пользователь
const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    name: {type: DataTypes.STRING, allowNull: true},
    second_name: {type: DataTypes.STRING, allowNull: true},
    phone_number: {type: DataTypes.STRING, allowNull: true},
    email_verified: {type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false}
})

// Email верификация
const EmailVerification = sequelize.define('email_verification', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, allowNull: false},
    pin_code: {type: DataTypes.STRING(6), allowNull: false},
    expires_at: {type: DataTypes.DATE, allowNull: false}
}, {
    tableName: 'email_verifications',
    timestamps: false,
    underscored: true,
    indexes: [
        {
            fields: ['email']
        },
        {
            fields: ['expires_at']
        }
    ]
})

// Контакты
const Contact = sequelize.define('contact', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    type: {type: DataTypes.STRING, allowNull: false}, // phone, email, address, social, messenger
    value: {type: DataTypes.STRING, allowNull: false},
    label: {type: DataTypes.STRING, allowNull: false},
    is_active: {type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false},
    sort_order: {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false}
}, {
    tableName: 'contacts',
    underscored: true,
    indexes: [
        {
            fields: ['type']
        },
        {
            fields: ['is_active']
        },
        {
            fields: ['sort_order']
        }
    ]
})

// Контентные страницы
const ContentPage = sequelize.define('content_page', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    page_key: {type: DataTypes.STRING, unique: true, allowNull: false}, // about_us, delivery, payment, etc.
    title: {type: DataTypes.STRING, allowNull: false},
    content: {type: DataTypes.TEXT, allowNull: false},
    meta_title: {type: DataTypes.STRING, allowNull: true},
    meta_description: {type: DataTypes.TEXT, allowNull: true},
    is_active: {type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false}
}, {
    tableName: 'content_pages',
    underscored: true,
    indexes: [
        {
            fields: ['page_key']
        },
        {
            fields: ['is_active']
        }
    ]
})

// Заказы
const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    order_number: {type: DataTypes.STRING(20), allowNull: false, unique: true},
    user_id: {type: DataTypes.INTEGER, allowNull: true},
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false
    },
    total_amount: {type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0},
    shipping_amount: {type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0},
    customer_name: {type: DataTypes.STRING(255), allowNull: false},
    customer_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { isEmail: true }
    },
    customer_phone: {type: DataTypes.STRING(20), allowNull: false},
    shipping_address: {type: DataTypes.TEXT, allowNull: false},
    shipping_city: {type: DataTypes.STRING(100), allowNull: false},
    shipping_postal_code: {type: DataTypes.STRING(20), allowNull: true},
    payment_method: {
        type: DataTypes.ENUM('cash', 'card', 'bank_transfer'),
        allowNull: false
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        defaultValue: 'pending',
        allowNull: false
    },
    notes: {type: DataTypes.TEXT, allowNull: true}
}, {
    tableName: 'orders',
    underscored: true
})

// Элементы заказа
const OrderItem = sequelize.define('order_item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    order_id: {type: DataTypes.INTEGER, allowNull: false},
    product_id: {type: DataTypes.INTEGER, allowNull: false},
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: { min: 1 }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 }
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 }
    }
}, {
    tableName: 'order_items',
    underscored: true
})

// Статические методы для Order
Order.generateOrderNumber = function() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${year}${month}${day}-${random}`;
};

// Методы экземпляра для Order
Order.prototype.calculateTotal = async function() {
    const items = await this.getOrderItems();
    const itemsTotal = items.reduce((sum, item) => {
        return sum + (parseFloat(item.price) - parseFloat(item.discount)) * item.quantity;
    }, 0);
    
    this.total_amount = itemsTotal + parseFloat(this.shipping_amount);
    await this.save();
    return this.total_amount;
};

// Методы экземпляра для OrderItem
OrderItem.prototype.getSubtotal = function() {
    return (parseFloat(this.price) - parseFloat(this.discount)) * this.quantity;
};

// Корзина покупателя
const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

// Связующая таблица между товарами и корзиной во избежание дублирования данных
const BasketProduct = sequelize.define('basket_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

// Товар
const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    min_price: {type: DataTypes.INTEGER, allowNull: true},
    width: {type: DataTypes.INTEGER, allowNull: false},
    depth: {type: DataTypes.INTEGER, allowNull: false},
    height: {type: DataTypes.INTEGER, allowNull: false},
    description: {type: DataTypes.TEXT},
})

// Тип товара 
const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const Subtype = sequelize.define('subtype', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

// Фабрика
const Factory = sequelize.define('factory', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

// Дополнительная информация по товару
const ProductInfo = sequelize.define('product_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    value: {type: DataTypes.STRING, allowNull: false},
    featureId: {type: DataTypes.INTEGER, allowNull: false},
})

const Color = sequelize.define('color', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const Material = sequelize.define('material', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const MaterialToType = sequelize.define('material_to_type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Image = sequelize.define('image', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    img: {type: DataTypes.STRING, allowNull: false},
    order: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0}
})

const Collection = sequelize.define('collection', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const MaterialCategory = sequelize.define('material_category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    multiplier: {type: DataTypes.FLOAT, allowNull: false}
})

const Feature = sequelize.define('feature', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false}
})

const FeatureToTypeFactory = sequelize.define('feature_to_type_factory', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    featureId: {type: DataTypes.INTEGER, allowNull: false},
    typeId: {type: DataTypes.INTEGER, allowNull: false},
    factoryId: {type: DataTypes.INTEGER, allowNull: false}
}, {
    indexes: [
        // Добавляем составной уникальный индекс
        {
            unique: true,
            fields: ['featureId', 'typeId', 'factoryId']
        }
    ]
})

// Связующие таблицы

// Временная связующая таблица между типом товара и фабрикой
const TypeToFactory = sequelize.define('type_to_factory', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

// Временная связующая таблица между материалом и цветом
const ColorToMaterial = sequelize.define('color_to_material', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

// Временная связующая таблица между категорией материала и фабрикой
const MaterialCategoryToMaterial = sequelize.define('material_category_to_material', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const MaterialCategoryToFactory = sequelize.define('material_category_to_factory', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const CollectionToType = sequelize.define('collection_to_type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

// Описание связей между таблицами

// User
User.hasOne(Basket, {foreignKey: { allowNull: false }});
Basket.belongsTo(User, {foreignKey: { allowNull: false }});
User.hasMany(Order, {foreignKey: 'user_id'});
Order.belongsTo(User, {foreignKey: 'user_id'});

// Basket
Basket.hasMany(BasketProduct, {foreignKey: { allowNull: false }});
BasketProduct.belongsTo(Basket, {foreignKey: { allowNull: false }});

// Order
Order.hasMany(OrderItem, {
    as: 'orderItems',
    foreignKey: 'order_id'
});
OrderItem.belongsTo(Order, {foreignKey: 'order_id'});

// OrderItem и Product
Product.hasMany(OrderItem, {foreignKey: 'product_id'});
OrderItem.belongsTo(Product, {
    as: 'product',
    foreignKey: 'product_id'
});

// Type
Type.hasMany(Product, {foreignKey: { allowNull: false }});
Type.hasMany(Subtype, {foreignKey: { allowNull: false }});
Type.hasOne(MaterialToType, {foreignKey: { allowNull: false }});
Product.belongsTo(Type, {foreignKey: { allowNull: false }});
Subtype.belongsTo(Type, {foreignKey: { allowNull: false }});
MaterialToType.belongsTo(Type, {foreignKey: { allowNull: false }});

// Factory
Factory.hasMany(Product, {foreignKey: { allowNull: false }});
Factory.hasMany(Collection, {foreignKey: { allowNull: false }});
Product.belongsTo(Factory, {foreignKey: { allowNull: false }});
Collection.belongsTo(Factory, {foreignKey: { allowNull: false }});

// Product
Product.hasMany(BasketProduct, {foreignKey: { allowNull: false }});
Product.hasMany(Image, { 
    as: 'images',
    foreignKey: 'productId'
});
Product.hasMany(ProductInfo, {as: 'product_infos', foreignKey: 'productId'});
Product.belongsTo(Collection, {as: 'collection', foreignKey: 'collectionId'});
BasketProduct.belongsTo(Product, { foreignKey: { allowNull: false }});
Image.belongsTo(Product, {
    foreignKey: 'productId'
});
ProductInfo.belongsTo(Product, {foreignKey: 'productId'});
Collection.hasMany(Product, {foreignKey: 'collectionId'});

// Material
Material.hasMany(MaterialToType, { foreignKey: { allowNull: false }});
MaterialToType.belongsTo(Material, { foreignKey: { allowNull: false }});

// Feature
Feature.hasMany(FeatureToTypeFactory);
FeatureToTypeFactory.belongsTo(Feature);

Type.hasMany(FeatureToTypeFactory);
FeatureToTypeFactory.belongsTo(Type);

Factory.hasMany(FeatureToTypeFactory);
FeatureToTypeFactory.belongsTo(Factory);

// Промежуточные таблицы
Type.belongsToMany(Factory, {through: 'type_to_factory'});
Factory.belongsToMany(Type, {through: 'type_to_factory'});

Color.belongsToMany(Material, {through: 'color_to_material'});
Material.belongsToMany(Color, {through: 'color_to_material'});

Material.belongsToMany(MaterialCategory, {through: 'material_category_to_material'});
MaterialCategory.belongsToMany(Material, {through: 'material_category_to_material'});

MaterialCategory.belongsToMany(Factory, {through: 'material_category_to_factory'});
Factory.belongsToMany(MaterialCategory, {through: 'material_category_to_factory'});

Type.belongsToMany(Collection, {through: 'collection_to_type'});
Collection.belongsToMany(Type, {through: 'collection_to_type'});

ProductInfo.belongsTo(Feature, { foreignKey: 'featureId' });
Feature.hasMany(ProductInfo, { foreignKey: 'featureId' });

// Добавляем связь с Subtype
Product.belongsTo(Subtype, { foreignKey: 'subtypeId' });
Subtype.hasMany(Product, { foreignKey: 'subtypeId' });

module.exports = {
    User, 
    Basket, 
    BasketProduct,
    Product,
    Type,
    Subtype,
    Factory,
    ProductInfo,
    Color,
    Material,
    MaterialToType,
    Image,
    Collection,
    MaterialCategory,
    Feature,
    FeatureToTypeFactory,
    EmailVerification,
    Contact,
    ContentPage,
    // Промежуточные таблицы
    TypeToFactory,
    ColorToMaterial,
    MaterialCategoryToMaterial,
    MaterialCategoryToFactory,
    CollectionToType,
    Order,
    OrderItem
}