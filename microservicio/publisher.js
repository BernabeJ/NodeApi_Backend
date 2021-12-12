"use strict";

const { Requester } = require("cote");

const requester = new Requester({ name: "publisher" });

const miniaturaRequester = (foto) => {
	const req = {
		type: "convertir-miniatura",
		foto: foto,
	};
	requester.send(req, (done) => {
		console.log(`transform ${foto} = ${req} ${done}`);
	});
};

module.exports = miniaturaRequester;