import { expect } from "chai";
import { describe } from "mocha";
import { make_whitespace, pad_string } from "../../src/ui/util";

const random_positive_number = (upper_bound: number = 10000) => Math.ceil(Math.random() * upper_bound);

describe('util', () => {
    describe('make_whitespace()', () => {
        it('should return string of length if length is positive', () => {
            const length = random_positive_number()
            const str = make_whitespace(length);
            expect(str).to.have.lengthOf(length);
        })
        it('should return empty string if length is negative', () => {
            const length = -random_positive_number();
            const str = make_whitespace(length);
            expect(str).to.have.lengthOf(0);
        })
        it('should return empty string if length is zero', () => {
            const str = make_whitespace(0);
            expect(str).to.have.lengthOf(0);
        })
    })
    describe('pad_string()', () => {
        describe('if char limit is positive', () => {
            describe('if char limit is longer than string', () => {
                const char_limit = 30;
                const str = 'ABCDEFG';
                const res_str = pad_string(str, char_limit);

                it('should right-pad string with whitespace', () => {
                    const str = 'ABCDEFG';
                    expect(res_str.substring(str.length).trim()).to.have.lengthOf(0);
                })
                it('should return string of length char_limit', () => {
                    const res_str = pad_string(str, char_limit);
                    expect(res_str).to.have.a.lengthOf(char_limit);
                })
            })
            describe('if char limit is less than string', () => {
                const char_limit = 10;
                const str = 'ABCDEFGHIJKLMNOPQRST';

                it('should right-pad substring with ...', () => {
                    const res_str = pad_string(str, char_limit);
                    expect(res_str.substring(res_str.length - 3)).to.equal('...');
                })
                it('should return string of length char_limit', () => {
                    const res_str = pad_string(str, char_limit);
                    expect(res_str).to.have.a.lengthOf(char_limit);
                })
            })
            describe('if char limit is equal to length of string', () => {
                const char_limit = 10;
                const str = 'ABCDEFGHIJ';

                it('should return original string', () => {
                    const res_str = pad_string(str, char_limit);
                    expect(res_str).to.equal(str);
                })
                it('should return string of length char_limit', () => {
                    const res_str = pad_string(str, char_limit);
                    expect(res_str).to.have.a.lengthOf(char_limit);
                })
            })
        })

        describe('if char limit is zero', () => {
            it('should return empty string', () => {
                const char_limit = 0;
                const str = 'ABCDEFGHIJ';
                const res_str = pad_string(str, char_limit);
                expect(res_str).to.have.a.lengthOf(0);
            })
        })

        describe('if char limit is negative', () => {
            it('should return original string', () => {
                const char_limit = -random_positive_number();
                const str = Array(-char_limit * 2).fill('A').join('');
                const res_str = pad_string(str, char_limit);
                expect(res_str).to.equal(str);
            })
        })

    })
})