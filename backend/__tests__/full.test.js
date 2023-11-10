// tests/user.test.js
const supertest = require('supertest');
const app = require('../app'); // Adjust the path to your app entry point
const mongoose = require('mongoose');

const request = supertest(app);

describe('User API endpoints', () => {
  let userId = process.env.USER_ID;
  let userEmail = process.env.EMAIL;
  let password = process.env.PASSWORD;
  let userToken = process.env.AUTH_TOKEN;


  // Create a new user
  it('should create a new user', async () => {
    const res = await request.post('/api/users')
      .send({
        userName: 'testuser',
        password: 'password',
        userType: 'test',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        birthday: '1990-01-01',
        bio: 'A test bio',
        employments: [],
        logs: []
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('post');
    userId1 = res.body.post.id;
    userEmail1 = res.body.post.email;
  });

  // // Update a user
  // it('should update a user', async () => {
  //   const res = await request.put(`/api/users/${userId}`)
  //     .set('Authorization', `Bearer ${userToken}`) // Set the headers with the token
  //     .send({
  //       firstName: 'UpdatedName'
  //     });

  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body.user.firstName).toEqual('UpdatedName');
  // });

  // // Get a user by email
  // it('should get a user by email', async () => {
  //   const res = await request.get(`/api/users/email/${userEmail}`)
  //     .set('Authorization', `Bearer ${userToken}`);

  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body.user.email).toEqual(userEmail);
  // });

  // // Get a user by ID
  // it('should get a user by ID', async () => {
  //   const res = await request.get(`/api/users/${userId}`)
  //     .set('Authorization', `Bearer ${userToken}`);

  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body.user._id).toEqual(userId);
  // });

  // // Get all users
  // it('should get all users', async () => {
  //   const res = await request.get('/api/users')
  //     .set('Authorization', `Bearer ${userToken}`);

  //   expect(res.statusCode).toEqual(200);
  //   expect(Array.isArray(res.body.users)).toBeTruthy();
  // });

  // Delete a user
  it('should delete a user', async () => {
    const res = await request.delete(`/api/users/${userId1}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User deleted successfully');
  });
});
