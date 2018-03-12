
/**
 * higher order error function to catch errors
 *
 * @param {function} fn - function
 *
 * @returns {function} wrapped with error handling
 */
function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

module.exports = {
  catchErrors,
};
