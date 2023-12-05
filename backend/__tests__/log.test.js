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
    // var employeeId
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
                appendToList(['log', response.body.id]);
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
    
        it('should add a log entry to an existing log', async () => {
            const newLogEntry = {
                log: {
                    scoop : "floop",
                    doop: "sloop"
                }
            };
    
            const response = await supertest(app)
                .put(`/api/log/${logId}/entry`) 
                .set('Authorization', `Bearer ${userToken}`)
                .send(newLogEntry);
    
            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('log');
            expect(response.body.log.log).toContainEqual(newLogEntry['log']);
        });

        it('should fail to add a log entry to an existing log', async () => {
            const newLogEntry = {
                // log: {
                scoop : "floop",
                doop: "sloop"
                // }
            };
    
            const response = await supertest(app)
                .put(`/api/log/${logId}/entry`) 
                .set('Authorization', `Bearer ${userToken}`)
                .send(newLogEntry);
    
            expect(response.statusCode).toEqual(400);
        });

        // var holdover
        // it('should close a log entry by ID', async () => {
        //     console.log("great stats: " + logId)
        //     const response = await supertest(app)
        //         .patch(`/api/log/${logId}/end`)
        //         .set('Authorization', `Bearer ${userToken}`);

        //     console.log("abcdefgg " + response.body.message);
        //     expect(response.statusCode).toEqual(200);
        //     expect(response.body).toHaveProperty('status');
        //     expect(response.body.status).toBe('Closed');
        //     holdover = response.body.endTimestamp
        // });
    
    //     it('should close the same log entry by ID', async () => {
    //         const response = await supertest(app)
    //             .patch(`/api/log/${logForHere}/end`)
    //             .set('Authorization', `Bearer ${userToken}`);

    //         console.log("abcdefg " + response.body.message);
    //         expect(response.statusCode).toEqual(200);
    //         expect(response.body).toHaveProperty('status');
    //         expect(response.body.endTimestamp).toBe(holdover);

    //     });

        it('should retrieve all log entries', async () => {
            const response = await supertest(app)
                .get('/api/log')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.statusCode).toEqual(200);
            expect(Array.isArray(response.body.logs)).toBeTruthy();
        });
    
        it('should retrieve a log entry by ID', async () => {
            const response = await supertest(app)
                .get(`/api/log/${logId}`)
                .set('Authorization', `Bearer ${userToken}`);

    
            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('log');
        });

        it('should retrieve all log entries for a specific employee', async () => {
            const response = await supertest(app)
                .get(`/api/log/employee/${userId}`)
                .set('Authorization', `Bearer ${userToken}`);
            // if (response.statusCode === 404) {
            //     expect(response.body.message).toEqual("No logs found for the specified employee!");
            // } else {
            expect(response.statusCode).toEqual(200);
            expect(Array.isArray(response.body.logs)).toBeTruthy();
            // }
        });

        it('should fail to retrieve all log entries for a specific employee', async () => {
            const response = await supertest(app)
                .get(`/api/log/employee/${employeeId}`)
                .set('Authorization', `Bearer ${userToken}`);
    
            // if (response.statusCode === 404) {
            expect(response.statusCode).toEqual(404);
            expect(response.body.message).toEqual("No logs found for the specified employee!");
            // } else {
            //     expect(response.statusCode).toEqual(200);
            //     expect(Array.isArray(response.body.logs)).toBeTruthy();
            // }
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

    describe('Log Close API Tests', () => {
        var logForHere
        it('should create a new log entry', async () => {
            const newLog = {
                employee: userId
            };
    
            const response = await supertest(app)
                .post('/api/log')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newLog);
    
            if(response.statusCode === 201){
                appendToList(['log', response.body.id]);
            }
            expect(response.statusCode).toEqual(201);
            expect(response.body).toHaveProperty('log');
            logForHere = response.body.log._id; // Save log ID for future tests
        });
        var holdover
        it('should close a log entry by ID', async () => {
            const response = await supertest(app)
                .patch(`/api/log/${logForHere}/end`)
                .set('Authorization', `Bearer ${userToken}`);

            console.log("abcdefgg " + response.body.message);
            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('status');
            expect(response.body.status).toBe('Closed');
            holdover = response.body.endTimestamp
        });
    
        it('should close the same log entry by ID', async () => {
            const response = await supertest(app)
                .patch(`/api/log/${logForHere}/end`)
                .set('Authorization', `Bearer ${userToken}`);

            console.log("abcdefg " + response.body.message);
            expect(response.statusCode).toEqual(200);
            expect(response.body).toHaveProperty('status');
            expect(response.body.endTimestamp).toBe(holdover);

        });
    });
   
});