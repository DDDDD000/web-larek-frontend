import { EventEmitter } from "../shared/events";
import { ensureElement } from "../shared/utils";

export class CheckoutView {
    private _container: HTMLElement;
    protected _checkoutOrderTemplate: HTMLTemplateElement;
    protected _contactTemplate: HTMLTemplateElement;
    private _formElement!: HTMLFormElement;

    constructor(container: HTMLElement, private events: EventEmitter) {
        this._container = container;
        this._checkoutOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
        this._contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
    }

    renderOrderForm() {
        const orderClone = this._checkoutOrderTemplate.content.cloneNode(true) as DocumentFragment;
        this._formElement = orderClone.querySelector('.form') as HTMLFormElement;

        const byCardButton = this._formElement.querySelector('.button[name="card"]') as HTMLButtonElement;
        const byCashButton = this._formElement.querySelector('.button[name="cash"]') as HTMLButtonElement;
        const addressInput = this._formElement.querySelector('input[name="address"]') as HTMLInputElement;
        const continueButton = this._formElement.querySelector('.order__button') as HTMLButtonElement;

        this.setOrderNextEnabled(false);

        let selectedPayment: 'card' | 'cash' | '' = '';

        const emitOrderInput = () => {
            this.events.emit('checkout:order:input', {
                payment: selectedPayment,
                address: addressInput.value.trim()
            });
        };

        byCardButton.addEventListener('click', () => {
            selectedPayment = 'card';
            byCardButton.classList.add('button_alt-active');
            byCashButton.classList.remove('button_alt-active');
            emitOrderInput();
        });

        byCashButton.addEventListener('click', () => {
            selectedPayment = 'cash';
            byCashButton.classList.add('button_alt-active');
            byCardButton.classList.remove('button_alt-active');
            emitOrderInput();
        });

        addressInput.addEventListener('input', emitOrderInput);

        this._formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('checkout:order:submit', {
                payment: selectedPayment,
                address: addressInput.value.trim()
            });
        });

        this._container.innerHTML = '';
        this._container.appendChild(this._formElement);
    }

    setOrderNextEnabled(enabled: boolean) {
        try {
            const btn = this._formElement.querySelector('.order__button') as HTMLButtonElement;
            if (btn) btn.disabled = !enabled;
        } catch (e) { }
    }

    renderContactForm() {
        const contactClone = this._contactTemplate.content.cloneNode(true) as DocumentFragment;
        this._formElement = contactClone.querySelector('.form') as HTMLFormElement;

        const emailInput = this._formElement.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneInput = this._formElement.querySelector('input[name="phone"]') as HTMLInputElement;
        const submitButton = this._formElement.querySelector('button[type="submit"]') as HTMLButtonElement;

        submitButton.disabled = true;

        const emitInput = () => {
            this.events.emit('checkout:contacts:input', {
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim()
            });
        };

        emailInput.addEventListener('input', emitInput);
        phoneInput.addEventListener('input', emitInput);

        this._formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('checkout:submit', {
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim()
            });
        });

        this._container.innerHTML = '';
        this._container.appendChild(this._formElement);
    }

    setContactSubmitEnabled(enabled: boolean) {
        try {
            const btn = this._formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (btn) btn.disabled = !enabled;
        } catch (e) { }
    }
}
