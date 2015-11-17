/**
 * index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
import _           from 'lodash';
import Ignis       from 'ignis';
import Parser      from 'body-parser';
import Passport    from 'passport';
import * as JWT    from 'passport-jwt';
import * as Local  from 'passport-local';
import {
  autobind
}                  from 'core-decorators';


/* Symbols to hide internal data */
const $$aliases = Symbol();
const $$options = Symbol();


/**
 * PassportService class.
 * Does not have an initialization callback.
 */
@Ignis.Service.deps('http')
export default class PassportService extends Ignis.Service {

  constructor(ignis) {
    super(ignis);

    this[$$aliases] = { token: 'jwt' };
    this[$$options] = { session: false };
  }


  /*!
   * Initialization callback.
   */
  async init(http) {

    /* Push required middleware into the router */
    http.router.use(Parser.json());
    http.router.use(Passport.initialize());

    /* Push a middleware factory before the callback */
    http.pre(this.factory);

    /* Attach default authentication strategies */
    this.strategy(JWT.Strategy);
    this.strategy(Local.Strategy);

  }


  /*!
   * Defines an authentication strategy.
   * Returns a wrapper function that unpsomisifies the callback.
   */
  strategy(type) {
    return function(callback) {
      let options  = Object.create(null);
      if (arguments.length === 2) {
        options  = arguments[0];
        callback = arguments[1];
      }

      const result = new type(options, Ignis.Util.unpromisify(callback));
      Passport.use(result);
    };
  }


  /*!
   * Defines an alias for a strategy.
   */
  @autobind
  alias(strategy, aka) {
    this[$$aliases][aka] = strategy;
  }


  /*!
   * Creates a passport.js callback.
   */
  callback(req, res, next) {
    return function(err, user, info) {
      if (err) { return next(err); }

      if (!user) {
        const error = new Ignis.Error('Authentication Failed');
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


  /*!
   * Middleware factory function.
   */
  @autobind
  factory(ignis, handler) {
    let options  = handler.auth;
    let strategy = options;

    /* Allow additional options */
    if (typeof options === 'object') {
      strategy = options.strategy;
      delete options.strategy;
    } else {
      options = { };
    }

    /* Generate nothing if strategy is 'none' or falsy */
    if (!strategy || /^none$/i.test(strategy)) { return null; }

    /* Resolve aliases first */
    const aliases = this[$$aliases];
    while (aliases[strategy]) {
      strategy = aliases[strategy];
    }

    /* Create the corresponding middleware */
    options = _.defaults(options, this[$$options]);
    return (req, res, next) => {
      const callback = this.callback(req, res, next);
      Passport.authenticate(strategy, options, callback)(req, res, next);
    };
  }

}


/**
 * Expose symbols
 */
PassportService.$$aliases = $$aliases;
PassportService.$$options = $$options;
