import { ITicket, IViewTicketsResponseData, ROUTE } from "../types";
import { api_get } from "./auth";
import routes from "./routes";


/**
 * Use Zendesk API to view a single ticket by id
 * @param id the ticket id
 * @returns ticket object
 */
export const view_ticket = async (id: number): Promise<ITicket> => {
    const route = routes.get(ROUTE.VIEW_TICKET);
    const response = await api_get<IViewTicketsResponseData>(`${route}/${id}`);
    return response.data.ticket;
}