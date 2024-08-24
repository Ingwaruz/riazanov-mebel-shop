import {makeAutoObservable} from "mobx";

export default class ProductStore {
    constructor() {
        this._types = [
            {id: 1, name: 'Диваны'},
            {id: 2, name: 'Кровати'}
        ]
        this._factories = [
            {id: 1, name: 'Ardoni'},
            {id: 2, name: 'Мелодия сна'}
        ]
        this._products = [
            {id: 1, name: 'Люфтен', price: 15000, img: 'https://thefurny.eu/upload/iblock/096/09675713a87bbdd4919393cd839a7457.jpg'},
            {id: 2, name: 'Лондон', price: 25000, img: 'https://thefurny.eu/upload/iblock/096/09675713a87bbdd4919393cd839a7457.jpg'},
            {id: 3, name: 'Авокадо', price: 35000, img: 'https://thefurny.eu/upload/iblock/096/09675713a87bbdd4919393cd839a7457.jpg'},
            {id: 4, name: 'Валенсия', price: 45000, img: 'https://thefurny.eu/upload/iblock/096/09675713a87bbdd4919393cd839a7457.jpg'},
            {id: 5, name: 'Фаби', price: 55000, img: 'https://thefurny.eu/upload/iblock/096/09675713a87bbdd4919393cd839a7457.jpg'},
            {id: 6, name: 'Дэнвер', price: 65000, img: 'https://thefurny.eu/upload/iblock/096/09675713a87bbdd4919393cd839a7457.jpg'},
        ]
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

    get types() {
        return this._types
    }
    get factories() {
        return this._factories
    }
    get products() {
        return this._products
    }
}