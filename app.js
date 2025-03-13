const express = require('express')
const cors = require('cors')
require('dotenv').config()

const router = require('./routes')

const dbConnect = require('./config/mongo.js')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', router)

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`)
})

dbConnect()