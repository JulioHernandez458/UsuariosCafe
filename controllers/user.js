const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user'); 


const getUsers = async( req = request, res = response ) => {

    const { limit = '5', from = '0' } = req.query;
    
    // const users = await User.find( { status: true } )
    //                 .limit( Number(limit) )
    //                 .skip( Number(from) );

    // const total = await User.count( { status: true } );

    const [total, users] = await Promise.all([

        User.count({ status: true }),

        User.find({ status: true })
            .limit(Number(limit))
            .skip(Number(from))

    ]);

    

    res.json( {
        total, 
        users
    } );

}

const postUser = async( req = request, res = response ) => {

    
    const { name, email, password, role } = req.body;
    const user = new User( { name, email, password, role } );


    // Encriptación del password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    // Se guarda en la BD
    await user.save();

    res.json( {user} );
}

const putUser = async(req = request, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...dataActualizar } = req.body;

    if (password) {
        
        // Encriptación del password
        const salt = bcryptjs.genSaltSync();
        dataActualizar.password = bcryptjs.hashSync(password, salt);
    }

    await User.findByIdAndUpdate( id, dataActualizar );
    const usuarioActualizado = await User.findById( id );
    res.json( usuarioActualizado );

}

const deleteUser = async( req = request, res = response ) => {
    
    const { id } = req.params;

    //const usuarioEliminar = await User.findByIdAndDelete( id );
    const usuarioEliminar = await User.findByIdAndUpdate( id, { status: false } );
    const usuarioAutenticado = req.user;

    res.json( {
        usuarioEliminar,
        usuarioAutenticado
    } );

}

module.exports = {
    getUsers,
    postUser,
    putUser,
    deleteUser
}