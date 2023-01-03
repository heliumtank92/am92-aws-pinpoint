import { expect, describe } from '@jest/globals'
import testIf from './testif.js'

import PinpointSdk from '../dist/PinpointSdk.js'

const pinpointSdk = new PinpointSdk()

describe('Test Pinpoint Email', () => {
  testIf(process.env.TEST_PINPOINT_EMAIL_SIMPLE_ENABLED)('Send Simple Text Email Success', async () => {
    const ToAddress = process.env.TEST_PINPOINT_EMAIL_TO_ADDRESS
    const SimpleEmail = {
      Subject: { Data: 'Test Email' },
      TextPart: { Data: 'This is a test Email' }
    }
    const attrs = { ToAddress, SimpleEmail }
    const response = await pinpointSdk.sendEmail(attrs)
    const { Result = {} } = response
    expect(Result.DeliveryStatus).toBe('SUCCESSFUL')
  })

  testIf(process.env.TEST_PINPOINT_EMAIL_TEMPLATE_ENABLED)('Send Template Email Success', async () => {
    const ToAddress = process.env.TEST_PINPOINT_EMAIL_TO_ADDRESS
    const TemplateName = 'Test_Email_Template'
    const TemplateVersion = '1'
    const Substitutions = { Name: 'Full Name' }

    const attrs = { ToAddress, TemplateName, TemplateVersion, Substitutions }
    const response = await pinpointSdk.sendTemplatizedEmail(attrs)
    const { Result = {} } = response
    expect(Result.DeliveryStatus).toBe('SUCCESSFUL')
  })
})
