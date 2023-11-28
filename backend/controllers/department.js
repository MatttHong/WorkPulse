const Department = require("../models/department");

// Create a new department
exports.createDept = (req, res, next) => {
    let dept;
    try {
        dept = new Department(req.body);
    } catch (err) {
        res.status(400).json({
            message: "Parameters did not match Model",
        });
    }
    if (req.TokenUserId && !dept.departmentAdministrators.includes(req.TokenUserId)){
        dept.departmentAdministrators.push(req.TokenUserId);
    }
    // Assuming you want to check for an existing department by its name
    Department.findOne({ departmentName: dept.departmentName })
    .then(foundDept => {
        if (!foundDept) {
            return dept.save();
        } else {
            throw new Error("Department already exists.");
        }
    })
    .then((result) => {
        res.status(201).json({
            message: "Department added successfully",
            dept: {
                ...result.toObject(),
                id: result._id,
            },
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: err.message || "Failed to create department!",
        });
    });
};

// Update a department by ID
exports.updateDept = (req, res, next) => {
    const deptId = req.params.id;

    Department.findById(deptId)
    .then((dept) => {
        if (!dept) {
            throw new Error("Department not found");
        }
        if(req.TokenUserId && !dept.departmentAdministrators.includes(req.TokenUserId)) {
            throw new Error("Invalid Credentials");
        }
        
        if (req.body.departmentName !== undefined) dept.departmentName = req.body.departmentName;
        if (req.body.departmentAdministrators !== undefined && req.body.departmentAdministrators !== []) dept.departmentAdministrators = req.body.departmentAdministrators;
        if (req.body.employees !== undefined) dept.employees = req.body.employees;
        if (req.body.projects !== undefined) dept.projects = req.body.projects;

        return dept.save();
    })
    .then((result) => {
        res.json({
            message: "Department updated successfully",
            dept: result.toObject(),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: err.message || "Failed to update department!",
        });
    });
};

// Get all departments
exports.getDepts = (req, res, next) => {
    Department.find()
    .then((depts) => {
        res.json({
            depts: depts.map(dept => dept.toObject()),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: err.message || "Failed to fetch departments!",
        });
    });
};

// Get a department by ID
exports.getDeptById = (req, res, next) => {
    const deptId = req.params.id;

    Department.findById(deptId)
    .then((dept) => {
        if (!dept) {
            throw new Error("Department not found");
        }

        res.json({
            dept: dept.toObject(),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json({
            message: err.message || "Department not found!",
        });
    });
};

// Delete a department by ID
exports.deleteDept = (req, res, next) => {
    const deptId = req.params.id;

    Department.findById(deptId)
    .then((dept) => {
        if (!dept) {
            throw new Error("Department not found");
        }

        // Check if the user has the necessary credentials to delete the department
        // if (req.TokenUserId && !dept.departmentAdministrators.includes(req.TokenUserId)) {
        //     throw new Error("Invalid Credentials");
        // }

        // If the user has the credentials, proceed with department deletion
        return Department.findByIdAndRemove(deptId);
    })
    .then(() => {
        res.json({
            message: "Department deleted successfully",
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json({
            message: err.message || "Department not found or invalid credentials!",
        });
    });
};