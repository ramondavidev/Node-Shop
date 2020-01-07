const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProdutoSchema = new Schema({
    nome: String,
    preco: Number,
    quantidade: Number,
    data: Date,
    descricao: String,
    image: String
});

module.exports = mongoose.model('Produto', ProdutoSchema)