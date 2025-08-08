import { EventEmitter } from "../shared/events";
import { ensureElement } from "../shared/utils";

export class CheckoutView {
    private _container: HTMLElement;
    protected _checkoutOrderTemplate: HTMLTemplateElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        this._container = container;
        this._checkoutOrderTemplate = ensureElement<HTMLTemplateElement>('#order')

    }

    renderOrderForm() {
        const orderClone = this._checkoutOrderTemplate.content.cloneNode(true) as DocumentFragment
        const orderElement = orderClone.querySelector('.form') as HTMLFormElement

        const byCardButton = orderClone.querySelector('.button[name="card"]') as HTMLButtonElement;
        const byCashButton = orderClone.querySelector('.button[name="cash"]') as HTMLButtonElement;
        const deliveryAddressInput = orderClone.querySelector('input[name="address"]') as HTMLInputElement;
        const continuePaymentButton = orderClone.querySelector('.order__button') as HTMLButtonElement;

        console.log(byCardButton, byCashButton, deliveryAddressInput, continuePaymentButton);
        this._container.innerHTML = '';
        this._container.append(orderElement);

    }
}