const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { popFromList, isListPopulated, removeFromList, clean, appendToList, listLength } = require('../utils/moduleForTestingSupport');

const request = supertest(app);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

beforeAll(async () => {
  await mongoose.connect(`mongodb://${process.env.MONGO}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

});
let userToken;

afterAll(async () => {
  if(!userToken){
    userToken = process.env.AUTH_TOKEN;
  }
  await clean(userToken);
  // Close the MongoDB connection after all tests have run
  await mongoose.connection.close();
});

describe('Auth API endpoints', () => {
    let userId = process.env.USER_ID;
    let userEmail = process.env.EMAIL;
    let password = process.env.PASSWORD;
    userToken = process.env.AUTH_TOKEN;
    let userpas = 'password1!D';
    let userem = 'testtest@example.com';
    let id;
    let firstToken;
    let newToken;
    // test('should always pass', () => {
    //     expect(true).toBeTruthy();
    // });
    
    it('should get a user by ID with valid Token', async () => {
      const res = await request.get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`);
  
      expect(res.statusCode).toEqual(200);
      expect(res.body.user._id).toEqual(userId);
    });

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
      firstToken = res.body.token;
      // expect(res.body.message).toEqual('Wrong Login Details');
    });

    it('should get a user by ID with new Token', async () => {
      const res = await request.get(`/api/users/${id}`)
        .set('Authorization', `Bearer ${firstToken}`);
  
      expect(res.statusCode).toEqual(200);
      expect(res.body.user._id).toEqual(id);
    });

    it('should fail to log in', async () => {
      const res = await request.post('/api/auth')
        .send({
        email: userem,
        password: userpas.slice(0, Math.floor(Math.random() * password.length)) + password.slice(Math.floor(Math.random() * password.length) + 1)
        })
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Wrong Login Details');
    })
  
    it('waiting for 500ms', async () => {
      await sleep(1000); // Sleep for 500 ms
    });

    it('should successfully log in and get a new token', async () => {
        const res = await request.post('/api/auth')
            .send({
            email: userem,
            password: userpas
            })
        expect(res.statusCode).toEqual(200);
        newToken = res.body.token;
        expect(newToken).toBeTruthy();
        expect(newToken).not.toEqual(firstToken);
        expect(res.body.message).toEqual('Correct Details');
        expect()
    })

    it('should fail to get a user by ID with invalid Token', async () => {
        const res = await request.get(`/api/users/${id}`)
          .set('Authorization', `Bearer ${firstToken}`);
    
        expect(newToken).not.toEqual(firstToken);
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Session expired or invalid');
    });

    it('should get a user by ID with new Token', async () => {
        const res = await request.get(`/api/users/${id}`)
          .set('Authorization', `Bearer ${newToken}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.user._id).toEqual(id);
    });

});
// const authResponse = await supertest(app)
//     .post('/api/auth')
//     .send({
//       email: email,
//       password: password
//     });

//   // Check if the login was successful and get the token
//   if (authResponse.status !== 200) {
//     throw new Error('Failed to log in test user');
//   }
//   const authToken = authResponse.body.token;
//   if (!userId){
//     userId = authResponse.body.data._id;
//     if (userId){
//       global.__TEST_STATE__.usersToDelete.push(['users', userId]);
//     }
//   }