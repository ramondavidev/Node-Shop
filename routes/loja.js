var express = require('express');
var router = express.Router();
const Produto = require('../models/produto');

router.get('/', async function(req, res, next) {
  let produtos = await Produto.find({});
  res.render('loja', {produtos});
});

router.get('/adicionar-item', function(req, res, next) {
  res.render('adicionar');
});

router.post('/', async function(req, res, next) {
  let produto = await new Produto(req.body.produto);
  produto.save();
  res.redirect(`/loja/${produto.id}`);
});

router.get('/:id', async function(req, res, next) {
  let produto = await Produto.findById(req.params.id);
  res.render('show', {produto});
});

router.get('/:id/edit', function(req, res, next) {
  
});

router.put('/:id', function(req, res, next) {
  
});

router.delete('/', function(req, res, next) {
  
});

module.exports = router;
