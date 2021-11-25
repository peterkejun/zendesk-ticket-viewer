import { list_tickets } from "../api/list_tickets";
import { IColumn, ITicket } from "../types";
import { pad_string } from "./util";

const CELL_PADDING = 3;

export default class TicketList {

    private current_page: number;
    private total_pages: number;
    private total_tickets: number;

    private tickets: ITicket[] = [];

    constructor() {
        this.current_page = 1;
        this.total_pages = 1;
        this.total_tickets = 0;
    }

    private has_next_page(): boolean {
        return this.current_page < this.total_pages;
    }

    private has_previous_page(): boolean {
        return this.current_page > 1;
    }

    public async go_to_next_page() {
        if (this.has_next_page()) {
            this.current_page += 1;
            await this.fetch_current_page();
        }
    }

    public async go_to_previous_page() {
        if (this.has_previous_page()) {
            this.current_page -= 1;
            await this.fetch_current_page();
        }
    }

    async fetch_current_page() {
        const data = await list_tickets(this.current_page);
        this.tickets = data.tickets;

        this.total_tickets = data.count;
        if (this.total_tickets > data.tickets.length) {
            this.total_pages = Math.ceil(this.total_tickets / data.tickets.length);
        }
    }

    private get_column_definitions(): IColumn[] {
        const columns: IColumn[] = [
            {
                field: 'id',
                display: 'ID',
                char_length: 15,
            }, {
                field: 'subject',
                display: 'Subject',
                char_length: 30,
            }, {
                field: 'created_at',
                display: 'Date Created',
                char_length: 30,
            }, {
                field: 'priority',
                display: 'Priority',
                char_length: 20,
            }, {
                field: 'status',
                display: 'Status',
                char_length: 20,
            },
        ];
        return columns;
    }

    private render_row(columns: IColumn[], ticket: ITicket): string {
        const column_strings = columns.map(column => {
            if (ticket[column.field] != null) {
                return pad_string(ticket[column.field].toString(), column.char_length, CELL_PADDING);
            }
            return pad_string('', column.char_length, CELL_PADDING);
        });
        return column_strings.join('');
    }

    public render() {
        const columns = this.get_column_definitions();

        const header_row = columns.map(column => {
            return pad_string(column.display, column.char_length, CELL_PADDING);
        }).join('');

        const rows: string[] = [];
        for (let ticket of this.tickets) {
            const row_string = this.render_row(columns, ticket);
            rows.push(row_string);
        }
        const table_string = header_row + '\n' + rows.join('\n');

        return table_string;
    }
}