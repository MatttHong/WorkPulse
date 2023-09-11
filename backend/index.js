const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const morgan = require('morgan');

const PORT = process.env.PORT || 3000;
const MONGO = process.env.MONGO = "129.114.27.13:27017/Pulse";

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const inviteRoutes =  require("./routes/invite");

const { initializeFirebase } = require('./utils/firebase');

const app = express()

app.use(morgan('dev'));
app.use(bodyParser.json());
mongoose.Promise = global.Promise;

main()
    .then((res) => console.log(res))
    .catch((err) => console.log(err));  

async function main() {
    await initializeFirebase();
    // console.log("mongodb://" + MONGO);
    await mongoose.connect("mongodb://" + MONGO);
    // await mongoose.connect("mongodb://localhost:27017/test");
} 

app.use((req, res, next) => { 
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/invite", inviteRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);

// start the server

});
