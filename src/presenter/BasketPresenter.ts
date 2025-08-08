import { Modal } from "../components/Modal";
import { BasketModel } from "../model/BasketModel";
import { IBasketCard } from "../model/types";
import { IEvents } from "../shared/events";
import { BasketView } from "../view/BasketView";
import { CheckoutPresenter } from "./CheckoutPresenter";

export class BasketPresenter {
    protected _model: BasketModel;
    protected _view: BasketView;
    private _modal: Modal;
    private _checkoutPresenter: CheckoutPresenter;

    constructor(model: BasketModel, view: BasketView, private events: IEvents, checkoutPresenter: CheckoutPresenter) {
        this._model = model
        this._view = view
        this._checkoutPresenter = checkoutPresenter;

        const modalContainer = document.querySelector('.modal') as HTMLElement
        this._modal = new Modal(modalContainer, this.events)
    }

    init(): void {
        this.events.on('basket:add', this.handleAdd.bind(this))
        this.events.on('basket:remove', this.handleRemove.bind(this))
        this.events.on('basket:open', this.handleOpen.bind(this))
        this._view.onOrderClick(() => this.handleOrder())

        this._view.renderBasket(this._model.products);

    }

    handleAdd(data: IBasketCard) {
        try {
            this._model.addProduct(data);
            this._view.renderBasket(this._model.products);
        }
        catch (error) {
            console.warn(error);
        }
    }

    handleRemove(data: { id: string }) {
        this._model.removeProduct(data.id);
        this._view.renderBasket(this._model.products);
    }

    handleOpen() {
        this._view.renderBasket(this._model.products);

        this._modal.render({ content: this._view.container });
    }

    handleOrder() {
        this._checkoutPresenter.render();
    }
}