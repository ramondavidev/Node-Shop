const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    nome: String,
    image: String,
    isAdmin: {type: Boolean, default: false},
    sobrenome: String,
    email: String,
    cpf: {type: String},
    endereco:{
        bairro: String,
        rua: String,
        numero: String,
        telefone: String,
        cidade: String
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

