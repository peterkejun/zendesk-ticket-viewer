import { view_ticket } from "../api/view_ticket";
import { ITicket, IColumn, IErrorResponse } from "../types";
import { pad_string } from "./util";

const CELL_PADDING = 5;

/**
 * A model for the application, fetches and renders a single ticket
 */
export default class SingleTicketView {
    /**
     * the ticket id
     */
    private ticket_id: number;

    /**
     * the ticket object
     */
    private ticket: ITicket | null;

    /**
     * any error while loading the ticket
     */
    private error: string | null;

    /**
     * @param ticket_id ticket id of this view
     */
    constructor(ticket_id: number) {
        this.ticket_id = ticket_id;
        this.ticket = null;
        this.error = null;
    }

    /**
     * Fetch the ticket from API
     */
    public async fetch_current_ticket() {
        try {
            this.ticket = await view_ticket(this.ticket_id);
            this.error = null;
        } catch (err: any) {
            const err_res = err.response as IErrorResponse;
            this.ticket = null;
            switch (err_res.status) {
                case 404:
                    this.error = 'Ticket not found';
                    break;
                default:
                    this.error = 'Something went wrong. Please try again later.';
                    break;
            }
        }
    }

    /**
     * @returns column definition for displaying ticket details
     * @see IColumn
     */
    private get_column_definitions(): IColumn[] {
        return [{
            field: 'id',
            display: 'ID',
            char_length: 15,
        }, {
            field: 'subject',
            display: 'Subject',
            char_length: 15,
        }, {
            field: 'created_at',
            display: 'Date Created',
            char_length: 15,
        }, {
            field: 'updated_at',
            display: 'Date Updated',
            char_length: 15,
        }, {
            field: 'type',
            display: 'Type',
            char_length: 15,
        }, {
            field: 'priority',
            display: 'Priority',
            char_length: 15,
        }, {
            field: 'status',
            display: 'Status',
            char_length: 15,
        }, {
            field: 'tags',
            display: 'Tags',
            char_length: 15,
        }]
    }

    /**
     * Renders a string that displays ticket ticket in a tabular fashion
     * @returns rendered string of ticket details
     */
    public render(): string {
        // if an error occured, display the error
        if (this.error) {
            return this.error;
        }

        // if no ticket exists, display nothing
        if (this.ticket == null) {
            return '';
        }

        // -1 because we don't want to limit the length of the value column
        const char_limits = [20, -1];

        const columns = this.get_column_definitions();

        // render one row per field
        const rows: string[] = [];
        for (let column of columns) {
            const field = pad_string(column.display, char_limits[0], CELL_PADDING);
            let value = '';
            if (this.ticket[column.field] != null) {
                value = pad_string(this.ticket[column.field], char_limits[1], CELL_PADDING);
            }
            const row_str = field + value;
            rows.push(row_str);
        }

        // render ticket description in a paragraph
        rows.push('Description');
        rows.push(this.ticket.description);

        return rows.join('\n');
    }
}