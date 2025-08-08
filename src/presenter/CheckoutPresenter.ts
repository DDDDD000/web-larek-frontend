import { BasketModel } from "../model/BasketModel";
import { IEvents } from "../shared/events";
import { CheckoutView } from "../view/CheckoutView";

export class CheckoutPresenter {
    private model: BasketModel;
    constructor(private view: CheckoutView, private events: IEvents, model: BasketModel) {
        this.model = model;
        this.events.on('checkout:step2', this.handleStep2.bind(this));
        this.events.on('checkout:complete', this.handleComplete.bind(this));
    }

    init() {
        this.view.renderOrderForm();
    }

    handleStep2(data: { payment: string; address: string }) {
        console.log('Шаг 1 завершён:', data);
        this.view.renderContactForm();
    }

    handleComplete(data: { name: string; phone: string; email: string }) {
        console.log('Шаг 2 завершён:', data);

        const total = this.model.getTotalPrice(); // получаем сумму
        this.view.renderSuccessScreen(total);     // передаём в метод
    }
}
