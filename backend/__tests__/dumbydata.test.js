const supertest = require('supertest');
const app = require('../app'); 
const mongoose = require('mongoose');
const Employee = require('../models/employee'); 
const Status = require('../utils/status');
const { appendToList, removeFromList, clean, getList, listLength } = require('../utils/moduleForTestingSupport');

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

describe('Employee API endpoints', () => {
    // test('This test will always pass', () => {
    //     expect(true).toBeTruthy();
    // });
    let userpas = 'password1!D';
    let userem = 'testt@example.com';
    let userem2 = 'testtttttttt@example.com';
    userId = process.env.USER_ID;
    userToken = process.env.AUTH_TOKEN;
    let token, orgId, employeeId;
    let token2, id2;


    it('should create a new user then log in', async () => {

        const userResponse = await supertest(app)
        .post('/api/users')
        .send({
            userName: 'testuser',
            password: userpas,
            userType: 'test',
            firstName: 'Test',
            lastName: 'User',
            email: userem,
            birthday: '1990-01-01',
            bio: 'A test bio',
            employments: [],
            logs: ['anything can go here no matter how long it is and this is proof of this concept, literally anything even above the character max for the default']
        });
        if (userResponse.statusCode === 201){
            // appendToList(['users', userResponse.body.post._id]);
            console.log(getList())
            id = userResponse.body.post._id
            expect(listLength()).toBeGreaterThan(0);
        }
        expect(userResponse.statusCode).toEqual(201);
        expect(userResponse.body).toHaveProperty('post');
        
        const res = await request.post('/api/auth')
        .send({
            email: userem,
            password: userpas
            })
        expect(res.statusCode).toEqual(200);
        token = res.body.token;
    });

});