const supertest = require('supertest')
const app = require('../app.js')
const mongoose = require('mongoose')
const clientModel = require('../models/client.js')

jest.setTimeout(30000)

describe('client endpoints', () => {
    let token
    let clientId
    let clientCif
    const api = supertest(app)

    beforeAll(async () => {
        await clientModel.deleteMany({})
        token = global.USER_TOKEN
        if (!token) throw new Error('USER_TOKEN no definido')
    })

    it('should create a new client', async () => {
        const peticion = {
            name: 'Cliente Test',
            cif: 'D52431244',
            address: {
                street: 'Felipe VI',
                number: 20,
                postal: 28000,
                city: 'Madrid',
                province: 'Madrid'
            }
        }
        const { body } = await api.post('/api/client').auth(token, { type: 'bearer' })
            .send(peticion).expect(200).expect('Content-Type', /application\/json/)
        expect(body).toHaveProperty('_id')
        expect(body.name).toBe(peticion.name)
        clientId = body._id
        clientCif = body.cif
    });

    it('should get all clients', async () => {
        const { body } = await api.get('/api/client').auth(token, { type: 'bearer' })
            .expect(200)
        expect(Array.isArray(body.data)).toBe(true)
        expect(body.data.some(c => c._id === clientId)).toBe(true)
    });

    it('should get a client by id', async () => {
        const { body } = await api.get(`/api/client/${clientId}`).auth(token, { type: 'bearer' })
            .expect(200)
        expect(body.data._id).toBe(clientId)
    });

    it('should update a client', async () => {
        const update = {
            name: 'Cliente Modificado',
            address: {
                street: 'Nueva',
                number: 10,
                postal: 28010,
                city: 'Madrid',
                province: 'Madrid'
            }
        }
        const { body } = await api.put('/api/client').auth(token, { type: 'bearer' })
            .send({ cif: clientCif, ...update }).expect(200).expect('Content-Type', /application\/json/)
        expect(body.clientUpdate.name).toBe(update.name)
    });

    it('should archive a client (soft-delete)', async () => {
        const { body } = await api.delete('/api/client/archivar').auth(token, { type: 'bearer' })
            .send({ cif: clientCif }).expect(200)
        expect(body.message).toBe('archivado!')
    });

    it('should get archived clients', async () => {
        const { body } = await api.get('/api/client/archived').auth(token, { type: 'bearer' })
            .expect(200)
        expect(Array.isArray(body.data)).toBe(true)
        expect(body.data.some(c => c._id === clientId)).toBe(true)
    });

    it('should restore a client', async () => {
        const { body } = await api.patch('/api/client/restore').auth(token, { type: 'bearer' }).send({ cif: clientCif })
            .expect(200).expect('Content-Type', /application\/json/)
        expect(body.message).toBe('restaurado!')
    });

    it('should delete a client (hard-delete)', async () => {
        await api.delete('/api/client/delete').auth(token, { type: 'bearer' })
            .send({ cif: clientCif }).expect(200)
        const notDeleted = await clientModel.findOne({ cif: clientCif })
        expect(notDeleted).toBeNull()
    });
})