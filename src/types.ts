// Ticket

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
}

// API

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

export interface IErrorResponse extends IObject {
    status: number,
    statusText: string,
}


// UI
export interface IColumn extends IObject {
    field: string,
    display: string,
    char_length: number,
}

// Input

export enum IInputType {
    MENU = 'menu',
    QUIT = 'quit',

    VIEW_ALL_TICKETS = '1',
    VIEW_SINGLE_TICKET = '2',
    INVALID_INPUT = '__invalid_input__',

    NEXT_PAGE = 'right arrow',
    PREVIOUS_PAGE = 'left arrow',

}
export interface IInputEvent {
    input_type: IInputType,
    last_input: string,
    err?: any,
}

export type IInputRuleCallback = () => void;

export type IInputRule = IInputType | {
    callback?: IInputRuleCallback,
    children: { [key: string]: IInputRule, }
};

export type IInputHandler = (input: IInputEvent) => void | Promise<void>;

export enum SpecialKey {
    UP = "\u001b[A",
    DOWN = "\u001b[B",
    RIGHT = "\u001b[C",
    LEFT = "\u001b[D",
    CTRL_C = "\u0003",
}

export interface IInputOption {
    type: IInputType,
    display: string,
    key_option: string,
}

// Ticket Viewer

export enum ViewerMode {
    LANDING,
    MENU,
    LIST,
    SINGLE,
    LOADING,
    QUITTING,
}

