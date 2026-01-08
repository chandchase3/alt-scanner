// utils/requestTracker.js

let timestamps = [];

function logRequest(apiName = 'API') {
  const now = Date.now();
  timestamps.push(now);

  // Remove timestamps older than 60 seconds
  timestamps = timestamps.filter(t => now - t <= 60_000);

  console.log(`[${apiName}] Requests in last 60s: ${timestamps.length} at ${new Date().toISOString()}`);
}

module.exports = { logRequest };
