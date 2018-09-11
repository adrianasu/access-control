const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Testing', function() {
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it('Should send status 200', function() {
        return chai.request(app)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
            })
            .catch(err => {
                console.log('Internal Error');
                res.status(500).send(err);
            });
    });

})