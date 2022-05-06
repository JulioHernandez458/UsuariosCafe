

const esAdminRole = ( req, res, next ) => {

    if( !req.user ){
        return res.status(500).json({
            msg: 'se requiere validar el token primero'
        })
    }

    const { role, name } = req.user;

    if( role !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `el usuario ${ name } no es administrador`
        })
    }

    next();

}


const tieneRoles = ( ...roles ) => {

    return ( req, res, next ) => {

        if( !req.user ){
            return res.status(500).json({
                msg: 'se requiere validar el token primero'
            })
        }

        if( !roles.includes( req.user.role ) ){
            return res.status(401).json({
                msg: 'el usuario no tiene permiso para esta accion'
            })
        }

        next();
    }

}

module.exports = {
    esAdminRole,
    tieneRoles
}