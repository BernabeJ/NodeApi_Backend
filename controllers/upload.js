const multer = require('multer')

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

exports.uploadFile = (req, res) => {
    res.send({ data: 'Enviar un archivo' })
}