const supertest = require('supertest');
const app = require('../app.js');

jest.setTimeout(30000);

describe('auth endpoints', () => {
    const api = supertest(app);

    it('should register a user', () => {

        expect(global.USER_TOKEN).toBeTruthy();
        expect(global.USER_ID).toBeTruthy();
    });

    it('should log the user', async () => {

        const { mail, passwd } = global.USER_CREDENTIALS;

        const { body } = await api
            .post('/api/auth/login')
            .send({ mail, passwd })
            .expect(200)
            .expect('Content-Type', /json/);

        expect(body).toHaveProperty('token');
        expect(body.user._id).toBe(global.USER_ID);
    });
});