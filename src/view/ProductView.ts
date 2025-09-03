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
        private basketTemplate: HTMLTemplateElement,
        private events: EventEmitter
    ) { }
    private createElementFromTemplate(template: HTMLTemplateElement): HTMLElement {
        return template.content.firstElementChild!.cloneNode(true) as HTMLElement;
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

    private fillCardData(cardElement: HTMLElement, product: IProduct) {
        const title = cardElement.querySelector(".card__title") as HTMLElement;
        const price = cardElement.querySelector(".card__price") as HTMLElement;
        const image = cardElement.querySelector(".card__image") as HTMLImageElement;
        const category = cardElement.querySelector(".card__category") as HTMLElement;

        if (title) title.textContent = product.title;
        if (price) price.textContent = product.price ? `${product.price} синапсов` : "Бесценно";
        if (image) image.src = `${CDN_URL}${product.image}`;
        if (category) {
            category.textContent = product.category;
            const colorClass = this.categoryColors[product.category] || "other";
            category.className = `card__category card__category_${colorClass}`;
        }
    }

    createCard(product: IProduct): HTMLElement {
        const card = this.createElementFromTemplate(this.cardTemplate);
        this.fillCardData(card, product);
        card.addEventListener("click", () => {
            this.events.emit("card:select", product);
        });
        return card;
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
        this.applyCategoryStyle(category, product.category)
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
