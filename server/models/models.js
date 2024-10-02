const sequelize = require('../db')
const {DataTypes} = require('sequelize')

// Описание таблиц базы данных

// Пользователь
const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    name: {type: DataTypes.STRING, allowNull: true}, //allowNull: false
    second_name: {type: DataTypes.STRING, allowNull: true}, //allowNull: false
    phone_number: {type: DataTypes.STRING, allowNull: true}, //allowNull: false
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
    width: {type: DataTypes.INTEGER, allowNull: true}, //allowNull: false
    depth: {type: DataTypes.INTEGER, allowNull: true}, //allowNull: false
    height: {type: DataTypes.INTEGER, allowNull: true}, //allowNull: false
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
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const FeaturesToTypeToFactory = sequelize.define('features_to_type_to_factory', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
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

// Basket
Basket.hasMany(BasketProduct, {foreignKey: { allowNull: false }});
BasketProduct.belongsTo(Basket, {foreignKey: { allowNull: false }});

// Type
Type.hasMany(Product, {foreignKey: { allowNull: false }});
Type.hasOne(MaterialToType, {foreignKey: { allowNull: false }});
Type.hasOne(FeaturesToTypeToFactory, {foreignKey: { allowNull: false }});
Product.belongsTo(Type, {foreignKey: { allowNull: false }});
MaterialToType.belongsTo(Type, {foreignKey: { allowNull: false }});
FeaturesToTypeToFactory.belongsTo(Type, {foreignKey: { allowNull: false }});

// Factory
Factory.hasMany(Product, {foreignKey: { allowNull: false }});
Factory.hasMany(Collection, {foreignKey: { allowNull: false }});
Factory.hasOne(FeaturesToTypeToFactory, {foreignKey: { allowNull: false }});
Product.belongsTo(Factory, {foreignKey: { allowNull: false }});
Collection.belongsTo(Factory, {foreignKey: { allowNull: false }});
FeaturesToTypeToFactory.belongsTo(Factory, {foreignKey: { allowNull: false }});

// Product
Product.hasMany(BasketProduct, {foreignKey: { allowNull: false }});
Product.hasMany(Image, {foreignKey: { allowNull: false }});
BasketProduct.belongsTo(Product, { foreignKey: { allowNull: false }});
Image.belongsTo(Product, { foreignKey: { allowNull: false }});

Material.hasMany(MaterialToType, { foreignKey: { allowNull: false }});
MaterialToType.belongsTo(Material, { foreignKey: { allowNull: false }});

Feature.hasMany(FeaturesToTypeToFactory, { foreignKey: { allowNull: false }});
FeaturesToTypeToFactory.belongsTo(Feature, { foreignKey: { allowNull: false }});

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

// 21 таблица
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
    MaterialToType,
    Image,
    Collection,
    MaterialCategory,
    Feature,
    FeaturesToTypeToFactory,
    // Промежуточные таблицы
    TypeToFactory,
    ColorToMaterial,
    MaterialCategoryToMaterial,
    MaterialCategoryToFactory,
    CollectionToType
}