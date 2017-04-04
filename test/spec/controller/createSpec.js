const express = require('express');
const supertest = require('supertest');
const fhir = require('../../../');

describe('createSpec', () => {

  var app, req, store;

  beforeEach(() => {
    app = express();
    app.use(fhir({}));
    req = supertest(app);

    store = require('../../../lib/provider/memory');
  });


  it('should create resource', async () => {

    // when
    await req.post('/Observation').expect(200);

    // then
    expect(store.get()).toEqual(expect.arrayContaining([
      { resourceType: 'Observation' }
    ]));

  });


  it('should  ', async () => {

    // when
    const res = req.post('/NoFHIRResource');

    // then
    await res.expect(400);
  });

});
