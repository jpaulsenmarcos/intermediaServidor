const supertest = require('supertest')
const app = require('../app.js')
const mongoose = require('mongoose')
const clientModel = require('../models/client.js')

jest.setTimeout(30000)

describe('client endpoints', () => {
    let token
    let clientId
    const api = supertest(app)

    beforeAll(async () => {
        await clientModel.deleteMany({})
        token = global.USER_TOKEN
        if (!token) throw new Error('USER_TOKEN no definido')
    })

    it('should create a new client', async () => {
        const payload = {
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
            .send(payload).expect(200).expect('Content-Type', /application\/json/)
        expect(body).toHaveProperty('_id')
        expect(body.name).toBe(payload.name)
        clientId = body._id
    })
})