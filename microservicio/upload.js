"use strict";

const { Responder } = require("cote");
var Jimp = require("jimp");

// declaramos el microservicio

const responder = new Responder({ name: "convertir-imagen" });

// lógica del microservicio

responder.on("convertir-miniatura", async (req, done) => {
    const { foto } = req;
    const fotoPath = (`public/images/anuncios/${foto}`);

    Jimp.read(fotoPath)
        .then((fotoToThumbnail) => {
            fotoToThumbnail
                .resize(100, 100)
                .write(`public/images/resize/miniatura_${foto}`);
        })
        .catch((err) => {
            console.error(err);
        });
    const result = `imagen convertida en public/images/resize/miniatura ${foto}`;
	await done(result);
});