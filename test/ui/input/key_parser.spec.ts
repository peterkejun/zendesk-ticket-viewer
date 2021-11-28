import { expect } from "chai";
import { describe } from "mocha";
import { SpecialKey } from "../../../src/types";
import KeyParser from "../../../src/ui/input/key_parser";
import crypto from 'crypto';

describe('KeyParser', () => {

    describe('#parse()', () => {
        describe('key: string', () => {
            it('should convert (string) up arrow key to enum SpecialKey.UP', () => {
                const parser = new KeyParser();
                const key = parser.parse('\u001b[A');
                expect(key).to.equal(SpecialKey.UP);
            })
            it('should convert (string) down arrow key to enum SpecialKey.DOWN', () => {
                const parser = new KeyParser();
                const key = parser.parse('\u001b[B');
                expect(key).to.equal(SpecialKey.DOWN);
            })
            it('should convert (string) right arrow key to enum SpecialKey.RIGHT', () => {
                const parser = new KeyParser();
                const key = parser.parse('\u001b[C');
                expect(key).to.equal(SpecialKey.RIGHT);
            })
            it('should convert (string) left arrow key to enum SpecialKey.LEFT', () => {
                const parser = new KeyParser();
                const key = parser.parse('\u001b[D');
                expect(key).to.equal(SpecialKey.LEFT);
            })
            it('should return input string for any other strings', () => {
                const parser = new KeyParser();
                for (let i = 0; i < 100; i++) {
                    const random_string = crypto.randomBytes(Math.ceil(Math.random() * 100)).toString('utf-8');
                    const key = parser.parse(random_string);
                    expect(key).to.equal(random_string);
                }
            })
        })
        describe('key: Buffer', () => {
            it('should convert (buffer) up arrow key to enum SpecialKey.UP', () => {
                const parser = new KeyParser();
                const buffer = Buffer.from('\u001b[A');
                const key = parser.parse(buffer);
                expect(key).to.equal(SpecialKey.UP);
            })
            it('should convert (buffer) down arrow key to enum SpecialKey.DOWN', () => {
                const parser = new KeyParser();
                const buffer = Buffer.from('\u001b[B');
                const key = parser.parse(buffer);
                expect(key).to.equal(SpecialKey.DOWN);
            })
            it('should convert (buffer) right arrow key to enum SpecialKey.RIGHT', () => {
                const parser = new KeyParser();
                const buffer = Buffer.from('\u001b[C');
                const key = parser.parse(buffer);
                expect(key).to.equal(SpecialKey.RIGHT);
            })
            it('should convert (buffer) left arrow key to enum SpecialKey.LEFT', () => {
                const parser = new KeyParser();
                const buffer = Buffer.from('\u001b[D');
                const key = parser.parse(buffer);
                expect(key).to.equal(SpecialKey.LEFT);
            })
            it('should return utf string for any other buffer', () => {
                const parser = new KeyParser();
                for (let i = 0; i < 100; i++) {
                    const random_string = crypto.randomBytes(Math.ceil(Math.random() * 100)).toString('utf-8');
                    const buffer = Buffer.from(random_string);
                    const key = parser.parse(buffer);
                    expect(key).to.equal(random_string);
                }
            })
        })

    })

})