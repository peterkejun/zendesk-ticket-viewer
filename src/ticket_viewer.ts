import InputParser, { IInputEvent, InputType } from "./ui/input_parser";
import SingleTicketView from "./ui/single_ticket_view";
import TicketList from "./ui/ticket_list";


type IInputHandler = (input: IInputEvent) => Promise<void>;

enum ViewerMode {
    MENU,
    LIST,
    SINGLE,
}
export default class TicketViewer {
    private input_parser: InputParser;
    private ticket_list: TicketList;
    private single_ticket_view: SingleTicketView | null;
    private input_handler_map: Map<InputType, IInputHandler>;
    private mode: ViewerMode;

    constructor() {
        this.mode = ViewerMode.MENU;
        this.input_parser = new InputParser();
        this.ticket_list = new TicketList();
        this.single_ticket_view = null;

        this.input_handler_map = new Map();
        this.input_handler_map.set(InputType.VIEW_ALL_TICKETS, this.view_all_tickets);
        this.input_handler_map.set(InputType.NEXT_PAGE, this.go_to_next_page);
        this.input_handler_map.set(InputType.PREVIOUS_PAGE, this.go_to_previous_page);
        this.input_handler_map.set(InputType.VIEW_SINGLE_TICKET, this.view_single_ticket);
    }

    start() {
        this.input_parser.sub().subscribe({
            next: this.handle_input,
            error: this.handle_input_error,
        });
        this.input_parser.resume_input();
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
            default:
                view = '';
                break;
        }
        console.log(view);
    }

}