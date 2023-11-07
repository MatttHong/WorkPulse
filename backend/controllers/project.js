const Project = require("../models/project"); // Ensure this points to your Project model file

// Create a new project
exports.createProject = (req, res, next) => {
    const project = new Project(req.body);
    
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

        // Update fields of the project
        project.projectName = req.body.projectName;
        project.projectAdminstrators = req.body.projectAdminstrators;
        project.employees = req.body.employees;
        project.tasks = req.body.tasks;
        project.departments = req.body.departments;
        project.status = req.body.status;
        // ...other fields you might want to update

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

    Project.findByIdAndRemove(projectId)
    .then((project) => {
        if (!project) {
            throw new Error("Project not found");
        }

        res.json({
            message: "Project deleted successfully",
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
