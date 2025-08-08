import { CheckoutView } from "../view/CheckoutView";

export class CheckoutPresenter {
    private view: CheckoutView;

    constructor(view: CheckoutView) {
        this.view = view;
    }

    render() {
        this.view.renderOrderForm();
    }
}
