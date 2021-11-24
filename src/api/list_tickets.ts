import { IListTicketsResponseData, IListTicketsReturnData } from "../types";
import { api_get } from "./auth"

export const list_tickets = async (page: number = 1): Promise<IListTicketsReturnData> => {
    const response = await api_get<IListTicketsResponseData>(`/api/v2/tickets.json?page=${page}`);
    const data = response.data;
    let current_page = page;
    let total_pages = 1;
    let total_tickets = data.count;
    if (total_tickets > data.tickets.length) {
        total_pages = Math.ceil(total_tickets / data.tickets.length);
    }
    return {
        tickets: data.tickets,
        current_page,
        total_pages,
        total_tickets,
    }
}