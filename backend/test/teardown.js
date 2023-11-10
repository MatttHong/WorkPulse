// test/teardown.js
const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { popFromList, isListPopulated, removeFromList, appendToList, getList } = require('../utils/moduleForTestingSupport');

module.exports = async () => {
  // Use supertest to delete the user created in setup.js
  console.log(getList())
  await mongoose.connect(`mongodb://${process.env.MONGO}`, { useNewUrlParser: true, useUnifiedTopology: true });
  // await supertest(app)
  //   .delete(`/api/users/${global.__USER_ID__}`)
  //   .set('Authorization', `Bearer ${global.__AUTH_TOKEN__}`);
  let userToken = process.env.AUTH_TOKEN;
  // console.log(process.env.LIST)
  while(isListPopulated()){
    const [type, value] = popFromList();

    try {
        const response = await supertest(app)
            .delete(`/api/${type}/${value}`)
            .set('Authorization', `Bearer ${userToken}`);
        
        // Handle response or log for debugging
        if(response.statusCode != 200){
            console.log('Failed due to:')
            console.log(response.body.message);
        }
    } catch (error) {
        // Handle or log error
        console.error(`Error for type: ${type}, value: ${value}`, error);
    }
  }
  await mongoose.disconnect();
};
