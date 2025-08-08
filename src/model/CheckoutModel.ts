import { IClient, IContacts } from "./types";

export class CheckoutModel {
    protected client: IClient = {
        payment: '',
        address: '',
        email: '',
        phone: ''
    }

    saveClientData(data: IClient): void {
        this.client.payment = data.payment;
        this.client.address = data.address;
        this.client.email = data.email;
        this.client.phone = data.phone;
    }

    get сlientData(): IClient {
        return this.client
    }

    validateContacts(data: IContacts): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{7,15}$/;

        return emailRegex.test(data.email) && phoneRegex.test(data.phone);
    }
}