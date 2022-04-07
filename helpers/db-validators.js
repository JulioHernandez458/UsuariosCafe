const Role = require('../models/role');
const User = require('../models/user'); 

const esRoleValido = async(role = '') => {

    const existRole = await Role.findOne( { role } );
    if(!existRole) {
        throw new Error(`el rol ${role} no es valido`);
    }

}

const existEmail = async (email = '') => {

    // Verificación del correo
    const exist = await User.findOne({ email });
    if ( exist ) {
        throw new Error('el correo ya existe');
    }

}

const existUsuarioId = async (id = '') => {

    // Verificación del Usuario com el id
    const exist = await User.findById(id);
    if (!exist) {
        throw new Error('el usuario no existe');
    }

}

module.exports = {
    esRoleValido,
    existEmail,
    existUsuarioId
}