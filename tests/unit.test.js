const sinon = require('sinon');
const reseller = require('../api/reseller');
const ResellerModel = require('../models/reseller.model');
const log = require('../log/log');
const axios = require('axios');
const auth = require('../api/auth');
const Bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');

const chai = require('chai');
const expect = chai.expect;


describe('API Unit Tests', function() {
    log.error = sinon.stub();
    log.info = sinon.stub();

    describe('API Unit Tests - reseller.js', function() {

        describe('Unit Tests for function reseller.SaveReseller', function() {

            it('should return the status 400 when a name is not informed', function (done) {
                const requestMockWithoutName = {
                    body: {
                        cpf: '37850775724',
                        email: 'unit_test@test.com',
                        password: '12345678'
                    }
                };

                const requestMockEmptyName = {
                    body: {
                        name: '',
                        cpf: '37850775724',
                        email: 'unit_test@test.com',
                        password: '12345678'
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                reseller.saveReseller(requestMockWithoutName, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'Name is missing.'});

                reseller.saveReseller(requestMockEmptyName, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'Name is missing.'});

                sinon.restore();
                done();
            });

            it('should return the status 400 when a cpf is not informed', function (done) {
                const requestMockWithoutCpf = {
                    body: {
                        name: 'Unit Test',
                        email: 'unit_test@test.com',
                        password: '12345678'
                    }
                };

                const requestMockEmptyCpf = {
                    body: {
                        name: 'Unit Test',
                        cpf: '',
                        email: 'unit_test@test.com',
                        password: '12345678'
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                reseller.saveReseller(requestMockWithoutCpf, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'CPF is missing.'});

                reseller.saveReseller(requestMockEmptyCpf, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'CPF is missing.'});

                sinon.restore();
                done();
            });

            it('should return the status 400 when a cpf is invalid', function (done) {
                const requestMockShortCpf = {
                    body: {
                        name: 'Unit Test',
                        cpf: '1',
                        email: 'unit_test@test.com',
                        password: '12345678'
                    }
                };

                const requestMockLongCpf = {
                    body: {
                        name: 'Unit Test',
                        cpf: '123456789123456789',
                        email: 'unit_test@test.com',
                        password: '12345678'
                    }
                };

                const requestMockImpossibleCpf = {
                    body: {
                        name: 'Unit Test',
                        cpf: '45074359568',
                        email: 'unit_test@test.com',
                        password: '12345678'
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                reseller.saveReseller(requestMockShortCpf, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'CPF is not valid.'});

                reseller.saveReseller(requestMockLongCpf, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'CPF is not valid.'});

                reseller.saveReseller(requestMockImpossibleCpf, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'CPF is not valid.'});

                sinon.restore();
                done();
            });

            it('should return the status 400 when a email is not informed or invalid', function (done) {
                const requestMockWithoutEmail = {
                    body: {
                        name: 'Unit Test',
                        cpf: '37850775724',
                        password: '12345678'
                    }
                };

                const requestMockEmptyEmail = {
                    body: {
                        name: 'Unit Test',
                        cpf: '37850775724',
                        email: '',
                        password: '12345678'
                    }
                };

                const requestMockInvalidEmail = {
                    body: {
                        name: 'Unit Test',
                        cpf: '37850775724',
                        email: 'invalidEmail',
                        password: '12345678'
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                reseller.saveReseller(requestMockWithoutEmail, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'Email is not valid.'});

                reseller.saveReseller(requestMockEmptyEmail, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'Email is not valid.'});

                reseller.saveReseller(requestMockInvalidEmail, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'Email is not valid.'});

                sinon.restore();
                done();
            });

            it('should return the status 400 when a password is not informed', function (done) {
                const requestMockWithoutPassword = {
                    body: {
                        name: 'Unit Test',
                        cpf: '37850775724',
                        email: 'unit_test@test.com'
                    }
                };

                const requestMockEmptyPassword = {
                    body: {
                        name: 'Unit Test',
                        cpf: '37850775724',
                        email: 'unit_test@test.com',
                        password: ''
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                reseller.saveReseller(requestMockWithoutPassword, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'Password is missing.'});

                reseller.saveReseller(requestMockEmptyPassword, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'Password is missing.'});

                sinon.restore();
                done();
            });

            it('should return the status 400 when MongoDB return a validation failed', function (done) {

                const requestMock = {
                    body: {
                        name: 'Unit Test',
                        cpf: '37850775724',
                        email: 'unit_test@test.com',
                        password: '12345678'
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                let mongoErrorMock = new Error('Fake Error');
                mongoErrorMock.name = 'MongoError';
                mongoErrorMock.keyValue = {value: 'mockValue'};

                ResellerModel.prototype.save = sinon.stub();
                ResellerModel.prototype.save.throws(mongoErrorMock);

                reseller.saveReseller(requestMock, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: `The following value is already registered: ${JSON.stringify(mongoErrorMock.keyValue)}` });

                sinon.restore();
                done();
            });

            it('should return the status 200 when everything is ok.', function (done) {

                const requestMock = {
                    body: {
                        name: 'Unit Test',
                        cpf: '37850775724',
                        email: 'unit_test@test.com',
                        password: '12345678'
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                ResellerModel.prototype.save = sinon.stub();
                ResellerModel.prototype.save.returns();

                reseller.saveReseller(requestMock, responseMock).then(function (data) {
                    sinon.assert.calledWith (responseMock.status, 200);
                    sinon.assert.calledWith (responseMock.send, { message: 'New Reseller save with success.' });
                });

                sinon.restore();
                done();
            });

        });

        describe('Unit Tests for function reseller.savePurchase', function() {
            
            it('should return the status 400 when a code is not informed', function (done) {
                const requestMockWithoutCode = {
                    body: {
                        value: 100.0
                    }
                };

                const requestMockEmptyCode = {
                    body: {
                        code: '',
                        value: 100.0
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                reseller.savePurchase(requestMockWithoutCode, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'Code is missing.'});

                reseller.savePurchase(requestMockEmptyCode, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'Code is missing.'});

                sinon.restore();
                done();
            });

            it('should return the status 400 when a value is not informed', function (done) {
                const requestMockWithoutValue = {
                    body: {
                        code: '123'
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                reseller.savePurchase(requestMockWithoutValue, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'Value is missing.'});

                sinon.restore();
                done();
            });

            it('should return the status 400 when a value is not valid', function (done) {
                const requestMockWithValueNaN = {
                    body: {
                        code: '123',
                        value: 'Not a Number'
                    }
                };

                const requestMockWithNegativeValue = {
                    body: {
                        code: '123',
                        value: -100.0
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                reseller.savePurchase(requestMockWithValueNaN, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'Value is not valid.'});

                reseller.savePurchase(requestMockWithNegativeValue, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'Value is not valid.'});

                sinon.restore();
                done();
            });

            it('should return the status 404 when a reseller not found', function (done) {
                const requestMock = {
                    body: {
                        code: '123',
                        value: 100.0
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                ResellerModel.findById = sinon.stub();
                ResellerModel.findById.returns(null);

                reseller.savePurchase(requestMock, responseMock).then(function () {
                    sinon.assert.calledWith (responseMock.status, 404);
                    sinon.assert.calledWith (responseMock.send, { message: 'The reseller was not found.'});
                });

                sinon.restore();
                done();
            });

            it('should return the status 200 when everything ok.', function (done) {
                const requestMock = {
                    body: {
                        code: '123',
                        value: 100.0
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                const resellerMock = {
                    purchases: [],
                    save: sinon.stub()
                }

                ResellerModel.findById = sinon.stub();
                ResellerModel.findById.returns(resellerMock);
                resellerMock.save.returns();

                reseller.savePurchase(requestMock, responseMock).then(function () {
                    sinon.assert.calledWith (responseMock.status, 200);
                    sinon.assert.calledWith (responseMock.send, { message: 'Purchase successfully registered.'});
                    expect(resellerMock.purchases).to.be.an('array');
                    expect(resellerMock.purchases).to.have.lengthOf(1);
                    expect(resellerMock.purchases[0].status).equal('Em validação');
                });

                sinon.restore();
                done();
            });

            it('should return the status 200 when everything ok to cpf in whitelist.', function (done) {
                const requestMock = {
                    body: {
                        code: '123',
                        value: 100.0
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                const resellerMock = {
                    purchases: [],
                    cpf: '15350946056',
                    save: sinon.stub()
                }

                ResellerModel.findById = sinon.stub();
                ResellerModel.findById.returns(resellerMock);

                resellerMock.save.returns();

                reseller.savePurchase(requestMock, responseMock).then(function () {
                    sinon.assert.calledWith (responseMock.status, 200);
                    sinon.assert.calledWith (responseMock.send, { message: 'Purchase successfully registered.'});

                    expect(resellerMock.purchases).to.be.an('array');
                    expect(resellerMock.purchases).to.have.lengthOf(1);
                    expect(resellerMock.purchases[0].status).equal('Aprovado');
                });

                sinon.restore();
                done();
            });

        });

        describe('Unit Tests for function reseller.getPurchases', function() {

            it('should return the status 404 when a reseller not found', function (done) {
                const requestMock = {
                    body: {
                        id: 12345
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                ResellerModel.findById = sinon.stub();
                ResellerModel.findById.returns(null);

                reseller.getPurchases(requestMock, responseMock).then(function () {
                    sinon.assert.calledWith (responseMock.status, 404);
                    sinon.assert.calledWith (responseMock.send, { message: 'The reseller was not found.'});
                });

                sinon.restore();
                done();
            });

            it('should return the status 200 when no purchase was registered', function (done) {
                const requestMock = {
                    body: {
                        id: 12345
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                const resellerMock = {
                    purchases: []
                };

                ResellerModel.findById = sinon.stub();
                ResellerModel.findById.returns(resellerMock);

                reseller.getPurchases(requestMock, responseMock).then(function () {
                    sinon.assert.calledWith (responseMock.status, 200);
                    sinon.assert.calledWith (responseMock.send, []);
                });

                sinon.restore();
                done();
            });

            it('should return the status 200 when everything ok', function (done) {
                const requestMock = {
                    body: {
                        id: 12345
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                const resellerMock = {
                    purchases: [{
                        code: '1',
                        value: 1000.0,
                        date: 'mockDate',
                        status: 'Em validação'
                    },{
                        code: '2',
                        value: 1250.0,
                        date: 'mockDate',
                        status: 'Em validação'
                    },{
                        code: '3',
                        value: 1501.0,
                        date: 'mockDate',
                        status: 'Em validação'
                    }]
                };

                const completePurchases = [{
                        code: '1',
                        value: 1000.0,
                        date: 'mockDate',
                        status: 'Em validação',
                        cashback: 0.1,
                        valueCashback: 1000.0 * 0.1
                    },{
                        code: '2',
                        value: 1250.0,
                        date: 'mockDate',
                        status: 'Em validação',
                        cashback: 0.15,
                        valueCashback: 1250.0 * 0.15
                    },{
                        code: '3',
                        value: 1501.0,
                        date: 'mockDate',
                        status: 'Em validação',
                        cashback: 0.2,
                        valueCashback: 1501.0 * 0.2
                    }];

                ResellerModel.findById = sinon.stub();
                ResellerModel.findById.returns(resellerMock);

                reseller.getPurchases(requestMock, responseMock).then(function () {
                    sinon.assert.calledWith (responseMock.status, 200);
                    sinon.assert.calledWith (responseMock.send, completePurchases);
                });

                sinon.restore();
                done();
            });

        });

        describe('Unit Tests for function reseller.getPurchases', function() {

            it('should return the status 404 when a reseller not found', function (done) {
                const requestMock = {
                    body: {
                        id: 12345
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                ResellerModel.findById = sinon.stub();
                ResellerModel.findById.returns(null);

                reseller.getCashback(requestMock, responseMock).then(function () {
                    sinon.assert.calledWith (responseMock.status, 404);
                    sinon.assert.calledWith (responseMock.send, { message: 'The reseller was not found.'});
                });

                sinon.restore();
                done();
            });

            it('should return the status 502 when a external API not respond', function (done) {
                const requestMock = {
                    body: {
                        id: 12345
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                const resellerMock = {
                    cpf: '15350946056'
                }

                ResellerModel.findById = sinon.stub();
                ResellerModel.findById.returns(resellerMock);

                let mongoErrorMock = new Error('Fake Error');

                axios.get = sinon.stub();
                axios.get.throws(mongoErrorMock);

                reseller.getCashback(requestMock, responseMock).then(function () {
                    sinon.assert.calledWith (responseMock.status, 502);
                    sinon.assert.calledWith (responseMock.send, { 
                        message: 'It was not possible to communicate with the external API to check the accumulated cachback.' });
                });

                sinon.restore();
                done();
            });

            it('should return the status 200 when a external API is online', function (done) {
                const requestMock = {
                    body: {
                        id: 12345
                    }
                };

                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };

                const axiosResponseMock = {
                    data: {
                        statusCode: 200,
                        body: {credit: 3000.0}
                    }
                }

                const resellerMock = {
                    cpf: '15350946056'
                }

                ResellerModel.findById = sinon.stub();
                ResellerModel.findById.returns(resellerMock);

                axios.get = sinon.stub();
                axios.get.returns(axiosResponseMock);

                reseller.getCashback(requestMock, responseMock).then(function () {
                    sinon.assert.calledWith (responseMock.status, axiosResponseMock.data.statusCode);
                    sinon.assert.calledWith (responseMock.send, axiosResponseMock.data.body);
                });

                sinon.restore();
                done();
            });

        });

    });

    describe('API Unit Tests - auth.js', function() {
    
        describe('Unit Tests for function auth.authentication', function() {
    
            it('should return the status 400 when a cpf is not informed', function (done) {
                const requestMock = {
                    body: {
                        password: '12345678'
                    }
                };
    
                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };
    
                auth.authentication(requestMock, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'No cpf or password was entered.'});
    
                sinon.restore();
                done();
            });
    
            it('should return the status 400 when a password is not informed', function (done) {
                const requestMock = {
                    body: {
                        cpf: '12345678910'
                    }
                };
    
                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };
    
                auth.authentication(requestMock, responseMock);
                sinon.assert.calledWith (responseMock.status, 400);
                sinon.assert.calledWith (responseMock.send, { message: 'No cpf or password was entered.'});
    
                sinon.restore();
                done();
            });
    
            it('should return the status 404 when a reseller is not found', function (done) {
                const requestMock = {
                    body: {
                        cpf: '12345678910',
                        password: '1234'
                    }
                };
    
                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };
    
                ResellerModel.findOne = sinon.stub();
                ResellerModel.findOne.returns(null);
    
                auth.authentication(requestMock, responseMock).then(function () {
                    sinon.assert.calledWith (responseMock.status, 404);
                    sinon.assert.calledWith (responseMock.send, { message: 'Not found the reseller.'});
                });
    
                sinon.restore();
                done();
            });
    
            it('should return the status 400 when the password is wrong', function (done) {
                const requestMock = {
                    body: {
                        cpf: '12345678910',
                        password: '1234'
                    }
                };
    
                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };
    
                const resellerMock = {
                    password: 'passwordMock'
                };
    
                ResellerModel.findOne = sinon.stub();
                ResellerModel.findOne.returns(resellerMock);
    
                Bcrypt.compare = sinon.stub();
                Bcrypt.compare.returns(false);
    
                auth.authentication(requestMock, responseMock).then(function () {
                    sinon.assert.calledWith (responseMock.status, 400);
                    sinon.assert.calledWith (responseMock.send, { message: 'The password is invalid.'});
                });
    
                sinon.restore();
                done();
            });
    
            it('should return the status 200 when get a valid token', function (done) {
                const requestMock = {
                    body: {
                        cpf: '12345678910',
                        password: '1234'
                    }
                };
    
                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };
    
                const resellerMock = {
                    password: 'passwordMock'
                };
    
                ResellerModel.findOne = sinon.stub();
                ResellerModel.findOne.returns(resellerMock);
    
                Bcrypt.compare = sinon.stub();
                Bcrypt.compare.returns(true);
    
                Jwt.sign = sinon.stub();
                Jwt.sign.returns('tokenMock');
    
                auth.authentication(requestMock, responseMock).then(function () {
                    sinon.assert.calledWith (responseMock.status, 200);
                    sinon.assert.calledWith (responseMock.send, { token: 'tokenMock'});
                });
    
                sinon.restore();
                done();
            });
        });
    
        describe('Unit Tests for function auth.authorization', function() {
    
            it('should return the status 401 when any token is provided', function (done) {
                const requestMock = {
                    headers: {}
                };
    
                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };
    
                auth.authorization(requestMock, responseMock, function () {});
                sinon.assert.calledWith (responseMock.status, 401);
                sinon.assert.calledWith (responseMock.send, { message: 'No token provided.'});
    
                sinon.restore();
                done();
            });
    
            it('should continue if a valid Bearer token was provided', function (done) {
                const requestMock = {
                    headers: {
                        authorization: 'Bearer mockToken'
                    }
                };
    
                const responseMock = {
                    status: sinon.stub(),
                    send: sinon.stub()
                };
    
                Jwt.verify = sinon.stub();
                Jwt.verify.returns();
    
                auth.authorization(requestMock, responseMock, function () {});
    
                sinon.restore();
                done();
            });
    
        });
    });

});