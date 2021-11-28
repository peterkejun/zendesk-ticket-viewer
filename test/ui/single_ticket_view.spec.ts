import { describe } from "mocha";
import * as api from '../../src/api/view_ticket';
import sinon from 'sinon';
import SingleTicketView from "../../src/ui/single_ticket_view";
import chai from "chai";
import chai_as_promised from 'chai-as-promised';
import { sample_ticket, sample_ticket_rendered } from "../test_data";
import { ITicket } from "src/types";

chai.use(chai_as_promised);
const expect = chai.expect;

const create_error_stub = (error_code: number = -1) => sinon.stub(api, 'view_ticket')
    .returns(new Promise((resolve, reject) => {
        reject({
            response: {
                status: error_code,
            }
        });
    }));

const create_success_stub = () => sinon.stub(api, 'view_ticket')
    .returns(new Promise((resolve) => {
        resolve(sample_ticket);
    }));

const create_null_ticket_stub = () => sinon.stub(api, 'view_ticket')
    .returns(new Promise((resolve) => {
        resolve(null as unknown as ITicket);
    }))

describe('SingleTicketView', () => {

    describe('#fetch_current_ticket', () => {

        it('should not throw any API errors', async () => {
            const stub = create_error_stub();
            const view = new SingleTicketView(-1);
            await expect(view.fetch_current_ticket()).to.be.fulfilled;
            stub.restore();
        })

        it('should invoke api.view_ticket()', async () => {
            const stub = create_success_stub();
            const view = new SingleTicketView(-1);
            await view.fetch_current_ticket();
            expect(stub).to.have.been.called;
            stub.restore();
        })
    })

    describe('#render()', () => {
        it('should return "Ticket not found" if API responds 404', async () => {
            const stub = create_error_stub(404);
            const view = new SingleTicketView(-1);
            await view.fetch_current_ticket();
            const str = view.render();
            expect(str).to.equal('Ticket not found');
            stub.restore();
        })
        it('should return "Something went wrong. Please try again later." if API responds with other errors', async () => {
            const stub = create_error_stub(-1);
            const view = new SingleTicketView(-1);
            await view.fetch_current_ticket();
            const str = view.render();
            expect(str).to.equal('Something went wrong. Please try again later.');
            stub.restore();
        })
        it('should return "Something went wrong. Please try again later." if ticket was not fetched for some other reason', async () => {
            const stub = create_null_ticket_stub();
            const view = new SingleTicketView(-1);
            await view.fetch_current_ticket();
            const str = view.render();
            expect(str).to.equal('Something went wrong. Please try again later.');
            stub.restore();
        })
        it('should return str representation of the ticket if success', async () => {
            const stub = create_success_stub();
            const view = new SingleTicketView(-1);
            await view.fetch_current_ticket();
            const str = view.render();
            expect(str).to.equal(sample_ticket_rendered);
            stub.restore();
        })
    })
})