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
import { CheckoutView } from './view/CheckoutView';
import { CheckoutPresenter } from './presenter/CheckoutPresenter';
import { CheckoutModel } from './model/CheckoutModel';


// Событийный брокер
const events = new EventEmitter();

const header = document.querySelector('.header') as HTMLElement;
const headerView = new HeaderView(header, events);

//Место для отображения карточек
const gallery = document.querySelector('.gallery') as HTMLElement
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketElement = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

//Модели
const productModel = new ProductModel();
const basketModel = new BasketModel();
const checkoutModel = new CheckoutModel();

//Views
const productView = new ProductView(gallery, events);
const basketView = new BasketView(basketElement, events);
const checkoutView = new CheckoutView(basketElement, events, checkoutModel)

//Презентеры
const productPresenter = new ProductPresenter(productModel, productView, events, basketModel);
const checkoutPresenter = new CheckoutPresenter(checkoutView, events, basketModel)
const basketPresenter = new BasketPresenter(basketModel, basketView, events, checkoutModel)

productPresenter.init();
basketPresenter.init();
checkoutPresenter.init();