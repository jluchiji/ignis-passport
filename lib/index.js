/**
 * index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
// istanbul ignore next

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// istanbul ignore next

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const Ignis = require('parent-require')('ignis');

/* Symbols to hide internal data */
const $$strategies = Symbol();
const $$aliases = Symbol();

/**
 * PassportService class.
 */

let PassportService = (function (_Ignis$Service) {
  _inherits(PassportService, _Ignis$Service);

  function PassportService(ignis) {
    _classCallCheck(this, _PassportService);

    _get(Object.getPrototypeOf(_PassportService.prototype), 'constructor', this).call(this, ignis);
  }

  /**
   * Expose symbols
   */
  var _PassportService = PassportService;
  PassportService = Ignis.Service.deps('http')(PassportService) || PassportService;
  return PassportService;
})(Ignis.Service);

exports['default'] = PassportService;
PassportService.$$strategies = $$strategies;
PassportService.$$aliases = $$aliases;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
