const Task = require("../models/tasks");

// Create a new task
exports.createTask = (req, res, next) => {
    let task;
    try {
        task = new Task(req.body);
    } catch (err) {
        res.status(400).json({
            message: "Parameters did not match Model",
        });
    }
    if(req.TokenUserId && !task.taskAdministrators.includes(req.TokenUserId)) {
        task.taskAdministrators.push(req.TokenUserId);
    }
    task.save()
    .then((result) => {
        res.status(201).json({
            message: "Task added successfully",
            task: result.toObject(),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: err.message || "Failed to create task!",
        });
    });
};

// Update a task by ID
exports.updateTask = (req, res, next) => {
    const taskId = req.params.id;
    
    Task.findById(taskId)
    .then((task) => {
        if (!task) {
            throw new Error("Task not found");
        }

        if(req.TokenUserId && !task.taskAdministrators.includes(req.TokenUserId)) {
            throw new Error("Invalid Credentials");
        }

        if (req.body.taskName !== undefined) task.taskName = req.body.taskName;
        if (req.body.taskAdministrators !== undefined) task.taskAdministrators = req.body.taskAdministrators;
        if (req.body.employees !== undefined) task.employees = req.body.employees;
        if (req.body.status !== undefined) task.status = req.body.status;

        return task.save();
    })
    .then((result) => {
        res.json({
            message: "Task updated successfully",
            task: result.toObject(),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: err.message || "Failed to update task!",
        });
    });
};

// Get all tasks
exports.getTasks = (req, res, next) => {
    Task.find()
    .then((tasks) => {
        res.json({
            tasks: tasks.map(task => task.toObject()),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: err.message || "Failed to fetch tasks!",
        });
    });
};

// Get a task by ID
exports.getTaskById = (req, res, next) => {
    const taskId = req.params.id;

    Task.findById(taskId)
    .then((task) => {
        if (!task) {
            throw new Error("Task not found");
        }

        res.json({
            task: task.toObject(),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json({
            message: err.message || "Task not found!",
        });
    });
};

// Delete a task by ID
exports.deleteTask = (req, res, next) => {
    const taskId = req.params.id;

    Task.findById(taskId)
    .then((task) => {
        if (!task) {
            throw new Error("Task not found");
        }

        // Check if the user has the necessary credentials to delete the task
        if (req.TokenUserId && !task.taskAdministrators.includes(req.TokenUserId)) {
            throw new Error("Invalid Credentials");
        }

        // If the user has the credentials, proceed with task deletion
        return Task.findByIdAndRemove(taskId);
    })
    .then(() => {
        res.json({
            message: "Task deleted successfully",
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json({
            message: err.message || "Task not found or invalid credentials!",
        });
    });
};