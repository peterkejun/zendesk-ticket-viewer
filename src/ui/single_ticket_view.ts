import { view_ticket } from "../api/view_ticket";
import { ITicket, IColumn } from "../types";
import { pad_string } from "./util";

const CELL_PADDING = 5;
export default class SingleTicketView {
    private ticket_id: number;
    private ticket: ITicket | null;

    constructor(ticket_id: number) {
        this.ticket_id = ticket_id;
        this.ticket = null;
    }

    public async fetch_current_ticket() {
        this.ticket = await view_ticket(this.ticket_id);
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
        if (this.ticket == null) {
            return '';
        }

        const char_limits = [20, 20];

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
        return rows.join('\n');
    }
}