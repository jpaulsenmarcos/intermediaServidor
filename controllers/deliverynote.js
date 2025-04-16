const deliveryModel = require('../models/deliverynote.js')
const projectModel = require('../models/project.js')
const clientModel = require('../models/client.js')
const userModel = require('../models/user.js')
const { matchedData } = require('express-validator')
const { uploadToPinata } = require('../utils/handleUploadIPFS.js')
const { handleHttpError } = require('../utils/handleError.js')
const PDFDocument = require('pdfkit')
const axios = require('axios')

const createProject = async (req, res) => {
    try {
        console.log("Hola")
        const body = matchedData(req)
        console.log(body)
        const data = await deliveryModel.create(body);
        res.send(data)
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_CREATE_CLIENT')
    }
}

const getDeliverynotes = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = req.params
        const proyecto = await projectModel.findById(id)
        const cliente = await clientModel.findById(proyecto.clientId)
        if (String(cliente.createdBy) !== String(userId)) {
            return handleHttpError(res, 'ERROR_NOT_YOUR_CLIENT')
        }
        if (!proyecto) {
            return handleHttpError(res, 'ERROR_NO_PROYECTS')
        }
        const deliverynotes = await deliveryModel.find({ projectId: id })
        if (!deliverynotes.length) {
            return handleHttpError(res, 'ERROR_NO_DELIVERYNOTES')
        }
        res.send({ deliverynotes })
        res.status(200)
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_DELIVERYNOTES')
    }
}

const getDeliveryNoteById = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = req.params
        const deliverynote = await deliveryModel.findById(id).populate('clientId').populate('projectId');
        if (!deliverynote) {
            return handleHttpError(res, 'ERROR_NO_DELIVERYNOTE')
        }
        const cliente = await clientModel.findById(deliverynote.clientId)
        if (String(cliente.createdBy) !== String(userId)) {
            return handleHttpError(res, 'ERROR_NOT_YOUR_CLIENT')
        }
        res.send({ deliverynote })
        res.status(200)
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_DELIVERYNOTE_BY_ID')
    }
}

const downloadPdf = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = req.params
        const user = await userModel.findById(userId)
        const deliverynote = await deliveryModel.findById(id).populate('clientId').populate('projectId');
        if (!deliverynote) {
            return handleHttpError(res, 'ERROR_NO_DELIVERYNOTE')
        }
        const cliente = await clientModel.findById(deliverynote.clientId)
        if (user.role !== 'guest') {
            if (String(cliente.createdBy) !== String(userId)) {
                return handleHttpError(res, 'ERROR_NOT_YOUR_CLIENT')
            }
        }
        if (user.role === 'guest' && String(user.createdBy) !== String(deliverynote.clientId.createdBy)) {
            return handleHttpError(res, 'ERROR_NOT_YOUR_CLIENT')
        }
        const documento = new PDFDocument({ margin: 50, sixe: 'A4' })

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="deliverynote_${deliverynote._id}.pdf"`)

        documento.pipe(res)
        documento.fontSize(18).text('Albarán ', { underline: true })
        documento.moveDown()
        documento.fontSize(12).text(`Fecha de impresión: ${new Date().toLocaleDateString()}`)
        documento.text(`Albarán ID: ${deliverynote._id}`)
        documento.moveDown()
        documento.text('Cliente ->', { underline: true })
        documento.moveDown()
        documento.text(`Nombre cliente: ${deliverynote.clientId.name}`)
        documento.moveDown()
        documento.text('Proyecto ->', { underline: true })
        documento.moveDown()
        documento.text(`Nombre proyecto: ${deliverynote.projectId.name}`)
        documento.text(`Email proyecto: ${deliverynote.projectId.email}`)
        documento.moveDown()
        documento.text('Albarán ->', { underline: true })
        documento.moveDown()
        documento.text(`Formato albarán: ${deliverynote.format}`)
        documento.text(`Horas albarán: ${deliverynote.hours}`)
        documento.text(`Decripcción albarán: ${deliverynote.description}`)
        documento.text(`Workdate albarán: ${deliverynote.workdate}`)
        documento.moveDown()
        documento.end()
    } catch (err) {
        handleHttpError(res, 'ERROR_DOWNLOAD_PDF')
    }
}

const signDeliverynote = async (req, res) => {
    try {
        const { id } = req.params
        const fileBuffer = req.file.buffer;
        const filename = req.file.originalname;
        const pinataResponse = await uploadToPinata(fileBuffer, filename);
        const ipsFile = pinataResponse.IpfsHash;
        const ipfsUrl = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipsFile}`
        console.log('IPFS URL: ', ipfsUrl);
        const deliverynote = await deliveryModel.findByIdAndUpdate(
            id,
            {
                firma: {
                    name: filename,
                    url: ipfsUrl
                }
            },
            { new: true }
        );
        if (!deliverynote) {
            return handleHttpError(res, 'DELIVERYNOTE_NOT_FOUND', 404);
        }
        res.send({ deliverynote })
        res.status(200)
    } catch (err) {
        handleHttpError(res, 'ERROR_SIGN_DELIVERYNOTE')
    }
}

