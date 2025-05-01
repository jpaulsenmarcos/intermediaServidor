const express = require('express')
const { createDelivery, getDeliverynotes, getDeliveryNoteById, downloadPdf, signDeliverynote, downloadSignedPdf, deleteDeliverynote } = require('../controllers/deliverynote.js')
const { uploadMiddlewareMemory } = require('../utils/handleStorage.js')
const { validatorCreateDeliverynote } = require('../validators/deliverynote.js')
const authMiddleware = require('../middleware/session.js')

const deliveryRouter = express.Router();

/**
 *  @openapi
 *  /api/deliverynote:
 *   post:
 *       tags:
 *       - Deliverynote
 *       summary: "Create deliverynote"
 *       description: Create a new deliverynote for a project
 *       requestBody:
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: "#/components/schemas/createDelivery"
 *       responses:
 *           '200':
 *               description: Devuelve el Albarán creado exitosamente.
 *           '409':
 *               description: Error al crear el albarán.
 *       security:
 *           - bearerAuth: []
 */
deliveryRouter.post('/', authMiddleware, validatorCreateDeliverynote, createDelivery)
/**
 *  @openapi
 *  /api/deliverynote/:id:
 *   get:
 *       tags:
 *       - Deliverynote
 *       summary: "User getDeliverynotes"
 *       description: get all deliverynotes from a client
 *       parameters:
 *         - in: path
 *           name: id
 *           description: Identificador único del cliente
 *           required: true
 *           schema: 
 *             type: string
 *           example: "67c2c2cfaf91b9796609faf4"
 *       requestBody:
 *           content:
 *               application/json:
 *                   securitySchemes:
 *                      $ref: "#/components/securitySchemes/bearerAuth"
 *       responses:
 *           '200':
 *               description: Devuelve la lista de albaranes asociados al proyecto.
 *           '409':
 *               description: Proyecto no válido o sin albaranes, o no autorizado.
 *       security:
 *           - bearerAuth: []
 */
deliveryRouter.get('/:id', authMiddleware, getDeliverynotes)
/**
 *  @openapi
 *  /api/deliverynote/ById/:id:
 *   get:
 *       tags:
 *       - Deliverynote
 *       summary: "User getDeliverynotes by id"
 *       description: get one deliverynote by indicating the id
 *       parameters:
 *         - in: path
 *           name: id
 *           description: Identificador único del albarán
 *           required: true
 *           schema: 
 *             type: string
 *           example: "67c2c2cfaf91b9796609faf4"
 *       requestBody:
 *           content:
 *               application/json:
 *                   securitySchemes:
 *                      $ref: "#/components/securitySchemes/bearerAuth"
 *       responses:
 *           '200':
 *               description: Devuelve el albarán obtenido correctamente.
 *           '409':
 *               description: Albarán inexistente o acceso denegado.
 *       security:
 *           - bearerAuth: []
 */
deliveryRouter.get('/ById/:id', authMiddleware, getDeliveryNoteById)
/**
 *  @openapi
 *  /api/deliverynote/pdf/:id:
 *   get:
 *       tags:
 *       - Deliverynote
 *       summary: "User downloadPdf by id"
 *       description: Download one deliverynote by indicating the id
 *       parameters:
 *         - in: path
 *           name: id
 *           description: Identificador único del albarán
 *           required: true
 *           schema: 
 *             type: string
 *           example: "67c2c2cfaf91b9796609faf4"
 *       requestBody:
 *           content:
 *               application/json:
 *                   securitySchemes:
 *                      $ref: "#/components/securitySchemes/bearerAuth"
 *       responses:
 *           '200':
 *               description: PDF generado y descargado correctamente.
 *           '409':
 *               description: Error de acceso o generación del PDF.
 *       security:
 *           - bearerAuth: []
 */
deliveryRouter.get('/pdf/:id', authMiddleware, downloadPdf)

//deliveryRouter.get('/signimage/:id', authMiddleware, signDeliverynote)

/**
 *  @openapi
 *  /api/deliverynote/signimage/:id:
 *   patch:
 *       tags:
 *       - Deliverynote
 *       summary: "User signDeliverynote by id"
 *       description: Signs the deliverynote by including a new field firma with the image url in the deliverynote
 *       parameters:
 *         - in: path
 *           name: id
 *           description: Identificador único del albarán
 *           required: true
 *           schema: 
 *             type: string
 *           example: "67c2c2cfaf91b9796609faf4"
 *       requestBody:
 *           content:
 *             multipart/form-data:
 *               schema:
 *                 type: object
 *                 required:
 *                   - image
 *                 properties:
 *                   image:
 *                     type: string
 *                     format: binary
 *                     description: Imagen de la firma en formato PNG o JPEG
 *       responses:
 *           '200':
 *               description: Firma subida e integrada al albarán correctamente.
 *           '404':
 *               description: Albarán no encontrado.
 *           '409':
 *               description: Error al guardar la firma.
 *       security:
 *           - bearerAuth: []
 */
deliveryRouter.patch("/signimage/:id", authMiddleware, uploadMiddlewareMemory.single("image"), (err, req, res, next) => {
    console.log("ERROR:::::::: ", err.code)
    res.status(413).send("Error capturado")
}, signDeliverynote)

/**
 *  @openapi
 *  /api/deliverynote/signedPdf/:id:
 *   patch:
 *       tags:
 *       - Deliverynote
 *       summary: "User downloadPdf by id"
 *       description: Create a new pdf including the sign and download it
 *       parameters:
 *         - in: path
 *           name: id
 *           description: Identificador único del albarán
 *           required: true
 *           schema: 
 *             type: string
 *           example: "67c2c2cfaf91b9796609faf4"
 *       requestBody:
 *           content:
 *               application/json:
 *                   securitySchemes:
 *                      $ref: "#/components/securitySchemes/bearerAuth"
 *       responses:
 *           '200':
 *               description: PDF con firma generado y descargado exitosamente.
 *           '409':
 *               description: Error al generar o recuperar PDF firmado, o falta la firma.
 *       security:
 *           - bearerAuth: []
 */
deliveryRouter.patch('/signedPdf/:id', authMiddleware, downloadSignedPdf)
/**
 *  @openapi
 *  /api/deliverynote/delete/:id:
 *   delete:
 *       tags:
 *       - Deliverynote
 *       summary: "User deleteDeliverynote"
 *       description: Deletes one deliverynote by including the id
 *       parameters:
 *         - in: path
 *           name: id
 *           description: Identificador único del albarán
 *           required: true
 *           schema: 
 *             type: string
 *           example: "67c2c2cfaf91b9796609faf4"
 *       requestBody:
 *           content:
 *               application/json:
 *                   securitySchemes:
 *                      $ref: "#/components/securitySchemes/bearerAuth"
 *       responses:
 *           '200':
 *               description: Albarán eliminado correctamente.
 *           '409':
 *               description: Albarán no existente, acceso denegado o ya firmado.
 *       security:
 *           - bearerAuth: []
 */
deliveryRouter.delete('/delete/:id', authMiddleware, deleteDeliverynote)

module.exports = deliveryRouter