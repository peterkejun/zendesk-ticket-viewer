import { Subject } from 'rxjs';
import readline from 'readline';
import KeyParser from './key_parser';
import { IInputEvent, IInputOption, IInputType, IInputRule } from '../../types';
import { InputRuleTree } from './input_rule_tree';


/**
 * Subject-based input parser for stdin, to recognize input sequence based on langauge rules
 */
export default class InputParser {

    /**
     * declarative definition of the syntax of input sequence
     * @see IInputRule
     */
    private input_rule: IInputRule;

    /**
     * rxjs subject that emits recognized input sequence
     * @see IInputEvent
     */
    private input: Subject<IInputEvent>;

    /**
     * abstract syntax tree to represent input rules
     * @see InputRuleTree
     */
    private rule_tree: InputRuleTree;

    /**
     * flag to pause or resume reading from stdin
     * Inputs from stdin while paused will be ignored.
     */
    private is_paused: boolean;

    /**
     * parser to parse raw stdin input, especially escaped sequences
     * @see KeyParser
     */
    private key_parser: KeyParser;

    /**
     * stdin reader from "readline" module
     * @see https://www.npmjs.com/package/readline
     */
    private stdin: readline.Interface | null;

    /**
     * static map to store human-readable labels for input types
     * @see IInputType
     */
    private input_type_display_map: Map<IInputType, string>;

    /**
     * @param input_rule the input rule used to recognize input sequence
     */
    constructor(input_rule: IInputRule) {
        // build abstract syntax tree from input rule
        this.input_rule = input_rule;
        this.rule_tree = new InputRuleTree(this.input_rule);

        this.input = new Subject();

        this.key_parser = new KeyParser();

        // start reading stdin on init
        this.is_paused = false;

        this.stdin = null;

        // initailize static label mapping
        this.input_type_display_map = new Map();
        this.init_input_type_display_map();
    }

    /**
     * start recognizing input sequence from stdin
     */
    public start_reading_stdin() {
        // attach listener for inputs delimited by newline
        // this is important because it keeps the event loop going
        this.stdin = readline.createInterface({
            input: process.stdin,
        });
        this.stdin.on('line', this.stdin_listener);
    }

    /**
     * stop recognizing input sequence from stdin and end the current event
     * call this to remove the input parser from the next interation of the event loop
     */
    public stop_reading_stdin() {
        if (this.stdin) {
            // remove listener 
            this.stdin.removeListener('line', this.stdin_listener);

            // close the stdin stream
            this.stdin.close();
        }
    }

    /**
     * Core handler for user input from stdin
     * @param line A raw input delimited by newline from stdin
     */
    private stdin_listener = (line: string) => {
        // ignore this input if parser is paused
        if (this.is_paused) {
            return;
        }

        // sanitize the input
        const _line = line.trim();
        const input = this.key_parser.parse(_line);

        // run logic against the input
        this.handle_input(input);
    }

    /**
     * Core handler to recognize user input
     * Emits recognized input sequence from the "input" subject.
     * @param input Sanitized user input to recognize 
     */
    private handle_input = (input: string) => {
        let input_type: IInputType | null = null;

        // try recognizing the input in the abstract syntax tree
        try {
            input_type = this.rule_tree.navigate(input);
        } catch (err) {
            // emit invalid input if not allowed by the rule
            this.input.next({
                err,
                input_type: IInputType.INVALID_INPUT,
                last_input: input,
            });
            return;
        }

        // emit input sequence if recognized
        if (input_type != null) {
            this.input.next({
                input_type,
                last_input: input,
            });
        }
    }

    /**
     * pause the parser
     */
    public pause_input() {
        this.is_paused = true;
    }

    /**
     * resume the parser
     */
    public resume_input() {
        this.is_paused = false;
    }

    /**
     * Getter for the "input" subject that emits recognized input sequence
     * @returns the "input" subject
     */
    public sub() {
        return this.input;
    }

    /**
     * @returns a list of available & valid input types, in order of readability
     */
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

    /**
     * @returns array of available options, key inputs, and their readable labels
     * @see IInputOption
     */
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

    /**
     * Populates the type-to-label mapping
     */
    private init_input_type_display_map() {
        this.input_type_display_map.set(IInputType.VIEW_ALL_TICKETS, 'view all tickets');
        this.input_type_display_map.set(IInputType.VIEW_SINGLE_TICKET, 'view a single ticket');
        this.input_type_display_map.set(IInputType.NEXT_PAGE, 'go to the next page');
        this.input_type_display_map.set(IInputType.PREVIOUS_PAGE, 'go to the previous page');
        this.input_type_display_map.set(IInputType.QUIT, 'quit');
        this.input_type_display_map.set(IInputType.MENU, 'view the menu');
    }
}