const downloadSignedPdf = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = req.params
        const user = await userModel.findById(userId)
        const deliverynote = await deliveryModel.findById(id).populate('clientId').populate('projectId');
        if (!deliverynote) {
            return handleHttpError(res, 'ERROR_NO_DELIVERYNOTE')
        }
        const cliente = await clientModel.findById(deliverynote.clientId)
        if (user.role !== 'guest') {
            if (String(cliente.createdBy) !== String(userId)) {
                return handleHttpError(res, 'ERROR_NOT_YOUR_CLIENT')
            }
        }
        if (user.role === 'guest' && String(user.createdBy) !== String(deliverynote.clientId.createdBy)) {
            return handleHttpError(res, 'ERROR_NOT_YOUR_CLIENT')
        }
        if (!deliverynote.firma || !deliverynote.firma.url) {
            return handleHttpError(res, 'ERROR_NO_SIGNATURE');
        }
        const firmaResponse = await axios.get(deliverynote.firma.url, {
            responseType: 'arraybuffer'
        })
        const firmaBuffer = Buffer.from(firmaResponse.data, 'binary')
        const documento = new PDFDocument({ margin: 50, size: 'A4' })
        const chunks = []
        documento.on('data', (chunk) => chunks.push(chunk))
        documento.on('end', async () => {
            const pdfBuffer = Buffer.concat(chunks)

            try {
                const fileName = `deliverynote_${deliverynote._id}.pdf`
                const pinataResponse = await uploadToPinata(pdfBuffer, fileName)
                const ipfsHash = pinataResponse.IpfsHash
                const pinataUrl = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsHash}`
                console.log('PDF en pinata: ', pinataUrl)

                const pinataDownload = await axios.get(pinataUrl, { responseType: 'arraybuffer' })
                const buffer = Buffer.from(pinataDownload.data)

                res.setHeader('Content-Type', 'application/pdf')
                res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
                return res.send(buffer)
            } catch (err) {
                handleHttpError(res, 'ERROR_COULD_NOT_UPLOADORDOWNLOAD')
            }
        })
        documento.fontSize(18).text('Albarán ', { underline: true });
        documento.moveDown();
        documento.fontSize(12).text(`Fecha de impresión: ${new Date().toLocaleDateString()}`);
        documento.text(`Albarán ID: ${deliverynote._id}`);
        documento.moveDown();

        documento.text('Cliente ->', { underline: true });
        documento.moveDown();
        documento.text(`Nombre cliente: ${deliverynote.clientId.name || ''}`);
        documento.moveDown();

        documento.text('Proyecto ->', { underline: true });
        documento.moveDown();
        documento.text(`Nombre proyecto: ${deliverynote.projectId.name || ''}`);
        documento.text(`Email proyecto: ${deliverynote.projectId.email || ''}`);
        documento.moveDown();

        documento.text('Albarán ->', { underline: true });
        documento.moveDown();
        documento.text(`Formato albarán: ${deliverynote.format}`);
        documento.text(`Horas albarán: ${deliverynote.hours}`);
        documento.text(`Decripcción albarán: ${deliverynote.description}`);
        documento.text(`Workdate albarán: ${deliverynote.workdate}`);
        documento.moveDown();

        documento.text('Firma:', 50, 600);
        documento.image(firmaBuffer, 50, 620, { width: 120, height: 60 });
        documento.end()
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_DOWNLOAD_SIGNED_PDF');
    }
}

module.exports = { createProject, getDeliverynotes, getDeliveryNoteById, downloadPdf, signDeliverynote, downloadSignedPdf }