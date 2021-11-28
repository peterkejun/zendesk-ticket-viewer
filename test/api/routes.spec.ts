import { expect } from "chai";
import { describe } from "mocha";
import { ROUTE } from "../../src/types";
import { isUri } from 'valid-url';
import routes from "../../src/api/routes";

describe('routes', () => {
    const all_routes = [ROUTE.LIST_TICKETS, ROUTE.VIEW_TICKET];

    it('should export a map', () => {
        expect(routes).to.be.instanceOf(Map);
    })
    it('should export a map where keys are all routes', () => {
        expect([...routes.keys()]).to.have.same.members(all_routes);
    })
    it('should export a map where values are valid urls', () => {
        const sample_domain = 'https://www.example.com';
        const values = [...routes.values()].map(url => `${sample_domain}/${url}`);
        for (let value of values) {
            expect(isUri(value)).to.not.be.undefined;
        }
    })
})