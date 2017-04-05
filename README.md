[![Build Status](https://travis-ci.org/janstuemmel/campfhir-server.svg?branch=master)](https://travis-ci.org/janstuemmel/campfhir-server)
[![Test Coverage](https://codeclimate.com/github/janstuemmel/campfhir-server/badges/coverage.svg)](https://codeclimate.com/github/janstuemmel/campfhir-server/coverage)

# CampFhir Server

## Usage

```js
const express = require('express');
const app = express();

const fhir = require('campfhir-server')

app.use('/fhir', fhir({ /*options*/ }));

app.listen(1337, () => {
  console.log('Server listening on 0.0.0.0:1337');
});

```
