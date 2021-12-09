'use strict';

const { Usuario } = require('../models');

class LoginController {
    index(req, res, next) {
        res.locals.error = '';
        res.render('login');
    }
    async post(req, res, next) {
        try {
            
            const { email, password } = req.body;
            //buscar el usuario en la base de datos
            const usuario = await Usuario.findOne({
                email
            });
            //si no lo encuentro o no coincide la contraseña ---> error
            if (!usuario || !(await usuario.comparePassword(password))) { 
                res.locals.error = res.__('Invalid credentials');
                res.render('login');
                return;
            }
            //si lo encuentro y la contraseña coincide
            //--> apuntar en su sesion que esta autenticado

            //--> redirigir a los anuncios
            req.session.usuarioLogado = {
                _id: usuario._id,
            };


            res.redirect('/anuncios');
        } catch (err) {
            next(err);
        }
            
        }
}


module.exports = LoginController

