import { BasketModel } from "../model/BasketModel";
import { EventEmitter } from "../shared/events";
import { BasketView } from "../view/BasketView";
import { CheckoutView } from "../view/CheckoutView";
import { CheckoutPresenter } from "./CheckoutPresenter";
import { CheckoutModel } from "../model/CheckoutModel";
import { Modal } from "../components/Modal";

export class BasketPresenter {
    constructor(
        private model: BasketModel,
        private events: EventEmitter,
        private modalContainer: HTMLElement,
        private cardBasketTemplate: HTMLTemplateElement,
        private basketTemplate: HTMLTemplateElement,
        private checkoutModel: CheckoutModel,
        private mainPageView: any
    ) {
        this.events.on('basket:add', this.handleAdd.bind(this));
        this.events.on('basket:remove', this.handleRemove.bind(this));
        this.events.on('basket:changed', () => {
            this.updateCounter();
            if (this.modalContainer.querySelector('.basket')) {
                this.renderBasket();
            }
        });
    }

    init() {
        this.updateCounter();
    }

    private updateCounter() {
        this.mainPageView.setCounter(this.model.products.length);
    }

    private handleAdd(data: { id: string; title: string; price: number }) {
        try {
            this.model.addProduct(data);
            this.events.emit('basket:changed');
        } catch (e) {
            console.warn(e);
        }
    }

    private handleRemove(payload: { id: string }) {
        this.model.removeProduct(payload.id);
        this.events.emit('basket:changed');
    }

    open() {
        this.renderBasket();
    }

    private renderBasket() {
        const basketElement = this.basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const basketView = new BasketView(basketElement, this.events);

        const items = this.model.products.map((p, index) => {
            const clone = this.cardBasketTemplate.content.cloneNode(true) as DocumentFragment;
            const itemEl = clone.querySelector('.basket__item') as HTMLElement;
            const title = clone.querySelector('.card__title') as HTMLElement;
            const price = clone.querySelector('.card__price') as HTMLElement;
            const deleteBtn = clone.querySelector('.basket__item-delete') as HTMLButtonElement;
            const indexEl = clone.querySelector('.basket__item-index') as HTMLElement;

            title.textContent = p.title;
            price.textContent = `${p.price} синапсов`;

            if (indexEl) indexEl.textContent = String(index + 1);

            deleteBtn.addEventListener('click', () => {
                this.events.emit('basket:remove', { id: p.id });
            });

            return itemEl;
        });

        basketView.render(items);
        basketView.setTotalPrice(this.model.getTotalPrice());
        basketView.setOrderButtonState(this.model.products.length > 0);

        basketView.onOrderClick(() => {
            const checkoutView = new CheckoutView(basketView.container, this.events);
            const checkoutPresenter = new CheckoutPresenter(checkoutView, this.events, this.model, this.checkoutModel, this.modalContainer);
            checkoutPresenter.init();
        });

        const modal = new Modal(this.modalContainer, this.events);
        modal.render({ content: basketView.container });
    }

}
