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

    describe('Setup Functions', () => {

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
                appendToList(['users', userResponse.body.post._id]);
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

        it('should create a second new user and log in', async () => {
            const userResponse2 = await supertest(app)
            .post('/api/users')
            .send({
                userName: 'testuser',
                password: userpas,
                userType: 'test',
                firstName: 'Test',
                lastName: 'User',
                email: userem2,
                birthday: '1990-01-01',
                bio: 'A test bio',
                employments: [],
              });
            if (userResponse2.statusCode === 201){
      
                appendToList(['users', userResponse2.body.post._id]);
                id2 = userResponse2.body.post._id
                expect(listLength()).toBeGreaterThan(0);
  
            }
            expect(userResponse2.statusCode).toEqual(201);
            expect(userResponse2.body).toHaveProperty('post');
            
  
            const res2 = await request.post('/api/auth')
                .send({
                    email: userem2,
                    password: userpas
                })
  
            expect(res2.statusCode).toEqual(200);
            token2 = res2.body.token;

        });

        it('should create a new organization', async () => {
            const newOrg = { 
                organizationName: "TestOrg",
                organizationEmail: "testorg1@example.com",
                organizationAdministrators: [id2],
                employees: [userId],
                industry: "Technology"
            };

            const response = await request.post('/api/org')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newOrg);

            if (response.status === 201) {
                appendToList(['org', response.body.org._id]);
            }
            expect(response.body.message).toEqual("Organization added successfully");
            expect(response.status).toBe(201);
            expect(response.body.org.organizationAdministrators).toContain(userId);
            expect(response.body.org.organizationAdministrators).not.toEqual([userId]);
            orgId = response.body.org._id;
            expect(orgId).toBeTruthy();
            
        });
        it('should create an employee', async () => {
            const newEmployee = new Employee({
                email : "poopscoop@gmail.com",
                userId : userId,
                businessId : orgId,
                status: Status.invited
            });
            await newEmployee.save()
            employeeId = newEmployee.id
            appendToList(['employee', employeeId])
        });

    });

    describe('GET /api/employee/:id', () => {
        it('should get an employee by ID', async () => {
            const response = await request.get(`/api/employee/${employeeId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body.employee).toBeDefined();
        });

        it('should return not found for an invalid ID', async () => {
            const response = await request.get(`/api/employee/${userId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.body.message).toEqual("Employee not found");
            expect(response.status).toBe(404);
        });
    });

    describe('GET /api/employee/user/:userId', () => {
        it('should get employees by user ID', async () => {
            const response = await request.get(`/api/employee/byUserId/${userId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.employees)).toBeTruthy();
        });

        it('should return no employees found for a non-existent user', async () => {
            const response = await request.get(`/api/employee/byUserId/${employeeId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.body.message).toEqual("No employees found");
            expect(response.status).toBe(404);

        });
    });

    describe('PUT /api/employee/:id', () => {
        it('should update an employee', async () => {
            const updatedData = { email: "newemail@example.com" };
            const response = await request.put(`/api/employee/${employeeId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(updatedData);

            expect(response.body.employee.email).toEqual(updatedData.email);
            expect(response.status).toBe(200);

        });

        it('should update an employee from org admin', async () => {
            const updatedData = { email: "newnewemail@example.com" };
            const response = await request.put(`/api/employee/${employeeId}`)
                .set('Authorization', `Bearer ${token2}`)
                .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body.employee.email).toEqual(updatedData.email);
        });

        it('should return invalid credentials when unauthorized', async () => {
            const updatedData = { email: "unauthorized@example.com" };
            const response = await request.put(`/api/employee/${employeeId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData);

            expect(response.status).toBe(500);
            expect(response.body.message).toEqual("Invalid Credentials");
        });

        it('should return not found for an invalid ID', async () => {
            const updatedData = { email: "nonexistent@example.com" };
            const response = await request.put(`/api/employee/${userId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(updatedData);

            expect(response.status).toBe(500);
            expect(response.body.message).toEqual("Employee not found");
        });
    });

    describe('DELETE /api/employee/:id', () => {
        it('should return invalid credentials when unauthorized for delete', async () => {
            const response = await request.delete(`/api/employee/${employeeId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.body.message).toEqual("Invalid Credentials");
            expect(response.status).toBe(404);

        });

        it('should delete an employee', async () => {
            const response = await request.delete(`/api/employee/${employeeId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.body.message).toEqual("Employee deleted successfully");
            expect(response.status).toBe(200);
            removeFromList(['employees', employeeId]); // Assuming you manage a list of test records
        });

        it('should return not found for an invalid ID', async () => {
            const response = await request.delete(`/api/employee/${userId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.body.message).toEqual("Employee not found");
            expect(response.status).toBe(404);
        });
    });
});
