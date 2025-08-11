import './scss/styles.scss';
import { EventEmitter } from './shared/events';
import { ProductModel } from './model/ProductModel';
import { BasketModel } from './model/BasketModel';
import { CheckoutModel } from './model/CheckoutModel';
import { MainPageView } from './view/MainPageView';
import { ProductView } from './view/ProductView';
import { ProductPresenter } from './presenter/ProductPresenter';
import { BasketPresenter } from './presenter/BasketPresenter';

const events = new EventEmitter();

// Шаблоны
const cardCatalogTemplate = document.querySelector<HTMLTemplateElement>('#card-catalog')!;
const cardPreviewTemplate = document.querySelector<HTMLTemplateElement>('#card-preview')!;
const cardBasketTemplate = document.querySelector<HTMLTemplateElement>('#card-basket')!;
const basketTemplate = document.querySelector<HTMLTemplateElement>('#basket')!;

// Модели
const productModel = new ProductModel();
const basketModel = new BasketModel();
const checkoutModel = new CheckoutModel();

// Views и презентеры
const mainView = new MainPageView(document.body, events);
const productView = new ProductView(cardCatalogTemplate, cardPreviewTemplate, events);

const modalContainer = document.querySelector('.modal') as HTMLElement;

// Презентеры
const productPresenter = new ProductPresenter(
    productModel,
    productView,
    mainView,
    events,
    basketModel,
    modalContainer
);
productPresenter.init();

const basketPresenter = new BasketPresenter(
    basketModel,
    events,
    modalContainer,
    cardBasketTemplate,
    basketTemplate,
    checkoutModel,
    mainView
);
basketPresenter.init();

events.on('basket:open', () => {
    basketPresenter.open();
});
