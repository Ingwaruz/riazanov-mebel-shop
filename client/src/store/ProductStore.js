import {makeAutoObservable} from "mobx";

export default class ProductStore {
    constructor() {
        this._types = []
        this._factories = []
        this._products = []
        this._selectedType = {}
        this._selectedFactory = {}
        this._page = 1
        this._totalCount = 0
        this._limit = 6
        makeAutoObservable(this)
    }

    setTypes(types) {
        this._types = types
    }
    setFactories(factories) {
        this._factories= factories
    }
    setProducts(products) {
        this._products = products
    }
    setSelectedType(type) {
        this._selectedType = type
    }
    setSelectedFactory(factory) {
        this._selectedFactory = factory
    }

    setPage(page) {
        this._page = page
    }

    setTotalCount(count) {
        this._totalCount = count
    }

    get types() {
        return this._types
    }
    get factories() {
        return this._factories
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