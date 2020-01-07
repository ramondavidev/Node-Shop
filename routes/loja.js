var express = require('express');
var router = express.Router();
const Produto = require('../models/produto');

router.get('/', async function(req, res, next) {
  let produtos = await Produto.find({});
  res.render('produto/loja', {produtos});
});

router.get('/adicionar-item', function(req, res, next) {
  res.render('produto/adicionar');
});

router.post('/', async function(req, res, next) {
  let produto = await new Produto(req.body.produto);
  produto.save();
  res.redirect(`/loja/${produto.id}`);
});

router.get('/:id', async function(req, res, next) {
  let produto = await Produto.findById(req.params.id);
  res.render('produto/show', {produto});
});

router.get('/:id/edit', async function(req, res, next) {
  let produto = await Produto.findById(req.params.id);
  res.render('produto/edit', {produto});
});

router.put('/:id', async function(req, res, next) {
  await Produto.findByIdAndUpdate(req.params.id, req.body.produto);
  res.redirect('/loja/' + req.params.id);
});

router.delete('/:id', async function(req, res, next) {
  await Produto.findByIdAndRemove(req.params.id);
  res.redirect('/loja');
});

module.exports = router;
