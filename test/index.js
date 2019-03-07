/**
 * Created by jiangq on 2016/11/1.
 * Description:
 */
'use strict';
const chai = require('chai');
const promisify = require('../src');

const expect = chai.expect;

describe('test', () => {
  it('normal thunk function should be ok', done => {
    const client = {};
    Object.setPrototypeOf(client, {
      rpcA(request, options, callback) {
        process.nextTick(() => callback(null, {name: request.user}));
      }
    });
    promisify(client);
    client.rpcA({user: 'hello'}, (err, res) => {
      expect(err).to.be.null;
      expect(res.name).to.equal('hello');
      done();
    });
  });

  it('normal thunk function should be ok with error', done => {
    const client = {};
    Object.setPrototypeOf(client, {
      rpcA(request, options, callback) {
        process.nextTick(() => callback(new Error('error')));
      }
    });
    promisify(client);
    client.rpcA({user: 'hello'}, (err, res) => {
      expect(err).to.not.be.null;
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('error');
      done();
    });
  });

  it('normal thunk function should pass options ', done => {
    const client = {};
    Object.setPrototypeOf(client, {
      rpcA(request, options, callback) {
        expect(options).to.be.an.instanceof(Object);
        expect(options.deadline).to.be.an.instanceof(Date);
        process.nextTick(() => callback(null, {name: request.user}));
      }
    });
    promisify(client);

    var deadline = new Date(Date.now() + 1000);
    client.rpcA({user: 'hello'}, {deadline: deadline}, (err, res) => {
      expect(err).to.be.null;
      expect(res.name).to.equal('hello');
      done();
    });
  });

  it('promise should be ok ', done => {
    const client = {};
    Object.setPrototypeOf(client, {
      rpcA(request, options, callback) {
        process.nextTick(() => callback(null, {name: request.user}));
      }
    });
    promisify(client);

    client.rpcA({user: 'hello'}).then(res => {
      expect(res.name).to.equal('hello');
      done();
    }).catch(err => {
      done(new Error('should not error'));
    });
  });

  it('promise should be ok with error ', done => {
    const client = {};
    Object.setPrototypeOf(client, {
      rpcA(request, options, callback) {
        process.nextTick(() => callback(new Error('error')));
      }
    });
    promisify(client);

    client.rpcA({user: 'hello'}).then(res => {
      done(new Error('should not be ok'));
    }).catch(err => {
      expect(err).to.not.be.null;
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('error');
      done();
    });
  });

  it('promise should pass options ', done => {
    const client = {};
    Object.setPrototypeOf(client, {
      rpcA(request, options, callback) {
        expect(options).to.be.an.instanceof(Object);
        expect(options.deadline).to.be.an.instanceof(Date);
        process.nextTick(() => callback(null, {name: request.user}));
      }
    });
    promisify(client);

    var deadline = new Date(Date.now() + 1000);
    client.rpcA({user: 'hello'}, {deadline: deadline}).then(res => {
      expect(res.name).to.equal('hello');
      done();
    }).catch(err => {
      done(new Error('should not error'));
    });
  });
});
