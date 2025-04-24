const supertest = require('supertest')
const app = require('../app.js')
const mongoose = require('mongoose')
const usersModel = require('../models/user.js')

jest.setTimeout(30000)

describe('user endpoints', () => {
    let token
    let userId

    const api = supertest(app)

    beforeAll(() => {
        token = global.USER_TOKEN
        userId = global.USER_ID
        if (!token || !userId) {
            throw new Error('No se ha ejecutado auth test')
        }
    })

    it('should get all users', async () => {
        const { body } = await api.get('/api/users').auth(token, { type: 'bearer' })
            .expect(200).expect('Content-Type', /application\/json/)

        expect(body.data.some(u => u._id === userId)).toBe(true)
    });

    it('should get my users', async () => {
        const { body } = await api.get('/api/users/mine').auth(token, { type: 'bearer' })
            .expect(200)

        expect(body.data._id).toBe(userId)
    });

    it('should update a user', async () => {
        const { body } = await api.put('/api/users').auth(token, { type: 'bearer' })
            .send({ mail: global.USER_CREDENTIALS.mail, name: 'Nombre Modificado', surnames: 'Apellidos Modificado', nif: '12345678Z' }).expect(200)
        expect(body.user.name).toBe('Nombre Modificado')
    });

    it('should update user company info', async () => {
        const { body } = await api.patch('/api/users/company').auth(token, { type: 'bearer' })
            .send({
                company: {
                    name: 'Empresa Test',
                    cif: 'B12345678',
                    street: 'Calle False',
                    number: 123,
                    postal: 28080,
                    city: 'Madrid',
                    province: 'Madrid'
                },
            }).expect(200)

        expect(body.user.company.cif).toBe('B12345678')
    });

    it('should soft-delete a user', async () => {
        const { body } = await api.delete('/api/users?soft=true').auth(token, { type: 'bearer' })
            .expect(200).expect('Content-Type', /application\/json/)
        expect(body).toBe(true);
    });

    it('should hard-delete a user', async () => {
        await api.delete('/api/users?soft=false').auth(token, { type: 'bearer' }).expect(200)

        const exists = await usersModel.findById(userId)
        expect(exists).toBeNull()
    });
})