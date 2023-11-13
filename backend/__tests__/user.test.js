// tests/user.test.js
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

describe('User API endpoints', () => {
  // await mongoose.connect(`mongodb://${process.env.MONGO}`, { useNewUrlParser: true, useUnifiedTopology: true });
  let userId = process.env.USER_ID;
  let userEmail = process.env.EMAIL;
  let password = process.env.PASSWORD;
  userToken = process.env.AUTH_TOKEN;
  // console.log(userId);
  // console.log(userEmail);
  // console.log(password);
  // console.log(userToken);

  let userId1;
  let userEmail1;
  let userPassword = 'password1!D';
  let ogAuth;
  // Create a new user
  it('should create a new user', async () => {
      const userResponse = await supertest(app)
      .post('/api/users')
      .send({
          userName: 'testuser',
          password: password,
          userType: 'test',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          birthday: '1990-01-01',
          bio: 'A test bio',
          employments: [],
          logs: ['anything can go here no matter how long it is and this is proof of this concept, literally anything even above the character max for the default']
        });
        if (userResponse.statusCode === 201){

          appendToList(['users', userResponse.body.post._id])
  
        }
        expect(userResponse.statusCode).toEqual(201);
        expect(userResponse.body).toHaveProperty('post');
        
        userId1 = userResponse.body.post._id;
        userEmail1 = userResponse.body.post.email;
  });
  
  it('should login with new user', async () => {
    const res = await request.post('/api/auth')
    .send({
        email: userEmail1,
        password: password
        })
    expect(res.statusCode).toEqual(200);
    ogAuth = res.body.token;
  });

  it('should fail due to create a new user due to inputs being too long', async () => {
    const userResponse = await supertest(app)
    .post('/api/users')
    .send({
        userName: 'testuser',
        password: '12!A345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
        userType: 'test',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        birthday: '1990-01-01',
        bio: 'A test bio',
        employments: [],
        logs: []
      });
    if (userResponse.statusCode === 201){
      appendToList(['users', userResponse.body.post._id])
    }
    expect(userResponse.statusCode).toEqual(400);
    expect(userResponse.body.message).toEqual('Request body contains values with invalid lengths.');
    

    // expect(userResponse.body)
  });

  it('should fail due to create a new user due to invalid Ids in employments', async () => {
    const userResponse = await supertest(app)
    .post('/api/users')
    .send({
        userName: 'testuser',
        password: '141234!aA567890',
        userType: 'test',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        birthday: '1990-01-01',
        bio: 'A test bio',
        employments: ['123'],
        logs: []
      });
    if (userResponse.statusCode === 201){
      appendToList(['users', userResponse.body.post._id]);
    }
    expect(userResponse.statusCode).toEqual(400);
    expect(userResponse.body.message).toEqual('Request body contains values with invalid lengths.');
    
    // expect(userResponse.body)
  });

  it('should fail due to repeat email', async () => {
    const userResponse = await supertest(app)
    .post('/api/users')
    .send({
        userName: 'testuser',
        password: '123457aA1!890',
        userType: 'test',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        birthday: '1990-01-01',
        bio: 'A test bio',
        employments: [],
        logs: ['this can be anything']
      });
    if (userResponse.statusCode === 201){
      appendToList(['users', userResponse.body.post._id]);
    }
    expect(userResponse.statusCode).toEqual(500);
    expect(userResponse.body.message).toEqual('User already exists.');
    
    // expect(userResponse.body)
  });

  it('should fail to bad email', async () => {
    const userResponse = await supertest(app)
    .post('/api/users')
    .send({
        userName: 'testuser',
        password: '123457!aA1890',
        userType: 'test',
        firstName: 'Test',
        lastName: 'User',
        email: 'testexample.com',
        birthday: '1990-01-01',
        bio: 'A test bio',
        employments: [],
        logs: ['this can be anything']
      });
    if (userResponse.statusCode === 201){
      appendToList(['users', userResponse.body.post._id]);
    }
    expect(userResponse.statusCode).toEqual(400);
    expect(userResponse.body.message).toEqual('Invalid email format.');
    
    // expect(userResponse.body.message).toEqual('User already exists.')
    // expect(userResponse.body)
  });

  it('should fail to bad password', async () => {
    const userResponse = await supertest(app)
    .post('/api/users')
    .send({
        userName: 'testuser',
        password: '1234',
        userType: 'test',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        birthday: '1990-01-01',
        bio: 'A test bio',
        employments: [],
        logs: ['this can be anything']
      });
      if (userResponse.statusCode === 201){
        appendToList(['users', userResponse.body.post._id]);
      }  
      expect(userResponse.body.message).toEqual('Invalid password format.');
      expect(userResponse.statusCode).toEqual(400);
    
    // expect(userResponse.body.message).toEqual('User already exists.')
    // expect(userResponse.body)
  });

  // Update a user
  it('should update a user', async () => {
    const res = await request.put(`/api/users/${userId1}`)
      .set('Authorization', `Bearer ${ogAuth}`) // Set the headers with the token
      .send({
        firstName: 'UpdatedName'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.firstName).toEqual('UpdatedName');
    expect(res.body.user.lastName).toEqual('User');
  });

  it('should fail to update a user', async () => {
    const res = await request.put(`/api/users/${userId1}`)
      .set('Authorization', `Bearer ${userToken}`) // Set the headers with the token
      .send({
        firstName: 'UpdatedName1'
      });
    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual("Invalid Credentials")
    // expect(res.body.user.firstName).toEqual('UpdatedName1');
    // expect(res.body.user.lastName).toEqual('User');
  });

  // Get a user by email
  it('should get a user by email', async () => {
    const res = await request.get(`/api/users/email/${userEmail1}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.email).toEqual(userEmail1);
    expect(res.body.user._id).toEqual(userId1);
  });

  // Get a user by ID
  it('should get a user by ID', async () => {
    const res = await request.get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.user._id).toEqual(userId);
  });

  // Get all users
  it('should get all users', async () => {
    const res = await request.get('/api/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.users)).toBeTruthy();
  });

  // Delete a user
  it('should fail to bad permissions while trying to delete a user', async () => {
    const res = await request.delete(`/api/users/${userId1}`)
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', "Invalid Credentials");
    if (res.statusCode === 200){
      removeFromList(['users', res.body.user._id]);
    }
  });

  it('should delete a user', async () => {
    const res = await request.delete(`/api/users/${userId1}`)
      .set('Authorization', `Bearer ${ogAuth}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User deleted successfully');
    expect(res.body.user._id).toEqual(userId1);
    if (res.statusCode === 200){
      removeFromList(['users', res.body.user._id]);
    }
  });

  it('should fail to find a user', async () => {
    const res = await request.delete(`/api/users/${userId1}`)
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', "User not found");
    if (res.statusCode === 200){
      removeFromList(['users', res.body.user._id]);
    }

  });

});
