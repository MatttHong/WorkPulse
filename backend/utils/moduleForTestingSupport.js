const supertest = require('supertest');
const app = require('../app');

// Utility Functions

function appendToList(newValues, globState = '__TEST_STATE__', globVar = 'usersToDelete') {
    if (!global[globState]) {
        global[globState] = {};
    }
    let currentValues = global[globState][globVar] || [];
    currentValues.push(newValues);
    global[globState][globVar] = currentValues;
}

function getList(globState = '__TEST_STATE__', globVar = 'usersToDelete') {
    if (!global[globState]) {
        global[globState] = {};
    }
    if (!global[globState][globVar]){
        initList(globState, globVar);
    }
    return global[globState][globVar] || [];
}

function removeFromList(valuesToRemove, globState = '__TEST_STATE__', globVar = 'usersToDelete') {
    if (!global[globState]) {
        global[globState] = {};
    }
    let currentValues = global[globState][globVar] || [];

    const indexToRemove = currentValues.findIndex(([type, value]) => 
        type === valuesToRemove[0] && value === valuesToRemove[1]
    );

    if (indexToRemove > -1) {
        currentValues.splice(indexToRemove, 1);
    }

    global[globState][globVar] = currentValues;
}

function isListPopulated(globState = '__TEST_STATE__', globVar = 'usersToDelete') {
    if (!global[globState]) {
        global[globState] = {};
    }
    if (!global[globState][globVar]){
        initList(globState, globVar);
    }
    const currentValues = global[globState][globVar] || [];
    return currentValues.length > 0;
}

function listLength(globState = '__TEST_STATE__', globVar = 'usersToDelete') {
    if (!global[globState]) {
        global[globState] = {};
    }
    const currentValues = global[globState][globVar] || [];
    return currentValues.length;
}

function popFromList(globState = '__TEST_STATE__', globVar = 'usersToDelete') {
    if (!global[globState]) {
        global[globState] = {};
    }
    if(global[globState][globVar]){
        let currentValues = global[globState][globVar] || [];
        let poppedValue = null;
    
        if (currentValues.length > 0) {
            poppedValue = currentValues.pop();
        }
    
        global[globState][globVar] = currentValues;
        return poppedValue;
    } else {
        return 
    }
}

function initList(globState = '__TEST_STATE__', globVar = 'usersToDelete'){
    if (!global[globState]) {
        global[globState] = {};
    }
    if (!global[globState]) {
        global[globState] = {};
    }
    if (!global[globState][globVar]){
        global[globState][globVar] = []
    }
}


function callback(){
    console.log("Eval " + (global.__TEST_STATE__.userToken && 
        !global.__TEST_STATE__.isTokenLocked));
        

}

// Managing the token:
function waitForToken() {
    console.log(global.__TEST_STATE__);
    if (!global.__TEST_STATE__) {
        global.__TEST_STATE__ = {};
    }
    // 654ed24b3107606007d2cc38
    // 654ed24d7d8ccb0e6149ddc2
    return new Promise((resolve, reject) => {
        const intervalIds = setInterval(() => {}, 100); // checks every 100 milliseconds

        setTimeout(() => {
            clearInterval(intervalId);
            reject(new Error("Timeout waiting for token"));
        }, 10000); // 10 seconds timeout
    });
}

async function getToken() {
    try {
        const token = await waitForToken();
        return token;
    } catch (error) {
        console.log('Error getting token:', error);
        throw error;
    }
}

function lockToken() {
    if (!global.__TEST_STATE__) {
        global.__TEST_STATE__ = {};
    }
    global.__TEST_STATE__.isTokenLocked = true;
}

function unlockToken() {
    if (global.__TEST_STATE__) {
        global.__TEST_STATE__.isTokenLocked = false;
    }
}

function addToken(token) {
    if (!global.__TEST_STATE__) {
        global.__TEST_STATE__ = {};
    }
    global.__TEST_STATE__.userToken = token;
    unlockToken();
    // return token;
}

async function clean(userToken = process.env.AUTH_TOKEN){
    console.log("Token good? " + userToken + " vs " + process.env.AUTH_TOKEN);
    // let userToken = process.env.AUTH_TOKEN;
    let cleanedFully = true;
    while(isListPopulated()){
        const [type, value] = popFromList();

        try {
            console.log(`cleaning ${type}/${value}`);
            const response = await supertest(app)
                .delete(`/api/override/${value}`)
                .send({ type: type });
                // .set('Authorization', `Bearer ${userToken}`);
            
            // Handle response or log for debugging
            if(response.statusCode != 200){
                console.log('Failed due to: \n' + response.body.message + response.body.error)
            }
        } catch (error) {
            // Handle or log error
            console.log(`Error for type: ${type}, value: ${value}`, error);
            cleanedFully = false;
        }
    }
    return cleanedFully;
}

module.exports = {
    appendToList,
    getList,
    removeFromList,
    isListPopulated,
    listLength,
    getToken,
    lockToken,
    unlockToken,
    initList,
    addToken,
    clean,
    popFromList
};
