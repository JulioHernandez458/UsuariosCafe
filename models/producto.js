const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({

    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true
        //required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        require: true
    },
    descripcion: {
        type: String,
        require: true
    },
    disponible: {
        type: Boolean,
        default: true
    }

});

ProductoSchema.methods.toJSON = function(){
    const { __v, status, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Producto', ProductoSchema );