import { Modal } from "../components/Modal";
import { BasketModel } from "../model/BasketModel";
import { CheckoutModel } from "../model/CheckoutModel";
import { IBasketCard } from "../model/types";
import { EventEmitter, IEvents } from "../shared/events";
import { BasketView } from "../view/BasketView";
import { CheckoutView } from "../view/CheckoutView";
import { CheckoutPresenter } from "./CheckoutPresenter";

export class BasketPresenter {
    protected _model: BasketModel;
    protected _view: BasketView;
    private _modal: Modal;
    private _events: EventEmitter;
    private _basketTemplate: HTMLTemplateElement;

    constructor(model: BasketModel, view: BasketView, private events: EventEmitter, private checkoutModel: CheckoutModel) {
        this._model = model
        this._view = view
        this._events = events;

        this._basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;

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
        // Клонируем заново контейнер из шаблона
        const basketElement = this._basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

        // Пересоздаём View (важно: новый объект)
        this._view = new BasketView(basketElement, this._events);
        this._view.onOrderClick(() => this.handleOrder());
        this._view.renderBasket(this._model.products);

        // Открываем модалку с новой корзиной
        this._modal.render({ content: this._view.container });
    }

    handleOrder() {
        const checkoutView = new CheckoutView(this._view.container, this._events, this.checkoutModel);
        const checkoutPresenter = new CheckoutPresenter(checkoutView, this._events, this._model);
        checkoutPresenter.init();
    }
}