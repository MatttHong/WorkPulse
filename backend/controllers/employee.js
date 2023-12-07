const EmployeeModel = require('../models/employee')
const OrgModel = require('../models/organization')

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

        // Check if the user is either the employee or an organization admin
        const checkOrgAdmin = () => {
            if (employee.orgId) {
                return OrgModel.findById(employee.orgId)
                    .then(org => {
                        if (!org || !org.organizationAdministrators.includes(req.TokenUserId)) {
                            throw new Error("Invalid Credentials");
                        }
                        return employee; // Return employee to chain the promise
                    });
            } else {
                throw new Error("Invalid Credentials");
            }
        }

        // If the user is the employee or the check passes, update the employee
        const updateEmployee = (employee) => {
            if (req.body.email !== undefined) employee.email = req.body.email;
            if (req.body.logs !== undefined) employee.logs = req.body.logs;
            if (req.body.employees !== undefined) employee.employees = req.body.employees;
            if (req.body.orgId !== undefined) employee.orgId = req.body.orgId;
            if (req.body.status !== undefined) employee.status = req.body.status;
            if (req.body.tasks !== undefined) employee.tasks = req.body.tasks;

            return employee.save();
        };

        // Run the check for authorization
        if (employee.userId != req.TokenUserId) {
            return checkOrgAdmin().then(updateEmployee);
        } else {
            return updateEmployee(employee);
        }
    })
    .then((result) => {
        res.json({
            message: "Employee updated successfully",
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

    EmployeeModel.findById(id)
    .then((employee) => {
        if (!employee) {
            throw new Error("Employee not found");
        }

        // Check if the user has the necessary credentials to delete the employee
        // if (employee.userId != req.TokenUserId) {
        //     throw new Error("Invalid Credentials");
        // }

        // If the user has the credentials, proceed with employee deletion
        return EmployeeModel.findByIdAndRemove(id);
    })
    .then(() => {
        res.json({
            message: "Employee deleted successfully",
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json({
            message: err.message || "Employee not found or invalid credentials!",
        });
    });
};

exports.getEmployees = (req, res, next) => {
    EmployeeModel.find()
    .then((emp) => {
        res.json({
            employees: emp.map(emp => emp.toObject()),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: err.message || "Failed to fetch employees!",
        });
    });
};