const { Router } = require('express');
const { check } = require('express-validator');
const { getProductos, 
        getProducto, 
        postProducto, 
        putProducto, 
        deleteProducto } = require('../controllers/producto');
const { existProductoId, existCategoriaId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Obtener todos los productos - publico
router.get('/', getProductos);

// Obtener un producto por ID - publico
router.get('/:id',[
    check('id', 'no es un id valido de mongoDB').isMongoId(),
    check('id').custom(existProductoId),
    validarCampos
], getProducto);

// Crear un producto - privado - usiario con token valido
router.post('/',[ 
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria').custom(existCategoriaId),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    validarCampos
 ], postProducto);

// Editar un producto - privado- usuario con token valido
router.put('/:id',[ 
    validarJWT,
    check('id', 'no es un id valido de mongoDB').isMongoId(),
    check('id').custom(existProductoId),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
 ], putProducto);

// Eliminar un producto - Solo usuarios administradores
router.delete('/:id',[ 
    validarJWT,
    check('id', 'no es un id valido de mongoDB').isMongoId(),
    check('id').custom(existProductoId),
    validarCampos
 ], deleteProducto);


module.exports = router;

