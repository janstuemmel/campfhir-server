const express = require('express');
const assign = require('lodash/assign');
const supertest = require('supertest');
const fhir = require('../../../');

const { URL } = require('url');
const parseQuery = require('querystring').parse;

const Memory = require('../../../lib/provider/memory');
const { collectSearchRules } = require('../../../lib/controller/search');

describe('searchSpec', () => {

  describe('routes', () => {

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


    it('should resources by query', async () => {

      // given
      Memory.add({
        resourceType: 'Observation',
        id: '1',
        status: 'final',
        subject: { reference: 'Patient/1' },
        code: { text: 'Weight', coding: { code: 'weight' } },
      });


      // when
      await req.get('/Observation?subject=Patient/1&code=weight').expect(200).then(res => {


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
          ])
        });

      });
    });


  });


  describe('functions', () => {

    it('should get query params', () => {

      // when
      var url = new URL('http://example.com/Observation?subject=Patient/1&foo=1');

      // then
      expect(url.searchParams.get('subject')).toBe('Patient/1');
      expect(url.searchParams.get('foo')).toBe('1');
    });


    it('should collect search rules', () => {

      // given
      var query = { subject: 'Patient/1', _id: '123' };

      // when
      var searchRules = collectSearchRules(query);

      // then
      expect(searchRules).toEqual({
        'subject.reference': 'Patient/1',
        'id': '123'
      })
    });

  });

});
