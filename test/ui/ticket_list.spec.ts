import chai from 'chai';
import chai_as_promised from 'chai-as-promised';
import sinon from 'sinon';
import TicketList from '../../src/ui/ticket_list';
import { sample_ticket, sample_ticket_row_rendered } from '../test_data';
import * as api from '../../src/api/list_tickets';

chai.use(chai_as_promised);
const expect = chai.expect;

const create_error_stub = (error_code: number = -1) => sinon.stub(api, 'list_tickets')
    .returns(new Promise((resolve, reject) => {
        reject({
            response: {
                status: error_code,
            }
        });
    }));

const create_success_stub = () => sinon.stub(api, 'list_tickets')
    .returns(new Promise((resolve) => {
        resolve({
            next_page: null,
            previous_page: null,
            count: 1,
            tickets: Array(10).fill(sample_ticket),
        });
    }));

describe('TicketList', () => {
    const view = new TicketList();

    describe('#fetch_current_page()', () => {
        it('should not throw any API errors', async () => {
            const stub = create_error_stub();
            await expect(view.fetch_current_page()).to.be.fulfilled;
            stub.restore();
        })

        it('should invoke api.list_tickets()', async () => {
            const stub = create_success_stub();
            await view.fetch_current_page();
            expect(stub).to.have.been.called;
            stub.restore();
        })
    })

    describe('#go_to_previous_page()', () => {
        it('should not invoke api.list_tickets() if no previous page', async () => {
            const stub = create_success_stub();
            await view.go_to_previous_page();
            expect(stub).to.not.have.been.called;
            stub.restore();
        })
        it('should invoke api.list_tickets() if there is a previous page', async () => {
            const stub = create_success_stub();
            const pre_current_page = view['current_page'];
            view['current_page'] = 2;
            await view.go_to_previous_page();
            expect(stub).to.have.been.called;
            stub.restore();
            view['current_page'] = pre_current_page;
        })
    })
    describe('#go_to_next_page()', () => {
        it('should not invoke api.list_tickets() if no next page', async () => {
            const stub = create_success_stub();
            const pre_total_page = view['total_pages'];
            const pre_current_page = view['current_page'];
            view['total_pages'] = 1;
            view['current_page'] = 1
            await view.go_to_next_page();
            expect(stub).to.not.have.been.called;
            stub.restore();
            view['total_pages'] = pre_total_page;
            view['current_page'] = pre_current_page;
        })
        it('should invoke api.list_tickets() if there is a next page', async () => {
            const stub = create_success_stub();
            const pre_total_page = view['total_pages'];
            const pre_current_page = view['current_page'];
            view['total_pages'] = 2;
            view['current_page'] = 1
            await view.go_to_next_page();
            expect(stub).to.have.been.called;
            stub.restore();
            view['total_pages'] = pre_total_page;
            view['current_page'] = pre_current_page;
        })
    })

    describe('#render()', () => {
        it('should return "Something went wrong. Please try again later." if API responds with other errors', async () => {
            const stub = create_error_stub(-1);
            const view = new TicketList();
            await view.fetch_current_page();
            const str = view.render();
            expect(str).to.equal('Something went wrong. Please try again later.');
            stub.restore();
        })
        it('should return str representation of the ticket list if success', async () => {
            const stub = create_success_stub();
            const view = new TicketList();
            await view.fetch_current_page();
            const str = view.render();
            expect(str).to.equal(sample_ticket_row_rendered);
            stub.restore();
        })
    })
})