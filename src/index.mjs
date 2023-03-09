import {
  PinpointClient,
  SendMessagesCommand,
  SendOTPMessageCommand,
  VerifyOTPMessageCommand,
  GetEmailTemplateCommand,
  GetSmsTemplateCommand
} from '@aws-sdk/client-pinpoint'

import CONFIG from './CONFIG.mjs'
import PinpointError from './PinpointError.mjs'
import templatize from './lib/templatize.js'

import {
  SEND_MESSAGE_ERROR,
  SEND_EMAIL_ERROR,
  SEND_SMS_ERROR,
  GET_EMAIL_TEMPLATE_ERROR,
  GET_SMS_TEMPLATE_ERROR
} from './ERRORS.mjs'

export default class PinpointSdk {
  constructor (config = {}) {
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
  }

  async sendMessages (attrs = {}) {
    try {
      this.#_sendMessages(attrs)
    } catch (error) {
      const err = new PinpointError(error, SEND_MESSAGE_ERROR)
      throw err
    }
  }

  async sendEmail (attrs = {}) {
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
    const Addresses = toAddresses.reduce((addresses, ToAddress) => {
      addresses[ToAddress] = { ChannelType }
      return addresses
    }, {})

    // Handle SimpleEmail if Template Provided
    let SimpleEmail
    if (emailTemplateName && emailTemplateVersion) {
      // Get Template
      const template = await this.#_getEmailTemplate(attrs)
      const { DefaultSubstitutions = '', TextPart = '', HtmlPart = '', Subject = '' } = template

      // Perform Subsitutions
      const DefaultSubstitutionsObj = (DefaultSubstitutions && JSON.parse(DefaultSubstitutions)) || {}
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
    const MessageRequest = {
      MessageConfiguration: {
        EmailMessage: {
          body,
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
      const messageAttrs = { MessageRequest }
      const MessageResponse = await this.#_sendMessages(messageAttrs)

      // Build Response Data
      const { RequestId, Result } = MessageResponse
      const results = _buildResults(RequestId, Result, ChannelType)
      return { results }
    } catch (error) {
      console.log(error)
      throw new PinpointError(error, SEND_EMAIL_ERROR)
    }
  }

  async sendSms (attrs = {}) {
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
    const Addresses = destinationNumbers.reduce((addresses, DestinationNumber) => {
      addresses[DestinationNumber] = { ChannelType }
      return addresses
    }, {})

    // Handle SimpleEmail if Template Provided
    let Body = body
    if (smsTemplateName && smsTemplateVersion) {
      // Get Template
      const template = await this.#_getSmsTemplate(attrs)
      const { DefaultSubstitutions = '', Body: TemplateBody = '' } = template

      // Perform Subsitutions
      const DefaultSubstitutionsObj = (DefaultSubstitutions && JSON.parse(DefaultSubstitutions)) || {}
      const Substitutions = { ...DefaultSubstitutionsObj, ...substitutions }
      Body = templatize(TemplateBody, Substitutions)
    }

    // Build MessageRequest
    const MessageRequest = {
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
      const messageAttrs = { MessageRequest }
      const MessageResponse = await this.#_sendMessages(messageAttrs)

      // Build Response Data
      const { RequestId, Result } = MessageResponse
      const results = _buildResults(RequestId, Result, ChannelType)
      return { results }
    } catch (error) {
      throw new PinpointError(error, SEND_SMS_ERROR)
    }
  }

  async sendOTP (attrs = {}) {
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

    const SendOTPMessageRequestParameters = {
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

    const params = { ApplicationId, SendOTPMessageRequestParameters }
    const command = new SendOTPMessageCommand(params)
    const response = await client.send(command)

    const { MessageResponse } = response
    const { RequestId, Result } = MessageResponse
    const results = _buildResults(RequestId, Result)
    return { result: results[0] }
  }

  async verifyOTP (attrs = {}) {
    const { client, ApplicationId } = this
    const {
      destinationIdentity,
      otp,
      referenceId
    } = attrs

    const VerifyOTPMessageRequestParameters = {
      DestinationIdentity: destinationIdentity,
      Otp: otp,
      ReferenceId: referenceId
    }

    const params = { ApplicationId, VerifyOTPMessageRequestParameters }
    const command = new VerifyOTPMessageCommand(params)
    const response = await client.send(command)

    const { VerificationResponse: { Valid } } = response
    return { valid: Valid }
  }

  async #_sendMessages (attrs = {}) {
    const { client, ApplicationId } = this
    const { MessageRequest } = attrs

    const params = { ApplicationId, MessageRequest }
    const command = new SendMessagesCommand(params)
    const response = await client.send(command)

    const { MessageResponse } = response
    return MessageResponse
  }

  async #_getEmailTemplate (attrs = {}) {
    try {
      const { client } = this
      const { emailTemplateName, emailTemplateVersion } = attrs

      const params = { TemplateName: emailTemplateName, Version: emailTemplateVersion }
      const command = new GetEmailTemplateCommand(params)
      const response = await client.send(command)

      const { EmailTemplateResponse } = response
      return EmailTemplateResponse
    } catch (error) {
      const err = new PinpointError(error, GET_EMAIL_TEMPLATE_ERROR)
      throw err
    }
  }

  async #_getSmsTemplate (attrs = {}) {
    try {
      const { client } = this
      const { smsTemplateName, smsTemplateVersion } = attrs

      const params = { TemplateName: smsTemplateName, Version: smsTemplateVersion }
      const command = new GetSmsTemplateCommand(params)
      const response = await client.send(command)

      const { SMSTemplateResponse } = response
      return SMSTemplateResponse
    } catch (error) {
      const err = new PinpointError(error, GET_SMS_TEMPLATE_ERROR)
      throw err
    }
  }
}

function _buildResults (requestId, Result = {}, channelType) {
  return Object.keys(Result).map(Address => {
    const AddressResult = Result[Address]
    const { MessageId, DeliveryStatus, StatusCode, StatusMessage, UpdatedToken } = AddressResult
    return {
      requestId,
      messageId: MessageId,
      channelType,
      address: Address,
      deliveryStatus: DeliveryStatus,
      statusCode: StatusCode,
      message: StatusMessage,
      updatedToken: UpdatedToken
    }
  })
}
