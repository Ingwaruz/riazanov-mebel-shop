import { makeAutoObservable } from "mobx";

class BasketStore {
    items = [];
    
    constructor() {
        makeAutoObservable(this);
        this.loadFromLocalStorage();
    }
    
    loadFromLocalStorage() {
        try {
            const storedItems = localStorage.getItem('basketItems');
            if (storedItems) {
                this.items = JSON.parse(storedItems);
            }
        } catch (error) {
            console.error('Ошибка при загрузке корзины из LocalStorage:', error);
        }
    }
    
    saveToLocalStorage() {
        try {
            localStorage.setItem('basketItems', JSON.stringify(this.items));
        } catch (error) {
            console.error('Ошибка при сохранении корзины в LocalStorage:', error);
        }
    }
    
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.images && product.images.length > 0 ? product.images[0].img : null,
                quantity: quantity
            });
        }
        
        this.saveToLocalStorage();
    }
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToLocalStorage();
    }
    
    changeQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveToLocalStorage();
        }
    }
    
    clearBasket() {
        this.items = [];
        this.saveToLocalStorage();
    }
    
    get totalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    get totalPrice() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
}

export default BasketStore; 