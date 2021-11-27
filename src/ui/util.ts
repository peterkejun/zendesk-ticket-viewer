/**
 * create a whitespace string of length 
 * @param count number of whitespaces
 * @returns a string of "count" number of whitespaces
 */
export const make_whitespace = (count: number): string => {
    const arr = []
    for (let i = 0; i < count; i++) {
        arr.push(' ');
    }
    return arr.join('');
}

/**
 * pad a string to a length of "char_limit" using whitespaces.
 * if original string is longer than "char_limit", string is truncated and padded by ... at the end
 * if "char_limit" <= 0, original string is returned
 * @param str original string
 * @param char_limit length of output string
 * @param padding padding to the right of output string, included in char_limit
 * @returns a string of length "char_limit" padded by whitespace
 */
export const pad_string = (str: string, char_limit: number, padding: number = 0): string => {
    if (char_limit <= 0) {
        return str;
    }

    let padded = str;
    if (padded.length > char_limit - padding) {
        padded = padded.substring(0, char_limit - padding - 3) + '...';
    }
    padded += make_whitespace(char_limit - padded.length);
    return padded;
}

/**
 * @param str a string
 * @returns whether the string is numeric.
 */
export const is_numeric = (str: string): boolean => {
    return !isNaN(+str);
}