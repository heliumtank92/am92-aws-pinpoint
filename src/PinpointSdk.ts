import {
  PinpointClient,
  SendMessagesCommand,
  SendOTPMessageCommand,
  VerifyOTPMessageCommand,
  GetEmailTemplateCommand,
  GetSmsTemplateCommand,
  SendMessagesCommandInput,
  SendMessagesCommandOutput,
  MessageResponse,
  GetEmailTemplateCommandInput,
  GetEmailTemplateCommandOutput,
  EmailTemplateResponse,
  GetSmsTemplateCommandInput,
  GetSmsTemplateCommandOutput,
  SMSTemplateResponse,
  MessageRequest,
  MessageResult,
  DeliveryStatus,
  SendOTPMessageCommandInput,
  SendOTPMessageRequestParameters,
  SendOTPMessageCommandOutput,
  VerifyOTPMessageCommandInput,
  VerifyOTPMessageCommandOutput
} from '@aws-sdk/client-pinpoint'

import CONFIG from './CONFIG'
import { PinpointError } from './PinpointError'
import templatize from './lib/templatize'

import {
  SEND_MESSAGE_ERROR,
  SEND_EMAIL_ERROR,
  SEND_SMS_ERROR,
  GET_EMAIL_TEMPLATE_ERROR,
  GET_SMS_TEMPLATE_ERROR
} from './ERRORS'
import {
  PinpointSdkConfig,
  SendEmailAttrs,
  SendMessagesAttrs,
  SendOTPAttrs,
  SendSmsAttrs,
  SendSmsEmailData,
  SendSmsEmailOtpResult,
  VerifyOTPAttrs,
  VerifyOTPData
} from './TYPES'

/**
 * Provides methods to interact with AWS Pinpoint for sending messages, emails, SMS, and OTPs.
 *
 * @export
 * @class PinpointSdk
 * @typedef {PinpointSdk}
 */
export class PinpointSdk {
  /**
   * Configuration for the Pinpoint SDK instance.
   *
   * @type {PinpointSdkConfig}
   */
  config: PinpointSdkConfig
  /**
   * AWS Pinpoint client used to send requests to the AWS service.
   *
   * @type {PinpointClient}
   */
  client: PinpointClient
  /**
   * Application ID used with AWS Pinpoint to identify the project.
   *
   * @type {string}
   */
  ApplicationId: string

  /**
   * Constructs a new instance of the PinpointSdk class, initializing configuration and AWS client.
   *
   * @constructor
   * @param {Partial<PinpointSdkConfig>} [config={}]
   */
  constructor(config: Partial<PinpointSdkConfig> = {}) {
    this.config = { ...CONFIG, ...config }
    const { CONNECTION_CONFIG, APPLICATION_ID } = this.config

    this.client = new PinpointClient(CONNECTION_CONFIG)
    this.ApplicationId = APPLICATION_ID

    // Method Hard-binding
    this.sendMessages = this.sendMessages.bind(this)
    this.sendEmail = this.sendEmail.bind(this)
    this.sendSms = this.sendSms.bind(this)
    this.sendOTP = this.sendOTP.bind(this)
    this.verifyOTP = this.verifyOTP.bind(this)
    this.getSmsTemplate = this.getSmsTemplate.bind(this)
    this.getEmailTemplate = this.getEmailTemplate.bind(this)
  }

  /**
   * Sends a generic message using AWS Pinpoint. This method abstracts the complexity of the AWS SDK.
   *
   * @async
   * @param {SendMessagesAttrs} attrs
   * @returns {Promise<MessageResponse | undefined>}
   */
  async sendMessages(
    attrs: SendMessagesAttrs
  ): Promise<MessageResponse | undefined> {
    try {
      const MessageResponse = await this.#_sendMessages(attrs)
      return MessageResponse
    } catch (error) {
      const err = new PinpointError(error, SEND_MESSAGE_ERROR)
      throw err
    }
  }

