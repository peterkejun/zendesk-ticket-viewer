import InputParser from "./ui/input/input_parser";
import SingleTicketView from "./ui/single_ticket_view";
import TicketList from "./ui/ticket_list";
import { IInputType, IInputEvent, IInputHandler, ViewerMode, IInputRule, SpecialKey } from './types';


export default class TicketViewer {
    private input_parser: InputParser;
    private ticket_list: TicketList;
    private single_ticket_view: SingleTicketView | null;
    private input_handler_map: Map<IInputType, IInputHandler>;
    private mode: ViewerMode;

    constructor() {
        this.mode = ViewerMode.LANDING;
        this.input_parser = new InputParser(this.get_input_rules());
        this.ticket_list = new TicketList();
        this.single_ticket_view = null;

        this.input_handler_map = new Map();
        this.input_handler_map.set(IInputType.VIEW_ALL_TICKETS, this.view_all_tickets);
        this.input_handler_map.set(IInputType.NEXT_PAGE, this.go_to_next_page);
        this.input_handler_map.set(IInputType.PREVIOUS_PAGE, this.go_to_previous_page);
        this.input_handler_map.set(IInputType.VIEW_SINGLE_TICKET, this.view_single_ticket);
        this.input_handler_map.set(IInputType.MENU, this.view_menu);
        this.input_handler_map.set(IInputType.QUIT, this.quit);
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

    private start_loading = (): ViewerMode => {
        this.input_parser.pause_input();
        const previous_mode = this.mode;
        this.mode = ViewerMode.LOADING;
        return previous_mode;
    }

    private stop_loading = (next_mode: ViewerMode) => {
        this.input_parser.resume_input();
        this.mode = next_mode;
    }

    private view_all_tickets = async (input: IInputEvent) => {
        this.start_loading();
        this.render();
        await this.ticket_list.fetch_current_page();
        this.stop_loading(ViewerMode.LIST);
        this.render();
    }

    private go_to_next_page = async (input: IInputEvent) => {
        const previous_mode = this.start_loading();
        this.render();
        await this.ticket_list.go_to_next_page();
        this.stop_loading(previous_mode);
        this.render();
    }

    private go_to_previous_page = async (input: IInputEvent) => {
        const previous_mode = this.start_loading();
        this.render();
        await this.ticket_list.go_to_previous_page();
        this.stop_loading(previous_mode);
        this.render();
    }

    private view_single_ticket = async (input: IInputEvent) => {
        this.start_loading();
        this.render();
        const ticket_id = parseInt(input.last_input);
        this.single_ticket_view = new SingleTicketView(ticket_id);
        await this.single_ticket_view.fetch_current_ticket();
        this.stop_loading(ViewerMode.SINGLE);
        this.render();
    }

    private view_menu = (input: IInputEvent) => {
        this.mode = ViewerMode.MENU;
        this.render();
    }

    private quit = (input: IInputEvent) => {
        this.input_parser.stop_reading_stdin();
        this.mode = ViewerMode.QUITTING;
        this.render();
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

    private make_prompt_ticket_id_view(): string {
        const prompt = 'Enter ticket ID:';
        return prompt;
    }

    private make_loading_view(): string {
        return `Loading...`;
    }

    private make_quitting_view(): string {
        return `Goodbye`;
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
                    view = this.make_prompt_ticket_id_view();
                }
                break;
            case ViewerMode.MENU:
                view = this.make_menu_view();
                break;
            case ViewerMode.LOADING:
                view = this.make_loading_view();
                break;
            case ViewerMode.QUITTING:
                view = this.make_quitting_view();
                break;
            default:
                view = this.make_landing_view();
                break;
        }
        console.log(view);
    }

    private get_input_rules(): IInputRule {
        return {
            children: {
                '1': IInputType.VIEW_ALL_TICKETS,
                '2': {
                    callback: this.prompt_single_ticket_id,
                    children: {
                        '#': IInputType.VIEW_SINGLE_TICKET,
                    },
                },
                'quit': IInputType.QUIT,
                [SpecialKey.LEFT]: IInputType.PREVIOUS_PAGE,
                [SpecialKey.RIGHT]: IInputType.NEXT_PAGE,
                'menu': IInputType.MENU,
            },
        };
    }

    private prompt_single_ticket_id = () => {
        this.single_ticket_view = null;
        this.mode = ViewerMode.SINGLE;
        this.render();
    }


}