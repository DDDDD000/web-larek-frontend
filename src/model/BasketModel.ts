import { IBasketCard } from "./types"

export class BasketModel {
    protected _products: IBasketCard[];

    constructor() {
        this._products = []
    }

    addProduct(product: IBasketCard) {
        const exists = this._products.some(p => p.id === product.id);
        if (!exists) {
            this._products.push(product)
        }
        else {
            throw new Error('Товар уже в корзине')
        }
    }

    removeProduct(productId: string) {
        this._products = this._products.filter(product => product.id !== productId)
    }

    getTotalPrice(): number {
        return this._products.reduce((sum, product) => sum + product.price, 0)
    }

    get products(): IBasketCard[] {
        return this._products
    }

    clearBasket() {
        this._products = [];
    }
}