/**
 * index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Ignis = require('parent-require')('ignis');


/* Symbols to hide internal data */
const $$strategies = Symbol();
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

    this[$$strategies] = new Map();
    this[$$aliases] = new Map();
    this[$$options] = { session: false };
  }


}


/**
 * Expose symbols
 */
PassportService.$$strategies = $$strategies;
PassportService.$$aliases = $$aliases;
PassportService.$$options = $$options;
