import InputParser from "./ui/input_parser";
import SingleTicketView from "./ui/single_ticket_view";
import TicketList from "./ui/ticket_list";
import { InputType, IInputEvent, IInputHandler, ViewerMode } from './types';


export default class TicketViewer {
    private input_parser: InputParser;
    private ticket_list: TicketList;
    private single_ticket_view: SingleTicketView | null;
    private input_handler_map: Map<InputType, IInputHandler>;
    private mode: ViewerMode;

    constructor() {
        this.mode = ViewerMode.LANDING;
        this.input_parser = new InputParser();
        this.ticket_list = new TicketList();
        this.single_ticket_view = null;

        this.input_handler_map = new Map();
        this.input_handler_map.set(InputType.VIEW_ALL_TICKETS, this.view_all_tickets);
        this.input_handler_map.set(InputType.NEXT_PAGE, this.go_to_next_page);
        this.input_handler_map.set(InputType.PREVIOUS_PAGE, this.go_to_previous_page);
        this.input_handler_map.set(InputType.VIEW_SINGLE_TICKET, this.view_single_ticket);
        this.input_handler_map.set(InputType.MENU, this.view_menu);
        this.input_handler_map.set(InputType.QUIT, this.quit);
    }

    start() {
        this.input_parser.sub().subscribe({
            next: this.handle_input,
            error: this.handle_input_error,
        });
        this.input_parser.start_reading_stdin();
        this.render();
    }

    private handle_input = async (input: IInputEvent) => {
        console.log('you entered', input.input_type);

        const handler = this.input_handler_map.get(input.input_type);
        if (handler) {
            handler(input);
        } else {
            console.log('No handler for input event');
        }
    }

    private handle_input_error = (error: any) => {
        console.log('something went wrong');
    }

    private view_all_tickets = async (input: IInputEvent) => {
        await this.ticket_list.fetch_current_page();
        this.mode = ViewerMode.LIST;
        this.render();
    }

    private go_to_next_page = async (input: IInputEvent) => {
        await this.ticket_list.go_to_next_page();
        this.render();
    }

    private go_to_previous_page = async (input: IInputEvent) => {
        await this.ticket_list.go_to_previous_page();
        this.render();
    }

    private view_single_ticket = async (input: IInputEvent) => {
        const ticket_id = parseInt(input.last_input);
        this.single_ticket_view = new SingleTicketView(ticket_id);
        await this.single_ticket_view.fetch_current_ticket();
        this.mode = ViewerMode.SINGLE;
        this.render();
    }

    private view_menu = (input: IInputEvent) => {
        this.mode = ViewerMode.MENU;
        this.render();
    }

    private quit = (input: IInputEvent) => {
        this.input_parser.stop_reading_stdin();
    }

    private make_landing_view(): string {
        const landing = `
Welcome to the Ticket Viewer!
Type 'menu' to view options or 'quit' to quit.
        `;
        return landing;
    }

    private make_menu_view(): string {
        const menu_strings: string[] = [];
        menu_strings.push(`Select view options:\n`);

        const options = this.input_parser.get_input_options();
        for (let option of options) {
            const option_str = `* Type ${option.key_option} to ${option.display}`;
            menu_strings.push(option_str);
        }
        menu_strings.push('\n')

        const menu = menu_strings.join('\n');
        return menu;
    }

    private render() {
        let view: string;
        switch (this.mode) {
            case ViewerMode.LIST:
                view = this.ticket_list.render();
                break;
            case ViewerMode.SINGLE:
                if (this.single_ticket_view) {
                    view = this.single_ticket_view.render();
                } else {
                    view = '';
                }
                break;
            case ViewerMode.MENU:
                view = this.make_menu_view();
                break;
            default:
                view = this.make_landing_view();
                break;
        }
        console.log(view);
    }

}