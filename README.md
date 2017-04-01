[![Build Status](https://travis-ci.org/janstuemmel/campfhir-server.svg?branch=master)](https://travis-ci.org/janstuemmel/campfhir-server)

# CampFhir Server

## Usage

```js
const express = require('express');
const app = express();

const campfhir = require('campfhir-server')

app.use('/fhir', campfhir);

app.listen(1337, () => {
  console.log('Server listening on 0.0.0.0:1337');
});

```
