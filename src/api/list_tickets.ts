import { IListTicketsResponseData } from "../types";
import { api_get } from "./auth"

export const list_tickets = async (page: number = 1): Promise<IListTicketsResponseData> => {
    const response = await api_get<IListTicketsResponseData>(`/api/v2/tickets.json?page=${page}`);
    const data = response.data;
    return data;
}