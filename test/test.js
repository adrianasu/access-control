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

    it('Should get app test', function() {
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

     it('Should allow user to login', function () {
         return chai.request(app)
             .post('/login')
             .then(function (res) {
                 expect(res).to.have.status(200);
             })
             .catch(err => {
                 console.log('Internal Error');
                 res.status(500).send(err);
             });
     });

     it('Show info of employee with that id', function () {
         return chai.request(app)
             .get('/:id')
             .then(function (res) {
                 expect(res).to.have.status(200);
             })
             .catch(err => {
                 console.log('Internal Error');
                 res.status(500).send(err);
             });
     });

     it('Should create employee with that id', function () {
         return chai.request(app)
             .post('/:id')
             .then(function (res) {
                 expect(res).to.have.status(200);
             })
             .catch(err => {
                 console.log('Internal Error');
                 res.status(500).send(err);
             });
     });

     it('Should edit employee with that id info', function () {
         return chai.request(app)
             .put('/:id')
             .then(function (res) {
                 expect(res).to.have.status(200);
             })
             .catch(err => {
                 console.log('Internal Error');
                 res.status(500).send(err);
             });
     });

     it('Should delete employee with that id', function () {
         return chai.request(app)
             .delete('/:id')
             .then(function (res) {
                 expect(res).to.have.status(200);
             })
             .catch(err => {
                 console.log('Internal Error');
                 res.status(500).send(err);
             });
     });

     it('Should show employee info', function () {
         return chai.request(app)
             .get('/entrance/:id')
             .then(function (res) {
                 expect(res).to.have.status(200);
             })
             .catch(err => {
                 console.log('Internal Error');
                 res.status(500).send(err);
             });
     });

})