  /**
   * Sends an email using AWS Pinpoint. This method handles template fetching and substitution.
   *
   * @async
   * @param {SendEmailAttrs} [attrs={}]
   * @returns {Promise<SendSmsEmailData>}
   */
  async sendEmail(attrs: SendEmailAttrs = {}): Promise<SendSmsEmailData> {
    const { EMAIL_FROM_ADDRESS } = this.config
    const ChannelType = 'EMAIL'
    const {
      body,
      feedbackForwardingAddress,
      fromAddress = EMAIL_FROM_ADDRESS,
      rawEmail,
      simpleEmail = {},
      replyToAddresses,
      toAddresses = [],
      emailTemplateName,
      emailTemplateVersion,
      substitutions = {}
    } = attrs

    // Handle Addresses
    const Addresses = toAddresses.reduce(
      (
        addresses: { [key: string]: { ChannelType: string } },
        ToAddress: string
      ) => {
        addresses[ToAddress] = { ChannelType }
        return addresses
      },
      {}
    )

    // Handle SimpleEmail if Template Provided
    let SimpleEmail

    if (emailTemplateName && emailTemplateVersion) {
      // Get Template
      const template = await this.getEmailTemplate(attrs)
      const {
        DefaultSubstitutions = '',
        TextPart = '',
        HtmlPart = '',
        Subject = ''
      } = template || {}

      // Perform Subsitutions
      const DefaultSubstitutionsObj =
        (DefaultSubstitutions && JSON.parse(DefaultSubstitutions)) || {}
      const Substitutions = { ...DefaultSubstitutionsObj, ...substitutions }

      // Build SimpleEmail
      SimpleEmail = {
        Subject: { Data: templatize(Subject, Substitutions) },
        TextPart: { Data: templatize(TextPart, Substitutions) },
        HtmlPart: { Data: templatize(HtmlPart, Substitutions) }
      }
    } else {
      SimpleEmail = {
        Subject: { Data: simpleEmail.subject?.data || '' },
        TextPart: { Data: simpleEmail.textPart?.data || '' },
        HtmlPart: { Data: simpleEmail.htmlPart?.data || '' }
      }
    }

    // Build MessageRequest
    const messageRequest: MessageRequest = {
      MessageConfiguration: {
        EmailMessage: {
          Body: body,
          FeedbackForwardingAddress: feedbackForwardingAddress || undefined,
          FromAddress: fromAddress,
          RawEmail: rawEmail,
          ReplyToAddresses: replyToAddresses,
          SimpleEmail
        }
      },
      Addresses
    }

    try {
      // Send Email
      const messageAttrs = { MessageRequest: messageRequest }
      const MessageResponse = await this.#_sendMessages(messageAttrs)

      // Build Response Data
      const { RequestId = '', Result = {} } = MessageResponse || {}
      const results = _buildResults(RequestId, Result, ChannelType)
      return { results }
    } catch (error) {
      console.log(error)
      throw new PinpointError(error, SEND_EMAIL_ERROR)
    }
  }

