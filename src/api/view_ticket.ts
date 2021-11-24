import { ITicket, IViewTicketsResponseData } from "src/types";
import { api_get } from "./auth";


export const view_ticket = async (id: number): Promise<ITicket> => {
    const response = await api_get<IViewTicketsResponseData>(`api/v2/tickets/${id}`);
    return response.data.ticket;
}