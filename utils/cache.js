const NodeCache = require('node-cache');

// Cache TTL = 60 seconds
const cache = new NodeCache({ stdTTL: 60 });

module.exports = cache;
