import { Api } from "../shared/api";

export class OrderAPI extends Api {
    createOrder(payment: string, email: string, phone: string, address: string, total: number, items: string[]) {
        return this.post('/order', {
            payment,
            email,
            phone,
            address,
            total,
            items
        });
    }
}
