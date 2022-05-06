const { Router } = require('express');
const { check } = require('express-validator');
const res = require('express/lib/response');
const { postCategoria, getCategorias, getCategoria, putCategoria, deleteCategoria } = require('../controllers/categoria');
const { existCategoriaId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', getCategorias);

// Obtener una categoria por ID - publico
router.get('/:id',[
    check('id', 'no es un id valido de mongoDB').isMongoId(),
    check('id').custom(existCategoriaId),
    validarCampos
], getCategoria);

// Crear una categoria - privado - usiario con token valido
router.post('/',[ 
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
 ], postCategoria);

// Editar una categoria - privado- usuario con token valido
router.put('/:id',[ 
    validarJWT,
    check('id', 'no es un id valido de mongoDB').isMongoId(),
    check('id').custom(existCategoriaId),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
 ], putCategoria);

// Eliminar una categoria - Solo usuarios administradores
router.delete('/:id',[ 
    validarJWT,
    check('id', 'no es un id valido de mongoDB').isMongoId(),
    check('id').custom(existCategoriaId),
    validarCampos
 ], deleteCategoria);


module.exports = router;