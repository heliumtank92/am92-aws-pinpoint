import { SERVICE } from './CONFIG'
import { PinpointErrorMap } from './TYPES'

/** @ignore */
const DEFAULT_ERROR_MSG = 'Pinpoint Error'
/** @ignore */
const DEFAULT_ERROR_STATUS_CODE = 500
/** @ignore */
const DEFAULT_ERROR_CODE = 'Pinpoint::GENERIC'

/**
 * Error class whose instance is thrown in case of any error.
 *
 * @class
 * @typedef {PinpointError}
 * @extends {Error}
 */
export class PinpointError extends Error {
  /**
   * Flag to identify if error is a custom error.
   */
  readonly _isCustomError = true
  /**
   * Flag to identify if error is a PinpointError.
   */
  readonly _isPinpointError = true
  /**
   * Node project from which Error is thrown.
   */
  readonly service: string
  /**
   * Error's message string.
   */
  message: string
  /**
   * HTTP status code associated with the error.
   */
  statusCode: number
  /**
   * Error Code.
   */
  errorCode: string
  /**
   * Error object.
   */
  error?: any
  /**
   * Creates an instance of PinpointError.
   *
   * @constructor
   * @param [e] Any Error instance to wrap with PinpointError.
   * @param [eMap] PinpointErrorMap to rewrap error for better understanding.
   */
  constructor(e?: any, eMap?: PinpointErrorMap) {
    super()

    const {
      message: eMessage,
      $metadata: { httpStatusCode: eStatusCode = 500 } = {}
    } = e

    this.service = SERVICE
    this.message = eMap?.message || eMessage || DEFAULT_ERROR_MSG
    this.statusCode =
      eMap?.statusCode || eStatusCode || DEFAULT_ERROR_STATUS_CODE
    this.errorCode = eMap?.errorCode || DEFAULT_ERROR_CODE
    this.error = e
  }
}
