/**
 * test/auth/strategy.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

var Sinon          = require('sinon');
var Chai           = require('chai');
var Bluebird       = require('bluebird');
var Passport       = require('passport');

Chai.use(require('chai-as-promised'));
var expect         = Chai.expect;

var strategy       = require('../lib/strategy');


describe('strategy(1)', function() {

  before(function() { Passport.__use = Passport.use; });

  after(function() { Passport.use = Passport.__use; });

  beforeEach(function() {
    Passport.use = Sinon.spy();
    var spy = this.spy  = Sinon.spy();
    this.ctor = function(options, callback) {
      this.options = options;
      this.callback = callback;
      spy.apply(null, arguments);
    };
  });

  it('should produce a strategy factory', function() {

    var factory = strategy(this.ctor);
    expect(factory).to.be.a('function');

    var options  = { foo: 'bar' };
    var callback = Sinon.spy();

    var result = factory(options, callback);
    expect(this.spy.calledOnce).to.equal(true);
    expect(this.spy.calledWith(options)).to.equal(true);
    expect(Passport.use.calledOnce).to.equal(true);
  });

  it('should handle absent options parameter', function() {

    var factory = strategy(this.ctor);
    expect(factory).to.be.a('function');

    var callback = Sinon.spy();

    var result = factory(callback);
    expect(this.spy.calledOnce).to.equal(true);
    expect(this.spy.calledWith({ })).to.equal(true);
    expect(Passport.use.calledOnce).to.equal(true);

  });

});
