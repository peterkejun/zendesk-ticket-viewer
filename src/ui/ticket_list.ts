import { list_tickets } from "../api/list_tickets";
import { IColumn, ITicket } from "../types";
import { pad_string } from "./util";

const CELL_PADDING = 3;

/**
 * A model of the application, fetches and renders a table of tickets
 */
export default class TicketList {

    /**
     * current page in pagination
     */
    private current_page: number;

    /**
     * total pages of tickets
     */
    private total_pages: number;

    /**
     * total number of tickets
     */
    private total_tickets: number;

    /**
     * tickets of current page
     * @see ITicket
     */
    private tickets: ITicket[] = [];

    /**
     * any error while loading the ticket
     */
    private error: string | null;

    /**
     * Set page to first page
     */
    constructor() {
        this.current_page = 1;
        this.total_pages = 1;
        this.total_tickets = 0;
        this.error = null;
    }

    /**
     * @returns whether there is a next page
     */
    private has_next_page(): boolean {
        return this.current_page < this.total_pages;
    }

    /**
     * @returns whether there is a previous page
     */
    private has_previous_page(): boolean {
        return this.current_page > 1;
    }

    /**
     * fetch the next page of tickets, if any
     */
    public async go_to_next_page() {
        if (this.has_next_page()) {
            this.current_page += 1;
            await this.fetch_current_page();
        }
    }

    /**
     * fetch the previous page of tickets, if any
     */
    public async go_to_previous_page() {
        if (this.has_previous_page()) {
            this.current_page -= 1;
            await this.fetch_current_page();
        }
    }

    /**
     * fetch current page of tickets and update pagination parameters
     */
    public async fetch_current_page() {
        try {
            const data = await list_tickets(this.current_page);
            this.tickets = data.tickets;

            this.total_tickets = data.count;

            // if there are multiple pages, then calculate total number of pages
            if (this.total_tickets > data.tickets.length) {
                this.total_pages = Math.ceil(this.total_tickets / data.tickets.length);
            }
        } catch (err) {
            this.error = 'Something went wrong. Please try again later.';
        }

    }

    /**
     * @returns column definition of the visible table of tickets
     * @see IColumn
     */
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

    /**
     * Render a ticket into a row string
     * @param columns the column definition
     * @param ticket the ticket of current row to render
     * @returns rendered row string of this ticket
     */
    private render_row(columns: IColumn[], ticket: ITicket): string {
        const column_strings = columns.map(column => {
            // if ticket has this field, format the value
            if (ticket[column.field] != null) {
                return pad_string(ticket[column.field].toString(), column.char_length, CELL_PADDING);
            }
            // if ticket does not have this field, format empty string
            return pad_string('', column.char_length, CELL_PADDING);
        });
        return column_strings.join('');
    }

    /**
     * Render all tickets into a table
     * @returns rendered table string of all tickets
     */
    public render() {
        if (this.error) {
            return this.error;
        }

        const rows: string[] = [];

        const pagination = `Showing ${this.current_page} of ${this.total_pages} pages (${this.total_tickets} tickets)\n`;
        rows.push(pagination);

        // render header row
        const columns = this.get_column_definitions();
        const header_row = columns.map(column => {
            return pad_string(column.display, column.char_length, CELL_PADDING);
        }).join('');
        rows.push(header_row)

        // render each row
        for (let ticket of this.tickets) {
            const row_string = this.render_row(columns, ticket);
            rows.push(row_string);
        }

        // render instructions
        const instructions = `\nUse left/right arrow keys to view the previous/next page.`
        rows.push(instructions);

        // concatenate all rows by newline 
        const table_string = rows.join('\n');
        return table_string;
    }
}