import {
  PinpointClient,
  SendMessagesCommand,
  SendOTPMessageCommand,
  VerifyOTPMessageCommand,
  GetEmailTemplateCommand,
  GetSmsTemplateCommand
} from '@aws-sdk/client-pinpoint'

import PINPOINT_CONFIG from './PINPOINT_CONFIG.mjs'
import PinpointError from './PinpointError.mjs'
import templatize from './helpers/templatize.js'

const {
  CONNECTION_CONFIG: PINPOINT_CONNECTION_CONFIG,
  APPLICATION_ID: PINPOINT_APPLICATION_ID,

  SMS_ORIGINATION_NUMBER: PINPOINT_SMS_ORIGINATION_NUMBER,
  SMS_SENDER_ID: PINPOINT_SMS_SENDER_ID,

  EMAIL_FROM_ADDRESS: PINPOINT_EMAIL_FROM_ADDRESS,

  OTP_BRAND_NAME: PINPOINT_OTP_BRAND_NAME,
  OTP_ORIGINATION_IDENTITY: PINPOINT_OTP_ORIGINATION_IDENTITY,
  OTP_ALLOWED_ATTEMPTS: PINPOINT_OTP_ALLOWED_ATTEMPTS,
  OTP_CODE_LENGTH: PINPOINT_OTP_CODE_LENGTH,
  OTP_VALIDITY_PERIOD: PINPOINT_OTP_VALIDITY_PERIOD
} = PINPOINT_CONFIG

export default class PinpointSdk {
  constructor (config = {}) {
    const {
      CONNECTION_CONFIG = PINPOINT_CONNECTION_CONFIG,
      APPLICATION_ID = PINPOINT_APPLICATION_ID,

      SMS_ORIGINATION_NUMBER = PINPOINT_SMS_ORIGINATION_NUMBER,
      SMS_SENDER_ID = PINPOINT_SMS_SENDER_ID,

      EMAIL_FROM_ADDRESS = PINPOINT_EMAIL_FROM_ADDRESS,

      OTP_BRAND_NAME = PINPOINT_OTP_BRAND_NAME,
      OTP_ORIGINATION_IDENTITY = PINPOINT_OTP_ORIGINATION_IDENTITY,
      OTP_ALLOWED_ATTEMPTS = PINPOINT_OTP_ALLOWED_ATTEMPTS,
      OTP_CODE_LENGTH = PINPOINT_OTP_CODE_LENGTH,
      OTP_VALIDITY_PERIOD = PINPOINT_OTP_VALIDITY_PERIOD
    } = config

    this.client = new PinpointClient(CONNECTION_CONFIG)
    this.ApplicationId = APPLICATION_ID

    this.SmsOriginationNumber = SMS_ORIGINATION_NUMBER
    this.SmsSenderId = SMS_SENDER_ID

    this.EmailFromAddress = EMAIL_FROM_ADDRESS

    this.OtpBrandName = OTP_BRAND_NAME
    this.OtpOriginationIdentity = OTP_ORIGINATION_IDENTITY
    this.OtpAllowedAttempts = OTP_ALLOWED_ATTEMPTS
    this.OtpCodeLength = OTP_CODE_LENGTH
    this.OtpValidityPeriod = OTP_VALIDITY_PERIOD

    // Method Hard-binding
    this.sendMessages = this.sendMessages.bind(this)
    this.sendSms = this.sendSms.bind(this)
    this.sendEmail = this.sendEmail.bind(this)
    this.sendOTP = this.sendOTP.bind(this)
    this.verifyOTP = this.verifyOTP.bind(this)
    this.getEmailTemplate = this.getEmailTemplate.bind(this)
    this.getSmsTemplate = this.getSmsTemplate.bind(this)
    this.sendTemplatizedEmail = this.sendTemplatizedEmail.bind(this)
    this.sendTemplatizedEmail = this.sendTemplatizedEmail.bind(this)
  }

