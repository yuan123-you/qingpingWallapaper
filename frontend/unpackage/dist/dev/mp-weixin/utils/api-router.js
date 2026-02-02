"use strict";
const common_vendor = require("../common/vendor.js");
const API_ENDPOINTS = [
  "https://qingping-wallpaper-api.1628973345.workers.dev",
  "https://your-vercel-app.vercel.app/api",
  "https://your-netlify-app.netlify.app/api"
];
const HEALTH_CHECK_INTERVAL = 5 * 60 * 1e3;
const HEALTH_CHECK_TIMEOUT = 5e3;
let endpointStatus = {};
let currentEndpointIndex = 0;
async function checkEndpointHealth(endpoint) {
  try {
    const startTime = Date.now();
    const response = await fetch(`${endpoint}/api/user/banner/list`, {
      method: "GET",
      signal: AbortSignal.timeout(HEALTH_CHECK_TIMEOUT)
    });
    const duration = Date.now() - startTime;
    return {
      healthy: response.ok,
      responseTime: duration,
      statusCode: response.status
    };
  } catch (error) {
    return {
      healthy: false,
      responseTime: HEALTH_CHECK_TIMEOUT,
      error: error.message
    };
  }
}
async function healthCheckAllEndpoints() {
  const results = await Promise.all(
    API_ENDPOINTS.map(async (endpoint) => {
      const status = await checkEndpointHealth(endpoint);
      return { endpoint, ...status };
    })
  );
  results.forEach(({ endpoint, healthy, responseTime }) => {
    endpointStatus[endpoint] = {
      healthy,
      responseTime,
      lastCheck: Date.now()
    };
  });
  const healthyEndpoints = results.filter((r) => r.healthy).sort((a, b) => a.responseTime - b.responseTime);
  if (healthyEndpoints.length > 0) {
    const fastestEndpoint = healthyEndpoints[0].endpoint;
    currentEndpointIndex = API_ENDPOINTS.indexOf(fastestEndpoint);
    common_vendor.index.__f__("log", "at utils/api-router.js:59", "Fastest endpoint:", fastestEndpoint, healthyEndpoints[0].responseTime + "ms");
  }
  return results;
}
function getBestEndpoint() {
  const healthyEndpoints = API_ENDPOINTS.filter(
    (endpoint) => {
      var _a;
      return (_a = endpointStatus[endpoint]) == null ? void 0 : _a.healthy;
    }
  );
  if (healthyEndpoints.length === 0) {
    return API_ENDPOINTS[0];
  }
  const sorted = healthyEndpoints.sort((a, b) => {
    var _a, _b;
    const timeA = ((_a = endpointStatus[a]) == null ? void 0 : _a.responseTime) || Infinity;
    const timeB = ((_b = endpointStatus[b]) == null ? void 0 : _b.responseTime) || Infinity;
    return timeA - timeB;
  });
  return sorted[0];
}
function getNextEndpoint() {
  currentEndpointIndex = (currentEndpointIndex + 1) % API_ENDPOINTS.length;
  return API_ENDPOINTS[currentEndpointIndex];
}
function markEndpointFailed(endpoint) {
  if (endpointStatus[endpoint]) {
    endpointStatus[endpoint].healthy = false;
    endpointStatus[endpoint].lastError = Date.now();
  }
}
function getEndpointStatus() {
  return endpointStatus;
}
function startHealthCheck() {
  healthCheckAllEndpoints();
  setInterval(healthCheckAllEndpoints, HEALTH_CHECK_INTERVAL);
}
const apiRouter = {
  API_ENDPOINTS,
  getBestEndpoint,
  getNextEndpoint,
  markEndpointFailed,
  getEndpointStatus,
  startHealthCheck,
  healthCheckAllEndpoints
};
exports.apiRouter = apiRouter;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/api-router.js.map
