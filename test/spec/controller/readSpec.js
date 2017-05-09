const express = require('express');
const assign = require('lodash/assign');
const supertest = require('supertest');
const fhir = require('../../../');

const Memory = require('../../../lib/provider/memory');

describe('createSpec', () => {

  var app, req;

  beforeEach(() => {
    app = express();
    app.use(fhir({}));
    req = supertest(app);

    Memory.resources = [];
  });


  it('should get resource', async () => {

    // given
    Memory.add({
      resourceType: 'Observation',
      id: '1',
      status: 'final',
      code: { text: 'test' },
    });

    // when
    await req.get('/Observation/1').expect(200).then(res => {

      // then
      expect(JSON.parse(res.text)).toMatchObject({
        id: '1',
        resourceType: 'Observation'
      });

    });
  });


  it('should not get resource', async () => {

    // when
    await req.get('/Observation/1').expect(404).then(res => {

      // then
      expect(JSON.parse(res.text).issue[0]).toMatchObject({
        code: 'NOT_FOUND',
        details: { text:  'Resource not found' }
      });
    });
  });


});
