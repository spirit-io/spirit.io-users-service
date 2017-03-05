import { Fixtures } from './fixtures';
import { Server } from 'spirit.io/lib/application';
import { expect } from 'chai';
import { Service } from 'spirit.io/lib/core';
import { setup } from 'f-mocha';
// this call activates f-mocha wrapper.
setup();

let server: Server;

describe('User entity services:', () => {

    before(function (done) {
        this.timeout(10000);
        server = Fixtures.setup(done);
    });

    it('Login with bad credentials should fail', () => {
        expect(() => Service.act('model:User,action:invoke', {
            name: 'login',
            params: {
                login: 'badUser',
                password: 'badPwd'
            }
        })).to.throw("User 'badUser' not found.");
    });

    it('Login with bad password should fail', () => {
        expect(() => Service.act('model:User,action:invoke', {
            name: 'login',
            params: {
                login: 'admin',
                password: 'badPwd'
            }
        })).to.throw("Wrong password !");
    });

    it('Login with correct credentials should work', () => {
        let body = Service.act('model:User,action:invoke', {
            name: 'login',
            params: {
                login: 'admin',
                password: 'admin'
            }
        });
        expect(body.login).to.equal('admin');
        expect(body.role).to.be.not.null;
    });
});