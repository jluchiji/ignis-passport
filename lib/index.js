/**
 * auth/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.passportFactory = passportFactory;
exports.passportCallback = passportCallback;
exports['default'] = auth;
// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportJwt = require('passport-jwt');

var JWT = _interopRequireWildcard(_passportJwt);

var _passportLocal = require('passport-local');

var Local = _interopRequireWildcard(_passportLocal);

var _strategy = require('./strategy');

var _strategy2 = _interopRequireDefault(_strategy);

/**
 * passportFactory(2)
 *
 * @description                Authentication middleware factory.
 * @param          {ignis}     Ignis.js namespace.
 * @param          {handler}   Ignis.js request handler with metadata.
 * @returns        {Function}  Express.js middleware instance.
 */

function passportFactory(ignis, handler) {
  var options = handler.auth || handler.authenticate || handler.authentication;
  var strategy = options;
  if (typeof options === 'object') {
    strategy = options.strategy;
    delete options.strategy;
  } else {
    options = {};
  }

  /* Generate nothing if strategy is 'none' or falsy */
  if (!strategy || /^none$/i.test(strategy)) {
    return null;
  }

  /* Resolve aliases first */
  strategy = ignis.auth.__alias[strategy] || strategy;

  /* Create the corresponding middleware */
  options = _lodash2['default'].merge({}, ignis.auth.__options, options);
  return function (req, res, next) {
    var callback = passportCallback(req, res, next);
    _passport2['default'].authenticate(strategy, options, callback)(req, res, next);
  };
}

/**
 * passportCallback(3)
 *
 * @description                Creates a custom callback function so that
 *                             authentication errors go through Express.js
 *                             error handler stack instead of having Passport.js
 *                             send out a 401 response.
 * @param          {err}       Error occured during authentication.
 * @param          {user}      User information (if authentication successful).
 * @param          {info}      Additional information.
 */

function passportCallback(req, res, next) {
  return function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      var error = new Error('Authentication Failed');
      error.name = 'IgnisError';
      error.status = 401;
      error.sensitive = true;
      error.details = {
        sensitive: true,
        reason: info
      };
      return next(error);
    }

    req.user = user;
    next();
  };
}

/**
 * auth(1)
 *
 * @description                Ignis.js extension.
 */

function auth(Ignis) {
  Ignis.init(function () {
    /* Root authentication namespace */
    this.auth = Object.create(null);
    this.auth.__alias = { 'token': 'jwt' };
    this.auth.__options = { session: false };

    /* Attach passport.js middlewares */
    this.factories.push(passportFactory);
    this.root.use(_bodyParser2['default'].json());
    this.root.use(_passport2['default'].initialize());

    /* Authentication mechanisms */
    this.auth.jwt = (0, _strategy2['default'])(JWT.Strategy);
    this.auth.local = (0, _strategy2['default'])(Local.Strategy);
  });
}
//# sourceMappingURL=index.js.map