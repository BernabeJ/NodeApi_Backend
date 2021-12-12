'use strict';
//Servicio de redimensionado de imagen

const {Responder} = require('cote');
const multer = require('multer')
const sharp = require('sharp')

//declarar el microservicio

const responder = new Responder({ name: 'servicio de redimensionado' });

//almacen de datos del microservicio


//logica del microservicio
responder.on('convertir-imagen', (req, done) => {
    
})

const helperImg = (filePath, filename, size = 100) => {
    return sharp(filePath)
        .resize(100,100)
        .toFile(`./public/images/resize/${filename}`)
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/anuncios')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

exports.upload = upload.single('foto')
exports.helperImg = helperImg

exports.uploadFile = (req, res) => {
    res.send({ data: 'Enviar un archivo' })
}