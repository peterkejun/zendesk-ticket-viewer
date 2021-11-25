export enum SpecialKey {
    UP = "\u001b[A",
    DOWN = "\u001b[B",
    RIGHT = "\u001b[C",
    LEFT = "\u001b[D",
    CTRL_C = "\u0003",
}

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