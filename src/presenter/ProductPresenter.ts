import { ProductModel } from "../model/ProductModel";
import { ProductView } from "../view/ProductView";
import { MainPageView } from "../view/MainPageView";
import { EventEmitter } from "../shared/events";
import { BasketModel } from "../model/BasketModel";
import { Modal } from "../components/Modal";

export class ProductPresenter {
    private modal: Modal;

    constructor(
        private model: ProductModel,
        private productView: ProductView,
        private mainView: MainPageView,
        private events: EventEmitter,
        private basketModel: BasketModel,
        private modalContainer: HTMLElement
    ) {
        this.modal = new Modal(this.modalContainer, this.events);
    }

    async init() {
        const products = await this.model.getProducts();

        const cardElements = products.map(p => this.productView.createCard(p));
        this.mainView.render(cardElements);

        this.events.on('product:open', (payload: { product: any }) => {
            this.handleOpenProduct(payload.product);
        });
    }

    private handleOpenProduct(product: any) {
        const isInBasket = this.basketModel.products.some(item => item.id === product.id);
        const preview = this.productView.showProductPreview(product, isInBasket);
        this.modal.render({ content: preview });
    }
}
