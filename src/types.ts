export type ITag = string;

export interface IObject {
    [key: string]: any,
}

export interface ITicket extends IObject {
    url: string,
    id: number,
    created_at: string,
    updated_at: string,
    type: string,
    subject: string,
    raw_subject: string,
    description: string,
    priority: string,
    status: string,
    tags: ITag[],
    [key: string]: any,
}

export interface IPaginatedResponseData extends IObject {
    next_page: number | null,
    previous_page: number | null,
    count: number,
}

export interface IListTicketsResponseData extends IPaginatedResponseData {
    tickets: ITicket[],
}

export interface IViewTicketsResponseData extends IPaginatedResponseData {
    ticket: ITicket,
}


export interface IListTicketsReturnData extends IObject {
    tickets: ITicket[],
    current_page: number,
    total_pages: number,
    total_tickets: number,
}

export interface IColumn extends IObject {
    field: string,
    display: string,
    char_length: number,
}