import { expect, describe } from '@jest/globals'
import testIf from './testif.js'
import PinpointSdk from '../dist/PinpointSdk.js'

const pinpointSdk = new PinpointSdk()

describe('Test OTP SMS', () => {
  const ReferenceId = 'test-otp-sms'
  const DestinationIdentity = process.env.TEST_PINPOINT_OTP_DESTINATION_IDENTITY

  testIf(process.env.TEST_PINPOINT_OTP_GENERATE_ENABLED)('Send OTP SMS Success', async () => {
    const attrs = { ReferenceId, DestinationIdentity }
    const response = await pinpointSdk.sendOTP(attrs)

    const { Result = {} } = response
    expect(Result.DeliveryStatus).toBe('SUCCESSFUL')
  })

  testIf(process.env.TEST_PINPOINT_OTP_VALIDATE_ENABLED)('Verify OTP SMS Success', async () => {
    const Otp = process.env.TEST_PINPOINT_OTP_OTP_VALUE
    const attrs = { DestinationIdentity, Otp, ReferenceId }
    const response = await pinpointSdk.verifyOTP(attrs)

    const { Valid = {} } = response
    expect(Valid).toBe(true)
  })
})
