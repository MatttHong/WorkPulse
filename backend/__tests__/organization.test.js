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

describe('Organization API endpoints', () => {
    // test('This test will always pass', () => {
    //     expect(true).toBeTruthy();
    // });
    let userpas = 'password1!D';
    let userem = 'testst@example.com';
    let userem2 = 'teststtttt@example.com';
    userId = process.env.USER_ID;
    userToken = process.env.AUTH_TOKEN;
    let token, orgId, id;
    let token2, id2;

    describe('Setup For Future Tests', () => {
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

          expect(userResponse.statusCode).toEqual(201);
          expect(userResponse.body).toHaveProperty('post');
          if (userResponse.statusCode === 201){
    
            id = userResponse.body.post._id
            appendToList(['users', userResponse.body.post._id]);
            expect(listLength()).toBeGreaterThan(0);

          }

          const res = await request.post('/api/auth')
            .send({
                email: userem,
                password: userpas
                })

          expect(res.statusCode).toEqual(200);
          token = res.body.token;

        });
    });

    describe('POST /api/org', () => {
        it('should create a new organization', async () => {
            const newOrg = { 
                organizationName: "TestOrg",
                organizationEmail: "testorg@example.com",
                organizationAdministrators: [],
                employees: [userId],
                industry: ["Technology"]
            };

            const response = await request.post('/api/org')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newOrg);

            expect(response.body.message).toEqual("Organization added successfully");
            expect(response.status).toBe(201);
            expect(response.body.org.organizationAdministrators).toEqual([userId]);
            orgId = response.body.org.id;
            expect(orgId).toBeTruthy();
            if (response.status === 201) {
                appendToList(['org', orgId]);
            }
        });

        it('should fail a new organization due to repeat email', async () => {
            const newOrg = { 
                organizationName: "TestOrg",
                organizationEmail: "testorg@example.com",
                // organizationAdministrators: [],
                employees: [userId],
                industry: ["Technology"]
            };

            const response = await request.post('/api/org')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newOrg);

            expect(response.status).toBe(500);
            console.log('this is the body')
            // console.log(response);
            expect(response.body.message).toEqual("Organization already exists.");

            // expect(response.body.org.organizationAdministrators).toEqual([userId]);
            // orgId = response.body.org.id;
            // expect(orgId).toBeTruthy();
            if (response.status === 201) {
                appendToList(['org', orgId]);
            }

        });

    });

    // describe('PUT /api/org/:id', () => {

    //     it('should return invalid credentials when unauthorized', async () => {
    //         const updatedOrgData = { 
    //             organizationName: "UnauthorizedOrg"
    //         };
    
    //         const response = await request.put(`/api/org/${orgId}`)
    //             .set('Authorization', `Bearer ${token}`)
    //             .send(updatedOrgData);
    
    //         expect(response.status).toBe(500);
    //         expect(response.body.message).toEqual("Invalid Credentials");
    //     });

    //     it('should be unable to find organization', async () => {
    //         const updatedOrgData = { 
    //             organizationName: "UnauthorizedOrg"
    //         };
    
    //         const response = await request.put(`/api/org/${userId}`)
    //             .set('Authorization', `Bearer ${userToken}`)
    //             .send(updatedOrgData);
    
    //         expect(response.status).toBe(500);
    //         expect(response.body.message).toEqual("Organization not found");
    //     });

    //     it('should update an existing organization', async () => {
    //         const updatedOrgData = { 
    //             organizationName: "UpdatedTestOrg"
    //         };

    //         const response = await request.put(`/api/org/${orgId}`)
    //             .set('Authorization', `Bearer ${userToken}`)
    //             .send(updatedOrgData);

    //         expect(response.status).toBe(200);
    //         expect(response.body.org.organizationName).toEqual(updatedOrgData.organizationName);
    //     });

    // });

    // describe('GET /api/org', () => {
    //     it('should get all organizations', async () => {
    //         const response = await request.get('/api/org')
    //             .set('Authorization', `Bearer ${userToken}`);

    //         expect(response.status).toBe(200);
    //         expect(Array.isArray(response.body.orgs)).toBeTruthy();
    //     });
    // });

    // describe('GET /api/org/:id', () => {
    //     it('should get an organization by ID', async () => {
    //         const response = await request.get(`/api/org/${orgId}`)
    //             .set('Authorization', `Bearer ${userToken}`);

    //         expect(response.status).toBe(200);
    //         expect(response.body.org).toBeDefined();
    //     });

    //     it('should return not found for an invalid ID', async () => {
    //         const response = await request.get(`/api/org/${userId}`)
    //             .set('Authorization', `Bearer ${userToken}`);

    //         expect(response.status).toBe(404);
    //         expect(response.body.message).toEqual("Organization not found");

    //     });

    // });

    // describe('DELETE /api/org/:id', () => {

    //     it('should return invalid credentials when unauthorized', async () => {
    //         const response = await request.delete(`/api/org/${orgId}`)
    //             .set('Authorization', `Bearer ${token}`);
    
    //         expect(response.status).toBe(404);
    //         expect(response.body.message).toEqual("Invalid Credentials");
    //     });

    //     it('should fail to find an organization', async () => {

    //         const response = await request.delete(`/api/org/${userId}`)
    //             .set('Authorization', `Bearer ${userToken}`);

    //         expect(response.status).toBe(404);
    //         expect(response.body.message).toEqual("Organization not found");
    //         removeFromList(['org', orgId]);
            
    //     });

    //     it('should delete an organization', async () => {

    //         const response = await request.delete(`/api/org/${orgId}`)
    //             .set('Authorization', `Bearer ${userToken}`);

    //         expect(response.status).toBe(200);
    //         expect(response.body.message).toEqual("Organization deleted successfully");
    //         removeFromList(['org', orgId]);

    //     });

    // });

});
