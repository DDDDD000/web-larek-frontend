import { IEvents } from "../components/base/events";

export interface IProduct {
    id: string;
    title: string;
    image: string;
    category: string;
    price: number | null;
    description: string;
}

export type PaymentMethod = 'card' | 'cash';

export interface IClient {
    payment: PaymentMethod | '';
    address: string;
    email: string;
    phone: string;
}

export type IMainPageCard = Pick<IProduct, 'id' | 'title' | 'image' | 'category' | 'price'>

export interface ICatalogData {
    selectedCard: IProduct | null;
    products: IMainPageCard[];
    events: IEvents

    getCard(cardId: string): IProduct | undefined;
}

export type IBasketCard = Pick<IProduct, 'id' | 'title' | 'price'>

export interface IBasketData {
    products: IBasketCard[]
    events: IEvents

    deleteCard(cardId: string, payload: Function | null): void;
    confirmOrder(): void;
    closeBasket(): void;
}

export type IContacts = Pick<IClient, 'email' | "phone">

export interface IClientData {
    events: IEvents

    getClientData(): IContacts;
    clientDataCheck(data: IContacts): boolean;
    saveClientData(userData: IClient): void;
}

export type IPaymentInfo = Pick<IClient, 'payment' | 'address'>
