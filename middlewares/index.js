const {api_key} = require('../config/index')



// Middleware function to validate API key
function validateApiKey(req, res, next) {
    const ApiKey = req.headers['api-key'] || req.query['api-key'];

    // Check if API key is provided
    if (!ApiKey) {
        return res.status(401).json({ error: 'API key is required' });
    }

    // Check if API key is valid
    if (ApiKey !== api_key) {
        return res.status(403).json({ error: 'Invalid API key' });
    }

    // API key is valid, proceed to the next middleware/route handler
    next();
}

module.exports = {validateApiKey};