  async sendMessages (attrs = {}) {
    try {
      const { client, ApplicationId } = this
      const { MessageRequest } = attrs

      const params = { ApplicationId, MessageRequest }
      const command = new SendMessagesCommand(params)
      const response = await client.send(command)

      const { MessageResponse } = response
      return MessageResponse
    } catch (error) {
      const err = new PinpointError(error)
      throw err
    }
  }

  async sendSms (attrs = {}) {
    const { SmsOriginationNumber, SmsSenderId } = this
    const {
      Body,
      Keyword,
      MessageType,
      OriginationNumber = SmsOriginationNumber,
      SenderId = SmsSenderId,
      DestinationNumber = '',
      DestinationNumbers = [],
      Substitutions,
      TemplateName,
      TemplateId
    } = attrs

    const Addresses = (DestinationNumber && {
      [DestinationNumber]: { ChannelType: 'SMS' }
    }) || DestinationNumbers.reduce((addresses, DestinationNumber) => {
      addresses[DestinationNumber] = { ChannelType: 'SMS' }
      return addresses
    }, {})

    const MessageRequest = {
      MessageConfiguration: {
        SMSMessage: {
          Body,
          Keyword,
          MessageType,
          OriginationNumber,
          SenderId,
          Substitutions,
          TemplateId
        }
      },
      Addresses,
      TemplateConfiguration: TemplateName
        ? {
            SMSTemplate: { Name: TemplateName }
          }
        : undefined
    }

    const messageAttrs = { MessageRequest }
    const MessageResponse = await this.sendMessages(messageAttrs)

    const { Result, ...restProps } = MessageResponse
    const DestinationNumberResult = Result[DestinationNumber] || {}
    const data = { ...restProps, Channel: 'SMS', DestinationNumber, Result: DestinationNumberResult }

    return data
  }

  async sendEmail (attrs = {}) {
    const { EmailFromAddress } = this
    const {
      Body,
      FeedbackForwardingAddress,
      FromAddress = EmailFromAddress,
      RawEmail,
      ReplyToAddresses,
      SimpleEmail,
      ToAddress = '',
      ToAddresses = [],
      Substitutions,
      TemplateName
    } = attrs

    const Addresses = (ToAddress && {
      [ToAddress]: { ChannelType: 'EMAIL' }
    }) || ToAddresses.reduce((addresses, ToAddress) => {
      addresses[ToAddress] = { ChannelType: 'EMAIL' }
      return addresses
    }, {})

    const MessageRequest = {
      MessageConfiguration: {
        EmailMessage: {
          Body,
          FeedbackForwardingAddress,
          FromAddress,
          RawEmail,
          ReplyToAddresses,
          SimpleEmail,
          Substitutions
        }
      },
      Addresses,
      TemplateConfiguration: TemplateName
        ? {
            EmailTemplate: { Name: TemplateName }
          }
        : undefined
    }

    const messageAttrs = { MessageRequest }
    const MessageResponse = await this.sendMessages(messageAttrs)

    const { Result, ...restProps } = MessageResponse
    const ToAddressResult = Result[ToAddress] || {}
    const data = { ...restProps, Channel: 'EMAIL', ToAddress, Result: ToAddressResult }

    return data
  }

  async sendOTP (attrs = {}) {
    const {
      client,
      ApplicationId,

      OtpBrandName,
      OtpOriginationIdentity,
      OtpAllowedAttempts,
      OtpCodeLength,
      OtpValidityPeriod
    } = this

    const {
      BrandName = OtpBrandName,
      Channel = 'SMS',
      OriginationIdentity = OtpOriginationIdentity,
      AllowedAttempts = OtpAllowedAttempts,
      CodeLength = OtpCodeLength,
      ValidityPeriod = OtpValidityPeriod,

      DestinationIdentity,
      ReferenceId,
      EntityId,
      Language,
      TemplateId
    } = attrs

    const SendOTPMessageRequestParameters = {
      BrandName,
      Channel,
      DestinationIdentity,
      OriginationIdentity,
      ReferenceId,
      AllowedAttempts,
      CodeLength,
      EntityId,
      Language,
      TemplateId,
      ValidityPeriod
    }

    const params = { ApplicationId, SendOTPMessageRequestParameters }
    const command = new SendOTPMessageCommand(params)
    const response = await client.send(command)

    const { MessageResponse } = response
    const { Result, ...restProps } = MessageResponse
    const ToAddressResult = Result[DestinationIdentity] || {}
    const data = { ...restProps, DestinationIdentity, Result: ToAddressResult }

    return data
  }

