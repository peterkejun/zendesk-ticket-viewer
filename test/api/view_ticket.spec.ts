import { describe } from 'mocha';
import { IViewTicketsResponseData, ROUTE } from '../../src/types';
import { view_ticket } from '../../src/api/view_ticket';
import { expect } from 'chai';
import * as auth from '../../src/api/auth';
import sinon from 'sinon';
import routes from '../../src/api/routes';
import { AxiosResponse } from 'axios';
import { sample_ticket } from '../test_data';

const empty_view_ticket_response: Partial<AxiosResponse<IViewTicketsResponseData>> = {
    data: {
        next_page: null,
        previous_page: null,
        count: 0,
        ticket: sample_ticket,
    }
};

describe('api.view_ticket', () => {
    let stub: sinon.SinonStub;
    before(() => {
        stub = sinon.stub(auth, 'api_get').returns(new Promise((resolve) => {
            resolve(empty_view_ticket_response);
        }));
    })
    afterEach(() => {
        stub.reset();
    })
    after(() => {
        stub.restore();
    })
    it('should make GET request to Zendesk API', async () => {
        await view_ticket(-1);
        expect(stub).to.have.been.called;
    })
    it('should set ticket id in url', async () => {
        const ticket_id = 1;
        const expected_url = `${routes.get(ROUTE.VIEW_TICKET)!}/${ticket_id}`;
        let request_url: string | null = null;
        stub.restore();
        stub = sinon.stub(auth, 'api_get').callsFake(url => new Promise((resolve) => {
            request_url = url;
            resolve(empty_view_ticket_response);
        }))
        await view_ticket(ticket_id);
        expect(request_url).to.not.be.null;
        expect(request_url!).to.equal(expected_url);
    })
})