import { expect } from "chai";
import { describe } from "mocha";
import { IInputType } from "../../../src/types";
import { InputRuleNode } from '../../../src/ui/input/input_rule_node';

describe('InputRuleNode', () => {
    describe('#get_child()', () => {
        it('should return child if key exists', () => {
            const key = 'A';
            const child = new InputRuleNode(new Map(), null, null);
            const node = new InputRuleNode(new Map([
                [key, child],
            ]));
            const lookup_child = node.get_child(key);
            expect(lookup_child).to.equal(child);
        })
        it('should return null if key does not exist', () => {
            const key = 'A';
            const other_key = 'B';
            const child = new InputRuleNode(new Map(), null, null);
            const node = new InputRuleNode(new Map([
                [other_key, child],
            ]));
            const lookup_child = node.get_child(key);
            expect(lookup_child).to.be.null;
        });
        it('should return child with key "#" if lookup is numeric', () => {
            const key = Math.ceil(Math.random() * 100).toString();
            const child = new InputRuleNode(new Map(), null, null);
            const node = new InputRuleNode(new Map([
                ['#', child],
            ]));
            const lookup_child = node.get_child(key);
            expect(lookup_child).to.equal(child);
        })
    })
    describe('#is_type_node()', () => {
        it('should return true if node is a type node (leaf)', () => {
            const node = new InputRuleNode(new Map(), null, IInputType.VIEW_ALL_TICKETS);
            const is_type = node.is_type_node();
            expect(is_type).to.be.true;
        })
        it('should return false if node is not a type node (not leaf)', () => {
            const node = new InputRuleNode(new Map([
                ['A', new InputRuleNode(new Map(), null, IInputType.VIEW_ALL_TICKETS)]
            ]), null, null);
            const is_type = node.is_type_node();
            expect(is_type).to.be.false;

        })
    })
    describe('#get_type()', () => {
        it('should return the correct type if node is a type node (leaf)', () => {
            const type = IInputType.VIEW_ALL_TICKETS;
            const node = new InputRuleNode(new Map(), null, type);
            expect(node.get_type()).to.equal(type);
        })
        it('should return null if node is not a type node (not leaf)', () => {
            const node = new InputRuleNode(new Map([
                ['A', new InputRuleNode(new Map(), null, null)]
            ]), null, null);
            expect(node.get_type()).to.be.null;
        })
    })
    describe('#get_callback()', () => {
        it('should return the correct callback if node is created with a callback', () => {
            const callback = () => { let i = 0; };
            const node = new InputRuleNode(new Map(), callback, null);
            expect(node.get_callback()).to.equal(callback);
        })
        it('should return null if node is not created with a callback', () => {
            const node = new InputRuleNode(new Map(), null, null);
            expect(node.get_callback()).to.be.null;
        })
    })
})