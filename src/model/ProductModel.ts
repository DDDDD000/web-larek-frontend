import { API_URL } from "../shared/constants";
import { Api } from "../shared/api";
import { IProduct } from "./types";

const api = new Api(API_URL);


export class ProductModel {

    getProducts = async (): Promise<IProduct[]> => {
        const response = await api.get('/product');

        if (this.isCardsResponse(response)) {
            return response.items;
        }
        throw new Error('Неверный формат ответа от сервера');
    };

    private isCardsResponse(data: object): data is { total: number; items: IProduct[] } {
        return 'items' in data && Array.isArray(data.items);
    }

}

