// Utility Functions

function appendToList(newValues, globState = '__TEST_STATE__', globVar = 'usersToDelete') {
    let currentValues = global[globState][globVar] || [];
    currentValues.push(newValues);
    global[globState][globVar] = currentValues;
}

function getList(globState = '__TEST_STATE__', globVar = 'usersToDelete') {
    return global[globState][globVar] || [];
}

function removeFromList(valuesToRemove, globState = '__TEST_STATE__', globVar = 'usersToDelete') {
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
    const currentValues = global[globState][globVar] || [];
    return currentValues.length > 0;
}

function listLength(globState = '__TEST_STATE__', globVar = 'usersToDelete') {
    const currentValues = global[globState][globVar] || [];
    return currentValues.length;
}

function popFromList(globState = '__TEST_STATE__', globVar = 'usersToDelete') {
    let currentValues = global[globState][globVar] || [];
    let poppedValue = null;

    if (currentValues.length > 0) {
        poppedValue = currentValues.pop();
    }

    global[globState][globVar] = currentValues;
    return poppedValue;
}

module.exports = {
    appendToList,
    getList,
    removeFromList,
    isListPopulated,
    listLength,
    popFromList
};
