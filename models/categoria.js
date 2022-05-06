const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({

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
    }

});

module.exports = model( 'Categoria', CategoriaSchema );