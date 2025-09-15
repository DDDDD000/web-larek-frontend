import { Modal } from "../components/Modal";
import { BasketModel } from "../model/BasketModel";
import { CheckoutModel } from "../model/CheckoutModel";
import { IBasketCard, IProduct } from "../model/types";
import { CheckoutPresenter } from "../presenter/CheckoutPresenter";
import { CDN_URL } from "../shared/constants";
import { EventEmitter } from "../shared/events";
import { BasketView } from "./BasketView";
import { CheckoutView } from "./CheckoutView";

export class ProductView {

    private categoryColors: Record<string, string> = {
        "софт-скил": "soft",
        "другое": "other",
        "кнопка": "button",
        "хард-скил": "hard",
        "дополнительное": "additional"
    };

    constructor(
        private cardTemplate: HTMLTemplateElement,
        private previewTemplate: HTMLTemplateElement,
        private cardBasketTemplate: HTMLTemplateElement,
        private events: EventEmitter
    ) { }

    private fillCardBasicFields(
        clone: DocumentFragment,
        product: IProduct,
        selector: string = '.card'
    ): { element: HTMLElement, title: HTMLElement, image: HTMLImageElement, category: HTMLElement, price: HTMLElement } {

        const element = clone.querySelector(selector) as HTMLElement;
        const title = clone.querySelector('.card__title') as HTMLElement;
        const image = clone.querySelector('.card__image') as HTMLImageElement;
        const category = clone.querySelector('.card__category') as HTMLElement;
        const price = clone.querySelector('.card__price') as HTMLElement;

        title.textContent = product.title;
        image.src = `${CDN_URL}${product.image}`;
        image.alt = product.title;
        category.textContent = product.category;
        price.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';
        this.applyCategoryStyle(category, product.category);

        return { element, title, image, category, price };
    }

    private createCardFromTemplate(
        template: HTMLTemplateElement,
        product: IProduct,
        mainSelector: string
    ): { element: HTMLElement, title: HTMLElement, image: HTMLImageElement, category: HTMLElement, price: HTMLElement } {

        const clone = template.content.cloneNode(true) as DocumentFragment;
        return this.fillCardBasicFields(clone, product, mainSelector);
    }
    
    private applyCategoryStyle(categoryElement: HTMLElement, categoryName: string) {
        categoryElement.textContent = categoryName;

        categoryElement.classList.remove(
            ...Object.values(this.categoryColors).map(c => `card__category_${c}`)
        );

        const colorKey = this.categoryColors[categoryName];
        if (colorKey) {
            categoryElement.classList.add(`card__category_${colorKey}`);
        }
    }

    createCard(product: IProduct): HTMLElement {
        const { element: el } = this.createCardFromTemplate(this.cardTemplate, product, '.gallery__item');

        el.addEventListener('click', () => {
            this.events.emit('product:open', { product });
        });

        return el;
    }

    showProductPreview(product: IProduct, isInBasket: boolean = false): HTMLElement {
        const clone = this.previewTemplate.content.cloneNode(true) as DocumentFragment;
        const { element: el, title, image, category, price } = this.fillCardBasicFields(clone, product);

        const text = clone.querySelector('.card__text') as HTMLElement;
        const addBtn = clone.querySelector('.card__button') as HTMLButtonElement;

        text.textContent = product.description;

        if (product.price === null) {
            addBtn.disabled = true;
            addBtn.textContent = 'Нельзя купить';
        } else if (isInBasket) {
            addBtn.disabled = true;
            addBtn.textContent = 'Уже в корзине';
        } else {
            addBtn.addEventListener('click', () => {
                const payload = { id: product.id, title: product.title, price: product.price ?? 0 };
                this.events.emit('basket:add', payload);
                addBtn.disabled = true;
                addBtn.textContent = 'Уже в корзине';
            });
        }

        return el;
    }

    createBasketCard(product: IBasketCard, index: number): HTMLElement {
        if (!this.cardBasketTemplate) {
            throw new Error('cardBasketTemplate не передана');
        }

        const clone = this.cardBasketTemplate.content.cloneNode(true) as DocumentFragment;
        const itemEl = clone.querySelector('.basket__item') as HTMLElement;
        const title = clone.querySelector('.card__title') as HTMLElement;
        const price = clone.querySelector('.card__price') as HTMLElement;
        const deleteBtn = clone.querySelector('.basket__item-delete') as HTMLButtonElement;
        const indexEl = clone.querySelector('.basket__item-index') as HTMLElement;

        title.textContent = product.title;
        price.textContent = `${product.price} синапсов`;

        if (indexEl) indexEl.textContent = String(index + 1);

        deleteBtn.addEventListener('click', () => {
            this.events.emit('basket:remove', { id: product.id });
        });

        return itemEl;
    }
}
