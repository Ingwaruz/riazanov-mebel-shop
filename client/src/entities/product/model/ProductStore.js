import {makeAutoObservable} from "mobx";

export default class ProductStore {
    constructor() {
        this._types = []
        this._factories = []
        this._collections = []
        this._products = []
        this._selectedType = {}
        this._selectedFactory = {}
        this._selectedCollection = {}
        this._page = 1
        this._totalCount = 0
        this._limit = 20
        makeAutoObservable(this)
    }

    setTypes(types) {
        this._types = types
    }

    setFactories(factories) {
        this._factories = factories
    }

    setCollections(collections) {
        this._collections = collections
    }

    setProducts(products) {
        this._products = products
    }

    setSelectedType(type) {
        this.setPage(1)  // Сброс страницы при выборе типа
        this._selectedType = type
    }

    setSelectedFactory(factory) {
        this.setPage(1)  // Сброс страницы при выборе фабрики
        this._selectedFactory = factory
    }

    setSelectedCollection(collection) {
        this.setPage(1)  // Сброс страницы при выборе коллекции
        this._selectedCollection = collection
    }

    setPage(page) {
        this._page = page
    }

    setTotalCount(count) {
        this._totalCount = count
    }

    resetFilters() {
        this.setSelectedType({})
        this.setSelectedFactory({})
        // this.setSelectedCollection({})
        this.setPage(1)
    }

    get types() {
        return this._types
    }

    get factories() {
        return this._factories
    }

    get collections() {
        return this._collections
    }

    get products() {
        return this._products
    }

    get selectedType() {
        return this._selectedType
    }

    get selectedFactory() {
        return this._selectedFactory
    }

    get selectedCollection() {
        return this._selectedCollection
    }

    get totalCount() {
        return this._totalCount
    }

    get page() {
        return this._page
    }

    get limit() {
        return this._limit
    }
} 