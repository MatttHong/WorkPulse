const Project = require("../models/project"); // Ensure this points to your Project model file

// Create a new project
exports.createProject = (req, res, next) => {
    let project;
    try {
        project = new Project(req.body);
    } catch (err) {
        res.status(400).json({
            message: "Parameters did not match Model",
        });
    }

    if(req.TokenUserId && !project.projectAdministrators.includes(req.TokenUserId)) {
        project.projectAdministrators.push(req.TokenUserId);
    }

    project.save()
    .then((result) => {
        res.status(201).json({
            message: "Project added successfully",
            project: result.toObject(),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: err.message || "Failed to create project!",
        });
    });
};

// Update a project by ID
exports.updateProject = (req, res, next) => {
    const projectId = req.params.id;

    Project.findById(projectId)
    .then((project) => {
        if (!project) {
            throw new Error("Project not found");
        }

        if(req.TokenUserId && !project.projectAdministrators.includes(req.TokenUserId)) {
            throw new Error("Invalid Credentials");
        }

        if (req.body.projectName !== undefined) project.projectName = req.body.projectName;
        if (req.body.projectAdministrators !== undefined) project.projectAdministrators = req.body.projectAdministrators;
        if (req.body.employees !== undefined) project.employees = req.body.employees;
        if (req.body.tasks !== undefined) project.tasks = req.body.tasks;
        if (req.body.departments !== undefined) project.departments = req.body.departments;
        if (req.body.status !== undefined) project.status = req.body.status;

        return project.save();
    })
    .then((result) => {
        res.json({
            message: "Project updated successfully",
            project: result.toObject(),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: err.message || "Failed to update project!",
        });
    });
};

// Get all projects
exports.getProjects = (req, res, next) => {
    Project.find()
    .then((projects) => {
        res.json({
            projects: projects.map(project => project.toObject()),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: err.message || "Failed to fetch projects!",
        });
    });
};

// Get a project by ID
exports.getProjectById = (req, res, next) => {
    const projectId = req.params.id;

    Project.findById(projectId)
    .then((project) => {
        if (!project) {
            throw new Error("Project not found");
        }

        res.json({
            project: project.toObject(),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json({
            message: err.message || "Project not found!",
        });
    });
};

// Delete a project by ID
exports.deleteProject = (req, res, next) => {
    const projectId = req.params.id;

    Project.findById(projectId)
    .then((project) => {
        if (!project) {
            throw new Error("Project not found");
        }

        // Check if the user has the necessary credentials to delete the project
        if (req.TokenUserId && !project.projectAdministrators.includes(req.TokenUserId)) {
            throw new Error("Invalid Credentials");
        }

        // If the user has the credentials, proceed with project deletion
        return Project.findByIdAndRemove(projectId);
    })
    .then(() => {
        res.json({
            message: "Project deleted successfully",
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json({
            message: err.message || "Project not found or invalid credentials!",
        });
    });
};
