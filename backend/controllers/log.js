const Log = require("../models/logs")
const Status = require("../utils/status")
const axios = require("axios")

// Create a new log
exports.createLog = (req, res, next) => {
  const newLog = new Log({
    employee: req.body.employee,
    task: req.body.task,
    department: req.body.department,
    project: req.body.project,
    status: req.body.status,
    log: req.body.log,
    // startTimestamp defaults to Date.now()
    // endTimestamp is not required upon creation
  })
  if (!newLog.status) {
    newLog.status = Status.starting
  }
  newLog
    .save()
    .then((log) => {
      res.status(201).json({
        message: "Log created successfully",
        log: log.toObject(),
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: err.message || "Failed to create log entry!",
      })
    })
}

// Update a log by ID
exports.updateLog = (req, res, next) => {
  const logId = req.params.id

  Log.findById(logId)
    .then((log) => {
      if (!log) {
        throw new Error("Log not found")
      }

      if (req.body.employee !== undefined) log.employee = req.body.employee
      if (req.body.task !== undefined) log.task = req.body.task
      if (req.body.department !== undefined) log.department = req.body.department
      if (req.body.project !== undefined) log.project = req.body.project
      if (req.body.status !== undefined) log.status = req.body.status
      if (req.body.log !== undefined) log.log = req.body.log

      return log.save()
    })
    .then((updatedLog) => {
      res.json({
        message: "Log updated successfully",
        log: updatedLog.toObject(),
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: err.message || "Failed to update log!",
      })
    })
}

// Get all logs
exports.getLogs = (req, res, next) => {
  Log.find()
    .then((logs) => {
      res.json({
        logs: logs.map((log) => log.toObject()),
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: err.message || "Failed to fetch logs!",
      })
    })
}

// Get a log by ID
exports.getLogById = (req, res, next) => {
  const logId = req.params.id

  Log.findById(logId)
    .then((log) => {
      if (!log) {
        throw new Error("Log not found")
      }

      res.json({
        log: log.toObject(),
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(404).json({
        message: err.message || "Log not found!",
      })
    })
}

// Delete a log by ID
exports.deleteLog = (req, res, next) => {
  const logId = req.params.id

  Log.findByIdAndRemove(logId)
    .then((log) => {
      if (!log) {
        throw new Error("Log not found")
      }

      res.json({
        message: "Log deleted successfully",
        log: log.toObject(),
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(404).json({
        message: err.message || "Log not found!",
      })
    })
}

// Get logs by employee ID
exports.getLogsByEmployeeId = (req, res, next) => {
  const employeeId = req.params.employeeId

  Log.find({ employee: employeeId })
    .then((logs) => {
      if (!logs || logs.length === 0) {
        return res.status(404).json({
          message: "No logs found for the specified employee!",
        })
      }
      res.json({
        message: "Logs fetched successfully",
        logs: logs.map((log) => log.toObject()),
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: err.message || "Failed to fetch logs for the employee!",
      })
    })
}

// Add a log entry to an existing log
exports.addLogEntry = (req, res, next) => {
  const logId = req.params.id
  const logEntry = req.body.log
  if (!logEntry) {
    return res.status(400).json({
      message: "Log entry to add must be provided!",
    })
  }

  Log.findById(logId)
    .then((log) => {
      if (!log) {
        return res.status(404).json({ message: "Log not found" })
      }

      if (log.endTimestamp && log.endTimestamp < Date.now()) {
        return res.status(400).json({ message: "Log already closed" })
      }
      log.log.push(logEntry)

      return log.save()
    })
    .then((updatedLog) => {
      res.json({
        message: "Log entry added successfully",
        log: updatedLog.toObject(),
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: err.message || "Failed to add log entry!",
      })
    })
}

// End a log session by setting endTimestamp
exports.endLogSession = (req, res, next) => {
    const logId = req.params.id;
    let logEmpId
    let temp
    // This is the added token
    let token = req.headers.authorization?.split(" ")[1]
    let funcUrl = process.env.FUNCTION_URL
    Log.findById(logId)
        .then((log) => {
            if (!log) {
                throw new Error("Log not found");
            }
            logEmpId = log.employee
            if(log.endTimestamp !== null){
                a = log.endSession();
                temp = log
                return a
            } else {
                temp = log
            }
            // This should be adding the token
            // temp.token = token
            // printing what axios is going to send
            // console.log("what Axios is sending " + temp);
        })
        .then(() => {
            axios.post(funcUrl, {
                logData : temp,
                loginToken : token
            })
                .then(axiosResponse => {
                    console.log(axiosResponse);
                    res.json({
                        message: "Log session ended successfully",
                        logId: logId,
                        employee: logEmpId,
                        status: temp.status,
                        endTimestamp: temp.endTimestamp
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    res.status(500).json({
                        message: error.message || "Failed to run Azure function!",
                    });
                });
        })
        .catch((err) => {
            console.log(err)
            res.status(400).json({
                message: err.message || "Failed to end log session!",
        })
    })
}
