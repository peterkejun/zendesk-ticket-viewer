import { SpecialKey } from "../../types";

/**
 * A parser to parse a raw command-line input into either arrow keys or itself.
 * 
 * Common methods of reading stdin yields a Buffer or a string, which might contain
 *  escaped sequences such as the arrow keys. This parser will map raw arrow key 
 *  sequences into SpecialKey enums. 
 * 
 * @class
 * @see SpecialKey
 */
export default class KeyParser {

    /**
     * An array of the 4 arrow key enums, in arbitrary order. 
     */
    private special_keys: SpecialKey[];

    /**
     * Initialize the parser by populating the arrow key array.
     */
    constructor() {
        this.special_keys = [
            SpecialKey.UP,
            SpecialKey.DOWN,
            SpecialKey.RIGHT,
            SpecialKey.LEFT,
        ];
    }

    /**
     * 
     * @param key raw input from stdin
     * @returns arrow key enum if input is arrow key sequence, str(key) otherwise.
     */
    public parse(key: Buffer | string): string | SpecialKey {
        // cast key to utf-8 string
        const utf8 = typeof key === 'string' ? key : key.toString('utf-8');

        // check key against the special keys
        const special_key = this.special_keys.find(ak => ak === utf8);
        if (special_key) {
            // if key is arrow key, return arrow key enum
            return special_key;
        }

        // return string version of key
        return utf8;
    }
}