import { IBasketCard } from "../model/types";
import { EventEmitter } from "../shared/events";
import { ensureElement } from "../shared/utils";

export class BasketView {
    private _container: HTMLElement;
    protected _basketList: HTMLElement;
    protected _basketPrice: HTMLElement;
    protected _basketOrderButton: HTMLButtonElement;
    protected _basketCardTemplate: HTMLTemplateElement;

    constructor(container: HTMLElement, private events: EventEmitter) {
        this._container = container;
        this._basketList = ensureElement<HTMLElement>('.basket__list', container)
        this._basketPrice = ensureElement<HTMLElement>('.basket__price', container)
        this._basketOrderButton = ensureElement<HTMLButtonElement>('.basket__button', container)
        this._basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket')
    }

    renderBasket(products: IBasketCard[]) {
        this._basketList.innerHTML = ''
        let total: number = 0;

        products.forEach((product) => {
            const item = this.createBasketItem(product)
            this._basketList.appendChild(item)
            total += product.price
        })
        this.totalPrice = total
    }

    createBasketItem(product: IBasketCard): HTMLElement {
        const cardClone = this._basketCardTemplate.content.cloneNode(true) as DocumentFragment
        const cardElement = cardClone.querySelector('.basket__item') as HTMLElement

        const cardTitle = cardClone.querySelector('.card__title')!;
        const cardPrice = cardClone.querySelector('.card__price')!;
        const cardDeleteButton = cardClone.querySelector('.basket__item-delete') as HTMLButtonElement

        cardTitle.textContent = product.title;
        cardPrice.textContent = `${product.price} синапсов`;

        cardDeleteButton.addEventListener('click', () => {
            this.events.emit('basket:remove', { id: product.id })
        })
        return cardElement
    }

    set totalPrice(value: number) {
        this._basketPrice.textContent = `${value} синапсов`;
    }

    onOrderClick(callBack: () => void) {
        this._basketOrderButton.addEventListener('click', callBack)
    }

    get container(): HTMLElement {
        return this._container;
    }

    updateBasketCounter(count: number) {
        const counter = document.querySelector('.header__basket-counter') as HTMLElement;
        if (counter) {
            counter.textContent = String(count);
        }
    }

    setOrderButtonState(enabled: boolean) {
        if (enabled) {
            this._basketOrderButton.removeAttribute('disabled');
        } else {
            this._basketOrderButton.setAttribute('disabled', '');
        }
    }
}