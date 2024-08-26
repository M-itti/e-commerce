const sinon = require('sinon')
const { expect } = require('chai')

describe('Asynchronous Error Test', function () {
  it('should reject with an error', function () {
    const stub = sinon.stub().rejects(new Error('Asynchronous error'))

    return stub().catch((err) => {
      expect(err).to.be.an('error')
      expect(err.message).to.equal('Asynchronous error')
    })
  })
})
