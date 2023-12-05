const supertest = require('supertest');
const app = require('../app'); // Adjust the path to your app entry point
const mongoose = require('mongoose');
const { appendToList, removeFromList, clean, listLength } = require('../utils/moduleForTestingSupport');

const request = supertest(app);
let userToken, userId;

beforeAll(async () => {
    await mongoose.connect(`mongodb://${process.env.MONGO}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    if(!userToken){
        userToken = process.env.AUTH_TOKEN;
    }
    await clean(userToken);
    await mongoose.connection.close();
});

describe('Project API endpoints', () => {
    userId = process.env.USER_ID;
    userToken = process.env.AUTH_TOKEN;
    var projId

    it('should create a project', async () => {
        newProj = {
            projectName : "IncredibleNewProject"
        }
        const response = await supertest(app)
            .post('/api/proj')
            .set('Authorization', `Bearer ${userToken}`)
            .send(newProj);

        if(response.statusCode === 201){
            appendToList(['proj', response.body.project._id]);
        }
        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty('project');
        expect(response.body.project).toHaveProperty('_id');

        projId = response.body.project._id
        // console.log(pro)
    });

    it('should edit a project', async () => {
        newProj = {
            projectName : "IncredibleNewProject1"
        }
        const response = await supertest(app)
            .put(`/api/proj/${projId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send(newProj);
        console.log("right Here " + response.body.message)
        if(response.statusCode === 201){
            appendToList(['proj', response.body.id]);
        }
        console.log("GGGG " + response.body.message)
        expect(response.statusCode).toEqual(200);
        expect(response.body.project.projectName).toBe('IncredibleNewProject1');

    });

    describe('Post', () => {

        it('should fail to create a project', async () => {
            newProj = {
                // projectName : "IncredibleNewProject"
            }
            const response = await supertest(app)
                .post('/api/proj')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newProj);

            if(response.statusCode === 201){
                appendToList(['proj', response.body.id]);
            }
            expect(response.statusCode).toEqual(500);
        });
        
    });
        
    describe('Get', () => {
        it('should get all projects', async () => {
            const response = await supertest(app)
                .get('/api/proj')
                .set('Authorization', `Bearer ${userToken}`)
                // .send(newProj);

            // console.log("GGGG " + response.body.message)
            // if(response.statusCode === 201){
            //     appendToList(['proj', response.body.id]);
            // }
            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('projects');
            expect(response.body.projects.length).toBeGreaterThan(0);

        });

        it('should get proj by Id projects', async () => {
            console.log('looky here ' + projId)
            const response = await supertest(app)
                .get(`/api/proj/${projId}`)
                .set('Authorization', `Bearer ${userToken}`)

            console.log("GGGG " + response.body.message)
            expect(response.statusCode).toEqual(200);
            expect(response.body.project.projectName).toBe('IncredibleNewProject1');

        });

        it('should fail to get get proj by Id projects', async () => {
            const response = await supertest(app)
                .get(`/api/proj/${userId}`)
                .set('Authorization', `Bearer ${userToken}`)

            expect(response.statusCode).toEqual(404);

        });

    });

    it('should delete projects by Id', async () => {
        const response = await supertest(app)
                .delete(`/api/proj/${projId}`)
                .set('Authorization', `Bearer ${userToken}`)

            expect(response.statusCode).toEqual(200);
    });

});
