import {
  DeliveryStatus,
  MessageRequest,
  PinpointClientConfig
} from '@aws-sdk/client-pinpoint'

/** @ignore */
export type IntConfigKeys =
  | 'PINPOINT_OTP_ALLOWED_ATTEMPTS'
  | 'PINPOINT_OTP_CODE_LENGTH'
  | 'PINPOINT_OTP_VALIDITY_PERIOD_IN_MIN'

/** @ignore */
export type IntConfigs<T> = {
  [key in IntConfigKeys]?: T
}

/**
 * Defines the configuration structure for the AWS Pinpoint SDK used within the application.
 *
 * @export
 * @interface PinpointSdkConfig
 * @typedef {PinpointSdkConfig}
 */
export interface PinpointSdkConfig {
  /**
   * AWS Pinpoint client configuration details.
   *
   * @type {PinpointClientConfig}
   */
  CONNECTION_CONFIG: PinpointClientConfig
  /**
   * Unique identifier for the application using AWS Pinpoint.
   *
   * @type {string}
   */
  APPLICATION_ID: string
  /**
   * The phone number from which SMS messages are sent.
   *
   * @type {string}
   */
  SMS_ORIGINATION_NUMBER: string
  /**
   * Sender ID that appears on the recipient's device.
   *
   * @type {string}
   */
  SMS_SENDER_ID: string
  /**
   * The email address that appears in the 'From' field for emails sent.
   *
   * @type {string}
   */
  EMAIL_FROM_ADDRESS: string
  /**
   * Brand name used in OTP messages.
   *
   * @type {string}
   */
  OTP_BRAND_NAME: string
  /**
   * Identity used for sending OTPs.
   *
   * @type {string}
   */
  OTP_ORIGINATION_IDENTITY: string
  /**
   * Maximum number of OTP attempts allowed.
   *
   * @type {number}
   */
  OTP_ALLOWED_ATTEMPTS: number
  /**
   * Length of the OTP code.
   *
   * @type {number}
   */
  OTP_CODE_LENGTH: number
  /**
   * Validity period of the OTP in minutes.
   *
   * @type {number}
   */
  OTP_VALIDITY_PERIOD: number
}

/**
 * Default configuration values for the AWS Pinpoint SDK.
 *
 * @type {PinpointSdkConfig}
 */
export const DEFAULT_CONFIG: PinpointSdkConfig = {
  CONNECTION_CONFIG: {
    region: 'ap-south-1',
    apiVersion: '2016-12-01'
  },
  APPLICATION_ID: '',
  SMS_ORIGINATION_NUMBER: '',
  SMS_SENDER_ID: '',
  EMAIL_FROM_ADDRESS: '',
  OTP_BRAND_NAME: '',
  OTP_ORIGINATION_IDENTITY: '',
  OTP_ALLOWED_ATTEMPTS: 3,
  OTP_CODE_LENGTH: 6,
  OTP_VALIDITY_PERIOD: 5
}

/**
 * Attributes for sending messages via AWS Pinpoint.
 *
 * @export
 * @interface SendMessagesAttrs
 * @typedef {SendMessagesAttrs}
 */
export interface SendMessagesAttrs {
  /**
   * The message request details for sending messages.
   *
   * @type {?MessageRequest}
   */
  MessageRequest?: MessageRequest
}

/**
 * Attributes for sending emails via AWS Pinpoint.
 *
 * @export
 * @interface SendEmailAttrs
 * @typedef {SendEmailAttrs}
 */
export interface SendEmailAttrs {
  /**
   * The body content of the email.
   *
   * @type {?string}
   */
  body?: string
  /**
   * Email address for forwarding feedback.
   *
   * @type {?string}
   */
  feedbackForwardingAddress?: string
  /**
   * The 'From' address for the email.
   *
   * @type {?string}
   */
  fromAddress?: string
  /**
   * Raw email content, typically for custom MIME types.
   *
   * @type {?*}
   */
  rawEmail?: any
  /**
   * Simple email structure with subject, text, and HTML parts.
   *
   * @type {?{
   *     subject?: { data: string }
   *     textPart?: { data: string }
   *     htmlPart?: { data: string }
   *   }}
   */
  simpleEmail?: {
    subject?: { data: string }
    textPart?: { data: string }
    htmlPart?: { data: string }
  }
  /**
   * Reply-to email addresses.
   *
   * @type {?string[]}
   */
  replyToAddresses?: string[]
  /**
   * Recipient email addresses.
   *
   * @type {?string[]}
   */
  toAddresses?: string[]
  /**
   * The name of the email template to use.
   *
   * @type {?string}
   */
  emailTemplateName?: string
  /**
   * The version of the email template to use.
   *
   * @type {?string}
   */
  emailTemplateVersion?: string
  /**
   * Substitutions for the email template.
   *
   * @type {?{ [key: string]: string | number }}
   */
  substitutions?: { [key: string]: string | number }
}

/**
 * Attributes for sending SMS messages via AWS Pinpoint.
 *
 * @export
 * @interface SendSmsAttrs
 * @typedef {SendSmsAttrs}
 */
