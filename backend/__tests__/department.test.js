const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { popFromList, isListPopulated, removeFromList, appendToList, clean, getList, listLength } = require('../utils/moduleForTestingSupport');

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
  // Close the MongoDB connection after all tests have run
  await mongoose.connection.close();
});

describe('Department API endpoints', () => {
  let userId = process.env.USER_ID;
  userToken = process.env.AUTH_TOKEN;
  let departmentId;
  let token;
  let userpas = 'password1!D';
  let userem = 'testest@example.com';
  describe('Should always work', () =>{

    test('this test will always pass', () => {
      expect(true).toBe(true);
    });
    
  });
  
  describe('Proper Testing', () => {

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
        if (userResponse.statusCode === 201){

          id = userResponse.body.post._id
          appendToList(['users', userResponse.body.post._id]);
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
        // expect(res.body.message).toEqual('Wrong Login Details');
      });
    });

    describe('POST /', () => {
      it('should create a new department', async () => {
        const newDepartment = { 
          departmentName : "spoogle",
          departmentAdministrators : [],
          employees : [userId]
        };

        const response = await request.post('/api/dep')
          .set('Authorization', `Bearer ${userToken}`)
          .send(newDepartment);
        if(response.status === 201){
          appendToList(['dep', response.body.dept.id]);
        }
        expect(response.status).toBe(201);
        expect(response.body.message).toEqual("Department added successfully")
        departmentId = response.body.dept._id
        expect(departmentId).toBeTruthy();
        expect(response.body.dept).toBeDefined();
        expect(response.body.dept.departmentAdministrators).toContain(userId);
        
      });
    });

    describe('PUT /:id', () => {
      it('should update an existing department', async () => {
        const updatedDepartmentData = { 
          employees : []
        };

        const response = await request.put(`/api/dep/${departmentId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updatedDepartmentData);

        expect(response.status).toBe(200);
        expect(response.body.dept).toBeDefined();
        expect(response.body.dept.employees).toEqual([]);
      });

      it('should throw invalid credentials trying to update document', async () => {
        const updatedDepartmentData = { 
          employees : []
        };

        const response = await request.put(`/api/dep/${departmentId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updatedDepartmentData);

        expect(response.status).toBe(500);
        expect(response.body.message).toEqual("Invalid Credentials");
        // expect(response.body.dept).toBeDefined();
        // expect(response.body.dept.employees).toBe([]);
      });

      it('should throw unable to find while trying to update document', async () => {
        const updatedDepartmentData = { 
          employees : []
        };

        const response = await request.put(`/api/dep/${userId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updatedDepartmentData);

        expect(response.status).toBe(500);
        expect(response.body.message).toEqual("Department not found");
      });
    });

    describe('GET /', () => {
      it('should get all departments', async () => {
        const response = await request.get('/api/dep')
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.depts)).toBeTruthy();
      });
    });

    describe('GET /:id', () => {
      it('should get a department by ID', async () => {

        const response = await request.get(`/api/dep/${departmentId}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.dept).toBeDefined();
      });

      it('should be unable to find department by ID', async () => {

        const response = await request.get(`/api/dep/${userId}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toEqual("Department not found");
      });
    });

    describe('DELETE /:id', () => {

      it('should throw unable to find department', async () => {

        const response = await request.delete(`/api/dep/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toEqual("Department not found");
        // removeFromList(['dep', departmentId]);
      });
      
      it('should throw invalid credentials while trying to delete a department', async () => {

        const response = await request.delete(`/api/dep/${departmentId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toEqual("Invalid Credentials");
        // removeFromList(['dep', departmentId]);
      });

      it('should delete a department', async () => {

        const response = await request.delete(`/api/dep/${departmentId}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        if(response.status === 200){
          removeFromList(['dep', departmentId]);
        }
      });
      
    });
    
  });

});
