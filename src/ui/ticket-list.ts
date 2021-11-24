import { IListTicketsReturnData, IColumn } from "../types";
import { pad_string } from "./util";

const CELL_PADDING = 3;

export const make_ticket_list = (data: IListTicketsReturnData): string => {
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
    ]

    const header_row = columns.map(column => {
        return pad_string(column.display, column.char_length, CELL_PADDING);
    }).join('');

    const ticket_rows = data.tickets.map(ticket => {
        const column_strings = columns.map(column => {
            if (ticket[column.field] != null) {
                return pad_string(ticket[column.field].toString(), column.char_length, CELL_PADDING);
            }
            return pad_string('', column.char_length, CELL_PADDING);
        });
        return column_strings.join('');
    });

    return [header_row].concat(ticket_rows).join('\n');
}