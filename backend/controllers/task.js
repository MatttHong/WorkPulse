const Task = require("../models/task");

// Create a new task
exports.createTask = (req, res, next) => {
    const task = new Task(req.body);
    
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

        // Add fields that are allowed to be updated
        task.taskName = req.body.taskName;
        task.taskAdminstrators = req.body.taskAdminstrators;
        task.employees = req.body.employees;
        task.status = req.body.status;
        // ...other fields you might want to update

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

    Task.findByIdAndRemove(taskId)
    .then((task) => {
        if (!task) {
            throw new Error("Task not found");
        }

        res.json({
            message: "Task deleted successfully",
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
