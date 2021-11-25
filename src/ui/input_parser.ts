import { Subject } from 'rxjs';
import readline from 'readline';
import * as _ from 'lodash';
import { is_numeric } from './util';

export enum InputType {
    VIEW_ALL_TICKETS = 1,
    VIEW_SINGLE_TICKET = 2,
    QUIT = 3,
    INVALID_INPUT = 4,
}

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

    private input: Subject<InputType>;
    private stdin_interface: readline.Interface;
    private rule_tree: InputRuleTree;
    private is_paused: boolean;

    constructor() {
        this.input = new Subject();

        this.is_paused = true;

        this.rule_tree = new InputRuleTree(this.get_input_rules());

        this.stdin_interface = readline.createInterface({
            input: process.stdin,
        });

        this.stdin_interface.on('line', line => {
            if (this.is_paused) {
                return;
            }

            const _line = line.trim();
            let input_type: InputType | null = null;
            try {
                input_type = this.rule_tree.navigate(_line);
            } catch (err) {
                this.input.error({
                    err,
                    input_type: InputType.INVALID_INPUT,
                    current_input: _line,
                });
                return;
            }

            if (input_type != null) {
                this.input.next(input_type);
            }
        })
    }

    private get_input_rules(): InputRule {
        return {
            '1': InputType.VIEW_ALL_TICKETS,
            '2': {
                '#': InputType.VIEW_SINGLE_TICKET,
            },
            '3': InputType.QUIT,
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
}