const express = require('express');
const assign = require('lodash/assign');
const supertest = require('supertest');
const fhir = require('../../../');

describe('createSpec', () => {

  var app, req, sendPost;

  beforeEach(() => {
    app = express();
    app.use(fhir({}));
    req = supertest(app);
    sendPost = (route, resource, expectedStstaus) => {
      return req.post(route)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(resource))
        .expect(expectedStstaus);
    };
  });


  it('should create', async () => {

    // given
    var resource = {
      resourceType: 'Observation',
      status: 'final',
      code: { text: 'test' },
    };

    // when
    await sendPost('/Observation', resource, 200).then(res => {

      // then
      expect(JSON.parse(res.text)).toMatchObject(assign({}, resource, {
        id: expect.any(String)
      }));
    });

  });


  it('should create with new id and new meta', async () => {

    // given
    var resource = {
      id: 'oldid',
      meta: {
        versionId: 'oldverionid',
        lastupdated: '2000-01-01'
      },
      resourceType: 'Observation',
      status: 'final',
      code: { text: 'test' },
    };

    // when
    await sendPost('/Observation', resource, 200).then(res => {

      // then
      expect(JSON.parse(res.text).id).not.toBe('oldid');
      expect(JSON.parse(res.text).meta.versionId).not.toBe('oldversionId');
      expect(JSON.parse(res.text).meta.lastUpdated).not.toBe('2000-01-01');
    });

  });


  it('should create with HEADER.Location', async () => {

    // given
    var resource = {
      resourceType: 'Observation',
      status: 'final',
      code: { text: 'test' },
    };

    // when
    await sendPost('/Observation', resource, 200).then(res => {

      // then
      expect(res.header).toHaveProperty('location');
      expect(res.header.location).toMatch(/^http.+\/Observation\/.+\/_history\/.+$/);
    });

  });


  it('should create resource with id and meta', async () => {

    // given
    var resource = {
      resourceType: 'Observation',
      status: 'final',
      code: { text: 'test' },
    };

    // when
    await sendPost('/Observation', resource, 200).then(res => {

      // then
      expect(JSON.parse(res.text)).toHaveProperty('id');
      expect(JSON.parse(res.text)).toHaveProperty('meta.versionId');
      expect(JSON.parse(res.text)).toHaveProperty('meta.lastUpdated');
    });

  });


  it('should not create on wrong input', async () => {

    // given
    var resource = {
      resourceType: 'Observation',
      status: 'wrongStatusCode!!', // FAIL
      code: { text: 'test' },
    };

    // when
    await sendPost('/Observation', resource, 400).then(res => {

      // then
      expect(JSON.parse(res.text).issue[0]).toMatchObject({
        severity: 'error',
        code: 'BAD_REQUEST',
        details: { text: 'Cannot create resource' }
      });
    });

  });


  it('should not create on wrong resourceType', async () => {

    // given
    var resource = {
      resourceType: 'NotFHIRResource',
      status: 'final',
      code: { text: 'test' },
    };

    // when
    await sendPost('/Observation', resource, 404).then(res => {

      // then
      expect(JSON.parse(res.text).issue[0]).toMatchObject({
        severity: 'error',
        code: 'NOT_FOUND',
        details: { text: 'Wrong resourceType' }
      });
    });

  });


  it('should not create on wrong resource URI', async () => {

    // when
    const res = req.post('/NoFHIRResource');

    // then
    await res.expect(404);
  });

});
