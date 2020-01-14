const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransacaoSchema = new Schema({
    user: String,
    item:[
        {
            produto: String,
            preco: Number,
            quantidade: Number
        }
    ],
    horario: Date
});

module.exports = mongoose.model('Transacao', TransacaoSchema)