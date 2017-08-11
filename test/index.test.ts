import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import app from '../server/app';

chai.use(chaiHttp);
const expect = chai.expect;

describe('ping Route', () => {
  it('should be json', () => {
    return chai
      .request(app)
      .get('/ping')
      .then(res => {
        expect(res.type).to.eql('application/json');
      });
  });

  it('should have correct message prop', () => {
    return chai
      .request(app)
      .get('/ping')
      .then(res => {
        expect(res.body.message).to.eql('the server is working');
      });
  });

});
