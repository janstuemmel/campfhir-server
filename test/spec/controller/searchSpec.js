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


  it('should get resource bundle', async () => {

    // given
    Memory.add({
      resourceType: 'Observation',
      id: '1',
      status: 'final',
      code: { text: 'test' },
    });

    Memory.add({
      resourceType: 'Observation',
      id: '2',
      status: 'final',
      code: { text: 'test' },
    });

    // when
    await req.get('/Observation').expect(200).then(res => {

      // then
      expect(JSON.parse(res.text)).toMatchObject({
        resourceType: 'Bundle',
        type: 'searchset',
        entry: expect.arrayContaining([
          expect.objectContaining({
            resource: expect.objectContaining({
              id: '1',
              resourceType: 'Observation'
            })
          }),
          expect.objectContaining({
            resource: expect.objectContaining({
              id: '2',
              resourceType: 'Observation'
            })
          }),
        ])
      });

    });
  });


  it('should get empty resource bundle', async () => {

    // when
    await req.get('/Observation').expect(200).then(res => {


      // then
      expect(JSON.parse(res.text)).toMatchObject({
        resourceType: 'Bundle',
        type: 'searchset',
        entry: []
      });

    });
  });

});
