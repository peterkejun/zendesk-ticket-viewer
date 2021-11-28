import { expect } from "chai";
import { describe } from "mocha";
import mock_stdin from 'mock-stdin';
import TicketViewer from "../src/ticket_viewer";



describe('TicketViewer', () => {
    describe('#start()', () => {
        let prev_console_log: (...data: any[]) => void;
        let stdout: string = '';
        let stdin: mock_stdin.MockSTDIN;

        beforeEach(() => {
            stdout = '';
            prev_console_log = console.log;
            console.log = (...data: any[]) => {
                stdout += data.map(d => d.toString()).join(' ');
            }
            stdin = mock_stdin.stdin();
        })

        afterEach(() => {
            stdin.send('quit\n');
            stdin.restore();
            console.log = prev_console_log;
        })

        it('should render landing page to stdout', () => {

            const ticket_viewer = new TicketViewer();
            ticket_viewer.start();
            expect(stdout).to.equal(`
Welcome to the Ticket Viewer!
Type 'menu' to view options or 'quit' to quit.
        `);
        })
    })
})