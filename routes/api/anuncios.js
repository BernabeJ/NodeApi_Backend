'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');
const bodyParser = require('body-parser');
// const multer = require('multer');
// const upload = multer({ dest: './public/images/anuncios' });
const controller = require('../../microservicio/upload');


router.get('/', (req, res, next) => {

  const start = parseInt(req.query.start) || 0;
  const limit = parseInt(req.query.limit) || 1000; // nuestro api devuelve max 1000 registros
  const sort = req.query.sort || '_id';
  const includeTotal = req.query.includeTotal === 'true';
  const filters = {};
  if (typeof req.query.tag !== 'undefined') {
    filters.tags = req.query.tag;
  }

  if (typeof req.query.venta !== 'undefined') {
    filters.venta = req.query.venta;
  }

  if (typeof req.query.precio !== 'undefined' && req.query.precio !== '-') {
    if (req.query.precio.indexOf('-') !== -1) {
      filters.precio = {};
      let rango = req.query.precio.split('-');
      if (rango[0] !== '') {
        filters.precio.$gte = rango[0];
      }

      if (rango[1] !== '') {
        filters.precio.$lte = rango[1];
      }
    } else {
      filters.precio = req.query.precio;
    }
  }

  if (typeof req.query.nombre !== 'undefined') {
    filters.nombre = new RegExp('^' + req.query.nombre, 'i');
  }

  Anuncio.list(filters, start, limit, sort, includeTotal, function (err, anuncios) {
    if (err) return next(err);
    res.json({ ok: true, result: anuncios });
  });
});

// Return the list of available tags
router.get('/tags', function (req, res) {
  res.json({ ok: true, allowedTags: Anuncio.allowedTags() });
});

module.exports = router;

//crear un anuncio

//POST /api/anuncios(body)
// Crear un anuncio

router.post('/', controller.upload, async (req, res, next) => {
    try {
      const anuncioData = req.body  
      const foto = req.file.filename
      const anuncioFinal = { ...anuncioData, foto }
      controller.helperImg(req.file.path, `resize-${req.file.filename}`);
      console.log(req.file.path)
      
      const anuncio = new Anuncio(anuncioFinal); //creo un objeto de tipo Anuncio en Memoria
      const anuncioCreado = await anuncio.save(); // Lo guardo en la base de datos
      res.status(201).json({ anuncioCreado });
      console.log(anuncioFinal);
  

    } catch (err) {
        next(err)
    }
});

//DELETE /api/anuncios:id
// Elimina un anuncio
router.delete('/:id', async (req, res, next) => {
    try {
        
        const _id = req.params.id;
        await Anuncio.deleteOne({ _id: _id });
        res.json();

    } catch (err) {
        next(err);
    };
});

//PUT /api/anuncios:id (body)
//Actualizar un anuncio

router.put('/:id', async (req, res, next) => {
    try {
      
        const _id = req.params.id;
        const anuncioData = req.body;
        const anuncioActualizado = await Anuncio.findOneAndUpdate({ _id: _id }, anuncioData, {
            new: true, // esto es para que me devuelva el estado final del documento del anuncio
        });

        if (!anuncioActualizado) {
            res.status(404).json({ error: 'not found' });
            return
        }
        res.json({ result: anuncioActualizado });

    } catch (err) {
        next(err);
    };
})

