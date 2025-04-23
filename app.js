const express = require('express')
const morganBody = require('morgan-body')
const loggerStream = require('./utils/handleLogger.js')
const cors = require('cors')
const swaggerUi = require("swagger-ui-express")
const swaggerSpecs = require("./docs/swagger")

require('dotenv').config()

const router = require('./routes')

const dbConnect = require('./config/mongo.js')

const app = express()

morganBody(app, {

    noColors: true,
    skip: function (req, res) {
        return res.statusCode < 500
    },
    stream: loggerStream
})

app.use(cors())
app.use(express.json())
app.use("/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs)
)

app.use('/api', router)

const port = process.env.PORT || 3001

console.log(process.env.JWT_SECRET)

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`)
})

dbConnect()