const { request, response } = require('express');

const Producto = require('../models/producto');

const getProductos = async( req = request, res = response ) => {
    
    const { limit = '5', from = '0' } = req.query;

    try {

        // const productos = await Producto.find( { status: true } )
        //                 .limit( Number(limit) )
        //                 .skip( Number(from) );

        // const total = await Producto.count( { status: true } );

        const [total, productos] = await Promise.all([

            Producto.count({ status: true }),

            Producto.find({ status: true })
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
            productos
        });

    } catch (error) {
        console.error(error);
    }
}

const getProducto = async( req = request, res = response ) => {

    const { id } = req.params;

    try {

        const producto = await Producto.findById( id )
            .populate("user"); // Anidará la información del user

        if (!producto || producto.status === false ) {
            return res.status(400).json({
                msg: "el producto no existe"
            })
        }

        res.status(200).json({
            producto
        })

    } catch (error) {
        console.log(error);
    }

}

const postProducto = async( req = request, res = response ) => {

    const { name,...data } = req.body;
    data.name = name.toUpperCase();
    data.user = req.user._id;

    try {
        
        const productoDB = await Producto.findOne(  { name: data.name } );

        if(productoDB){
            return res.status(400).json({
                msg: 'El producto ya existe'
            })
        }

        

        // Preparamos el objeto producto
        const producto = new Producto( data );

        // Guardamos el producto
        producto.save();

        res.status(200).json({
            producto
        })


    } catch (error) {
        console.log(error);
    }

}

const putProducto = async( req = request, res = response ) => {

    const { id } = req.params;
    const { name,...data } = req.body;
    data.name = name.toUpperCase();

    try {
        
        const productoDB = await Producto.findOne({ name: data.name });


        if ( productoDB._id.toString() !== id ) {
            
            return res.status(400).json({
                msg: 'el producto ya existe'
            });

        }

        await Producto.findByIdAndUpdate( id, data );
        const productoActualizado = await Producto.findById( id );

        res.status(200).json(productoActualizado);

    } catch (error) {
        console.log(error);
    }

}

const deleteProducto = async( req = request, res = response ) => {

    const { id } = req.params;

    try {

        //const categoriaEliminar = await Categoria.findByIdAndDelete( id );
        const productoEliminar = await Producto.findByIdAndUpdate(id, { status: false });
        const usuarioAutenticado = req.user;

        res.status(200).json({
            productoEliminar,
            usuarioAutenticado
        });

    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    getProductos,
    getProducto,
    postProducto,
    putProducto,
    deleteProducto
}