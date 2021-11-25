export const make_whitespace = (count: number): string => {
    const arr = []
    for (let i = 0; i < count; i++) {
        arr.push(' ');
    }
    return arr.join('');
}

export const pad_string = (str: string, char_limit: number, padding: number = 0): string => {
    let padded = str;
    if (padded.length > char_limit - padding) {
        padded = padded.substring(0, char_limit - padding - 3) + '...';
    }
    padded += make_whitespace(char_limit - padded.length);
    return padded;
}

export const is_numeric = (str: string): boolean => {
    return !isNaN(+str);
}