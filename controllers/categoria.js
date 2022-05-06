const { request, response } = require("express");

const Categoria  = require('../models/categoria');


const getCategorias = async (req = request, res = response) => {

    const { limit = '5', from = '0' } = req.query;

    try {

        // const categorias = await Categoria.find( { status: true } )
        //                 .limit( Number(limit) )
        //                 .skip( Number(from) );

        // const total = await Categoria.count( { status: true } );

        const [total, categorias] = await Promise.all([

            Categoria.count({ status: true }),

            Categoria.find({ status: true })
                .limit(Number(limit))
                .skip(Number(from))
                .populate("user") // Anidará la información del user
            // .populate({
            //     path: "user", // populate blogs
            //     populate: {
            //        path: "blog" // in blogs, populate comments
            //     }
            //  })
        ]);

        res.json({
            total,
            categorias
        });

    } catch (error) {
        console.error(error);
    }

}

const getCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    try {

        const categoria = await Categoria.findById( id )
            .populate("user"); // Anidará la información del user

        if (!categoria || categoria.status === false ) {
            return res.status(400).json({
                msg: "la categoria no existe"
            })
        }

        res.status(200).json({
            categoria
        })

    } catch (error) {
        console.log(error);
    }

}

const postCategoria = async( req = request, res = response ) => {

    const name = req.body.name.toUpperCase();

    try {

        const categoriaDB = await Categoria.findOne({ name });

        if (categoriaDB) {
            
            return res.status(400).json({
                msg: 'La categoria ya existe'
            });

        }

        // Generar la data a guardar
        const data = {
            name,
            user: req.user._id
        }

        const categoria = new Categoria(data);

        //Guardamos la categoria en la BD
        await categoria.save();

        res.status(200).json({
            categoria
        })

    } catch (error) {
        console.log(error);
    }

}

const putCategoria = async ( req = request, res = response ) => {

    const { id } = req.params;
    const name = req.body.name.toUpperCase();

    try {
        
        const categoriaDB = await Categoria.findOne({ name });

        if ( categoriaDB ) {
            
            return res.status(400).json({
                msg: 'La categoria ya existe'
            });

        }

        await Categoria.findByIdAndUpdate(id, { name } );
        const categoriaActualizada = await Categoria.findById( id );

        res.status(200).json(categoriaActualizada);

    } catch (error) {
        console.log(error);
    }

}

const deleteCategoria = async ( req = request, res = response ) => {

    const { id } = req.params;

    try {

        //const categoriaEliminar = await Categoria.findByIdAndDelete( id );
        const categoriaEliminar = await Categoria.findByIdAndUpdate(id, { status: false });
        const usuarioAutenticado = req.user;

        res.status(200).json({
            categoriaEliminar,
            usuarioAutenticado
        });

    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    getCategorias,
    getCategoria,
    postCategoria,
    putCategoria,
    deleteCategoria
}