  async verifyOTP (attrs = {}) {
    const { client, ApplicationId } = this
    const {
      DestinationIdentity,
      Otp,
      ReferenceId
    } = attrs

    const VerifyOTPMessageRequestParameters = {
      DestinationIdentity,
      Otp,
      ReferenceId
    }

    const params = { ApplicationId, VerifyOTPMessageRequestParameters }
    const command = new VerifyOTPMessageCommand(params)
    const response = await client.send(command)

    const { VerificationResponse } = response
    return VerificationResponse
  }

  async getEmailTemplate (attrs = {}) {
    const { client } = this
    const { TemplateName, TemplateVersion } = attrs

    const params = { TemplateName, Version: TemplateVersion }
    const command = new GetEmailTemplateCommand(params)
    const response = await client.send(command)

    const { EmailTemplateResponse } = response
    return EmailTemplateResponse
  }

  async getSmsTemplate (attrs = {}) {
    const { client } = this
    const { TemplateName, TemplateVersion } = attrs

    const params = { TemplateName, Version: TemplateVersion }
    const command = new GetSmsTemplateCommand(params)
    const response = await client.send(command)

    const { SMSTemplateResponse } = response
    return SMSTemplateResponse
  }

  async sendTemplatizedEmail (attrs = {}) {
    const {
      ToAddress,
      Substitutions = {},
      FromAddress,
      FeedbackForwardingAddress,
      ReplyToAddresses
    } = attrs

    // Get Template
    const template = await this.getEmailTemplate(attrs)
    const { DefaultSubstitutions = '', TextPart = '', HtmlPart = '', Subject = '' } = template

    // Perform Subsitutions
    const DefaultSubstitutionsObj = (DefaultSubstitutions && JSON.parse(DefaultSubstitutions)) || {}
    const substitutions = { ...DefaultSubstitutionsObj, ...Substitutions }
    const TextPartData = templatize(TextPart, substitutions)
    const HtmlPartData = templatize(HtmlPart, substitutions)
    const SubjectData = templatize(Subject, substitutions)

    // Send Email
    const SimpleEmail = {
      Subject: { Data: SubjectData },
      TextPart: { Data: TextPartData },
      HtmlPart: { Data: HtmlPartData }
    }
    const emailAttrs = {
      ToAddress,
      SimpleEmail,
      FromAddress,
      FeedbackForwardingAddress,
      ReplyToAddresses
    }
    const response = await this.sendEmail(emailAttrs)
    return response
  }

  async sendTemplatizedSms (attrs = {}) {
    const {
      MessageType,
      DestinationNumber,
      Substitutions = {},
      OriginationNumber,
      Keyword,
      SenderId
    } = attrs

    // Get Template
    const template = await this.getSmsTemplate(attrs)
    const { DefaultSubstitutions = '', Body = '' } = template

    // Perform Subsitutions
    const DefaultSubstitutionsObj = (DefaultSubstitutions && JSON.parse(DefaultSubstitutions)) || {}
    const substitutions = { ...DefaultSubstitutionsObj, ...Substitutions }
    const BodyData = templatize(Body, substitutions)

    // Send SMS
    const smsAttrs = {
      Body: BodyData,
      MessageType,
      DestinationNumber,
      OriginationNumber,
      Keyword,
      SenderId
    }
    const response = await this.sendSms(smsAttrs)
    return response
  }
}
