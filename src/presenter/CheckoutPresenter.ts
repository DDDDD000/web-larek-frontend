import { CheckoutView } from "../view/CheckoutView";
import { IEvents, EventEmitter } from "../shared/events";
import { BasketModel } from "../model/BasketModel";
import { CheckoutModel } from "../model/CheckoutModel";
import { FinalMessageView } from "../view/FinalMessageView";
import { Modal } from "../components/Modal";
import { OrderAPI } from "../api/OrderApi";
import { API_URL } from "../shared/constants";


export class CheckoutPresenter {
    private modal!: Modal;

    constructor(
        private view: CheckoutView,
        private events: EventEmitter,
        private basketModel: BasketModel,
        private checkoutModel: CheckoutModel,
        private modalContainer: HTMLElement
    ) {
        this.events.on('checkout:order:input', this.onOrderInput.bind(this));
        this.events.on('checkout:order:submit', this.onOrderSubmit.bind(this));
        this.events.on('checkout:contacts:input', this.onContactsInput.bind(this));
        this.events.on('checkout:submit', this.onSubmit.bind(this));
        this.events.on('success:close', this.onSuccessClose.bind(this));
    }

    init() {
        this.view.renderOrderForm();
        this.modal = new Modal(this.modalContainer, this.events);
    }

    private onOrderInput(payload: { payment: string; address: string }) {
        const ok = Boolean(payload.payment && payload.address && payload.address.length > 0);
        this.view.setOrderNextEnabled(ok);
    }

    private onOrderSubmit(payload: { payment: string; address: string }) {
        const ok = Boolean(payload.payment && payload.address && payload.address.length > 0);
        if (!ok) {
            this.view.setOrderNextEnabled(false);
            return;
        }

        this.checkoutModel.saveClientData({
            payment: payload.payment as any,
            address: payload.address,
            email: '',
            phone: ''
        });


        this.view.renderContactForm();
    }

    private onContactsInput(payload: { email: string; phone: string }) {
        const ok = this.checkoutModel.validateContacts(payload);
        this.view.setContactSubmitEnabled(ok);
    }

    private onSubmit(payload: { email: string; phone: string }) {
        if (!this.checkoutModel.validateContacts(payload)) {
            this.view.setContactSubmitEnabled(false);
            return;
        }

        const prev = this.checkoutModel['client'] ?? { payment: '', address: '', email: '', phone: '' };
        this.checkoutModel.saveClientData({
            payment: prev.payment,
            address: prev.address,
            email: payload.email,
            phone: payload.phone
        });

        const total = this.basketModel.getTotalPrice();
        const items = this.basketModel.products.map(item => item.id);

        const orderApi = new OrderAPI(API_URL)

        orderApi.createOrder(prev.payment, prev.email, prev.phone, prev.address, total, items)
            .then(response => {
                console.log('Заказ успешно создан:', response);
                const finalContainer = document.createElement('div');
                const finalView = new FinalMessageView(finalContainer, this.events);
                const content = finalView.render({ total });

                this.modal.render({ content });

                if (typeof this.basketModel.clearBasket === 'function') {
                    this.basketModel.clearBasket();
                }
                this.events.emit('basket:changed');
            })
            .catch(error => {
                console.error('Ошибка при создании заказа:', error);
            });

    }

    private onSuccessClose() {
        this.modal.close();
    }
}
