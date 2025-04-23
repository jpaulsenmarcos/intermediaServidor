jest.mock('../utils/handleEmail.js', () => ({
    sendVerifyCode: jest.fn().mockResolvedValue(true),
}))

const supertest = require('supertest')
const app = require('../app.js')
const mongoose = require('mongoose')
const usersModel = require('../models/user.js')

jest.setTimeout(30000);

function buildUser() {
    return {
        mail: `test${Date.now()}@correo.es`,
        passwd: 'A12345678',
    };
}

describe('auth endpoints', () => {
    let token
    let userId
    let userMail

    const api = supertest(app)

    beforeAll(async () => {
        await new Promise((resolve) => mongoose.connection.once('connected', resolve));
    });

    beforeEach(async () => {
        await usersModel.deleteMany({})
        const userBody = buildUser()
        userMail = userBody.mail

        const registerResponse = await api.post('/api/auth/register').send(userBody)
            .set('Accept', 'application/json').expect(200);

        token = registerResponse.body.token;
        userId = registerResponse.body.user._id;

        await usersModel.findByIdAndUpdate(userId, {
            estado: 'validado',
            verifyCode: null,
            numberOfTries: 0,
        })
    })

    afterAll(async () => {
        await mongoose.disconnect();
    })

    it('should register a user', () => {
        expect(token).toBeTruthy();
        expect(userId).toBeTruthy();
    })

    it('should log the user', async () => {
        const loginResponse = await api.post('/api/auth/login').send({ mail: userMail, passwd: 'A12345678' })
            .set('Accept', 'application/json').expect(200).expect('Content-Type', /application\/json/);

        expect(loginResponse.body).toHaveProperty('token')
        expect(loginResponse.body.user._id).toBe(userId)
    })
})