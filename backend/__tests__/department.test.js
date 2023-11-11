const supertest = require('supertest');
const app = require('../app'); // Adjust the path to your app entry point
const mongoose = require('mongoose');
const { popFromList, isListPopulated, removeFromList, appendToList, clean, getList, listLength, getToken } = require('../utils/moduleForTestingSupport');

function randomlyIncreaseDigit(departmentId) {
  // Convert the departmentId to a string to manipulate individual digits
  const idString = departmentId.toString();

  // Generate a random index to choose which digit to increase
  const randomIndex = Math.floor(Math.random() * idString.length);

  // Get the digit at the random index
  const digit = parseInt(idString[randomIndex]);

  // Generate a random number (between 1 and 9) to add to the digit
  const randomIncrement = Math.floor(Math.random() * 9) + 1;

  // Increase the chosen digit by the random increment
  const newDigit = (digit + randomIncrement) % 10;

  // Replace the digit in the string with the new digit
  const newIdString = idString.slice(0, randomIndex) + newDigit.toString() + idString.slice(randomIndex + 1);

  // Convert the modified string back to a number
  const newDepartmentId = parseInt(newIdString);

  return newDepartmentId;
}


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
  let userEmail = process.env.EMAIL;
  let password = process.env.PASSWORD;
  userToken = process.env.AUTH_TOKEN;
  let departmentId;
  let token;
  let userpas = 'password1!D';
  let userem = 'testest@example.com';
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

      expect(response.status).toBe(201);
      expect(response.body.message).toEqual("Department added successfully")
      departmentId = response.body.dept._id
      expect(departmentId).toBeTruthy();
      expect(response.body.dept).toBeDefined();
      expect(response.body.dept.departmentAdministrators).toContain(userId);
      if(response.status === 201){
        appendToList(['dep', response.body.dept.id]);
      }
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
      // expect(response.body.dept).toBeDefined();
      // expect(response.body.dept.employees).toBe([]);
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
