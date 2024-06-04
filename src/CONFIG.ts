import {
  DEFAULT_CONFIG,
  IntConfigKeys,
  IntConfigs,
  PinpointSdkConfig
} from './TYPES'

/** @ignore */
const {
  npm_package_name: pkgName = '',
  npm_package_version: pkgVersion = '',
  PINPOINT_API_VERSION = '',
  PINPOINT_REGION = '',
  PINPOINT_ENABLED = 'false',
  PINPOINT_APPLICATION_ID = '',
  PINPOINT_SMS_ORIGINATION_NUMBER = '',
  PINPOINT_SMS_SENDER_ID = '',
  PINPOINT_EMAIL_FROM_ADDRESS = '',
  PINPOINT_OTP_BRAND_NAME = '',
  PINPOINT_OTP_ORIGINATION_IDENTITY = '',
  PINPOINT_OTP_ALLOWED_ATTEMPTS = '',
  PINPOINT_OTP_CODE_LENGTH = '',
  PINPOINT_OTP_VALIDITY_PERIOD_IN_MIN = ''
} = process.env

/** @ignore */
export const SERVICE = `${pkgName}@${pkgVersion}`

/** @ignore */
const REQUIRED_CONFIG: string[] = []
/** @ignore */
const MISSING_CONFIGS: string[] = []

/** @ignore */
const ENABLED: boolean = PINPOINT_ENABLED === 'true'

/** @ignore */
const INT_ENV: IntConfigs<string> = {
  PINPOINT_OTP_ALLOWED_ATTEMPTS,
  PINPOINT_OTP_CODE_LENGTH,
  PINPOINT_OTP_VALIDITY_PERIOD_IN_MIN
}

/** @ignore */
const INT_CONFIG: IntConfigs<number> = {}

/** @ignore */
const INVALID_INT_CONFIG: IntConfigs<string> = {}

if (ENABLED) {
  REQUIRED_CONFIG.push('PINPOINT_APPLICATION_ID')
}

REQUIRED_CONFIG.forEach((key: string) => {
  if (!process.env[key]) {
    MISSING_CONFIGS.push(key)
  }
})

if (MISSING_CONFIGS.length) {
  const logFunc = console.fatal || console.error
  logFunc(
    `[${SERVICE} AwsPinpoint] AwsPinpoint Config Missing: ${MISSING_CONFIGS.join(
      ', '
    )}`
  )
  process.exit(1)
}

Object.keys(INT_ENV).forEach(key => {
  const configKey = key as IntConfigKeys
  const value = INT_ENV[configKey] || ''
  const intValue = parseInt(value, 10)

  if (isNaN(intValue)) {
    INVALID_INT_CONFIG[configKey] = value
  } else {
    INT_CONFIG[configKey] = intValue
  }
})

if (Object.keys(INVALID_INT_CONFIG).length) {
  const logFunc = console.fatal || console.error
  logFunc(
    `[${SERVICE} AwsPinpoint] Invalid AwsPinpoint Integer Configs:`,
    INVALID_INT_CONFIG
  )
  process.exit(1)
}

/** @ignore */
const CONFIG: PinpointSdkConfig = {
  CONNECTION_CONFIG: {
    region: PINPOINT_REGION || DEFAULT_CONFIG.CONNECTION_CONFIG.region,
    apiVersion:
      PINPOINT_API_VERSION || DEFAULT_CONFIG.CONNECTION_CONFIG.apiVersion
  },
  APPLICATION_ID: PINPOINT_APPLICATION_ID,
  SMS_ORIGINATION_NUMBER: PINPOINT_SMS_ORIGINATION_NUMBER,
  SMS_SENDER_ID: PINPOINT_SMS_SENDER_ID,
  EMAIL_FROM_ADDRESS: PINPOINT_EMAIL_FROM_ADDRESS,
  OTP_BRAND_NAME: PINPOINT_OTP_BRAND_NAME,
  OTP_ORIGINATION_IDENTITY: PINPOINT_OTP_ORIGINATION_IDENTITY,
  OTP_ALLOWED_ATTEMPTS:
    INT_CONFIG.PINPOINT_OTP_ALLOWED_ATTEMPTS ||
    DEFAULT_CONFIG.OTP_ALLOWED_ATTEMPTS,
  OTP_CODE_LENGTH:
    INT_CONFIG.PINPOINT_OTP_CODE_LENGTH || DEFAULT_CONFIG.OTP_CODE_LENGTH,
  OTP_VALIDITY_PERIOD:
    INT_CONFIG.PINPOINT_OTP_VALIDITY_PERIOD_IN_MIN ||
    DEFAULT_CONFIG.OTP_VALIDITY_PERIOD
}

export default CONFIG
