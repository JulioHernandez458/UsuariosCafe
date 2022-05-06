const { Router } = require('express');
const { check } = require('express-validator');
const { getUsers,
        postUser,
        putUser,
        deleteUser} = require('../controllers/user');
const { esRoleValido, existEmail, existUsuarioId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRoles } = require('../middlewares/validar-roles');


const router = Router();

router.get('/', getUsers );

router.post('/', [
    check('name', 'el nombre es obligatorio').not().isEmpty(),
    check('password', 'password minimo de 6 caracteres').isLength( { min: 6 } ),
    check('email', 'email no valido').isEmail(),
    check('email').custom( existEmail ),
    //check('role', 'rol no valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('role').custom( esRoleValido ),
    validarCampos
], postUser);

router.put('/:id', [
    check('id', 'no es un id valido de mongoDB').isMongoId(),
    check('id').custom( existUsuarioId ),
    check('role').custom( esRoleValido ),
    validarCampos
], putUser);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRoles('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'no es un id valido de mongoDB').isMongoId(),
    check('id').custom(existUsuarioId),
    validarCampos
], deleteUser);

module.exports = router;