const supertest = require('supertest');
const app = require('../app'); 
const mongoose = require('mongoose');
const Employee = require("../models/employee"); 
const { appendToList, clean } = require('../utils/moduleForTestingSupport');

const request = supertest(app);
let userToken;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
  // Close the MongoDB connection after all tests have run
  await mongoose.connection.close();
});

describe('Invite API endpoints', () => {

    let userId = process.env.USER_ID;
    // let userEmail = process.env.EMAIL;
    // let password = process.env.PASSWORD;
    let orgId;
    userToken = process.env.AUTH_TOKEN;
    let employeeId;
    let email;
    let inviteToken;
    describe('setup with new organization', () => {
        it('should create a new organization', async () => {
            const newOrg = { 
                organizationName: "TestOrg",
                organizationEmail: "testorggg333@example.com",
                organizationAdministrators: [],
                employees: [userId],
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
    });
    describe('Invite a new user through the whole pipeline', () => {
    
        it('Inviting a new email', async () => {
            const data = { 
                email: "testin1234321@example.com",
                orgId: orgId
            };
            const response = await request.post('/api/invite')
                .set('Authorization', `Bearer ${userToken}`)
                .send(data);
            
            if(response.status === 200){
                appendToList(['employee', response.body.employeeId]);
                // if(response.body.userId){
                //     appendToList(['user', response.body.userId]);
                // }
            }
            expect(response.body.message).toEqual('Invitation email sent successfully.');
            expect(response.status).toBe(200);
            expect(response.body.new).toEqual(true)
            // expect(response.body).not.toHaveProperty('userId');
            employeeId = response.body.employeeId;
            inviteToken = response.body.inviteToken;
            email = response.body.email;

            expect(employeeId).toBeDefined();
            expect(employeeId).not.toBeNull();
            expect(employeeId).toBeTruthy();
            
            expect(inviteToken).toBeDefined();
            expect(inviteToken).not.toBeNull();
            expect(inviteToken).toBeTruthy();
            
            expect(email).toBeDefined();
            expect(email).not.toBeNull();
            expect(email).toBeTruthy();
            
        });

        it('waiting for 500ms', async () => {
            await sleep(500); // Sleep for 500 ms
        });

        it('Reinviting an email', async () => {
            const data = { 
                email: "testin1234321@example.com",
                orgId: orgId
            };
            const response = await request.post('/api/invite')
                .set('Authorization', `Bearer ${userToken}`)
                .send(data);
            
            if(response.status === 200){
                appendToList(['employee', response.body.employeeId]);
                // if(response.body.userId){
                //     appendToList(['user', response.body.userId]);
                // }
            }
            expect(response.body.message).toEqual('Invitation email sent successfully.');
            expect(response.status).toBe(200);
            expect(response.body.new).toEqual(false)
            // expect(response.body).toHaveProperty('userId');
            employeeId = response.body.employeeId;
            inviteToken = response.body.inviteToken;
            email = response.body.email;

            expect(employeeId).toBeDefined();
            expect(employeeId).not.toBeNull();
            expect(employeeId).toBeTruthy();
            
            expect(inviteToken).toBeDefined();
            expect(inviteToken).not.toBeNull();
            expect(inviteToken).toBeTruthy();
            
            expect(email).toBeDefined();
            expect(email).not.toBeNull();
            expect(email).toBeTruthy();
            
        });

    });
    describe('Accepting new invite', () => {
        it('should return 400 if required fields are missing', async () => {
            const data = {}; // Missing required fields
        
            const response = await request.put('/api/invite')
            .send(data);
        
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing required fields');
        });
        
        it('should return 404 if employee does not exist', async () => {
            const data = {
            employeeId: userId,
            email: email,
            inviteToken: inviteToken,
            };
        
            const response = await request.put('/api/invite')
            .send(data);
        
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Employee not found');
        });
        
        it('should return 400 if invite token is invalid', async () => {

            const newEmployee = new Employee({
                email: email,
                orgId: orgId,
            }); 

            newEmployee.generateInviteToken()

            const data = {
                employeeId: employeeId,
                email: email,
                inviteToken: newEmployee.inviteToken,
            };
        
            const response = await request.put('/api/invite')
                .send(data);
        
            expect(response.body.message).toBe('Invalid invite token');
            expect(response.status).toBe(400);
        });
        
        it('should return 400 if an middleware error occurs', async () => {
            // Mocking an internal server error by passing invalid data
            const data = {
                employeeId: 'validemployeeid',
                email: 'invalidemail', // Invalid email format
                inviteToken: 'validtoken',
            };
        
            const response = await request.put('/api/invite')
                .set('Authorization', `Bearer ${userToken}`)
                .send(data);
        
            expect(response.body.message).toBe('Request body contains values with invalid lengths.');
            expect(response.status).toBe(400);

        });
        it('should return 400 if an middleware error occurs', async () => {
            // Mocking an internal server error by passing invalid data
            const data = {
                employeeId: userId,
                email: 'invalidemail', // Invalid email format
                inviteToken: inviteToken,
            };
        
            const res = await request.put('/api/invite')
            .set('Authorization', `Bearer ${userToken}`)
            .send(data);
            
            expect(res.body.message).toBe('Invalid email format.');
            expect(res.status).toBe(400);
        });

        it('should return 200 for a proper run through', async () => {
            const data = {
                employeeId: employeeId,
                email: email, 
                inviteToken: inviteToken,
            };
        
            const response = await request.put('/api/invite')
                .set('Authorization', `Bearer ${userToken}`)
                .send(data);
        
            if(response.status === 200){
                appendToList(['users', response.userId]);
            }

            expect(response.body.message).toBe('Employee updated successfully');
            expect(response.status).toBe(200);
            expect(response.body.userId).toBeDefined();
            expect(response.body.token).toBeDefined();

            // });
        });

    });

});