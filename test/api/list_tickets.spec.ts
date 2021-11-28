import { describe } from 'mocha';
import { IListTicketsResponseData } from '../../src/types';
import { list_tickets } from '../../src/api/list_tickets';
import { expect } from 'chai';
import * as auth from '../../src/api/auth';
import sinon from 'sinon';
import { AxiosResponse } from 'axios';

const empty_list_ticket_response: Partial<AxiosResponse<IListTicketsResponseData>> = {
    data: {
        next_page: null,
        previous_page: null,
        count: 0,
        tickets: [],
    }
};

describe('api.list_tickets', () => {
    let stub: sinon.SinonStub;
    before(() => {
        stub = sinon.stub(auth, 'api_get').returns(new Promise((resolve) => {
            resolve(empty_list_ticket_response);
        }));
    })
    afterEach(() => {
        stub.reset();
    })
    after(() => {
        stub.restore();
    })
    it('should make GET request to Zendesk API', async () => {
        await list_tickets();
        expect(stub).to.have.been.called;
    })
    it('should set page index and size in query params', async () => {
        let url_page_index: string | null = null;
        let url_page_size: string | null = null;

        stub.restore();
        stub = sinon.stub(auth, 'api_get').callsFake(url => new Promise((resolve) => {
            url = url.split('?')[1];
            const params = new URLSearchParams(url);
            url_page_index = params.get('page');
            url_page_size = params.get('per_page');
            resolve(empty_list_ticket_response);
        }))
        const page_index = 1;
        const page_size = 25;
        await list_tickets(page_index, page_size);
        expect(url_page_index).to.not.be.null;
        expect(+url_page_index!).to.equal(page_index);
        expect(url_page_size).to.not.be.null;
        expect(+url_page_size!).to.equal(page_size);
    })
})