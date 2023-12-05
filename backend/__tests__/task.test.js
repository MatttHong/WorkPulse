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
    var taskId
    describe('Post', () => {
        it('should create a Task', async () => {
            newTask = {
                taskName : "IncredibleNewTask"
            }
            const response = await supertest(app)
                .post('/api/task')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newTask);
    
            if(response.statusCode === 201){
                appendToList(['task', response.body.task._id]);
            }
            expect(response.statusCode).toEqual(201);
            expect(response.body).toHaveProperty('task');
            expect(response.body.task).toHaveProperty('_id');
    
            taskId = response.body.task._id
            // console.log(pro)
        });
    });

    describe('Put', () => {
        it('should edit a Task', async () => {
            newTask = {
                taskName : "IncredibleNewProject2"
            }
            const response = await supertest(app)
                .put(`/api/task/${taskId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(newTask);
            // console.log("right Here " + response.body.message)
            if(response.statusCode === 201){
                appendToList(['task', response.body.task.id]);
            }
            console.log("GGGG " + response.body.message)
            expect(response.statusCode).toEqual(200);
            expect(response.body.task.taskName).toBe('IncredibleNewProject2');
        });
    });

    describe('Get', () => {
        it('should get all tasks', async () => {
            const response = await supertest(app)
                .get('/api/task')
                .set('Authorization', `Bearer ${userToken}`)
                // .send(newProj);

            // console.log("GGGG " + response.body.message)
            // if(response.statusCode === 201){
            //     appendToList(['proj', response.body.id]);
            // }
            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('tasks');
            expect(response.body.tasks.length).toBeGreaterThan(0);

        });

        it('should get proj by Id projects', async () => {
            console.log('looky here ' + taskId)
            const response = await supertest(app)
                .get(`/api/task/${taskId}`)
                .set('Authorization', `Bearer ${userToken}`)

            console.log("GGGG " + response.body.message)
            expect(response.statusCode).toEqual(200);
            expect(response.body.task.taskName).toBe('IncredibleNewProject2');

        });

        it('should fail to get task by Id', async () => {
            const response = await supertest(app)
                .get(`/api/task/${userId}`)
                .set('Authorization', `Bearer ${userToken}`)

            expect(response.statusCode).toEqual(404);

        });
    });
    describe('Delete', () => {
        it('should delete tasks by Id', async () => {
            const response = await supertest(app)
                    .delete(`/api/task/${taskId}`)
                    .set('Authorization', `Bearer ${userToken}`)
    
                expect(response.statusCode).toEqual(200);
        });
    });
});