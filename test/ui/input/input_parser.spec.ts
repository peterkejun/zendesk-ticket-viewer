import chai from "chai";
import sinon from 'sinon';
import sinon_chai from 'sinon-chai';
import { describe } from "mocha";
import mock_stdin from 'mock-stdin';
import { Subject } from "rxjs";
import { IInputRule, IInputType, SpecialKey } from "../../../src/types";
import InputParser from "../../../src/ui/input/input_parser";

chai.use(sinon_chai);
const expect = chai.expect;

const app_rule: IInputRule = {
    children: {
        '1': IInputType.VIEW_ALL_TICKETS,
        '2': {
            children: {
                '#': IInputType.VIEW_SINGLE_TICKET,
            },
        },
        'quit': IInputType.QUIT,
        [SpecialKey.LEFT]: IInputType.PREVIOUS_PAGE,
        [SpecialKey.RIGHT]: IInputType.NEXT_PAGE,
        'menu': IInputType.MENU,
    },
};

describe('InputParser', () => {
    let stdin: mock_stdin.MockSTDIN;
    const parser = new InputParser(app_rule);
    const stub = sinon.stub();

    before(() => {
        stdin = mock_stdin.stdin();
    })
    after(() => {
        stdin.restore();
    })
    afterEach(() => {
        stub.reset();
    })

    describe('#get_input_options()', () => {
        const options_must_have = [
            IInputType.MENU,
            IInputType.VIEW_ALL_TICKETS,
            IInputType.VIEW_SINGLE_TICKET,
            IInputType.NEXT_PAGE,
            IInputType.PREVIOUS_PAGE,
            IInputType.QUIT,
        ];

        it('should return all 6 options', () => {
            const options = parser.get_input_options();
            expect(options.map(o => o.type)).to.have.same.members(options_must_have);
        })
        it('should return labels for each option', () => {
            const options = parser.get_input_options();
            for (let option of options) {
                expect(option.display).to.be.a('string');
                expect(option.display).to.have.length.greaterThan(0);
            }
        })
        it('should return keys for each option', () => {
            const options = parser.get_input_options();
            for (let option of options) {
                expect(option.key_option).to.be.a('string');
                expect(option.key_option).to.have.length.greaterThan(0);
            }
        })
    })

    describe('#sub()', () => {
        after(() => {
            parser.sub().subscribe({
                next: stub,
            });
        })
        it('should return an rxjs Subject', () => {
            const sub = parser.sub();
            expect(sub).to.be.an.instanceOf(Subject);
        });
    })

    describe('#start_reading_stdin()', () => {
        it('should subscribe to "line" events from stdin', () => {
            parser.start_reading_stdin();

            stdin.send('hello world\n');
            expect(stub).to.have.been.called;
        });
    })

    describe('#pause_input()', () => {
        it('should ignore following inputs from stdin', () => {
            parser.pause_input();
            stdin.send('hello world\n');
            expect(stub).to.not.have.been.called;
        })
    })

    describe('#resume_input()', () => {
        it('should resume reading inputs from stdin', () => {
            parser.resume_input();
            stdin.send('hello world\n');
            expect(stub).to.have.been.called;
        })
    })

    describe('#stop_reading_stdin()', () => {
        it('should stop reading inputs from stdin', () => {
            parser.stop_reading_stdin();
            stdin.send('hello world\n');
            expect(stub).to.not.have.been.called;
        })
    })

})