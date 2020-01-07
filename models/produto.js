const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProdutoSchema = new Schema({
    nome: String,
    preco: Number,
    data: String,
    descricao: String,
    image: String
});

module.exports = mongoose.model('Produto', ProdutoSchema)