const express = require('express');
const cors = require('cors');

const { connectionDB } = require('../database/config');

class Server{

    constructor(){

        this.app = express();
        this.port = process.env.PORT;
        this.path = '/api/users';

        // Conexion a la base de datos
        this.dbConnection();

        // Middlewares
        this.middlewares();

        // Rutas de la Aplicación
        this.routes();

    }

    async dbConnection() {

        await connectionDB();

    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Directorio público
        this.app.use( express.static('public') );

        // Lectura y parseo del body
        this.app.use( express.json() );

    }

    routes() {

        this.app.use( this.path, require('../routes/user') );

    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('listening on port: ' + this.port)
        });
    }

}

module.exports = Server;