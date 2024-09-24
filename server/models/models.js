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
    phone_number: {type: DataTypes.INTEGER, allowNull: true},
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
})

// Тип товара 
const Type = sequelize.define('type', {
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
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

const Color = sequelize.define('color', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const Material = sequelize.define('material', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const MaterialsToType = sequelize.define('materials_to_Type', {
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
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const FeaturesTypeFactory = sequelize.define('features_type_factory', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

// Связующие таблицы

// Временная связующая таблица между типом товара и фабрикой
const TypeFactory = sequelize.define('type_factory', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

// Временная связующая таблица между материалом и цветом
const ColorMaterial = sequelize.define('color_material', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

// Временная связующая таблица между категорией материала и фабрикой
const MaterialCategoryFactory = sequelize.define('material_category_factory', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

// Описание связей между таблицами

// User
User.hasOne(Basket, {foreignKey: { allowNull: true }});
Basket.belongsTo(User, {foreignKey: { allowNull: true }});

// Basket
Basket.hasMany(BasketProduct, {foreignKey: { allowNull: true }});
BasketProduct.belongsTo(Basket, {foreignKey: { allowNull: true }});

// Type
Type.hasMany(Product, {foreignKey: { allowNull: true }});
Type.hasMany(Collection, {foreignKey: { allowNull: true }});
Type.hasOne(MaterialsToType, {foreignKey: { allowNull: true }});
Type.hasOne(FeaturesTypeFactory, {foreignKey: { allowNull: true }});
Product.belongsTo(Type, {foreignKey: { allowNull: true }});
Collection.belongsTo(Type, {foreignKey: { allowNull: true }});
MaterialsToType.belongsTo(Type, {foreignKey: { allowNull: true }});
FeaturesTypeFactory.belongsTo(Type, {foreignKey: { allowNull: true }});

// Factory
Factory.hasMany(Product, {foreignKey: { allowNull: true }});
Factory.hasMany(Collection, {foreignKey: { allowNull: true }});
Factory.hasOne(FeaturesTypeFactory, {foreignKey: { allowNull: true }});
Product.belongsTo(Factory, {foreignKey: { allowNull: true }});
Collection.belongsTo(Factory, {foreignKey: { allowNull: true }});
FeaturesTypeFactory.belongsTo(Factory, {foreignKey: { allowNull: true }});

// Product
Product.hasMany(BasketProduct, {foreignKey: { allowNull: true }});
Product.hasMany(Image, {foreignKey: { allowNull: true }});
BasketProduct.belongsTo(Product, { foreignKey: { allowNull: true }});
Image.belongsTo(Product, { foreignKey: { allowNull: true }});

MaterialsToType.hasMany(Material);
Material.belongsTo(MaterialsToType);

FeaturesTypeFactory.hasMany(Feature)
Feature.belongsTo(FeaturesTypeFactory)

// Промежуточные таблицы
Type.belongsToMany(Factory, {through: 'TypeFactory'});
Factory.belongsToMany(Type, {through: 'TypeFactory'});

Color.belongsToMany(Material, {through: 'ColorMaterial'});
Material.belongsToMany(Color, {through: 'ColorMaterial'});

MaterialCategory.belongsToMany(Material, {through: 'MaterialCategoryFactory'});
Factory.belongsToMany(Type, {through: 'MaterialCategoryFactory'});

module.exports = {
    User, 
    Basket, 
    BasketProduct,
    Product,
    Type,
    Factory,
    ProductInfo,
    Color,
    Material,
    MaterialsToType,
    Image,
    Collection,
    MaterialCategory,
    Feature,
    FeaturesTypeFactory,
    // Промежуточные таблицы
    TypeFactory,
    ColorMaterial,
    MaterialCategoryFactory
}