  /**
   * Sends an SMS using AWS Pinpoint. This method handles template fetching and substitution for SMS content.
   *
   * @async
   * @param {SendSmsAttrs} [attrs={}]
   * @returns {Promise<SendSmsEmailData>}
   */
  async sendSms(attrs: SendSmsAttrs = {}): Promise<SendSmsEmailData> {
    const { SMS_ORIGINATION_NUMBER, SMS_SENDER_ID } = this.config
    const ChannelType = 'SMS'
    const {
      body = '',
      keyword,
      messageType,
      originationNumber = SMS_ORIGINATION_NUMBER,
      senderId = SMS_SENDER_ID,
      destinationNumbers = [],
      smsTemplateName,
      smsTemplateVersion,
      substitutions = {}
    } = attrs

    // Handle Addresses
    const Addresses = destinationNumbers.reduce(
      (
        addresses: { [key: string]: { ChannelType: string } },
        DestinationNumber: string
      ) => {
        addresses[DestinationNumber] = { ChannelType }
        return addresses
      },
      {}
    )

    // Handle SimpleEmail if Template Provided
    let Body = body
    if (smsTemplateName && smsTemplateVersion) {
      // Get Template
      const template = await this.getSmsTemplate(attrs)
      const { DefaultSubstitutions = '', Body: TemplateBody = '' } =
        template || {}

      // Perform Subsitutions
      const DefaultSubstitutionsObj =
        (DefaultSubstitutions && JSON.parse(DefaultSubstitutions)) || {}
      const Substitutions = { ...DefaultSubstitutionsObj, ...substitutions }
      Body = templatize(TemplateBody, Substitutions)
    }

    // Build MessageRequest
    const messageRequest: MessageRequest = {
      MessageConfiguration: {
        SMSMessage: {
          Body,
          Keyword: keyword,
          MessageType: messageType,
          OriginationNumber: originationNumber,
          SenderId: senderId
        }
      },
      Addresses
    }

    try {
      // Send SMS
      const messageAttrs = { MessageRequest: messageRequest }
      const MessageResponse = await this.#_sendMessages(messageAttrs)

      // Build Response Data
      const { RequestId = '', Result = {} } = MessageResponse || {}
      const results = _buildResults(RequestId, Result, ChannelType)
      return { results }
    } catch (error) {
      throw new PinpointError(error, SEND_SMS_ERROR)
    }
  }

  /**
   * Sends a One-Time Password (OTP) using AWS Pinpoint. This method configures the OTP parameters and sends the request.
   *
   * @async
   * @param {SendOTPAttrs} [attrs={}]
   * @returns {Promise<SendSmsEmailOtpResult | undefined>}
   */
  async sendOTP(
    attrs: SendOTPAttrs = {}
  ): Promise<SendSmsEmailOtpResult | undefined> {
    const { client, ApplicationId } = this
    const {
      OTP_BRAND_NAME,
      OTP_ORIGINATION_IDENTITY,
      OTP_ALLOWED_ATTEMPTS,
      OTP_CODE_LENGTH,
      OTP_VALIDITY_PERIOD
    } = this.config

    const {
      brandName = OTP_BRAND_NAME,
      channel = 'SMS',
      originationIdentity = OTP_ORIGINATION_IDENTITY,
      allowedAttempts = OTP_ALLOWED_ATTEMPTS,
      codeLength = OTP_CODE_LENGTH,
      validityPeriod = OTP_VALIDITY_PERIOD,

      destinationIdentity,
      referenceId,
      entityId,
      language,
      templateId
    } = attrs

    const sendOTPMessageRequestParameters: SendOTPMessageRequestParameters = {
      BrandName: brandName,
      Channel: channel,
      DestinationIdentity: destinationIdentity,
      OriginationIdentity: originationIdentity,
      ReferenceId: referenceId,
      AllowedAttempts: allowedAttempts,
      CodeLength: codeLength,
      EntityId: entityId,
      Language: language,
      TemplateId: templateId,
      ValidityPeriod: validityPeriod
    }

    const params: SendOTPMessageCommandInput = {
      ApplicationId,
      SendOTPMessageRequestParameters: sendOTPMessageRequestParameters
    }
    const command = new SendOTPMessageCommand(params)
    const response: SendOTPMessageCommandOutput = await client.send(command)

    const { MessageResponse } = response || {}
    const { RequestId = '', Result = {} } = MessageResponse || {}
    const results = _buildResults(RequestId, Result)
    return results[0]
  }

