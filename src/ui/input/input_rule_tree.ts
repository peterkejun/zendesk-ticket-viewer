import { IInputRule, IInputType } from "../../types";
import { InputRuleNode } from "./input_rule_node";
import * as _ from 'lodash';


/**
 * This class represents an abstract syntax tree.
 * An input sequence is recognized if there exists a path from root to leaf
 * where each node on the path matches an input in the sequence in order.
 */
export class InputRuleTree {
    /**
     * The input rule to build the tree on
     * @see IInputRule
     */
    private input_rule: IInputRule;

    /**
     * The current node in the process of pattern matching
     * @see InputRuleNode
     */
    private current_node: InputRuleNode;

    /**
     * The root node of the tree
     * @see InputRuleNode
     */
    private root: InputRuleNode;

    /**
     * @param input_rule The input rule to build the tree on
     */
    constructor(input_rule: IInputRule) {
        this.input_rule = input_rule;
        this.root = this.build_tree(this.input_rule);
        this.current_node = this.root;
    }

    /**
     * Recursively build the tree using an input rule
     * @param input_rule declarative rule definition for this AST
     * @returns the root of the subtree created for the rule
     */
    private build_tree(input_rule: IInputRule): InputRuleNode {
        // if this node represents an recognized input sequence, build the leaf node
        const is_base_type = !(_.isObject(input_rule));
        if (is_base_type) {
            const base_type = input_rule as IInputType;
            return new InputRuleNode(new Map(), null, base_type);
        } else {
            // go through each child rule and build subtrees
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

    /**
     * navigate the AST by matching children of the current node with the input string
     * @param input the current input string
     * @returns recognized input sequence if exists, null if not
     * @throws "CHILD_DNE" if no matching child is found -> invalid input
     */
    public navigate(input: string): IInputType | null {
        // find child of current node
        const child = this.current_node.get_child(input);

        // if no child found, then the input is invalid, throw error
        if (!child) {
            throw new Error("CHILD_DNE");
        }

        // if thsi child is leaf node, then an input sequence is recognized, return 
        // the recognized input sequence and reset current node to root for the next
        // input sequence.
        if (child.is_type_node()) {
            const type = child.get_type();
            this.current_node = this.root;
            return type;
        } else {
            // if no input sequence is recognized yet, traverse the child node
            // and invoke the callback for the child node because it is visited
            const callback = child.get_callback();
            if (callback) {
                callback();
            }
            this.current_node = child;

            return null;
        }
    }
}