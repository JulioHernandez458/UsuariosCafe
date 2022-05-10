const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const User = require('../models/user');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'usuarios',
    'role'
]


const buscar = ( req, res = response ) => {

    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes(coleccion) ){
        return res.status(400).json({
            msg: `La coleccion ${coleccion} no es valida`
        })
    }

    switch (coleccion) {

        case 'categorias':
            buscarCategorias(termino,res);
            break;
        case 'productos':
            buscarProductos(termino,res);
            break;
        case 'usuarios':
            buscarUsuarios(termino,res);
            break;
        default:
            res.status(500).json({
                msg: 'Algo salio mal'
            });

    }

}

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.status(200).json({
            results: ( categoria ) ? [ categoria ] : []
        })
    }

    const regexp = new RegExp( termino, 'i' );

    const categorias = await Categoria.find({ name: regexp, status:true });

    res.status(200).json({
        results: categorias
    });

}

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const producto = await Producto.findById(termino).populate('categoria');
        if(producto){
            return res.status(200).json({
                results: ( producto ) ? [ producto ] : []
            });
        }else{
            const categoria = await Producto.find({categoria: termino}).populate('categoria');
            return res.status(200).json({
                results: ( categoria ) ? [ categoria ] : []
            });
        }
    }

    const regexp = new RegExp( termino, 'i' );

    const productos = await Producto.find({
        $or: [ { name: regexp }],
        $and: [ { status: true } ]
    }).populate('categoria');

    res.status(200).json({
        results: productos
    });

}

const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const usuario = await User.findById(termino);
        return res.status(200).json({
            results: ( usuario ) ? [ usuario ] : []
        })
    }

    const regexp = new RegExp( termino, 'i' );

    const usuarios = await User.find({
        $or: [ { name: regexp }, { email: regexp } ],
        $and: [ { status: true } ]
    });

    res.status(200).json({
        results: usuarios
    });

}



module.exports = {
    buscar
}