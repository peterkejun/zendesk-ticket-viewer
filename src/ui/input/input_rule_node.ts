import { IInputRuleCallback, IInputType } from "../../types";
import { is_numeric } from "../util";

/**
 * This class represents a node in an abstract syntax tree
 */
export class InputRuleNode {
    /**
     * a mapping from string input to child node
     */
    private children_map: Map<string, InputRuleNode>;

    /**
     * the input type recognized by arriving at this node
     * This is null when no type can be recognized yet.
     * @see IInputType
     */
    private input_type: IInputType | null;

    /**
     * optional callback to invoke when this node is visited
     * @see IInputRuleCallback
     */
    private callback: IInputRuleCallback | null;

    /**
     * @param children_map a mapping from string input to child node
     * @param callback optional callback to invoke when this node is visited
     * @param type the input type recognized by arriving at this node
     */
    constructor(children_map: Map<string, InputRuleNode>, callback: IInputRuleCallback | null = null, type: IInputType | null = null) {
        this.children_map = children_map;
        this.input_type = type;
        this.callback = callback;
    }

    /**
     * Find the child node matching the string input
     * @param input a string to lookup the child node
     * @returns the child node if exists, null if not
     */
    public get_child(input: string): InputRuleNode | null {
        // try lookup by key
        let child = this.children_map.get(input);
        if (child != null) {
            return child;
        }

        // if input is numeric which represents any number,
        // try lookup by special key #
        if (is_numeric(input)) {
            child = this.children_map.get('#');
            if (child != null) {
                return child;
            }
        }

        // no child node is found
        return null;
    }

    /**
     * @returns whether this node is a leaf (aka an input has been recognized)
     */
    public is_type_node(): boolean {
        return this.input_type != null;
    }

    /**
     * @returns the input type recognized by arriving at this node
     */
    public get_type(): IInputType {
        return this.input_type!;
    }

    /**
     * @returns the optional callback to invoke when visiting this node
     */
    public get_callback(): IInputRuleCallback | null {
        return this.callback;
    }
}