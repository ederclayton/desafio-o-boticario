const app = require('../server');
const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const ResellerModel = require('../models/reseller.model');
const log = require('../log/log');

const expect = chai.expect;

describe('API Integration Tests', function() {
    const mockReseller = {
        name: 'integration_test',
        cpf: '37850775724',
        email: 'integration.test@test.com.br',
        password: '12345678'
    };

    log.error = sinon.stub();
    log.info = sinon.stub();

    const mockPurchase = {
        code: '12345',
        value: 1500.1
    };

    let token;

    describe('Integration Tests to POST /reseller', function() {

        it('should POST /reseller without name with status 400', function (done) {
            request(app)
                .post('/reseller')
                .send({
                    cpf: mockReseller.cpf, 
                    email: mockReseller.email, 
                    password: mockReseller.password
                })
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('Name is missing.');
                    done();
                });
        });

        it('should POST /reseller without cpf with status 400', function (done) {
            request(app)
                .post('/reseller')
                .send({
                    name: mockReseller.name, 
                    email: mockReseller.email, 
                    password: mockReseller.password
                })
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('CPF is missing.');
                    done();
                });
        });

        it('should POST /reseller with an invalid cpf with status 400', function (done) {
            request(app)
                .post('/reseller')
                .send({
                    name: mockReseller.name,
                    cpf: 'invalidCpf',
                    email: mockReseller.email, 
                    password: mockReseller.password
                })
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('CPF is not valid.');
                    done();
                });
        });

        it('should POST /reseller without email with status 400', function (done) {
            request(app)
                .post('/reseller')
                .send({
                    name: mockReseller.name,
                    cpf: mockReseller.cpf, 
                    password: mockReseller.password
                })
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('Email is not valid.');
                    done();
                });
        });

        it('should POST /reseller with an invalid email with status 400', function (done) {
            request(app)
                .post('/reseller')
                .send({
                    name: mockReseller.name,
                    email: 'invalidEmail',
                    cpf: mockReseller.cpf, 
                    password: mockReseller.password
                })
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('Email is not valid.');
                    done();
                });
        });

        it('should POST /reseller without password with status 400', function (done) {
            request(app)
                .post('/reseller')
                .send({
                    name: mockReseller.name,
                    cpf: mockReseller.cpf, 
                    email: mockReseller.email
                })
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('Password is missing.');
                    done();
                });
        });

        it('should POST /reseller with status 200', function (done) {
            request(app)
                .post('/reseller')
                .send(mockReseller)
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    done();
                });
        });
    
    });

    describe('Integration Tests to POST /login', function() {

        it('should POST /login without cpf with status 400', function(done) {
            request(app)
                .post('/login')
                .send({password: mockReseller.password})
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('No cpf or password was entered.');
                    done();
                });
        });

        it('should POST /login without password with status 400', function(done) {
            request(app)
                .post('/login')
                .send({password: mockReseller.password})
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('No cpf or password was entered.');
                    done();
                });
        });

        it('should POST /login with a cpf not save with status 404', function(done) {
            request(app)
                .post('/login')
                .send({cpf: 'CpfNotSave', password: mockReseller.password})
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(404);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('Not found the reseller.');
                    done();
                });
        });

        it('should POST /login with a wrong password with status 400', function(done) {
            request(app)
                .post('/login')
                .send({cpf: mockReseller.cpf, password: 'wrongPassword'})
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('The password is invalid.');
                    done();
                });
        });

        it('should POST /login with status 200 and a valid token', function(done) {
            request(app)
                .post('/login')
                .send({cpf: mockReseller.cpf, password: mockReseller.password})
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('token');
                    token = res.body.token;
                    done();
                });
        });
    });

    describe('Integration Tests to POST /purchase', function() {

        it('should POST /purchase without a valid token with status 401', function(done) {
            request(app)
                .post('/purchase')
                .send(mockPurchase)
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(401);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('No token provided.');
                    done();
                });
        });

        it('should POST /purchase without a code with status 400', function(done) {
            request(app)
                .post('/purchase')
                .send({value : mockPurchase.value})
                .set('Authorization', token)
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('Code is missing.');
                    done();
                });
        });

        it('should POST /purchase without a value with status 400', function(done) {
            request(app)
                .post('/purchase')
                .send({code : mockPurchase.code})
                .set('Authorization', token)
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('Value is missing.');
                    done();
                });
        });

        it('should POST /purchase with an invalid value with status 400', function(done) {
            request(app)
                .post('/purchase')
                .send({code: mockPurchase.code, value: 'invalidValue'})
                .set('Authorization', token)
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('Value is not valid.');
                    done();
                });
        });

        it('should POST /purchase with a negative value with status 400', function(done) {
            request(app)
                .post('/purchase')
                .send({code: mockPurchase.code, value: -600.00})
                .set('Authorization', token)
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('Value is not valid.');
                    done();
                });
        });

        it('should POST /purchase with status 200', function(done) {
            request(app)
                .post('/purchase')
                .send(mockPurchase)
                .set('Authorization', token)
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('Purchase successfully registered.');
                    done();
                });
        });

    });

    describe('Integration Tests to GET /purchases', function() {

        it('should GET /purchases without a valid token with status 401', function(done) {
            request(app)
                .get('/purchases')
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(401);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('No token provided.');
                    done();
                });
        });

        it('should GET /purchases with status 200', function(done) {
            request(app)
                .get('/purchases')
                .set('Authorization', token)
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('array').to.have.lengthOf(1);
                    expect(res.body[0]).to.be.an('object');
                    expect(res.body[0]).to.have.property('code').to.equal(mockPurchase.code);
                    expect(res.body[0]).to.have.property('value').to.equal(mockPurchase.value);
                    expect(res.body[0]).to.have.property('date').that.is.not.empty;
                    expect(res.body[0]).to.have.property('cashback').to.equal(0.2);
                    expect(res.body[0]).to.have.property('valueCashback').to.equal(0.2 * mockPurchase.value);
                    expect(res.body[0]).to.have.property('status').to.equal('Em validação');
                    done();
                });
        });

    });

    describe('Integration Tests to GET /cashback', function() {

        it('should GET /cashback without a valid token with status 401', function(done) {
            request(app)
                .get('/cashback')
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(401);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('No token provided.');
                    done();
                });
        });

        it('should GET /cashback with status 200', function(done) {
            request(app)
                .get('/cashback')
                .set('Authorization', token)
                .end( function (err, res) {
                    expect(err).to.equal(null);
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('credit');
                    done();
                });
        });

    });

    after(async function() {
        await ResellerModel.findOneAndDelete({cpf: mockReseller.cpf});
    });
});