  /**
   * Verifies a One-Time Password (OTP) using AWS Pinpoint. This method sends the OTP verification request and returns the result.
   *
   * @async
   * @param {VerifyOTPAttrs} attrs
   * @returns {Promise<VerifyOTPData>}
   */
  async verifyOTP(attrs: VerifyOTPAttrs): Promise<VerifyOTPData> {
    const { client, ApplicationId } = this
    const { destinationIdentity, otp, referenceId } = attrs

    const VerifyOTPMessageRequestParameters = {
      DestinationIdentity: destinationIdentity,
      Otp: otp,
      ReferenceId: referenceId
    }

    const params: VerifyOTPMessageCommandInput = {
      ApplicationId,
      VerifyOTPMessageRequestParameters
    }
    const command = new VerifyOTPMessageCommand(params)
    const response: VerifyOTPMessageCommandOutput = await client.send(command)

    const { VerificationResponse: { Valid = false } = {} } = response
    return { valid: Valid }
  }

  /**
   * Fetches an email template from AWS Pinpoint and returns the template details. This method is used for email personalization.
   *
   * @async
   * @param {*} attrs
   * @returns {Promise<EmailTemplateResponse | undefined>}
   */
  async getEmailTemplate(
    attrs: any
  ): Promise<EmailTemplateResponse | undefined> {
    try {
      const { client } = this
      const { emailTemplateName, emailTemplateVersion } = attrs

      const params: GetEmailTemplateCommandInput = {
        TemplateName: emailTemplateName,
        Version: emailTemplateVersion
      }
      const command = new GetEmailTemplateCommand(params)
      const response: GetEmailTemplateCommandOutput = await client.send(command)

      const { EmailTemplateResponse } = response
      return EmailTemplateResponse
    } catch (error) {
      const err = new PinpointError(error, GET_EMAIL_TEMPLATE_ERROR)
      throw err
    }
  }

  /**
   * Fetches an SMS template from AWS Pinpoint and returns the template details. This method is used for SMS content personalization.
   *
   * @async
   * @param {*} attrs
   * @returns {Promise<SMSTemplateResponse | undefined>}
   */
  async getSmsTemplate(attrs: any): Promise<SMSTemplateResponse | undefined> {
    try {
      const { client } = this
      const { smsTemplateName, smsTemplateVersion } = attrs

      const params: GetSmsTemplateCommandInput = {
        TemplateName: smsTemplateName,
        Version: smsTemplateVersion
      }
      const command = new GetSmsTemplateCommand(params)
      const response: GetSmsTemplateCommandOutput = await client.send(command)

      const { SMSTemplateResponse } = response
      return SMSTemplateResponse
    } catch (error) {
      const err = new PinpointError(error, GET_SMS_TEMPLATE_ERROR)
      throw err
    }
  }

  /**
   * Internal method to send messages using AWS Pinpoint. This method is used by other public methods to send different types of messages.
   *
   * @async
   * @param {SendMessagesAttrs} attrs
   * @returns {Promise<MessageResponse | undefined>}
   */
  async #_sendMessages(
    attrs: SendMessagesAttrs
  ): Promise<MessageResponse | undefined> {
    const { client, ApplicationId } = this
    const { MessageRequest } = attrs

    const params: SendMessagesCommandInput = { ApplicationId, MessageRequest }
    const command = new SendMessagesCommand(params)
    const response: SendMessagesCommandOutput = await client.send(command)

    const { MessageResponse } = response
    return MessageResponse
  }
}

/** @ignore */
function _buildResults(
  requestId: string = '',
  Result: Record<string, MessageResult>,
  channelType: string = ''
): SendSmsEmailOtpResult[] {
  return Object.keys(Result).map(Address => {
    const AddressResult = Result[Address]
    const {
      MessageId: messageId = '',
      DeliveryStatus: deliveryStatus = 'UNKNOWN_FAILURE',
      StatusCode: statusCode = 0,
      StatusMessage: statusMessage = '',
      UpdatedToken: updatedToken = ''
    } = AddressResult

    return {
      requestId,
      messageId,
      channelType,
      address: Address,
      deliveryStatus: deliveryStatus as DeliveryStatus,
      statusCode,
      statusMessage,
      updatedToken
    }
  })
}
