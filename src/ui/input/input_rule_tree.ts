import { IInputRule, IInputType } from "../../types";
import { InputRuleNode } from "./input_rule_node";
import * as _ from 'lodash';


export class InputRuleTree {
    private input_rule: IInputRule;
    private current_node: InputRuleNode;
    private root: InputRuleNode;

    constructor(input_rule: IInputRule) {
        this.input_rule = input_rule;
        this.root = this.build_tree(this.input_rule);
        this.current_node = this.root;
    }

    private build_tree(input_rule: IInputRule): InputRuleNode {
        const is_base_type = !(_.isObject(input_rule));
        if (is_base_type) {
            const base_type = input_rule as IInputType;
            return new InputRuleNode(new Map(), null, base_type);
        } else {
            const child_map = new Map<string, InputRuleNode>();
            const child_rules = Object.entries(input_rule.children);
            for (let [key, rule] of child_rules) {
                const child_node = this.build_tree(rule);
                child_map.set(key, child_node);
            }
            const node = new InputRuleNode(child_map, input_rule.callback);
            return node;
        }
    }

    public navigate(input: string): IInputType | null {
        const child = this.current_node.get_child(input);
        if (!child) {
            throw new Error("CHILD_DNE");
        }
        if (child.is_type_node()) {
            const type = child.get_type();
            this.current_node = this.root;
            return type;
        } else {
            const callback = child.get_callback();
            if (callback) {
                callback();
            }
            this.current_node = child;
            return null;
        }
    }
}