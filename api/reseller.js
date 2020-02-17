const ResellerModel = require('../models/reseller.model');
const config = require('../config');
const Mongoose = require('mongoose');
const axios = require('axios');
const { cpf } = require('cpf-cnpj-validator');
const log = require('../log/log');

Mongoose.connect(
    config.getDbConnectionUri(),
    { 
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    function (error) {
        if (error) {
            log.error('Error on MongoDB connection.');
        } else {
            log.info('MongoDb connection established.');
        }
    }
);

const getCashbackPercentage = (valuePurchase) => {
    if (valuePurchase <= 1000.0) {
        return 0.1;
    } else if (valuePurchase > 1000.0 && valuePurchase <= 1500.0) {
        return 0.15;
    } else {
        return 0.2;
    }
};

const isValidEmail = (candidate) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(candidate);

const formatCpf = cpf_ => cpf_.replace('.','').replace('.','').replace('-','');

module.exports.saveReseller = async function (req, res) {
    try {
        if (!req.body.name) {
            log.error('When creating a new Reseller, returned error. Name is missing.');
            res.status(400);
            res.send({ message: 'Name is missing.'});
            return;
        }

        if (!req.body.cpf) {
            log.error('When creating a new Reseller, returned error. CPF is missing.');
            res.status(400);
            res.send({ message: 'CPF is missing.'});
            return;
        }

        req.body.cpf = formatCpf(req.body.cpf);

        if (!cpf.isValid(req.body.cpf)) {
            log.error('When creating a new Reseller, returned error. CPF is not valid.');
            res.status(400);
            res.send({ message: 'CPF is not valid.'});
            return;
        }

        if (!isValidEmail(req.body.email)) {
            log.error('When creating a new Reseller, returned error. Email is not valid.');
            res.status(400);
            res.send({ message: 'Email is not valid.'});
            return;
        }

        if (!req.body.password) {
            log.error('When creating a new Reseller, returned error. Password is missing.');
            res.status(400);
            res.send({ message: 'Password is missing.'});
            return;
        }

        let newReseller = new ResellerModel(req.body);
        await newReseller.save();
        log.info(`Successful new Resseler creation with id: ${newReseller._id}.`);
        res.status(200);
        res.send({ message: 'New Reseller save with success.' });

    } catch (error) {
        if (error.name === 'MongoError') {
            log.error(`When creating a new Reseller, returned error. Validation Failed: ${error.message}`);
            res.status(400);
            res.send({ message: `The following value is already registered: ${JSON.stringify(error.keyValue)}` })
        } else {
            log.error(error.message);
            res.status(500);
            res.send({ message: 'Internal Error' });
        }
    }
};

module.exports.savePurchase = async function (req, res) {
    try {
        if (!req.body.code) {
            log.error('When saving purchase, returned an error. The code is missing.');
            res.status(400);
            res.send({ message: 'Code is missing.'});
            return;
        }

        if (!req.body.value) {
            log.error('When saving purchase, returned an error. The value is missing.');
            res.status(400);
            res.send({ message: 'Value is missing.'});
            return;
        }

        if (isNaN(req.body.value) || req.body.value <= 0.0) {
            log.error('When saving purchase, returned an error. The value is not valid.');
            res.status(400);
            res.send({ message: 'Value is not valid.'});
            return;
        }

        const reseller = await ResellerModel.findById(req.id);
        if (!reseller) {
            log.error(`When saving purchase, returned an error. The reseller with id ${req.id} was not found.`);
            res.status(404);
            res.send({ message: 'The reseller was not found.'});
            return;
        }

        let purchase = {
            code: req.body.code,
            value: req.body.value,
            date: Date.now(),
            status: config.isCpfInWhiteList(reseller.cpf) ? 'Aprovado' : 'Em validação'
        };

        reseller.purchases.push(purchase);

        await reseller.save();
        log.info(`A new purchase has been registered for the reseller of id: ${req.id}.`);
        res.status(200);
        res.send({ message: 'Purchase successfully registered.'});

    } catch (error) {
        log.error(error.message);
        res.status(500);
        res.send('Internal Error');
    }
};

module.exports.getPurchases = async function (req, res) {
    try {
        const reseller = await ResellerModel.findById(req.id);
        if (!reseller) {
            log.error(`When getting purchases, returned an error. The reseller with id ${req.id} was not found.`);
            res.status(404);
            res.send({ message: 'The reseller was not found.'});
            return;
        }

        let completePurchases;
        if (reseller.purchases.lenght !== 0) {

            completePurchases = reseller.purchases.map(function (purchase) {
                const newPurchase = {
                    code: purchase.code,
                    value: purchase.value,
                    date: purchase.date,
                    cashback: getCashbackPercentage(purchase.value),
                    valueCashback: getCashbackPercentage(purchase.value) * purchase.value,
                    status: purchase.status
                };

                return newPurchase;
            });
        } else {
            completePurchases = [];
        }

        log.info(`The reseller of id ${req.id} requested your purchase list.`);
        res.status(200);
        res.send(completePurchases);

    } catch (error) {
        log.error(error.message);
        res.status(500).send('Internal Error');
    }
};

module.exports.getCashback = async function (req, res) {
    
    const reseller = await ResellerModel.findById(req.id);
    if (!reseller) {
        log.error(`When getting cashback, returned an error. The reseller with id ${req.id} was not found.`);
        res.status(404);
        res.send({ message: 'The reseller was not found.'});
        return;
    }

    try {
        let response = await axios.get(config.getExternalAPI(), {
            params: { cpf: reseller.cpf }
        });
        
        res.status(response.data.statusCode);
        res.send(response.data.body);
        
    } catch (error) {
        log.error(`Error communicating with the external API. Error status: ${error.message}`);
        res.status(502);
        res.send({ 
            message: 'It was not possible to communicate with the external API to check the accumulated cachback.' }
        );
    }
};