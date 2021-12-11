'use strict';

//modulo que exporta un middleware para comprobar que el usuario esta logado

module.exports = (req, res, next) => {
     if (!req.session.usuarioLogado) {
    res.redirect('/login');
    return;
     }
    next();
}