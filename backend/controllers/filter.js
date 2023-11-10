const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation

const limits = {

    username: { min: 0, max: 50 },
    userName: { min: 0, max: 50 },
    firstName: { min: 0, max: 50 },
    lastName: { min: 0, max: 50 },
    bio: { min: 0, max: 300 },
    email : { min: 3, max: 75 },
    id : { min: 24, max: 24 },
    departmentAdministrators : { min: 24, max: 24 },
    departmentAdministrator : { min: 24, max: 24 },
    tasks : { min: 24, max: 24 },
    userId : { min: 24, max: 24 },
    businessId : { min: 24, max: 24 },
    employeeId : { min: 24, max: 24 },
    inviteToken : { min: 33, max: 37 },
    log : { max: -1 },
    employee : { min: 24, max: 24 },
    department : { min: 24, max: 24 },
    project : { min: 24, max: 24 },
    task : { min: 24, max: 24 },
    employees : { min: 24, max: 24 },
    projects : { min: 24, max: 24 },
    departments : { min: 24, max: 24 },
    organizationEmail : { min: 3, max: 75 },
    organizationAdministrators : { min: 24, max: 24 },
    organizationAdministrator : { min: 24, max: 24 },
    employments : { min: 24, max: 24 },
    imageLink : { min: -1, max: -1 }

  };

const checkBodyForLongValues = (req, res, next) => {
    const defaultMaxLength = 100; // Default max length for values
    const keysWithInvalidLength = [];
  
    const checkLength = (key, value, min, max) => {
        if (Array.isArray(value)) {
            // If the value is an array, check each string element within the array
            return value.some(element => typeof element === 'string' && (element.length < min || element.length > max));
        }
        // If the value is a string, check its length
        return typeof value === 'string' && (value.length < min || value.length > max);
    };
  
    for (const [key, value] of Object.entries(req.body)) {
        // Use specific limit if exists, otherwise use default
        const min = limits[key]?.min || 0;
        const max = limits[key]?.max || defaultMaxLength;
        if (max != -1 || value){
            if (checkLength(key, value, min, max)) {
                keysWithInvalidLength.push(key);
            }
        }
    }
    for (const [key, value] of Object.entries(req.params)) {
        // Use specific limit if exists, otherwise use default
        const min = limits[key]?.min || 0;
        const max = limits[key]?.max || defaultMaxLength;
        if (max != -1 || value){
            if (checkLength(key, value, min, max)) {
                keysWithInvalidLength.push(key);
            }
        }
    }

    if (keysWithInvalidLength.length > 0) {
      // If there are any fields with string values outside the specified limits, send an error response.
      return res.status(400).json({
        message: 'Request body contains values with invalid lengths.',
        fields: keysWithInvalidLength
      });
    }
  
    // If everything is fine, proceed to the next middleware
    next();
  };

const validateAndFormatEmailParams = (req, res, next) => {
    Object.keys(req.params).forEach(key => {
        if (key.toLowerCase().includes('email')) {
          // Replace %40 with @
          req.params[key] = req.params[key].replace(/%40/gi, '@');
    
          // Validate the email format
          if (!emailRegex.test(req.params[key])) {
            return res.status(400).json({
              message: 'Invalid email format.',
              email: req.params[key]
            });
          }
        }
      });
    
    next(); // Proceed to the next middleware if all checks pass
}

module.exports = {
    checkBodyForLongValues,
    validateAndFormatEmailParams,
    emailRegex // Exporting the regex in case it's needed elsewhere
  };
  