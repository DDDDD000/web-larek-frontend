import { Modal } from "../components/Modal";
import { BasketModel } from "../model/BasketModel";
import { ProductModel } from "../model/ProductModel";
import { IProduct } from "../model/types";
import { IEvents } from "../shared/events";
import { ProductView } from "../view/ProductView";

export class ProductPresenter {
    protected _model: ProductModel;
    protected _view: ProductView;
    private _modal: Modal;

    constructor(model: ProductModel, view: ProductView, private events: IEvents, private basketModel: BasketModel) {
        this._model = model;
        this._view = view;

        const modalContainer = document.querySelector('.modal') as HTMLElement;
        this._modal = new Modal(modalContainer, this.events)
    }
    init(): void {
        this._model.getProducts()
            .then(products => {
                this._view.renderCatalog(products),
                    this.events.on('product:open', this.handleOpenProduct.bind(this));
            })
    }

    handleOpenProduct({ product }: { product: IProduct }) {
        const isInBasket = this.basketContainsProduct(product.id);
        const content = this._view.showProductPreview(product, isInBasket);
        this._modal.render({ content })
    }

    basketContainsProduct(productId: string): boolean {
        return this.basketModel.products.some(item => item.id === productId);
    }
}