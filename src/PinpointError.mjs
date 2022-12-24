export default class PinpointError {
  constructor (error) {
    const {
      _isPinpointError = false,
      message = '',
      $metadata: {
        httpStatusCode = 500,
        cfId,
        extendedRequestId,
        requestId
      } = {}
    } = error

    if (_isPinpointError) { return error }

    const err = { cfId, extendedRequestId, requestId }
    const errHasKeys = !!Object.keys(err).length

    this._isPinpointError = true
    this.message = message
    this.statusCode = httpStatusCode
    this.error = (errHasKeys && err) || undefined
  }

  toJSON () {
    const { message, statusCode, error } = this
    return { message, statusCode, error }
  }
}
