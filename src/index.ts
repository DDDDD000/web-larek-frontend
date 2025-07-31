import './scss/styles.scss';
import { CDN_URL } from './utils/constants';
import { getCards } from './components/CardsApi';
import { ensureElement } from './utils/utils';
import { IMainPageCard, IProduct } from './types';
import { Modal } from './components/Modal';
import { EventEmitter } from './components/base/events';

//Место для отображения карточек
const gallery = document.querySelector('.gallery')

//Темплейты
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog')
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview')

// Событийный брокер и модалка
const events = new EventEmitter();
const modalContainer = ensureElement<HTMLElement>('.modal');
const modal = new Modal(modalContainer, events);


const loadPageData = async (): Promise<void> => {
    await renderCards()
}

// Отрисовка карточек на главной
const renderCards = async (): Promise<void> => {
    const cards = await getCards();
    const fragment = document.createDocumentFragment();

    cards.forEach(cardData => {
        const cardElement = createCardElement(cardData);
        fragment.appendChild(cardElement)
    })

    gallery.innerHTML = ''
    gallery.appendChild(fragment);
};

// Создание DOM-элемента карточки в каталоге
const createCardElement = (cardData: IProduct): HTMLElement => {

    const cardClone = cardCatalogTemplate.content.cloneNode(true) as DocumentFragment;
    const cardElement = cardClone.querySelector('.gallery__item') as HTMLElement;

    const cardTitle = cardClone.querySelector('.card__title') as HTMLElement;
    const cardImage = cardClone.querySelector('.card__image') as HTMLImageElement;
    const cardCategory = cardClone.querySelector('.card__category') as HTMLElement;
    const cardPrice = cardClone.querySelector('.card__price') as HTMLElement;

    cardTitle.textContent = cardData.title;
    cardImage.src = `${CDN_URL}${cardData.image}`;
    cardCategory.textContent = cardData.category;
    cardPrice.textContent = cardData.price !== null ? `${cardData.price} синапсов` : 'Бесценно';

    cardElement.addEventListener('click', () => {
        const previewContent = createPreviewCard(cardData)
        modal.render({ content: previewContent })
    })

    return cardElement
}

const createPreviewCard = (cardData: IProduct): HTMLElement => {
    const previewClone = cardPreviewTemplate.content.cloneNode(true) as DocumentFragment;
    const previewElement = previewClone.querySelector('.card') as HTMLElement;

    const title = previewClone.querySelector('.card__title') as HTMLElement;
    const image = previewClone.querySelector('.card__image') as HTMLImageElement;
    const category = previewClone.querySelector('.card__category') as HTMLElement;
    const text = previewClone.querySelector('.card__text') as HTMLElement;
    const price = previewClone.querySelector('.card__price') as HTMLElement;

    title.textContent = cardData.title;
    image.src = `${CDN_URL}${cardData.image}`;
    image.alt = cardData.title;
    category.textContent = cardData.category;
    text.textContent = cardData.description;
    price.textContent = cardData.price !== null ? `${cardData.price} синапсов` : 'Бесценно';

    return previewElement;
}

loadPageData()
