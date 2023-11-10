const Department = require("../models/department");

// Create a new department
exports.createDept = (req, res, next) => {
    const dept = new Department(req.body);
    
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

        dept.departmentName = req.body.departmentName;
        dept.departmentAdministrators = req.body.departmentAdministrators;
        dept.employees = req.body.employees;
        dept.projects = req.body.projects;

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

    Department.findByIdAndRemove(deptId)
    .then((dept) => {
        if (!dept) {
            throw new Error("Department not found");
        }

        res.json({
            message: "Department deleted successfully",
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
