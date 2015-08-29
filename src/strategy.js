/**
 * auth/strategy.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Passport    from 'passport';
import { unpromisify } from 'ignis-util';

/**
 * strategy(1)
 *
 * @description                Creates a passport.js strategy that supports
 *                             promise-returning callbacks.
 * @param          {ctor}      Passport.js strategy constructor.
 * @returns        {Strategy}  Passport.js strategy.
 */
export default function strategy(ctor) {
  return function(callback) {
    let options  = Object.create(null);
    if (arguments.length === 2) {
      options  = arguments[0];
      callback = arguments[1];
    }

    let result = new ctor(options, unpromisify(callback));
    Passport.use(result);
  };
}
