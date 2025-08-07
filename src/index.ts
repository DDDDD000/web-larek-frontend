import './scss/styles.scss';
import { ProductModel } from './model/ProductModel';
import { ensureElement } from './shared/utils';
import { EventEmitter } from './shared/events';
import { ProductView } from './view/ProductView';
import { ProductPresenter } from './presenter/ProductPresenter';
import { BasketPresenter } from './presenter/BasketPresenter';
import { BasketModel } from './model/BasketModel';
import { BasketView } from './view/BasketView';
import { HeaderView } from './view/HeaderView';


// Событийный брокер
const events = new EventEmitter();

const header = document.querySelector('.header') as HTMLElement;
const headerView = new HeaderView(header, events);

//Место для отображения карточек
const gallery = document.querySelector('.gallery') as HTMLElement
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketElement = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

//Темплейты
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

//Модели
const productModel = new ProductModel();
const basketModel = new BasketModel();

//Views
const productView = new ProductView(gallery, events);
const basketView = new BasketView(basketElement, events);

//Презентеры
const productPresenter = new ProductPresenter(productModel, productView, events, basketModel);
const basketPresenter = new BasketPresenter(basketModel, basketView, events)

productPresenter.init();
basketPresenter.init()

