import { Subject } from 'rxjs';
import readline from 'readline';
import KeyParser from './key_parser';
import { IInputEvent, IInputOption, IInputType, IInputRule } from '../../types';
import { InputRuleTree } from './input_rule_tree';


export default class InputParser {

    private input_rule: IInputRule;
    private input: Subject<IInputEvent>;
    private rule_tree: InputRuleTree;
    private is_paused: boolean;
    private key_parser: KeyParser;
    private stdin: readline.Interface;

    private input_type_display_map: Map<IInputType, string>;

    constructor(input_rule: IInputRule) {
        this.input_rule = input_rule;

        this.input = new Subject();

        this.is_paused = false;

        this.rule_tree = new InputRuleTree(this.input_rule);

        this.key_parser = new KeyParser();

        this.stdin = readline.createInterface({
            input: process.stdin,
        });

        this.input_type_display_map = new Map();
        this.init_input_type_display_map();
    }

    public start_reading_stdin() {
        this.stdin.on('line', this.stdin_listener);

        this.input_type_display_map = new Map();
        this.init_input_type_display_map();
    }

    public stop_reading_stdin() {
        this.stdin.removeListener('line', this.stdin_listener);
        this.stdin.close();
    }

    private stdin_listener = (line: string) => {
        if (this.is_paused) {
            return;
        }

        const _line = line.trim();
        const input = this.key_parser.parse(_line);
        this.handle_input(input);
    }

    private handle_input = (input: string) => {
        let input_type: IInputType | null = null;

        try {
            input_type = this.rule_tree.navigate(input);
        } catch (err) {
            this.input.next({
                err,
                input_type: IInputType.INVALID_INPUT,
                last_input: input,
            });
            return;
        }

        if (input_type != null) {
            this.input.next({
                input_type,
                last_input: input,
            });
        }
    }

    public pause_input() {
        this.is_paused = true;
    }

    public resume_input() {
        this.is_paused = false;
    }

    public sub() {
        return this.input;
    }

    private get_input_types(): IInputType[] {
        return [
            IInputType.MENU,
            IInputType.VIEW_ALL_TICKETS,
            IInputType.VIEW_SINGLE_TICKET,
            IInputType.NEXT_PAGE,
            IInputType.PREVIOUS_PAGE,
            IInputType.QUIT,
        ]
    }

    public get_input_options(): IInputOption[] {
        const input_types = this.get_input_types();

        const options: IInputOption[] = []
        for (let type of input_types) {
            const display = this.input_type_display_map.get(type);
            if (display != null) {
                options.push({
                    type,
                    display,
                    key_option: type.toString(),
                });
            }
        }
        return options;
    }

    private init_input_type_display_map() {
        this.input_type_display_map.set(IInputType.VIEW_ALL_TICKETS, 'view all tickets');
        this.input_type_display_map.set(IInputType.VIEW_SINGLE_TICKET, 'view a single ticket');
        this.input_type_display_map.set(IInputType.NEXT_PAGE, 'go to the next page');
        this.input_type_display_map.set(IInputType.PREVIOUS_PAGE, 'go to the previous page');
        this.input_type_display_map.set(IInputType.QUIT, 'quit');
        this.input_type_display_map.set(IInputType.MENU, 'view the menu');
    }
}