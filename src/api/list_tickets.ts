import { IListTicketsResponseData } from "../types";
import { api_get } from "./auth"

export const list_tickets = async (page: number = 1, page_size: number = 25): Promise<IListTicketsResponseData> => {
    const response = await api_get<IListTicketsResponseData>(`/api/v2/tickets.json?page=${page}&per_page=${page_size}`);
    const data = response.data;
    return data;
}