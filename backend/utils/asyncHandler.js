/**
 * Wraps an async route handler and forwards errors to Express error middleware.
 * Eliminates repetitive try/catch blocks in every controller.
 * @param {Function} fn - Async express route handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
