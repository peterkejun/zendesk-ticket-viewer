import { expect } from "chai";
import { describe } from "mocha";
import { api_get, api_post, api_patch, api_delete } from "../../src/api/auth";

describe('auth', () => {
    describe('#api_get()', () => {
        it('should return api_get as an a function', () => {
            expect(api_get).to.be.a('function');
        })
    })
    describe('#api_post()', () => {
        it('should return api_post as an a function', () => {
            expect(api_post).to.be.a('function');
        })
    })
    describe('#api_patch()', () => {
        it('should return api_patch as an a function', () => {
            expect(api_patch).to.be.a('function');
        })
    })
    describe('#api_delete()', () => {
        it('should return api_delete as an a function', () => {
            expect(api_delete).to.be.a('function');
        })
    })
})