export interface SendSmsAttrs {
  /**
   * The body content of the SMS.
   *
   * @type {?string}
   */
  body?: string
  /**
   * Keyword associated with the SMS campaign.
   *
   * @type {?string}
   */
  keyword?: string
  /**
   * Type of the message, e.g., promotional or transactional.
   *
   * @type {?string}
   */
  messageType?: string
  /**
   * The phone number from which the SMS is sent.
   *
   * @type {?string}
   */
  originationNumber?: string
  /**
   * Sender ID that appears on the recipient's device.
   *
   * @type {?string}
   */
  senderId?: string
  /**
   * List of destination phone numbers.
   *
   * @type {?string[]}
   */
  destinationNumbers?: string[]
  /**
   * The name of the SMS template to use.
   *
   * @type {?string}
   */
  smsTemplateName?: string
  /**
   * The version of the SMS template to use.
   *
   * @type {?string}
   */
  smsTemplateVersion?: string
  /**
   * Substitutions for the SMS template.
   *
   * @type {?{ [key: string]: string }}
   */
  substitutions?: { [key: string]: string }
}

/**
 * Result of sending OTP via SMS or email.
 *
 * @export
 * @interface SendSmsEmailOtpResult
 * @typedef {SendSmsEmailOtpResult}
 */
export interface SendSmsEmailOtpResult {
  /**
   * Unique request identifier for the message.
   *
   * @type {string}
   */
  requestId: string
  /**
   * Unique message identifier.
   *
   * @type {string}
   */
  messageId: string
  /**
   * Type of channel used, e.g., SMS or email.
   *
   * @type {string}
   */
  channelType: string
  /**
   * Recipient address of the message.
   *
   * @type {string}
   */
  address: string
  /**
   * Status of the delivery.
   *
   * @type {DeliveryStatus}
   */
  deliveryStatus: DeliveryStatus
  /**
   * HTTP status code of the response.
   *
   * @type {number}
   */
  statusCode: number
  /**
   * Detailed status message.
   *
   * @type {string}
   */
  statusMessage: string
  /**
   * Token updated after the message is sent.
   *
   * @type {string}
   */
  updatedToken: string
}

/**
 * Data structure containing results of sending OTP via SMS or email.
 *
 * @export
 * @interface SendSmsEmailData
 * @typedef {SendSmsEmailData}
 */
export interface SendSmsEmailData {
  /**
   * Array of results for each message sent.
   *
   * @type {SendSmsEmailOtpResult[]}
   */
  results: SendSmsEmailOtpResult[]
}

/**
 * Attributes for sending OTP messages.
 *
 * @export
 * @interface SendOTPAttrs
 * @typedef {SendOTPAttrs}
 */
export interface SendOTPAttrs {
  /**
   * Brand name used in the OTP message.
   *
   * @type {?string}
   */
  brandName?: string
  /**
   * Communication channel used, e.g., SMS or email.
   *
   * @type {?string}
   */
  channel?: string
  /**
   * Identity used for sending the OTP.
   *
   * @type {?string}
   */
  originationIdentity?: string
  /**
   * Maximum number of OTP attempts allowed.
   *
   * @type {?number}
   */
  allowedAttempts?: number
  /**
   * Length of the OTP code.
   *
   * @type {?number}
   */
  codeLength?: number
  /**
   * Validity period of the OTP in minutes.
   *
   * @type {?number}
   */
  validityPeriod?: number
  /**
   * Recipient identity for the OTP.
   *
   * @type {?string}
   */
  destinationIdentity?: string
  /**
   * Reference identifier for tracking the OTP request.
   *
   * @type {?string}
   */
  referenceId?: string
  /**
   * Entity identifier associated with the OTP request.
   *
   * @type {?string}
   */
  entityId?: string
  /**
   * Language of the OTP message.
   *
   * @type {?string}
   */
  language?: string
  /**
   * Template identifier for the OTP message.
   *
   * @type {?string}
   */
  templateId?: string
}

/**
 * Attributes for verifying an OTP.
 *
 * @export
 * @interface VerifyOTPAttrs
 * @typedef {VerifyOTPAttrs}
 */
export interface VerifyOTPAttrs {
  /**
   * Recipient identity for the OTP.
   *
   * @type {string}
   */
  destinationIdentity: string
  /**
   * OTP code to verify.
   *
   * @type {string}
   */
  otp: string
  /**
   * Reference identifier used during OTP verification.
   *
   * @type {string}
   */
  referenceId: string
}

/**
 * Data structure for the result of OTP verification.
 *
 * @export
 * @interface VerifyOTPData
 * @typedef {VerifyOTPData}
 */
export interface VerifyOTPData {
  /**
   * Indicates whether the OTP is valid.
   *
   * @type {boolean}
   */
  valid: boolean
}

/**
 * Error mapping for customizing error messages and codes in AWS Pinpoint.
 *
 * @export
 * @interface PinpointErrorMap
 * @typedef {PinpointErrorMap}
 */
export interface PinpointErrorMap {
  /**
   * Custom message string for PinpointError instance.
   */
  message?: string
  /**
   * Custom error code string for PinpointError instance.
   */
  errorCode?: string
  /**
   * Custom HTTP status code for PinpointError instance.
   */
  statusCode?: number
}

/**
 * Substitutions for the email template.
 *
 * @export
 * @typedef {Substitutions}
 */
export type Substitutions = Record<string, number | string | undefined | null>

declare global {
  /** @ignore */
  interface Console {
    success?(...data: any[]): void
    fatal?(...data: any[]): void
  }
}
