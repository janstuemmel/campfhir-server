const express = require('express');
const assign = require('lodash/assign');
const supertest = require('supertest');
const fhir = require('../../../');

describe('createSpec', () => {

  var app, req;

  beforeEach(() => {
    app = express();
    app.use(fhir({}));
    req = supertest(app);
  });


  it('should create resource', async () => {

    // given
    var resource = {
      resourceType: 'Observation',
      status: 'final',
      code: { text: 'test' },
    };

    // when
    await req.post('/Observation')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(resource))
      .expect(200)
      .then(res => {

        // then
        expect(JSON.parse(res.text)).toMatchObject({
          err: false,
          data: expect.objectContaining(assign({}, resource, {
            id: expect.any(String)
          }))
        });
      });

  });


  it('should not create resource on wrong statusCode', async () => {

    // given
    var resource = {
      resourceType: 'Observation',
      status: 'wrongStatus!', // FAIL
      code: { text: 'test' },
    };

    // when
    await req.post('/Observation')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(resource))
      .expect(400)
      .then(res => {

        // then
        expect(JSON.parse(res.text)).toMatchObject({
          err: true,
          msg: expect.any(String)
        });
      });
  });


  it('should not create resource on wrong resourceType', async () => {

    // when
    const res = req.post('/NoFHIRResource');

    // then
    await res.expect(400);
  });

});
