const mongoose = require("mongoose");

function getCurrentDateFormatted() {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based; add 1 to adjust
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear().toString();

    return `${month}-${day}-${year}`;
}

const userSchema = mongoose.Schema({
    
    userName : { type: String, required: false },
    // salt: { type: String, required: true},
    password : { type: Object, default: "fillthisin", required: true },
    firstName : { type: String, default: "", required: false },
    lastName : { type: String, default: "", required: false },
    email : { type: String, required: true },
    birthday : {type: String, required: false },
    bio : {type: String, required: false },
    userType: {type: String, required: false},
    employments : {type: [String], default: [""], required: false },
    dateJoined: { type: String, required: true, default: getCurrentDateFormatted },
    reviews : {type: [Object], default: [], required: true}
    
});

module.exports = mongoose.model("User", userSchema);