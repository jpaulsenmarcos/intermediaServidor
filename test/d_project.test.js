const supertest = require('supertest')
const app = require('../app.js')
const mongoose = require('mongoose')
const clientModel = require('../models/client.js')
const projectModel = require('../models/project.js')

jest.setTimeout(30000)

describe('project endpoints', () => {
    let token
    let userId
    let clientId
    let projectId
    const api = supertest(app)

    beforeAll(async () => {
        token = global.USER_TOKEN
        userId = global.USER_ID
        if (!token || !userId) {
            throw new Error('Authetication credentials not found')
        }

        await projectModel.deleteMany({})
        await clientModel.deleteMany({})

        const clientData = {
            name: 'Cliente for Project',
            cif: `CIF${Date.now()}`,
            address: {
                street: 'Street Test',
                number: 1,
                postal: 12345,
                city: 'CityTest',
                province: 'ProvTest'
            }
        }
        const response = await api.post('/api/client').auth(token, { type: 'bearer' })
            .send(clientData).expect(200).expect('Content-Type', /application\/json/)
        clientId = response.body._id
    })

    afterAll(async () => {
        await mongoose.disconnect();
    })

    it('should create a new project', async () => {
        const projectData = {
            name: 'Proyecto Test',
            email: 'proj@test.com',
            address: {
                street: 'Proj Street',
                number: 2,
                postal: 54321,
                city: 'ProjCity',
                province: 'ProjProv'
            },
            code: 'P001',
            clientId,
            notes: 'Test notes'
        }
        const { body } = await api.post('/api/project').auth(token, { type: 'bearer' })
            .send(projectData).expect(200).expect('Content-Type', /application\/json/)
        projectId = body._id
        expect(body).toHaveProperty('_id')
        expect(body.name).toBe(projectData.name)
        expect(body.clientId).toBe(clientId)
    });

    it('should get all the project from the user', async () => {
        const { body } = await api.get('/api/project').auth(token, { type: 'bearer' })
            .expect(200).expect('Content-Type', /application\/json/)
        expect(Array.isArray(body.projects)).toBe(true)
        const found = body.projects.find(p => p._id === projectId)
        expect(found).toBeDefined()
        expect(found._id).toBe(projectId)
    });

    it('should get all projects from a client', async () => {
        const { body } = await api.get(`/api/project/client/${clientId}`).auth(token, { type: 'bearer' })
            .expect(200).expect('Content-Type', /application\/json/)
        expect(Array.isArray(body.projects)).toBe(true)
        const found = body.projects.find(p => p._id === projectId)
        expect(found).toBeDefined()
        expect(found._id).toBe(projectId)
    });

    it('should get a specific project', async () => {
        const { body } = await api.get(`/api/project/${clientId}/${projectId}`).auth(token, { type: 'bearer' })
            .expect(200).expect('Content-Type', /application\/json/)
        expect(body.project).toBeDefined()
        expect(body.project._id).toBe(projectId)
        expect(body.project.clientId).toBe(clientId)
    });

    it('should update a project', async () => {
        const updatedData = {
            name: 'ProyectoclienteHGS',
            email: 'juanito@gmail.com',
            address: {
                street: 'Carlos V',
                number: 22,
                postal: 28936,
                city: 'Móstoles',
                province: 'Madrid'
            },
            code: '0001',
            notes: 'Actualización 10 de abril'
        }
        const { body } = await api.put(`/api/project/${projectId}`).auth(token, { type: 'bearer' })
            .send(updatedData).expect(200).expect('Content-Type', /application\/json/)
        expect(body.updatedProject).toBeDefined()
        expect(body.updatedProject.name).toBe(updatedData.name)
        expect(body.updatedProject.email).toBe(updatedData.email)
        expect(body.updatedProject.address.street).toBe(updatedData.address.street)
        expect(body.updatedProject.code).toBe(updatedData.code)
        expect(body.updatedProject.notes).toBe(updatedData.notes)
    });

    it('should archive a project (soft-delete)', async () => {
        const { body } = await api.put(`/api/project/archivar/${clientId}/${projectId}`).auth(token, { type: 'bearer' })
            .expect(200).expect('Content-Type', /application\/json/)
        expect(body.message).toBe('archivado!')
    });

    it('should get archived projects', async () => {
        const { body } = await api.get('/api/project/archived').auth(token, { type: 'bearer' })
            .expect(200).expect('Content-Type', /application\/json/)
        expect(Array.isArray(body.projects)).toBe(true)
        const found = body.projects.find(p => p._id === projectId)
        expect(found).toBeDefined()
        expect(found._id).toBe(projectId)
    });

    it('should recover a project', async () => {
        const { body } = await api.put(`/api/project/recuperar/${clientId}/${projectId}`).auth(token, { type: 'bearer' })
            .expect(200).expect('Content-Type', /application\/json/)
        expect(body.message).toBe('recuperado!')
    });

    it('should delete a project (hard-delete)', async () => {
        await api.delete(`/api/project/${clientId}/${projectId}`).auth(token, { type: 'bearer' })
            .expect(200)
        const notDeleted = await projectModel.findById(projectId)
        expect(notDeleted).toBeNull()
    })
})