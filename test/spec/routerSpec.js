const express = require('express');
const supertest = require('supertest');

const fhir = require('../../');

describe('routerSpec', () => {

  var app, req;

  beforeEach(() => {
    app = express();
    app.use(fhir({}));
    req = supertest(app);
  });


  it('should response 404', async () => {

    // when
    const res = req.get('/route/not/exists');

    // then
    await res.expect(404);
  });


  it('should response 200', async () => {

    // when
    const res = req.get('/');

    // then
    await res.expect(200).then(res => {
      expect(res.text).toBe('OK');
    });

  });


  it('should get res.provider', async () => {

    // given
    app.get('/testroute', (req, res) => {

      // then
      expect(res.provider).not.toBeUndefined();

      res.send();
    });

    // when
    await req.get('/testroute').expect(200);

  });

});
