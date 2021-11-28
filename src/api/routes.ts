import { ROUTE } from "../types";

/**
 * prepare a mapping of API routes
 */
const routes: Map<ROUTE, string> = new Map();
routes.set(ROUTE.LIST_TICKETS, 'api/v2/tickets.json');
routes.set(ROUTE.VIEW_TICKET, 'api/v2/tickets');

export default routes;