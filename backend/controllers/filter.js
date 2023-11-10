const limits = {
    username: { min: 0, max: 50 },
    bio: { min: 0, max: 300 },
    email : { min: 3, max: 75 },
    id : { min: 24, max: 24 },
    departmentAdministrators : { min: 24, max: 24 },
    id : { min: 24, max: 24 }
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
    
        if (checkLength(key, value, min, max)) {
            keysWithInvalidLength.push(key);
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