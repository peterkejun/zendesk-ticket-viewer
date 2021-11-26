import { IInputRuleCallback, IInputType } from "../../types";
import { is_numeric } from "../util";

export class InputRuleNode {
    private children_map: Map<string, InputRuleNode>;
    private input_type: IInputType | null;
    private callback: IInputRuleCallback | null;

    constructor(children_map: Map<string, InputRuleNode>, callback: IInputRuleCallback | null = null, type: IInputType | null = null) {
        this.children_map = children_map;
        this.input_type = type;
        this.callback = callback;
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

    public get_type(): IInputType {
        return this.input_type!;
    }

    public get_callback(): IInputRuleCallback | null {
        return this.callback;
    }
}