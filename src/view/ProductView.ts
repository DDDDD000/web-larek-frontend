import { Modal } from "../components/Modal";
import { IProduct } from "../model/types";
import { CDN_URL } from "../shared/constants";
import { EventEmitter } from "../shared/events";
import { ensureElement } from "../shared/utils";

export class ProductView {
    protected _list: HTMLElement;
    protected _cardCatalogTemplate: HTMLTemplateElement;
    protected _cardPreviewTemplate: HTMLTemplateElement;

    constructor(placeContainer: HTMLElement, private events: EventEmitter) {
        this._list = placeContainer
        this._cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
        this._cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
    }

    // Отрисовка карточек на главной
    renderCatalog(products: IProduct[]) {
        this._list.innerHTML = ''

        products.forEach(cardData => {
            const product = this.createCardElement(cardData);
            this._list.appendChild(product)
        })
    }

    // Создание DOM-элемента карточки в каталоге
    private createCardElement(product: IProduct): HTMLElement {
        const cardClone = this._cardCatalogTemplate.content.cloneNode(true) as DocumentFragment;
        const cardElement = cardClone.querySelector('.gallery__item') as HTMLElement;

        const cardTitle = cardClone.querySelector('.card__title') as HTMLElement;
        const cardImage = cardClone.querySelector('.card__image') as HTMLImageElement;
        const cardCategory = cardClone.querySelector('.card__category') as HTMLElement;
        const cardPrice = cardClone.querySelector('.card__price') as HTMLElement;

        cardTitle.textContent = product.title;
        cardImage.src = `${CDN_URL}${product.image}`;
        cardCategory.textContent = product.category;
        cardPrice.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';

        cardElement.addEventListener('click', () => {
            // const previewContent = this.showProductPreview(product)
            this.events.emit('product:open', { product })
        })

        return cardElement
    }

    // Создание DOM-элемента карточки в каталоге
    showProductPreview(product: IProduct, isInBasket: boolean = false): HTMLElement {
        const previewClone = this._cardPreviewTemplate.content.cloneNode(true) as DocumentFragment;
        const previewElement = previewClone.querySelector('.card') as HTMLElement;

        const title = previewClone.querySelector('.card__title') as HTMLElement;
        const image = previewClone.querySelector('.card__image') as HTMLImageElement;
        const category = previewClone.querySelector('.card__category') as HTMLElement;
        const text = previewClone.querySelector('.card__text') as HTMLElement;
        const price = previewClone.querySelector('.card__price') as HTMLElement;
        const addToBasketButton = previewClone.querySelector('.card__button')

        title.textContent = product.title;
        image.src = `${CDN_URL}${product.image}`;
        image.alt = product.title;
        category.textContent = product.category;
        text.textContent = product.description;
        price.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';

        if (isInBasket) {
            addToBasketButton.setAttribute('disabled', '');
            addToBasketButton.textContent = 'Уже в корзине';
        } else {
            addToBasketButton.addEventListener('click', () => {
                this.events.emit('basket:add', product)
                addToBasketButton.setAttribute('disabled', '');
                addToBasketButton.textContent = 'Уже в корзине';
            })
        }

        return previewElement;
    }
}