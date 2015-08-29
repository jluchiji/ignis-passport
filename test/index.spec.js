/**
 * test/auth/index.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
/* jshint -W030 */
var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');
var Passport       = require('passport');

Chai.use(require('chai-as-promised'));
Chai.use(require('sinon-chai'));
var expect         = Chai.expect;

var Ignis          = require('ignis/lib/core');
var extension      = require('../lib');


describe('extension', function() {

  before(function() {
    Passport.__use = Passport.use;
    Passport.__authenticate = Passport.authenticate;
  });

  after(function() {
    Passport.use = Passport.__use;
    Passport.authenticate = Passport.__authenticate;
  });

  beforeEach(function() {
    Passport.use = Sinon.spy();
    Passport.authenticate = Sinon.spy();

    this.ignis = new Ignis();
    this.ignis.root.use = Sinon.spy(this.ignis.root.use);
  });

  it('should mount modules to the specified namespace', function() {
    this.ignis.use(extension);

    expect(this.ignis.auth).to.be.an('object');
    expect(this.ignis.auth.__alias).to.be.an('object');
    expect(this.ignis.auth.__options).to.be.an('object');

    expect(this.ignis.root.use).to.be.calledTwice;
    expect(this.ignis.factories.length).to.equal(1);

    expect(this.ignis.auth.jwt).to.be.a('function');
    expect(this.ignis.auth.local).to.be.a('function');

  });

});

describe('factory(2)', function() {

  before(function() {
    Passport.__use = Passport.use;
    Passport.__authenticate = Passport.authenticate;
  });

  after(function() {
    Passport.use = Passport.__use;
    Passport.authenticate = Passport.__authenticate;
  });

  beforeEach(function() {
    this.ignis = new Ignis();

    Passport.use = Sinon.spy();
    Passport.authenticate = Sinon.spy(function() {
      return function() { };
    });
  });

  it('should instantiate the appropriate middleware', function() {
    var mw = extension.passportFactory(this.ignis, { auth: 'local' });
    mw();

    expect(Passport.authenticate).to.be.calledOnce;
    expect(Passport.authenticate).to.be.calledWith('local');
  });

  it('should resolve aliases', function() {
    var mw = extension.passportFactory(this.ignis, { auth: 'token' });
    mw();

    expect(Passport.authenticate).to.be.calledOnce
    expect(Passport.authenticate).to.be.calledWith('jwt');
  });

  it('should handle options', function() {
    var mw = extension.passportFactory(this.ignis, { auth: { strategy: 'token' } });
    mw();

    expect(Passport.authenticate).to.be.calledOnce;
    expect(Passport.authenticate).to.be.calledWith('jwt');
  });

  it('should return null when no strategy is specified', function() {
    var mw = extension.passportFactory(this.ignis, { });
    expect(mw).to.equal(null);
  });

  it('should return null when strategy is \'none\'', function() {
    var mw = extension.passportFactory(this.ignis, { auth: 'noNe' });
    expect(mw).to.equal(null);
  });

});

describe('callback(3)', function() {

  beforeEach(function() { this.callback = Sinon.spy(); });

  it('should return a callback function', function() {
    var cb = extension.passportCallback(null, null, this.callback);
    expect(cb).to.be.a('function');
  });

  it('should not generate errors when successful', function() {
    var cb = extension.passportCallback(null, null, this.callback);

    cb(null, Object.create(null), null);
    expect(this.callback.calledOnce).to.equal(true);
    expect(this.callback.calledWithExactly()).to.equal(true);
  });

  it('should correctly pass on errors', function() {
    var cb = extension.passportCallback(null, null, this.callback);

    cb('foobar', Object.create(null), null);
    expect(this.callback.calledOnce).to.equal(true);
    expect(this.callback.calledWith('foobar')).to.equal(true);
  });

  it('should correctly generate Authentication Failed errors', function() {
    var cb = extension.passportCallback(null, null, this.callback);

    cb(null, null, 'foobar');
    expect(this.callback.calledOnce).to.equal(true);
    expect(this.callback.args[0][0])
      .to.be.an.instanceOf(Error).and
      .have.deep.property('details.reason', 'foobar');
  });

});

require('./strategy.spec.js');
