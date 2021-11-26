import { SpecialKey } from "../types";


export default class KeyParser {

    private special_keys: SpecialKey[];

    constructor() {
        this.special_keys = [
            SpecialKey.UP,
            SpecialKey.DOWN,
            SpecialKey.RIGHT,
            SpecialKey.LEFT,
            SpecialKey.CTRL_C,
        ];
    }

    public parse(key: Buffer | string): string | SpecialKey {
        const utf8 = typeof key === 'string' ? key : key.toString('utf-8');
        const special_key = this.special_keys.find(ak => ak === utf8);
        if (special_key) {
            return special_key;
        }
        return utf8;
    }
}