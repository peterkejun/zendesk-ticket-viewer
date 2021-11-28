import { expect } from "chai";
import { describe } from "mocha";
import { IInputRule, IInputType } from "../../../src/types";
import { InputRuleTree } from '../../../src/ui/input/input_rule_tree';

describe('InputRuleTree', () => {
    describe('#navigate()', () => {
        describe('if valid input', () => {
            const leaf_type = IInputType.VIEW_ALL_TICKETS;
            let rule: IInputRule = {
                children: {
                    '1': {
                        children: {
                            '2': {
                                children: {
                                    '3': {
                                        children: {
                                            '4': leaf_type,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
            let tree = new InputRuleTree(rule);
            const inputs = ['1', '2', '3', '4'];
            it('should return null at every node other than the leaf', () => {
                for (let i = 0; i < inputs.length - 1; i++) {
                    const ret = tree.navigate(inputs[i]);
                    expect(ret).to.be.null;
                }
            });
            it('should return type at leaf', () => {
                const ret = tree.navigate(inputs[inputs.length - 1]);
                expect(ret).to.equal(leaf_type);
            });
            it('should reset cursor to root node after arriving at leaf', () => {
                const ret = tree.navigate(inputs[0]);
                expect(ret).to.be.null;
            })

            it('should invoke callback of all nodes except leaf node', () => {
                const callback_arr: number[] = [];
                rule = {
                    children: {
                        '1': {
                            callback: () => callback_arr.push(1),
                            children: {
                                '2': {
                                    callback: () => callback_arr.push(2),
                                    children: {
                                        '3': {
                                            callback: () => callback_arr.push(3),
                                            children: {
                                                '4': leaf_type,
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                tree = new InputRuleTree(rule);
                for (let i = 0; i < inputs.length; i++) {
                    tree.navigate(inputs[i]);
                }
                for (let i = 0; i < inputs.length - 1; i++) {
                    expect(callback_arr.findIndex(e => e === +inputs[i])).to.not.equal(-1);
                }
                expect(callback_arr.length).to.equal(inputs.length - 1);
            })
        })

        describe('if invalid input', () => {
            const leaf_type = IInputType.VIEW_ALL_TICKETS;
            const rule: IInputRule = {
                children: {
                    '1': {
                        children: {
                            '2': {
                                children: {
                                    '3': {
                                        children: {
                                            '4': leaf_type,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
            const tree = new InputRuleTree(rule);
            const inputs = ['1', '2', '3', '4'];

            it('should throw an error "CHILD_DNE"', () => {
                tree.navigate(inputs[0]);
                tree.navigate(inputs[1]);

                expect(() => tree.navigate('5')).to.throw('CHILD_DNE');
            })

        })
    })
})