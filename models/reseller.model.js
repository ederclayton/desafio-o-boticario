const Mongoose = require('mongoose');
const Bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const ResellerSchema = new Mongoose.Schema({
    name: {type: String, required: true},
    cpf: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    purchases: [{
        code: {type: String},
        value: {type: Number},
        date: {type: Date},
        status: {type: String}
    }]
});

ResellerSchema.pre("save", function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = Bcrypt.hashSync(this.password, SALT_ROUNDS);
    next();
});

module.exports = Mongoose.model('Reseller', ResellerSchema);