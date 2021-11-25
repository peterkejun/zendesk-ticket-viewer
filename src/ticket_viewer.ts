import { async } from "rxjs";
import InputParser, { IInputEvent, InputType } from "./ui/input_parser";
import TicketList from "./ui/ticket_list";


type IInputHandler = (input: IInputEvent) => Promise<void>;

export default class TicketViewer {
    private input_parser: InputParser;
    private ticket_list: TicketList;
    private input_handler_map: Map<InputType, IInputHandler>;

    constructor() {
        this.input_parser = new InputParser();
        this.ticket_list = new TicketList();

        this.input_handler_map = new Map();
        this.input_handler_map.set(InputType.VIEW_ALL_TICKETS, this.view_all_tickets);
        this.input_handler_map.set(InputType.NEXT_PAGE, this.go_to_next_page);
        this.input_handler_map.set(InputType.PREVIOUS_PAGE, this.go_to_previous_page);
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

    private render() {
        console.log(this.ticket_list.render());
    }

}