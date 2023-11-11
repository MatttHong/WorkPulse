const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const envPath = `.env.${process.env.NODE_ENV}`;

const overRideRoutes = require("./routes/override");

const authRoutes = require("./routes/auth");
const depRoutes = require("./routes/department");
const empRoutes = require("./routes/employee");
const inviteRoutes = require("./routes/invite");
const logRoutes = require("./routes/log");
const orgRoutes = require("./routes/organization");
const projRoutes = require("./routes/project");
const taskRoutes = require("./routes/task");
const userRoutes = require("./routes/user");

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// CORS Middleware
app.use((req, res, next) => { 
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/invite", inviteRoutes);
app.use("/api/org", orgRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/dep", depRoutes);
app.use("/api/employee", empRoutes);
app.use("/api/log", logRoutes);
app.use("/api/proj", projRoutes);
// console.log("before if condition");
// console.log('NODE_ENV:', process.env.NODE_ENV);

if(process.env.NODE_ENV === 'test'){
    console.log("adding override")
    app.use("/api/override", overRideRoutes)
}

// Export the app for testing purposes
module.exports = app;
