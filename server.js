const app = require('express')();
const bodyParser = require('body-parser');
const config = require('./config');
const IP = config.getAPIAddress();
const PORT = config.getAPIPort();
const { saveReseller, savePurchase, getPurchases, getCashback } = require('./api/reseller');
const { authentication, authorization } = require('./api/auth');
const log = require('./log/log');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/login', async function (req, res) {
    await authentication(req, res);
});

app.post('/reseller', async function (req, res) {
    await saveReseller(req, res);
});

app.post('/purchase', authorization, async function (req, res) {
    await savePurchase(req, res);
});

app.get('/purchases', authorization, async function (req, res) {
    await getPurchases(req, res);
});

app.get('/cashback', authorization, async function (req, res) {
    await getCashback(req, res);
});

app.listen(PORT, IP, () => {
    log.info(`Server is listening on ${IP}:${PORT}!`);
});

module.exports = app;