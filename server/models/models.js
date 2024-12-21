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
})

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
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
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
    file: {type: DataTypes.STRING, allowNull: false}
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

// ����писание связей между таблицами

// User
User.hasOne(Basket, {foreignKey: { allowNull: false }});
Basket.belongsTo(User, {foreignKey: { allowNull: false }});

// Basket
Basket.hasMany(BasketProduct, {foreignKey: { allowNull: false }});
BasketProduct.belongsTo(Basket, {foreignKey: { allowNull: false }});

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
Product.hasMany(Image, {foreignKey: { allowNull: false }});
Product.hasMany(ProductInfo, {as: 'product_infos', foreignKey: 'productId'});
Product.belongsTo(Collection, {as: 'collection', foreignKey: 'collectionId'});
BasketProduct.belongsTo(Product, { foreignKey: { allowNull: false }});
Image.belongsTo(Product, { foreignKey: { allowNull: false }});
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

ProductInfo.belongsTo(Feature);
Feature.hasMany(ProductInfo);

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
    // Промежуточные таблицы
    TypeToFactory,
    ColorToMaterial,
    MaterialCategoryToMaterial,
    MaterialCategoryToFactory,
    CollectionToType
}