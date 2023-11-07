const EmployeeModel = require('../models/employee')

// Get a Employee by MongoDB _id
exports.getEmployeeById = (req, res, next) => {
    const id = req.params.id; // This is the MongoDB _id, not the userId field in the schema

    EmployeeModel.findById(id)
    .then((employee) => {
        if (!employee) {
            throw new Error("Employee not found");
        }

        res.json({
            employee: employee.toObject(),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json({
            message: err.message || "Employee not found!",
        });
    });
};

exports.getEmployeesByUserId = (req, res, next) => {
    const userId = req.params.userId;

    EmployeeModel.find({ userId: userId })
    .then((employees) => {
        if (!employees || employees.length === 0) {
            return res.status(404).json({
                message: "No employees found",
            });
        }

        res.json({
            employees: employees.map(employee => employee.toObject()),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: err.message || "An error occurred while fetching employees",
        });
    });
};


// Update a Employee by ID
exports.updateEmployee = (req, res, next) => {
    const id = req.params.id;

    EmployeeModel.findById(id)
    .then((employee) => {
        if (!employee) {
            throw new Error("Employee not found");
        }

        // Update fields of the employee
        
        employee.email = req.body.email;
        employee.logs = req.body.logs;
        employee.employees = req.body.employees;
        employee.businessId = req.body.businessId;
        employee.status = req.body.status;

        return employee.save();
    })
    .then((result) => {
        res.json({
            message: "employee updated successfully",
            employee: result.toObject(),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: err.message || "Failed to update employee!",
        });
    });
};

// Delete a Employee by ID
exports.deleteEmployeeModel = (req, res, next) => {
    const id = req.params.id;

    EmployeeModel.findByIdAndRemove(id)
    .then((employee) => {
        if (!employee) {
            throw new Error("Employee not found");
        }

        res.json({
            message: "Employee deleted successfully",
            employee: employee.toObject(),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json({
            message: err.message || "Employee not found!",
        });
    });
};