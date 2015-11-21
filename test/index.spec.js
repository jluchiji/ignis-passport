/**
 * test/index.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Chai = require('chai');
const Ignis = require('ignis');
const Passport = require('passport');
const PassportService = require('../lib');

Chai.use(require('sinon-chai'));
Chai.use(require('chai-as-promised'));

/*!
 * Setup global stuff here.
 */
global.co          = require('bluebird').coroutine;
global.expect      = Chai.expect;
global.Sinon       = require('sinon');

/*!
 * Setup/Teardown
 */
before(function() {
  Passport.__use = Passport.use;
  Passport.__authenticate = Passport.authenticate;
});

after(function() {
  Passport.use = Passport.__use;
  Passport.authenticate = Passport.__authenticate;
});

beforeEach(co(function*() {
  Passport.use = Sinon.spy();
  Passport.authenticate = Sinon.spy(() => function() { });

  Ignis.reset();
  this.ignis = Ignis();

  this.ignis.use(PassportService);
  this.ignis.use(Ignis.Http);
  yield this.ignis.init();

  this.http = this.ignis.service('http');
  this.http.router.use = Sinon.spy(this.http.router.use);
  this.service = this.ignis.service('passport');
}));

describe('init(http)', function() {

  it('should push auth middleware factory', function() {
    const factories = this.http[Ignis.Http.$$pre];
    expect(factories)
      .to.have.length(1);
    expect(factories[0])
      .to.equal(this.service.factory);
  });

});

describe('alias(strategy, aka)', function() {

  it('should define an alias', function() {
    this.service.alias('foo', 'bar');
    const aliases = this.service[PassportService.$$aliases];
    expect(aliases)
      .to.have.property('bar', 'foo');
  });

});

describe('factory(ignis, handler)', function() {

  it('should instantiate the appropriate middleware', function() {
    const mw = this.service.factory(this.ignis, { auth: 'local' });
    mw();

    expect(Passport.authenticate)
      .to.be.calledOnce
      .to.be.calledWith('local');
  });

  it('should resolve aliases', function() {
    const mw = this.service.factory(this.ignis, { auth: 'token' });
    mw();

    expect(Passport.authenticate)
      .to.be.calledOnce
      .to.be.calledWith('jwt');
  });

  it('should handle on options', function() {
    const mw = this.service.factory(this.ignis, { auth: { strategy: 'token' } });
    mw();

    expect(Passport.authenticate)
      .to.be.calledOnce
      .to.be.calledWith('jwt');
  });

  it('should return null when no strategy is specified', function() {
    const mw = this.service.factory(this.ignis, { });
    expect(mw)
      .to.equal(null);
  });

  it('should return null when strategy is \'none\'', function() {
    const mw = this.service.factory(this.ignis, { auth: 'noNe' });
    expect(mw)
      .to.equal(null);
  });

});

describe('callback(req, res, next)', function() {

  beforeEach(function() {
    this.cb = Sinon.spy();
  });

  it('should return a callback function', function() {
    const cb = this.service.callback(null, null, this.cb);
    expect(cb)
      .to.be.a('function');
  });

  it('should not generate errors when successful', function() {
    const cb = this.service.callback({ }, null, this.cb);
    cb(null, { }, null);

    expect(this.cb)
      .to.be.calledOnce;
    expect(this.cb.firstCall.args)
      .to.have.length(0);
  });

  it('should pass on errors if fails', function() {
    const cb = this.service.callback({ }, null, this.cb);
    cb('foobar', { }, null);

    expect(this.cb)
      .to.be.calledOnce
      .to.be.calledWith('foobar');
  });

  it('should generate Ignis.Error instances', function() {
    const cb = this.service.callback(null, null, this.cb);

    cb(null, null, 'foobar');

    expect(this.cb)
      .to.be.calledOnce;
    const actual = this.cb.firstCall.args[0];
    expect(actual)
      .to.exist
      .to.be.an.instanceOf(Ignis.Error)
      .to.have.deep.property('details.reason', 'foobar');

  });

});

describe('strategy(type)', function() {

  beforeEach(function() {
    const spy = this.spy = Sinon.spy();
    this.type = function(options, callback) {
      this.options = options;
      this.callback = callback;
      spy.apply(null, arguments);
    };
  });

  it('should produce a strategy factory', function() {
    const factory = this.service.strategy(this.type);
    expect(factory)
      .to.be.a('function');

    const options = { foo: 'bar' };
    const callback = Sinon.spy();

    factory(options, callback);

    expect(this.spy)
      .to.be.calledOnce
      .to.be.calledWith(options);
    expect(Passport.use)
      .to.be.calledOnce;
  });

  it('should handle absent options parameter', function() {
    const factory = this.service.strategy(this.type);
    expect(factory)
      .to.be.a('function');

    const callback = Sinon.spy();

    factory(callback);

    expect(this.spy)
      .to.be.calledOnce
      .to.be.calledWith({ });
    expect(Passport.use)
      .to.be.calledOnce;
  });

});
