const Bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');

const ResellerModel = require('../models/reseller.model');
const config = require('../config');
const log = require('../log/log');

const _10_MIN = 10 * 60;

const comparePassword = async (candidate, target) => {
    try {
        return await Bcrypt.compare(candidate, target);
    } catch (error) {
        return false;
    }
};

module.exports.authentication = async function (req, res) {
    try {

        if (!req.body.cpf || !req.body.password) {
            log.error('Authentication failed, no cpf or password was entered.');
            res.status(400);
            res.send({ message: 'No cpf or password was entered.'});
            return;
        }

        const reseller = await ResellerModel.findOne({cpf: req.body.cpf});
        if (!reseller) {
            log.error(`Authentication failed, not found a registered reseller with the cpf ${req.body.cpf}.`);
            res.status(404);
            res.send({ message: 'Not found the reseller.'});
            return;
        }

        const match = await comparePassword(req.body.password, reseller.password);
        if (!match) {
            log.error(`Authentication failed, the password entered for the cpf ${req.body.cpf} is invalid.`);
            res.status(400);
            res.send({ message: 'The password is invalid.' });
            return;
        }

        const token = Jwt.sign({ id: reseller._id }, config.getJwtSecret(), {
            expiresIn: _10_MIN
        });

        log.info(`A new token has been created for the reseller of id ${reseller._id}.`);
        res.status(200);
        res.send({ token: token });

    } catch (error) {
        log.error(error.message);
        res.status(500);
        res.send('Internal Error');
    }
};

module.exports.authorization = function (req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization'] || '';
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.replace('Bearer ', '');
    }

    if (!token) {
        log.error('Authorization failed, no token provided.');
        res.status(401);
        res.send({ message: 'No token provided.' });
        return;
    }
    
    Jwt.verify(token, config.getJwtSecret(), function(error, decoded) {
        if (error) {
            log.error(`Authorization failed, token is not valid. ${error.message}.`);
            res.status(401);
            res.send({ message: 'Token is not valid' });
            return;
        }

        log.info(`Authorization successfully performed for id ${decoded.id}.`)
        req.id = decoded.id;
        next();
    });
};