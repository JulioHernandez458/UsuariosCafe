const { request, response } = require('express');
const bcryptjs = require('bcryptjs');


const User = require('../models/user');
const { generarJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { json } = require('express/lib/response');

const login = async( req = request , res = response ) => {

    const { email, password } = req.body;

    try {

        // Verificar si el email existe
        const user = await User.findOne({ email });
        if( !user ){
            return res.status(400).json({
                msg: 'el email y/o password son incorrectos'
            });
        }

        // Verificiar si el usuario esta activo
        if( !user.status ){
            return res.status(400).json({
                msg: 'el email y/o password son incorrectos'
            })
        }

        // Verificar la contraseña 
        const validarPassword = bcryptjs.compareSync( password, user.password );
        if( !validarPassword ){
            return res.status(400).json({
                msg: 'el email y/o password son incorrectos'
            })
        }

        // Generar el JWT
        const token = await generarJWT( user.id );

        res.json( { 
            user,
            token
        })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({
            msg: 'Error al hacer login, ponerse en contacto con el administrador'
        })
    }

}


const googleSignIn = async( req = request , res = response ) => {

    const { id_token } = req.body;

    try {
        
        const { name, picture, email } = await googleVerify( id_token );
        
        let user = await User.findOne( { email } );

        if( !user ){
            const data = {
                name,
                password: '123456',
                email,
                img: picture,
                google:true
            }

            user = new User( data );
            await user.save();
        }

        if( !user.status ){
            return res.status(401).json({
                msg: 'Usuario deshabilitado, contacte con el administrador'
            })
        } 
        
        // Generar el JWT
        const token = await generarJWT( user.id );
        
        res.json( { 
            user,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}