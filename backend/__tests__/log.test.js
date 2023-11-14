const supertest = require('supertest');
const app = require('../app'); 
const mongoose = require('mongoose');
const Log = require("../models/logs"); 
const Employee = require("../models/employee");
const Status = require("../utils/status.js");
const { appendToList, clean } = require('../utils/moduleForTestingSupport');

const request = supertest(app);
let userToken;


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

describe('Organization API endpoints', () => {
    test('this test will always pass', () => {
        expect(true).toBe(true);
      });
      
    userId = process.env.USER_ID;
    userToken = process.env.AUTH_TOKEN;

    describe('Setup For Future Tests', () => {

        it('should create a new organization', async () => {
            const newOrg = { 
                organizationName: "TestOrg",
                organizationEmail: "testorrrrrrg@example.com",
                organizationAdministrators: [],
                // employees: [userId],
                industry: ["Technology"]
            };

            const response = await request.post('/api/org')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newOrg);
            if (response.status === 201) {
                appendToList(['org', response.body.org.id]);
            }
            expect(response.body.message).toEqual("Organization added successfully");
            expect(response.status).toBe(201);
            expect(response.body.org.organizationAdministrators).toEqual([userId]);
            orgId = response.body.org.id;
            expect(orgId).toBeTruthy();
            
        });

        it('should create an employee', async () => {
            const newEmployee = new Employee({
                email : "poopscoooooop@gmail.com",
                userId : userId,
                orgId : orgId,
                status: Status.invited
            });
            await newEmployee.save()
            employeeId = newEmployee.id
            appendToList(['employee', employeeId])
        });

    });

    describe('Log API Tests', () => {
        // Test for creating a new log
        it('should create a new log entry', async () => {
            const newLog = {
                employee: userId
            };
    
            const response = await supertest(app)
                .post('/api/log')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newLog);
    
            if(response.statusCode === 201){
                appendToList(['org', response.body.id]);
            }
            expect(response.statusCode).toEqual(201);
            expect(response.body).toHaveProperty('log');
            logId = response.body.log._id; // Save log ID for future tests
        });
    
        // Test for updating a log
        it('should update a log entry', async () => {
            const updatedLog = {
                task: userId
            };
    
            const response = await supertest(app)
                .put(`/api/log/${logId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(updatedLog);

            expect(response.statusCode).toEqual(200);
            expect(response.body.log.task).toEqual(updatedLog.task);
        });
    
        // Test for retrieving all logs
        it('should retrieve all log entries', async () => {
            const response = await supertest(app)
                .get('/api/log')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toEqual(200);
            expect(Array.isArray(response.body.logs)).toBeTruthy();
        });
    
        // Test for retrieving a single log by ID
        it('should retrieve a log entry by ID', async () => {
            const response = await supertest(app)
                .get(`/api/log/${logId}`)
                .set('Authorization', `Bearer ${userToken}`);

    
            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('log');
        });
    
        // Test for deleting a log
        it('should delete a log entry', async () => {
            
            const response = await supertest(app)
                .delete(`/api/log/${logId}`)
                .set('Authorization', `Bearer ${userToken}`);
            if(response.statusCode === 200)
            expect(response.statusCode).toEqual(200);
            expect(response.body.message).toContain('successfully');

        });
    
    });
   
});