// Simple in-memory cache for performance optimization
const cache = {};
const cacheTime = {};

function getCache(key, durationMs) {
  if (cache[key] && Date.now() - cacheTime[key] < durationMs) {
    return cache[key];
  }
  return null;
}

function setCache(key, data) {
  cache[key] = data;
  cacheTime[key] = Date.now();
}

function clearCache(key) {
  if (key) {
    delete cache[key];
    delete cacheTime[key];
  } else {
    // Clear all cache
    Object.keys(cache).forEach(k => {
      delete cache[k];
      delete cacheTime[k];
    });
  }
}

module.exports = { getCache, setCache, clearCache };
