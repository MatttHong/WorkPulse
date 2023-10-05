const Organization = require("../models/Organization");

// Create a new organization
exports.createOrg = (req, res, next) => {
    const org = new Organization(req.body);

    Organization.findOne({ organizationEmail: org.organizationEmail })
    .then(foundOrg => {
        if (!foundOrg) {
            return org.save();
        } else {
            throw new Error("Organization already exists.");
        }
    })
    .then((result) => {
        res.status(201).json({
            message: "Organization added successfully",
            org: {
                ...result.toObject(),
                id: result._id,
            },
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: err.message || "Failed to create organization!",
        });
    });
};

// Update an organization by ID
exports.updateOrg = (req, res, next) => {
    const orgId = req.params.id;

    Organization.findById(orgId)
    .then((org) => {
        if (!org) {
            throw new Error("Organization not found");
        }

        // Here you can add all the fields you want to update
        org.organizationName = req.body.organizationName;
        org.organizationEmail = req.body.organizationEmail;
        org.organizationAdministrators = req.body.organizationAdministrators;
        org.employees = req.body.employees;
        org.imageLink = req.body.imageLink;
        org.industry = req.body.industry;
        org.projects = req.body.projects;
        org.departments = req.body.departments;

        return org.save();
    })
    .then((result) => {
        res.json({
            message: "Organization updated successfully",
            org: result.toObject(),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: err.message || "Failed to update organization!",
        });
    });
};

// Get all organizations
exports.getOrgs = (req, res, next) => {
    Organization.find()
    .then((orgs) => {
        res.json({
            orgs: orgs.map(org => org.toObject()),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: err.message || "Failed to fetch organizations!",
        });
    });
};

// Get an organization by ID
exports.getOrgById = (req, res, next) => {
    const orgId = req.params.id;

    Organization.findById(orgId)
    .then((org) => {
        if (!org) {
            throw new Error("Organization not found");
        }

        res.json({
            org: org.toObject(),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json({
            message: err.message || "Organization not found!",
        });
    });
};

// Delete an organization by ID
exports.deleteOrg = (req, res, next) => {
    const orgId = req.params.id;

    Organization.findByIdAndRemove(orgId)
    .then((org) => {
        if (!org) {
            throw new Error("Organization not found");
        }

        res.json({
            message: "Organization deleted successfully",
            org: org.toObject(),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json({
            message: err.message || "Organization not found!",
        });
    });
};
