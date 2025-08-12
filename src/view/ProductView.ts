import { IProduct } from "../model/types";
import { CDN_URL } from "../shared/constants";
import { EventEmitter } from "../shared/events";

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
        private events: EventEmitter
    ) { }

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
        const clone = this.cardTemplate.content.cloneNode(true) as DocumentFragment;
        const el = clone.querySelector('.gallery__item') as HTMLElement;

        const title = clone.querySelector('.card__title') as HTMLElement;
        const image = clone.querySelector('.card__image') as HTMLImageElement;
        const category = clone.querySelector('.card__category') as HTMLElement;
        const price = clone.querySelector('.card__price') as HTMLElement;

        title.textContent = product.title;
        image.src = `${CDN_URL}${product.image}`;
        image.alt = product.title;
        this.applyCategoryStyle(category, product.category)
        category.textContent = product.category;
        price.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';

        el.addEventListener('click', () => {
            this.events.emit('product:open', { product });
        });

        return el;
    }

    showProductPreview(product: IProduct, isInBasket: boolean = false): HTMLElement {
        const clone = this.previewTemplate.content.cloneNode(true) as DocumentFragment;
        const el = clone.querySelector('.card') as HTMLElement;

        const title = clone.querySelector('.card__title') as HTMLElement;
        const image = clone.querySelector('.card__image') as HTMLImageElement;
        const category = clone.querySelector('.card__category') as HTMLElement;
        const text = clone.querySelector('.card__text') as HTMLElement;
        const price = clone.querySelector('.card__price') as HTMLElement;
        const addBtn = clone.querySelector('.card__button') as HTMLButtonElement;

        title.textContent = product.title;
        image.src = `${CDN_URL}${product.image}`;
        image.alt = product.title;
        category.textContent = product.category;
        text.textContent = product.description;
        price.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';

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
}
