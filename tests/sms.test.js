import { expect, describe } from '@jest/globals'
import testIf from './testif.js'
import PinpointSdk from '../src/PinpointSdk.mjs'

const pinpointSdk = new PinpointSdk()

describe('Test Pinpoint SMS', () => {
  testIf(process.env.TEST_PINPOINT_SMS_SIMPLE_PROMOTIONAL_ENABLED)('Send Simple Text Promotional SMS Success', async () => {
    const Body = 'This is a test Promotional SMS'
    const MessageType = 'PROMOTIONAL'
    const DestinationNumber = process.env.TEST_PINPOINT_SMS_TO_MOBILE

    const attrs = { Body, MessageType, DestinationNumber }
    const response = await pinpointSdk.sendSms(attrs)

    const { Result = {} } = response
    expect(Result.DeliveryStatus).toBe('SUCCESSFUL')
  })

  testIf(process.env.TEST_PINPOINT_SMS_SIMPLE_TRANSACTIONAL_ENABLED)('Send Simple Text Transactional SMS Success', async () => {
    const Body = 'This is a test Transactional SMS'
    const MessageType = 'TRANSACTIONAL'
    const DestinationNumber = process.env.TEST_PINPOINT_SMS_TO_MOBILE

    const attrs = { Body, MessageType, DestinationNumber }
    const response = await pinpointSdk.sendSms(attrs)

    const { Result = {} } = response
    expect(Result.DeliveryStatus).toBe('SUCCESSFUL')
  })

  testIf(process.env.TEST_PINPOINT_SMS_TEMPLATE_ENABLED)('Send Template SMS Success', async () => {
    const MessageType = 'PROMOTIONAL'
    const DestinationNumber = process.env.TEST_PINPOINT_SMS_TO_MOBILE
    const TemplateName = 'Test_SMS_Template'
    const TemplateVersion = '1'
    const Substitutions = { Name: 'Full Name' }

    const attrs = {
      MessageType,
      DestinationNumber,
      TemplateName,
      TemplateVersion,
      Substitutions
    }
    const response = await pinpointSdk.sendTemplatizedSms(attrs)
    const { Result = {} } = response
    expect(Result.DeliveryStatus).toBe('SUCCESSFUL')
  })
})
