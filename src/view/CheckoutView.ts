import { CheckoutModel } from "../model/CheckoutModel";
import { EventEmitter } from "../shared/events";
import { ensureElement } from "../shared/utils";

export class CheckoutView {
    private _container: HTMLElement;
    protected _checkoutOrderTemplate: HTMLTemplateElement;
    private _formElement: HTMLFormElement;
    protected _contactTemplate: HTMLTemplateElement;

    constructor(container: HTMLElement, private events: EventEmitter, private model: CheckoutModel) {
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

        continueButton.disabled = true;

        let selectedPayment: 'card' | 'cash' | '' = '';

        const updateButtonState = () => {
            const addressFilled = addressInput.value.trim().length > 0;
            const paymentSelected = selectedPayment !== '';
            continueButton.disabled = !(addressFilled && paymentSelected);
        };

        byCardButton.addEventListener('click', () => {
            selectedPayment = 'card';
            byCardButton.classList.add('button_alt-active');
            byCashButton.classList.remove('button_alt-active');
            updateButtonState();
        });

        byCashButton.addEventListener('click', () => {
            selectedPayment = 'cash';
            byCashButton.classList.add('button_alt-active');
            byCardButton.classList.remove('button_alt-active');
            updateButtonState();
        });

        addressInput.addEventListener('input', updateButtonState);

        continueButton.addEventListener('click', (event) => {
            event.preventDefault()
            if (!selectedPayment || !addressInput.value.trim()) {
                return;
            }

            this.events.emit('checkout:step2', {
                payment: selectedPayment,
                address: addressInput.value.trim()
            });
        });

        this._container.innerHTML = '';
        this._container.appendChild(this._formElement);
    }

    renderContactForm() {
        const contactClone = this._contactTemplate.content.cloneNode(true) as DocumentFragment;
        this._formElement = contactClone.querySelector('.form') as HTMLFormElement;

        const emailInput = this._formElement.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneInput = this._formElement.querySelector('input[name="phone"]') as HTMLInputElement;
        const submitButton = this._formElement.querySelector('button[type="submit"]') as HTMLButtonElement;

        const updateButtonState = () => {
            const data = {
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim()
            };

            submitButton.disabled = !this.model.validateContacts(data);
        };

        emailInput.addEventListener('input', updateButtonState);
        phoneInput.addEventListener('input', updateButtonState);

        this._formElement.addEventListener('submit', (event) => {
            event.preventDefault();

            const data = {
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim()
            };

            if (!this.model.validateContacts(data)) {
                alert('Введите корректные Email и номер телефона');
                return;
            }

            this.events.emit('checkout:complete', {
                name: '', 
                ...data
            });
        });

        submitButton.disabled = true; 
        this._container.innerHTML = '';
        this._container.appendChild(this._formElement);
    }


    renderSuccessScreen(total: number) {
        const template = document.querySelector('#success') as HTMLTemplateElement;
        const clone = template.content.cloneNode(true) as DocumentFragment;

        const description = clone.querySelector('.order-success__description') as HTMLElement;
        const closeButton = clone.querySelector('.order-success__close') as HTMLButtonElement;

        description.textContent = `Списано ${total} синапсов`;

        this._container.innerHTML = '';
        this._container.appendChild(clone);

        closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }
}
