/**
 * auth/strategy.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = strategy;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _ignisUtil = require('ignis-util');

/**
 * strategy(1)
 *
 * @description                Creates a passport.js strategy that supports
 *                             promise-returning callbacks.
 * @param          {ctor}      Passport.js strategy constructor.
 * @returns        {Strategy}  Passport.js strategy.
 */

function strategy(ctor) {
  return function (callback) {
    var options = Object.create(null);
    if (arguments.length === 2) {
      options = arguments[0];
      callback = arguments[1];
    }

    var result = new ctor(options, (0, _ignisUtil.unpromisify)(callback));
    _passport2['default'].use(result);
  };
}

module.exports = exports['default'];
//# sourceMappingURL=strategy.js.map