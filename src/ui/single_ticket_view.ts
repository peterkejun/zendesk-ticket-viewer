import { view_ticket } from "../api/view_ticket";
import { ITicket, IColumn, IErrorResponse } from "../types";
import { pad_string } from "./util";

const CELL_PADDING = 5;

export default class SingleTicketView {
    private ticket_id: number;
    private ticket: ITicket | null;

    private error: string | null;

    constructor(ticket_id: number) {
        this.ticket_id = ticket_id;
        this.ticket = null;
        this.error = null;
    }

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
            display: 'Tag',
            char_length: 15,
        }]
    }

    public render() {
        if (this.error) {
            return this.error;
        }

        if (this.ticket == null) {
            return '';
        }

        const char_limits = [20, -1];

        const columns = this.get_column_definitions();

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
        rows.push('Description');
        rows.push(this.ticket.description);
        return rows.join('\n');
    }
}