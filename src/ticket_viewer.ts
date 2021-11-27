import InputParser from "./ui/input/input_parser";
import SingleTicketView from "./ui/single_ticket_view";
import TicketList from "./ui/ticket_list";
import { IInputType, IInputEvent, IInputHandler, ViewerMode, IInputRule, SpecialKey } from './types';


/**
 * The controller for the application.
 */
export default class TicketViewer {

    /**
     * The parser to recognize stdin input sequence
     * @see InputParser
     */
    private input_parser: InputParser;

    /**
     * the ticket list model
     * @see TicketList
     */
    private ticket_list: TicketList;

    /**
     * The single ticket view model
     * @see SingleTicketView
     */
    private single_ticket_view: SingleTicketView | null;

    /**
     * a mapping of option to handler
     */
    private input_handler_map: Map<IInputType, IInputHandler>;

    /**
     * the current mode (state) of the controller
     */
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

    /**
     * start the application
     * - subscribe to user input
     * - start rendering in terminal
     */
    start() {
        // subscribe to recognized user input from parser
        this.input_parser.sub().subscribe({
            next: this.handle_input,
            error: this.handle_input_error,
        });
        this.input_parser.start_reading_stdin();

        // first render
        this.render();
    }

    /**
     * invoke a handler matching the user input
     * @param input the latest user input
     */
    private handle_input = async (input: IInputEvent) => {
        const handler = this.input_handler_map.get(input.input_type);
        if (handler) {
            handler(input);
        } else {
            console.error('No handler for input event');
        }
    }

    /**
     * @param error any error that occured during input recognition
     */
    private handle_input_error = (error: any) => {
        console.log('something went wrong');
    }

    /**
     * Enter the loading mode and pause user input
     * @returns the previous mode of the controller before the loading mode
     */
    private start_loading = (): ViewerMode => {
        this.input_parser.pause_input();
        const previous_mode = this.mode;
        this.mode = ViewerMode.LOADING;
        return previous_mode;
    }

    /**
     * Exit the loading mode and resume user input
     * @param next_mode the mode to set the controller to after resuming
     */
    private stop_loading = (next_mode: ViewerMode) => {
        this.input_parser.resume_input();
        this.mode = next_mode;
    }

    /**
     * handler for viewing all tickets (list tickets)
     * @param input the latest user input
     */
    private view_all_tickets = async (input: IInputEvent) => {
        // start loading
        this.start_loading();
        this.render();

        // fetch the current page of tickets
        await this.ticket_list.fetch_current_page();

        // stop loading
        this.stop_loading(ViewerMode.LIST);
        this.render();
    }

    /**
     * handler for going to the next page of the ticket list
     * @param input the latest user input
     */
    private go_to_next_page = async (input: IInputEvent) => {
        // start loading
        const previous_mode = this.start_loading();
        this.render();

        // load the next page of tickets
        await this.ticket_list.go_to_next_page();

        // stop loading
        this.stop_loading(previous_mode);
        this.render();
    }

    /**
     * handler for going to the previous page of the ticket list
     * @param input the latest user input
     */
    private go_to_previous_page = async (input: IInputEvent) => {
        // start loading
        const previous_mode = this.start_loading();
        this.render();

        // load the previous page of tickets
        await this.ticket_list.go_to_previous_page();

        // stop loading
        this.stop_loading(previous_mode);
        this.render();
    }

    /**
     * hanlder for viewing a single ticket
     * @param input the latest user input
     */
    private view_single_ticket = async (input: IInputEvent) => {
        // start loading
        this.start_loading();
        this.render();

        // extract the ticket id and create a single ticket view
        const ticket_id = parseInt(input.last_input);
        this.single_ticket_view = new SingleTicketView(ticket_id);
        await this.single_ticket_view.fetch_current_ticket();

        // stop loading
        this.stop_loading(ViewerMode.SINGLE);
        this.render();
    }

    /**
     * handler for viewing the menu
     * @param input the latest user input
     */
    private view_menu = (input: IInputEvent) => {
        this.mode = ViewerMode.MENU;
        this.render();
    }

    /**
     * handler for quitting the application
     * @param input the latest user input
     */
    private quit = (input: IInputEvent) => {
        // stop the parser from reading stdin so that the event loop terminates
        this.input_parser.stop_reading_stdin();

        this.mode = ViewerMode.QUITTING;
        this.render();
    }

    /**
     * handler for when user chooses to view a single ticket but 
     * has not provided a ticket ID
     */
    private prompt_single_ticket_id = () => {
        this.single_ticket_view = null;
        this.mode = ViewerMode.SINGLE;
        this.render();
    }

    /**
     * @returns a string that shows a welcome message for the landing page
     */
    private make_landing_view(): string {
        const landing = `
Welcome to the Ticket Viewer!
Type 'menu' to view options or 'quit' to quit.
        `;
        return landing;
    }

    /**
     * @returns a string that shows the menu
     */
    private make_menu_view(): string {
        const menu_strings: string[] = [];
        menu_strings.push(`Select view options:\n`);

        // format each option in a bullet point
        const options = this.input_parser.get_input_options();
        for (let option of options) {
            const option_str = `* Type ${option.key_option} to ${option.display}`;
            menu_strings.push(option_str);
        }
        menu_strings.push('\n')

        const menu = menu_strings.join('\n');
        return menu;
    }

    /**
     * @returns a string that prompts the user to give a ticket ID
     */
    private make_prompt_ticket_id_view(): string {
        const prompt = 'Enter ticket ID:';
        return prompt;
    }

    /**
     * @returns a string that shows "loading"
     */
    private make_loading_view(): string {
        return `Loading...`;
    }

    /**
     * @returns a string that says goodbye to the user when quitting
     */
    private make_quitting_view(): string {
        return `Goodbye`;
    }

    /**
     * This is the [view] of MVC for this application.
     * Render the current state of the controller
     */
    private render() {
        let view: string;

        // render a view based on the current mode
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

        // print the view to stdout
        console.log(view);
    }

    /**
     * @returns the input rule to use for this controller's parser
     * @see IInputRule
     */
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

}