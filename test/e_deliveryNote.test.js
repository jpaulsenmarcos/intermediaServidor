jest.mock('../utils/handleUploadIPFS.js', () => ({
    uploadToPinata: jest.fn().mockResolvedValue({ IpfsHash: 'fakehash' })
}));
jest.mock('axios');

const axios = require('axios')
const supertest = require('supertest')
const app = require('../app.js')
const mongoose = require('mongoose')
const clientModel = require('../models/client.js')
const projectModel = require('../models/project.js')
const deliveryModel = require('../models/deliverynote.js')

jest.setTimeout(30000)

describe('deliverynote endpoints', () => {

    let token
    let userId
    let clientId
    let projectId
    let deliveryId

    const api = supertest(app)

    beforeAll(async () => {
        token = global.USER_TOKEN
        userId = global.USER_ID
        if (!token || !userId) {
            throw new Error('Authentication credentials not found')
        }

        await deliveryModel.deleteMany({})
        await projectModel.deleteMany({})
        await clientModel.deleteMany({})

        const clientResponse = await api.post('/api/client').auth(token, { type: 'bearer' })
            .send({
                name: 'Cliente for Delivery',
                cif: `CIF${Date.now()}`,
                address: {
                    street: 'Street D',
                    number: 9,
                    postal: 12345,
                    city: 'CityD',
                    province: 'ProvD'
                }
            }).expect(200).expect('Content-Type', /application\/json/)
        clientId = clientResponse.body._id

        await clientModel.findByIdAndUpdate(clientId, { createdBy: userId })

        const projectResponse = await api.post('/api/project').auth(token, { type: 'bearer' })
            .send({
                name: 'Proyecto for Delivery',
                email: 'deliv@test.com',
                address: {
                    street: 'Proj Street',
                    number: 2,
                    postal: 54321,
                    city: 'ProjCity',
                    province: 'ProjProv'
                },
                code: 'D001',
                clientId,
                notes: 'Notes'
            }).expect(200).expect('Content-Type', /application\/json/)
        projectId = projectResponse.body._id
    })

    afterAll(async () => {
        await mongoose.disconnect();
    })

    it('should create a new deliveryNote', async () => {
        const { body } = await api.post('/api/deliverynote').auth(token, { type: 'bearer' })
            .send({
                clientId,
                projectId,
                format: 'material',
                material: 'wood',
                hours: 8,
                description: 'my description',
                workdate: '2024-02-01'
            }).expect(200).expect('Content-Type', /application\/json/)
        deliveryId = body._id
        expect(body.format).toBe('material')
        expect(body.hours).toBe(8)
    });

    it('should get all deliveryNote for a project', async () => {
        const { body } = await api.get(`/api/deliverynote/${projectId}`).auth(token, { type: 'bearer' })
            .expect(200).expect('Content-Type', /application\/json/)
        expect(Array.isArray(body.deliverynotes)).toBe(true);
        expect(body.deliverynotes.some(d => d._id === deliveryId)).toBe(true)
    });

    it('should get a specific deliveryNote', async () => {
        const { body } = await api.get(`/api/deliverynote/ById/${deliveryId}`).auth(token, { type: 'bearer' })
            .expect(200).expect('Content-Type', /application\/json/)
        expect(body.deliverynote).toBeDefined()
        expect(body.deliverynote._id).toBe(deliveryId)
    });

    it('should download the PDF', async () => {
        const response = await api.get(`/api/deliverynote/pdf/${deliveryId}`).auth(token, { type: 'bearer' })
            .expect(200)
        expect(response.headers['content-type']).toMatch(/pdf/)
    });

    it('should sign the delivery note', async () => {
        const { body } = await api.patch(`/api/deliverynote/signimage/${deliveryId}`).auth(token, { type: 'bearer' })
            .attach('image', Buffer.from('dummy'), 'firma.png').expect(200).expect('Content-Type', /json/)
        expect(body.deliverynote.firma).toBeDefined()
        expect(body.deliverynote.firma.url).toContain('https://')
    });

    /*it('should download the signed PDF', async () => {
        const onePxPng = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=',
            'base64'
        )

        axios.get.mockResolvedValueOnce({
            data: onePxPng,
            headers: { 'content-type': 'image/png' }
        }).mockResolvedValueOnce({
            data: Buffer.from('%PDF-1.4\n'),
            headers: { 'content-type': 'application/pdf' }
        })
        const response = await api.patch(`/api/deliverynote/signedPdf/${deliveryId}`).auth(token, { type: 'bearer' })
            .expect(200)
        expect(response.headers['content-type']).toMatch(/pdf/)
    });*/

    it('should delete the deliveryNote', async () => {
        await clientModel.findByIdAndUpdate(clientId, { createdBy: userId })
        const { body: newDelivery } = await api.post('/api/deliverynote').auth(token, { type: 'bearer' })
            .send({
                clientId,
                projectId,
                format: 'material',
                material: 'delete-test',
                hours: 1,
                description: 'to delete',
                workdate: '2024-02-01'
            }).expect(200)
        const deleteResponse = await api.delete(`/api/deliverynote/delete/${newDelivery._id}`).auth(token, { type: 'bearer' })
            .expect(200)
        expect(deleteResponse.body.message).toBe('eliminado!')
    });
})