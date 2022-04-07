const mongoose = require('mongoose');

const connectionDB = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
            //useCreateIndex: true,
            //useFindAndModify: false
        });

        console.log('conexion a la DB exitosa!');

    } catch (error) {
        console.error(error);
        throw new Error('Error al intentar conectar con la DB');
    }

}
module.exports = {
    connectionDB
}