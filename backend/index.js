const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const { PORT, MONGO } = require('./utils/environment');

const authRoutes = require("./routes/auth");
// const depRoutes = require("./routes/department");
const empRoutes = require("./routes/employee");
const inviteRoutes =  require("./routes/invite");
const logRoutes = require("./routes/log");
const orgRoutes = require("./routes/organization");
const projRoutes = require("./routes/project");
const taskRoutes = require("./routes/task");
const userRoutes = require("./routes/user");



const { initializeFirebase } = require('./utils/firebase');

const app = express()
app.use(cors());
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
app.use("/api/org", orgRoutes);
app.use("/api/task", taskRoutes);
// app.use("/api/dep", depRoutes);
app.use("/api/employee", empRoutes);
app.use("/api/log", logRoutes);
app.use("/api/proj", projRoutes);


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);

// start the server

});
