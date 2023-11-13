const Organization = require("../models/organization");

// Create a new organization
exports.createOrg = (req, res, next) => {
    let org;
    try {
        org = new Organization(req.body);
    } catch (err) {
        res.status(400).json({
            message: "Parameters did not match Model",
        });
    }
    if (req.TokenUserId && !org.organizationAdministrators.includes(req.TokenUserId)){
        org.organizationAdministrators.push(req.TokenUserId);
    }

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

        if(req.TokenUserId && !org.organizationAdministrators.includes(req.TokenUserId)) {
            throw new Error("Invalid Credentials");
        }

        if (req.body.organizationName !== undefined) org.organizationName = req.body.organizationName;
        if (req.body.organizationEmail !== undefined) org.organizationEmail = req.body.organizationEmail;
        if (req.body.organizationAdministrators !== undefined) org.organizationAdministrators = req.body.organizationAdministrators;
        if (req.body.employees !== undefined) org.employees = req.body.employees;
        if (req.body.imageLink !== undefined) org.imageLink = req.body.imageLink;
        if (req.body.industry !== undefined) org.industry = req.body.industry;
        if (req.body.projects !== undefined) org.projects = req.body.projects;
        if (req.body.departments !== undefined) org.departments = req.body.departments;

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

    Organization.findById(orgId)
    .then((org) => {
        if (!org) {
            throw new Error("Organization not found");
        }

        // Check if the user has the necessary credentials to delete the organization
        if (req.TokenUserId && !org.organizationAdministrators.includes(req.TokenUserId)) {
            throw new Error("Invalid Credentials");
        }

        // If the user has the credentials, proceed with organization deletion
        return Organization.findByIdAndRemove(orgId);
    })
    .then(() => {
        res.json({
            message: "Organization deleted successfully",
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json({
            message: err.message || "Organization not found or invalid credentials!",
        });
    });
};