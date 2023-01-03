"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class PinpointError {
  constructor(error) {
    var {
      _isPinpointError = false,
      message = '',
      $metadata: {
        httpStatusCode = 500,
        cfId,
        extendedRequestId,
        requestId
      } = {}
    } = error;
    if (_isPinpointError) {
      return error;
    }
    var err = {
      cfId,
      extendedRequestId,
      requestId
    };
    var errHasKeys = !!Object.keys(err).length;
    this._isPinpointError = true;
    this.message = message;
    this.statusCode = httpStatusCode;
    this.error = errHasKeys && err || undefined;
  }
  toJSON() {
    var {
      message,
      statusCode,
      error
    } = this;
    return {
      message,
      statusCode,
      error
    };
  }
}
exports.default = PinpointError;