jest.mock('../utils/handleEmail.js', () => ({
    sendVerifyCode: jest.fn().mockResolvedValue(true),
}));

const supertest = require('supertest');
const app = require('../app.js');
const usersModel = require('../models/user.js');
const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connection.once('connected', () => { });
    await usersModel.deleteMany({});

    const temp = { mail: `setup${Date.now()}@correo.es`, passwd: 'A12345678' };
    const api = supertest(app);

    const { body: reg } = await api.post('/api/auth/register').send(temp).expect(200);
    await usersModel.findByIdAndUpdate(reg.user._id, { estado: 'validado' });

    const { body: login } = await api.post('/api/auth/login').send(temp).expect(200);

    global.USER_TOKEN = login.token
    global.USER_ID = login.user._id
    global.USER_CREDENTIALS = temp
})

afterAll(async () => {
    await mongoose.disconnect();
});