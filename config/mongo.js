const mongoose = require('mongoose');

const db_uri = process.env.NODE_ENV === 'test' ? process.env.DB_URI_TEST :
    process.env.DB_URI

const dbConnect = () => {
    mongoose.set('strictQuery', false)
    mongoose.connect(db_uri)

}
mongoose.connection.on('connected', () => console.log("conectado a la base de datos"))

mongoose.connection.on('error', (e) => console.log(e.message))

module.exports = dbConnect