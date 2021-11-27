import { IListTicketsResponseData, ROUTE } from "../types";
import { api_get } from "./auth"
import routes from "./routes";

/**
 * Use Zendesk API to list tickets in this account, paginated
 * @param page the page to request
 * @param page_size number of tickets per page
 * @returns tickets with pagination data
 */
export const list_tickets = async (page: number = 1, page_size: number = 25): Promise<IListTicketsResponseData> => {
    const route = routes.get(ROUTE.LIST_TICKETS);
    const response = await api_get<IListTicketsResponseData>(`${route}?page=${page}&per_page=${page_size}`);
    const data = response.data;
    return data;
}