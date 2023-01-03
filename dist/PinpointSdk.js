"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _clientPinpoint = require("@aws-sdk/client-pinpoint");
var _CONFIG = _interopRequireDefault(require("./CONFIG.js"));
var _PinpointError = _interopRequireDefault(require("./PinpointError.js"));
var _templatize = _interopRequireDefault(require("./helpers/templatize.js"));
var _excluded = ["Result"],
  _excluded2 = ["Result"],
  _excluded3 = ["Result"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var {
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
} = _CONFIG.default;
class PinpointSdk {
  constructor() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var {
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
    } = config;
    this.client = new _clientPinpoint.PinpointClient(CONNECTION_CONFIG);
    this.ApplicationId = APPLICATION_ID;
    this.SmsOriginationNumber = SMS_ORIGINATION_NUMBER;
    this.SmsSenderId = SMS_SENDER_ID;
    this.EmailFromAddress = EMAIL_FROM_ADDRESS;
    this.OtpBrandName = OTP_BRAND_NAME;
    this.OtpOriginationIdentity = OTP_ORIGINATION_IDENTITY;
    this.OtpAllowedAttempts = OTP_ALLOWED_ATTEMPTS;
    this.OtpCodeLength = OTP_CODE_LENGTH;
    this.OtpValidityPeriod = OTP_VALIDITY_PERIOD;

    // Method Hard-binding
    this.sendMessages = this.sendMessages.bind(this);
    this.sendSms = this.sendSms.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.sendOTP = this.sendOTP.bind(this);
    this.verifyOTP = this.verifyOTP.bind(this);
    this.getEmailTemplate = this.getEmailTemplate.bind(this);
    this.getSmsTemplate = this.getSmsTemplate.bind(this);
    this.sendTemplatizedEmail = this.sendTemplatizedEmail.bind(this);
    this.sendTemplatizedEmail = this.sendTemplatizedEmail.bind(this);
  }
  sendMessages() {
    var _arguments = arguments,
      _this = this;
    return _asyncToGenerator(function* () {
      var attrs = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : {};
      try {
        var {
          client,
          ApplicationId
        } = _this;
        var {
          MessageRequest
        } = attrs;
        var params = {
          ApplicationId,
          MessageRequest
        };
        var command = new _clientPinpoint.SendMessagesCommand(params);
        var response = yield client.send(command);
        var {
          MessageResponse
        } = response;
        return MessageResponse;
      } catch (error) {
        var err = new _PinpointError.default(error);
        throw err;
      }
    })();
  }
  sendSms() {
    var _arguments2 = arguments,
      _this2 = this;
    return _asyncToGenerator(function* () {
      var attrs = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : {};
      var {
        SmsOriginationNumber,
        SmsSenderId
      } = _this2;
      var {
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
      } = attrs;
      var Addresses = DestinationNumber && {
        [DestinationNumber]: {
          ChannelType: 'SMS'
        }
      } || DestinationNumbers.reduce((addresses, DestinationNumber) => {
        addresses[DestinationNumber] = {
          ChannelType: 'SMS'
        };
        return addresses;
      }, {});
      var MessageRequest = {
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
        TemplateConfiguration: TemplateName ? {
          SMSTemplate: {
            Name: TemplateName
          }
        } : undefined
      };
      var messageAttrs = {
        MessageRequest
      };
      var MessageResponse = yield _this2.sendMessages(messageAttrs);
      var {
          Result
        } = MessageResponse,
        restProps = _objectWithoutProperties(MessageResponse, _excluded);
      var DestinationNumberResult = Result[DestinationNumber] || {};
      var data = _objectSpread(_objectSpread({}, restProps), {}, {
        Channel: 'SMS',
        DestinationNumber,
        Result: DestinationNumberResult
      });
      return data;
    })();
  }
  sendEmail() {
    var _arguments3 = arguments,
      _this3 = this;
    return _asyncToGenerator(function* () {
      var attrs = _arguments3.length > 0 && _arguments3[0] !== undefined ? _arguments3[0] : {};
      var {
        EmailFromAddress
      } = _this3;
      var {
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
      } = attrs;
      var Addresses = ToAddress && {
        [ToAddress]: {
          ChannelType: 'EMAIL'
        }
      } || ToAddresses.reduce((addresses, ToAddress) => {
        addresses[ToAddress] = {
          ChannelType: 'EMAIL'
        };
        return addresses;
      }, {});
      var MessageRequest = {
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
        TemplateConfiguration: TemplateName ? {
          EmailTemplate: {
            Name: TemplateName
          }
        } : undefined
      };
      var messageAttrs = {
        MessageRequest
      };
      var MessageResponse = yield _this3.sendMessages(messageAttrs);
      var {
          Result
        } = MessageResponse,
        restProps = _objectWithoutProperties(MessageResponse, _excluded2);
      var ToAddressResult = Result[ToAddress] || {};
      var data = _objectSpread(_objectSpread({}, restProps), {}, {
        Channel: 'EMAIL',
        ToAddress,
        Result: ToAddressResult
      });
      return data;
    })();
  }
  sendOTP() {
    var _arguments4 = arguments,
      _this4 = this;
    return _asyncToGenerator(function* () {
      var attrs = _arguments4.length > 0 && _arguments4[0] !== undefined ? _arguments4[0] : {};
      var {
        client,
        ApplicationId,
        OtpBrandName,
        OtpOriginationIdentity,
        OtpAllowedAttempts,
        OtpCodeLength,
        OtpValidityPeriod
      } = _this4;
      var {
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
      } = attrs;
      var SendOTPMessageRequestParameters = {
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
      };
      var params = {
        ApplicationId,
        SendOTPMessageRequestParameters
      };
      var command = new _clientPinpoint.SendOTPMessageCommand(params);
      var response = yield client.send(command);
      var {
        MessageResponse
      } = response;
      var {
          Result
        } = MessageResponse,
        restProps = _objectWithoutProperties(MessageResponse, _excluded3);
      var ToAddressResult = Result[DestinationIdentity] || {};
      var data = _objectSpread(_objectSpread({}, restProps), {}, {
        DestinationIdentity,
        Result: ToAddressResult
      });
      return data;
    })();
  }
  verifyOTP() {
    var _arguments5 = arguments,
      _this5 = this;
    return _asyncToGenerator(function* () {
      var attrs = _arguments5.length > 0 && _arguments5[0] !== undefined ? _arguments5[0] : {};
      var {
        client,
        ApplicationId
      } = _this5;
      var {
        DestinationIdentity,
        Otp,
        ReferenceId
      } = attrs;
      var VerifyOTPMessageRequestParameters = {
        DestinationIdentity,
        Otp,
        ReferenceId
      };
      var params = {
        ApplicationId,
        VerifyOTPMessageRequestParameters
      };
      var command = new _clientPinpoint.VerifyOTPMessageCommand(params);
      var response = yield client.send(command);
      var {
        VerificationResponse
      } = response;
      return VerificationResponse;
    })();
  }
  getEmailTemplate() {
    var _arguments6 = arguments,
      _this6 = this;
    return _asyncToGenerator(function* () {
      var attrs = _arguments6.length > 0 && _arguments6[0] !== undefined ? _arguments6[0] : {};
      var {
        client
      } = _this6;
      var {
        TemplateName,
        TemplateVersion
      } = attrs;
      var params = {
        TemplateName,
        Version: TemplateVersion
      };
      var command = new _clientPinpoint.GetEmailTemplateCommand(params);
      var response = yield client.send(command);
      var {
        EmailTemplateResponse
      } = response;
      return EmailTemplateResponse;
    })();
  }
  getSmsTemplate() {
    var _arguments7 = arguments,
      _this7 = this;
    return _asyncToGenerator(function* () {
      var attrs = _arguments7.length > 0 && _arguments7[0] !== undefined ? _arguments7[0] : {};
      var {
        client
      } = _this7;
      var {
        TemplateName,
        TemplateVersion
      } = attrs;
      var params = {
        TemplateName,
        Version: TemplateVersion
      };
      var command = new _clientPinpoint.GetSmsTemplateCommand(params);
      var response = yield client.send(command);
      var {
        SMSTemplateResponse
      } = response;
      return SMSTemplateResponse;
    })();
  }
  sendTemplatizedEmail() {
    var _arguments8 = arguments,
      _this8 = this;
    return _asyncToGenerator(function* () {
      var attrs = _arguments8.length > 0 && _arguments8[0] !== undefined ? _arguments8[0] : {};
      var {
        ToAddress,
        Substitutions = {},
        FromAddress,
        FeedbackForwardingAddress,
        ReplyToAddresses
      } = attrs;

      // Get Template
      var template = yield _this8.getEmailTemplate(attrs);
      var {
        DefaultSubstitutions = '',
        TextPart = '',
        HtmlPart = '',
        Subject = ''
      } = template;

      // Perform Subsitutions
      var DefaultSubstitutionsObj = DefaultSubstitutions && JSON.parse(DefaultSubstitutions) || {};
      var substitutions = _objectSpread(_objectSpread({}, DefaultSubstitutionsObj), Substitutions);
      var TextPartData = (0, _templatize.default)(TextPart, substitutions);
      var HtmlPartData = (0, _templatize.default)(HtmlPart, substitutions);
      var SubjectData = (0, _templatize.default)(Subject, substitutions);

      // Send Email
      var SimpleEmail = {
        Subject: {
          Data: SubjectData
        },
        TextPart: {
          Data: TextPartData
        },
        HtmlPart: {
          Data: HtmlPartData
        }
      };
      var emailAttrs = {
        ToAddress,
        SimpleEmail,
        FromAddress,
        FeedbackForwardingAddress,
        ReplyToAddresses
      };
      var response = yield _this8.sendEmail(emailAttrs);
      return response;
    })();
  }
  sendTemplatizedSms() {
    var _arguments9 = arguments,
      _this9 = this;
    return _asyncToGenerator(function* () {
      var attrs = _arguments9.length > 0 && _arguments9[0] !== undefined ? _arguments9[0] : {};
      var {
        MessageType,
        DestinationNumber,
        Substitutions = {},
        OriginationNumber,
        Keyword,
        SenderId
      } = attrs;

      // Get Template
      var template = yield _this9.getSmsTemplate(attrs);
      var {
        DefaultSubstitutions = '',
        Body = ''
      } = template;

      // Perform Subsitutions
      var DefaultSubstitutionsObj = DefaultSubstitutions && JSON.parse(DefaultSubstitutions) || {};
      var substitutions = _objectSpread(_objectSpread({}, DefaultSubstitutionsObj), Substitutions);
      var BodyData = (0, _templatize.default)(Body, substitutions);

      // Send SMS
      var smsAttrs = {
        Body: BodyData,
        MessageType,
        DestinationNumber,
        OriginationNumber,
        Keyword,
        SenderId
      };
      var response = yield _this9.sendSms(smsAttrs);
      return response;
    })();
  }
}
exports.default = PinpointSdk;