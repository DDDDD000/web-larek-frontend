import { EventEmitter } from "../shared/events";
import { ensureElement } from "../shared/utils";

export class BasketView {
    private _list: HTMLElement;
    private _priceEl: HTMLElement;
    private _orderButton: HTMLButtonElement;
    private _container: HTMLElement;

    constructor(container: HTMLElement, private events: EventEmitter) {
        this._container = container;
        this._list = ensureElement<HTMLElement>('.basket__list', this._container);
        this._priceEl = ensureElement<HTMLElement>('.basket__price', this._container);
        this._orderButton = ensureElement<HTMLButtonElement>('.basket__button', this._container);
    }

    render(items: HTMLElement[]) {
        this._list.replaceChildren(...items);
    }

    setTotalPrice(value: number) {
        this._priceEl.textContent = `${value} синапсов`;
    }

    setOrderButtonState(enabled: boolean) {
        this._orderButton.disabled = !enabled;
    }

    onOrderClick(cb: () => void) {
        this._orderButton.addEventListener('click', cb);
    }

    get container(): HTMLElement {
        return this._container;
    }
}
