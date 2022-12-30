const {
  PINPOINT_API_VERSION = '2016-12-01',
  PINPOINT_REGION = 'ap-south-1',

  PINPOINT_ENABLED = 'false',
  PINPOINT_APPLICATION_ID = '',

  PINPOINT_SMS_ORIGINATION_NUMBER = '',
  PINPOINT_SMS_SENDER_ID = '',

  PINPOINT_EMAIL_FROM_ADDRESS = '',

  PINPOINT_OTP_BRAND_NAME = '',
  PINPOINT_OTP_ORIGINATION_IDENTITY = '',
  PINPOINT_OTP_ALLOWED_ATTEMPTS = '3',
  PINPOINT_OTP_CODE_LENGTH = '6',
  PINPOINT_OTP_VALIDITY_PERIOD_IN_MIN = '5'
} = process.env

const ENABLED = PINPOINT_ENABLED === 'true'

const REQUIRED_CONFIG = []
const MISSING_CONFIGS = []
const INVALID_CONFIGS = []
const INT_CONFIGS = {
  PINPOINT_OTP_ALLOWED_ATTEMPTS,
  PINPOINT_OTP_CODE_LENGTH,
  PINPOINT_OTP_VALIDITY_PERIOD_IN_MIN
}

if (ENABLED) {
  REQUIRED_CONFIG.puish('PINPOINT_APPLICATION_ID')
}

REQUIRED_CONFIG.forEach(function (key) {
  if (!process.env[key]) {
    MISSING_CONFIGS.push(key)
  }
})

if (MISSING_CONFIGS.length) {
  console.error(`Missing Pinpoint Configs: ${MISSING_CONFIGS}`)
  process.exit(1)
}

// Handle Invalid Configs
Object.keys(INT_CONFIGS).forEach(key => {
  const value = INT_CONFIGS[key]
  INT_CONFIGS[key] = parseInt(value, 10)

  if (isNaN(INT_CONFIGS[key])) {
    INVALID_CONFIGS.push(`Invalid Pinpoint Config ${key}. Must be a valid Number: ${value}`)
  }
})

if (INVALID_CONFIGS.length) {
  INVALID_CONFIGS.map(console.error)
  process.exit(1)
}

const CONNECTION_CONFIG = {
  region: PINPOINT_REGION,
  apiVersion: PINPOINT_API_VERSION
}

const CONFIG = {
  CONNECTION_CONFIG,
  APPLICATION_ID: PINPOINT_APPLICATION_ID,

  SMS_ORIGINATION_NUMBER: PINPOINT_SMS_ORIGINATION_NUMBER,
  SMS_SENDER_ID: PINPOINT_SMS_SENDER_ID,

  EMAIL_FROM_ADDRESS: PINPOINT_EMAIL_FROM_ADDRESS,

  OTP_BRAND_NAME: PINPOINT_OTP_BRAND_NAME,
  OTP_ORIGINATION_IDENTITY: PINPOINT_OTP_ORIGINATION_IDENTITY,
  OTP_ALLOWED_ATTEMPTS: INT_CONFIGS[PINPOINT_OTP_ALLOWED_ATTEMPTS],
  OTP_CODE_LENGTH: INT_CONFIGS[PINPOINT_OTP_CODE_LENGTH],
  OTP_VALIDITY_PERIOD: INT_CONFIGS[PINPOINT_OTP_VALIDITY_PERIOD_IN_MIN]
}

export default CONFIG
