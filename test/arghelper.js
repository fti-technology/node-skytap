var chai = require('chai')
  , helpers = require('../lib/arghelper')

  , expect = chai.expect;

describe('arghelper', function() {

  describe('#combine', function() {

    it('should merge two objects', function() {
      var src = { a: 'a' }
        , dst = { b: 'b' }
        , result;
      
      result = helpers.combine(src, dst);
      expect(result.a).to.equal('a');
      expect(result.b).to.equal('b');
    });


    it('should not mutate source', function() {
      var src = { a: 'a' }
        , dst = { b: 'b' }
        , result;
      
      result = helpers.combine(src, dst);
      expect(src.a).to.equal('a');
      expect(src.b).to.be.undefined;
    });


    it('should not mutate destination', function() {
      var src = { a: 'a' }
        , dst = { b: 'b' }
        , result;
      
      result = helpers.combine(src, dst);
      expect(dst.a).to.be.undefined;
      expect(dst.b).to.equal('b');
    });


    it('should override properties on the destination', function() {
      var src = { a: 'a' }
        , dst = { a: 'b' }
        , result;

      result = helpers.combine(src, dst);
      expect(result.a).to.equal('b');
    });


    it('should exclude null properties from the source', function() {
      var src = { a: 'a' }
        , dst = { a: null, b: null }
        , result;

      result = helpers.combine(src, dst);
      expect(result.a).to.equal('a');
      expect(result.b).to.be.undefined;
    });


    it('should exclude undefined properties from the source', function() {
      var src = { a: 'a' }
        , dst = { a: undefined, b: undefined }
        , result;

      result = helpers.combine(src, dst);
      expect(result.a).to.equal('a');
      expect(result.b).to.be.undefined;
    });

  });


  describe('#convertAuth', function () {

    it('should construct auth object', function () {
      var opts = { };
      var result = helpers.convertAuth(opts);
      expect(result.auth).to.not.be.undefined;      
    });


    it('should create user property on auth object from username', function () {    
      var opts = { 
        username: 'username',
      };
      var result = helpers.convertAuth(opts);      
      expect(result.auth.user).to.equal('username');
    });


    it('should create pass property on auth object from password', function () {    
      var opts = { 
        password: 'password',
      };
      var result = helpers.convertAuth(opts);      
      expect(result.auth.pass).to.equal('password');       
    });


    it('should create pass property on auth object from token', function () {    
      var opts = { 
        token: 'token'
      };
      var result = helpers.convertAuth(opts);      
      expect(result.auth.pass).to.equal('token');       
    });


    it('should use token property over password property on auth object', function () {
      var opts = { 
        password: 'password',
        token: 'token'
      };
      var result = helpers.convertAuth(opts);      
      expect(result.auth.pass).to.equal('token');       
    });


    it('should delete username', function() {
      var opts = { 
        username: 'username',
      };
      var result = helpers.convertAuth(opts);      
      expect(result.username).to.be.undefined;
    });


    it('should delete password', function() {
      var opts = { 
        password: 'password',
      };
      var result = helpers.convertAuth(opts);      
      expect(result.password).to.be.undefined;
    });


    it('should delete token', function() {
      var opts = { 
        token: 'token'
      };
      var result = helpers.convertAuth(opts);      
      expect(result.token).to.be.undefined;
    });


    it('should not overwrite auth', function (){
      var opts = { 
        auth: { 
          weird: true
        }
      };
      var result = helpers.convertAuth(opts);      
      expect(result.auth.weird).to.be.true;
    });


    it('should use existing auth.user if supplied', function () {
      var opts = {
        username: 'username',
        auth: { 
          user: 'auth.user'
        }
      };
      var result = helpers.convertAuth(opts);
      expect(result.auth.user).to.equal('auth.user');
    });


    it('should use existing auth.pass if supplied', function () {
      var opts = {
        password: 'password',
        auth: { 
          pass: 'auth.pass'
        }
      };
      var result = helpers.convertAuth(opts);
      expect(result.auth.pass).to.equal('auth.pass');
    });


    it('should not mutate original object', function () {
      var opts = {
        username: 'username',
        password: 'password'
      };
      var result = helpers.convertAuth(opts);
      expect(opts.username).to.equal('username');
      expect(opts.password).to.equal('password');
    });

  });


  describe('#convertReqParams', function (){

    it('should append GET params to query string', function () {
      var opts = {
        url: 'http://localhost',
        method: 'GET',
        params: {
          some: 'some',
          param: 'param'
        }
      };
      var result = helpers.convertReqParams(opts);
      expect(result.method).to.equal('GET');
      expect(result.url).to.equal('http://localhost?some=some&param=param');
    });

    
    it('should move params object body for POST', function () {
      var opts = {
        url: 'http://localhost',
        method: 'POST',
        params: {
          some: 'some',
          param: 'param'
        }
      };
      var result = helpers.convertReqParams(opts);
      expect(result.method).to.equal('POST');
      expect(result.body).to.equal(opts.params);
    });


    it('should move params object body for PUT', function () {
      var opts = {
        url: 'http://localhost',
        method: 'PUT',
        params: {
          some: 'some',
          param: 'param'
        }
      };
      var result = helpers.convertReqParams(opts);
      expect(result.method).to.equal('PUT');
      expect(result.body).to.equal(opts.params);
    });


    it('should move params object body for DELETE', function () {
      var opts = {
        url: 'http://localhost',
        method: 'DELETE',
        params: {
          some: 'some',
          param: 'param'
        }
      };
      var result = helpers.convertReqParams(opts);
      expect(result.method).to.equal('DELETE');
      expect(result.body).to.equal(opts.params);
    });


    it('should handle no params on GET request', function () {
      var opts = {
        url: 'http://localhost',
        method: 'GET'
      };
      var result = helpers.convertReqParams(opts);
      expect(result.url).to.equal('http://localhost');
    });

    it('should handle empty params on GET request', function () {
      var opts = {
        url: 'http://localhost',
        method: 'GET',
        params: {}
      };
      var result = helpers.convertReqParams(opts);
      // Make sure doesn't append `?` followed by empty string
      expect(result.url).to.equal('http://localhost');
    });

    it('should handle no params on POST/PUT/DELETE request', function () {
      var opts = {
        url: 'http://localhost',
        method: 'POST'
      };
      var result = helpers.convertReqParams(opts);
      expect(result.url).to.equal('http://localhost');
    });

    it('should only set body when params has keys', function () {
      var opts = {
        method: 'POST',
        params: { }
      };
      var result = helpers.convertReqParams(opts);
      expect(result.body).to.be.undefined;
    });

  });


  describe('#convertUrlParams', function () {

    it('should convert param in first position', function () {
      var opts = {
        url: 'http://localhost/:id',
        params: {
          id: 123
        }
      };
      var result = helpers.convertUrlParams(opts);
      expect(result.url).to.equal('http://localhost/123');
    });


    it('should convert param in last position', function () {
      var opts = {
        url: 'http://localhost/api/environments/:id',
        params: {
          id: 123
        }
      };
      var result = helpers.convertUrlParams(opts);
      expect(result.url).to.equal('http://localhost/api/environments/123');
    });


    it('should convert param in middle position', function () {
      var opts = {
        url: 'http://localhost/api/projects/:id/templates',
        params: {
          id: 123
        }
      };
      var result = helpers.convertUrlParams(opts);
      expect(result.url).to.equal('http://localhost/api/projects/123/templates');
    });


    it('should convert multiple params', function () {
      var opts = {
        url: 'http://localhost/api/:controller/:id/templates',
        params: {
          id: 123,
          controller: 'projects'
        }
      };
      var result = helpers.convertUrlParams(opts);
      expect(result.url).to.equal('http://localhost/api/projects/123/templates');
    });


    it('should delete property from params', function () {
      var opts = {
        url: 'http://localhost/:id',
        params: {
          id: 123
        }
      };
      var result = helpers.convertUrlParams(opts);
      expect(result.params.id).to.be.undefined;
    });


    it('should not modify original argument', function () {
      var opts = {
        url: 'http://localhost/:id',
        params: {
          id: 123
        }
      };
      var result = helpers.convertUrlParams(opts);
      expect(opts.params.id).to.not.be.undefined;
    });


    it('should handle no params', function () {
      var opts = {
        url: 'http://localhost'
      };
      var result = helpers.convertUrlParams(opts);
      expect(result.url).to.equal('http://localhost');
    });

  });

});