const multer = require('multer')
const sharp = require('sharp')

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