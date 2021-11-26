import { Subject } from 'rxjs';
import readline from 'readline';
import * as _ from 'lodash';
import { is_numeric } from './util';
import KeyParser from './key_parser';
import { IInputEvent, IInputOption, InputType, SpecialKey } from '../types';



export class InputRuleNode {
    private children_map: Map<string, InputRuleNode>;
    private input_type: InputType | null;
    constructor(children_map: Map<string, InputRuleNode>, type: InputType | null = null) {
        this.children_map = children_map;
        this.input_type = type;
    }

    public get_child(input: string): InputRuleNode | null {
        let child = this.children_map.get(input);
        if (child != null) {
            return child;
        }

        if (is_numeric(input)) {
            child = this.children_map.get('#');
            if (child != null) {
                return child;
            }
        }

        return null;
    }

    public is_type_node(): boolean {
        return this.input_type != null;
    }

    public get_type(): InputType {
        return this.input_type!;
    }
}

type InputRule = InputType | { [key: string]: InputRule };

export class InputRuleTree {
    private input_rule: InputRule;
    private current_node: InputRuleNode;
    private root: InputRuleNode;

    constructor(input_rule: InputRule) {
        this.input_rule = input_rule;
        this.root = this.build_tree(this.input_rule);
        this.current_node = this.root;
    }

    private build_tree(input_rule: InputRule): InputRuleNode {
        const is_base_type = !(_.isObject(input_rule));
        if (is_base_type) {
            const base_type = input_rule as InputType;
            return new InputRuleNode(new Map(), base_type);
        } else {
            const child_map = new Map<string, InputRuleNode>();
            const child_rules = Object.entries(input_rule);
            for (let [key, rule] of child_rules) {
                const child_node = this.build_tree(rule);
                child_map.set(key, child_node);
            }
            const node = new InputRuleNode(child_map);
            return node;
        }
    }

    public navigate(input: string): InputType | null {
        const child = this.current_node.get_child(input);
        if (!child) {
            throw new Error("CHILD_DNE");
        }
        if (child.is_type_node()) {
            const type = child.get_type();
            this.current_node = this.root;
            return type;
        } else {
            this.current_node = child;
            return null;
        }
    }
}

export default class InputParser {

    private input: Subject<IInputEvent>;
    private rule_tree: InputRuleTree;
    private is_paused: boolean;
    private key_parser: KeyParser;
    private stdin: readline.Interface;

    private input_type_display_map: Map<InputType, string>;

    constructor() {
        this.input = new Subject();

        this.is_paused = false;

        this.rule_tree = new InputRuleTree(this.get_input_rules());

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
        let input_type: InputType | null = null;

        try {
            input_type = this.rule_tree.navigate(input);
        } catch (err) {
            this.input.next({
                err,
                input_type: InputType.INVALID_INPUT,
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

    private get_input_rules(): InputRule {
        return {
            '1': InputType.VIEW_ALL_TICKETS,
            '2': {
                '#': InputType.VIEW_SINGLE_TICKET,
            },
            'quit': InputType.QUIT,
            [SpecialKey.LEFT]: InputType.PREVIOUS_PAGE,
            [SpecialKey.RIGHT]: InputType.NEXT_PAGE,
            'menu': InputType.MENU,
        };
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

    private get_input_types(): InputType[] {
        return [
            InputType.MENU,
            InputType.VIEW_ALL_TICKETS,
            InputType.VIEW_SINGLE_TICKET,
            InputType.NEXT_PAGE,
            InputType.PREVIOUS_PAGE,
            InputType.QUIT,
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
        this.input_type_display_map.set(InputType.VIEW_ALL_TICKETS, 'view all tickets');
        this.input_type_display_map.set(InputType.VIEW_SINGLE_TICKET, 'view a single ticket');
        this.input_type_display_map.set(InputType.NEXT_PAGE, 'go to the next page');
        this.input_type_display_map.set(InputType.PREVIOUS_PAGE, 'go to the previous page');
        this.input_type_display_map.set(InputType.QUIT, 'quit');
        this.input_type_display_map.set(InputType.MENU, 'view the menu');
    }
}