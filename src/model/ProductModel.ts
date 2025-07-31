import { API_URL } from "../utils/constants";
import { Api } from "../components/base/api";
import { IProduct } from "../types";

const api = new Api(API_URL);

export const getCards = async (): Promise<IProduct[]> => {
    const response = await api.get('/product');

    if (isCardsResponse(response)) {
        return response.items;
    }
    throw new Error('Неверный формат ответа от сервера');
};


function isCardsResponse(data: object): data is { total: number; items: IProduct[] } {
    return 'items' in data && Array.isArray(data.items);
}