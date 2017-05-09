const { Http } = require('fhir-proof');
const { OperationOutcome } = Http;


module.exports.createError = (code, text) => {

  return OperationOutcome({
    issue: [
      {
        severity: 'error',
        code: code,
        details: {
          text: text
        }
      }
    ]
  })
};
