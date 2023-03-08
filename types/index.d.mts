export default class PinpointSdk {
    constructor(config?: {});
    config: {
        CONNECTION_CONFIG: {
            region: string;
            apiVersion: string;
        };
        APPLICATION_ID: string;
        SMS_ORIGINATION_NUMBER: string;
        SMS_SENDER_ID: string;
        EMAIL_FROM_ADDRESS: string;
        OTP_BRAND_NAME: string;
        OTP_ORIGINATION_IDENTITY: string;
        OTP_ALLOWED_ATTEMPTS: string;
        OTP_CODE_LENGTH: string;
        OTP_VALIDITY_PERIOD: string;
    };
    client: PinpointClient;
    ApplicationId: string;
    sendMessages(attrs?: {}): Promise<void>;
    sendEmail(attrs?: {}): Promise<{
        results: {
            requestId: any;
            messageId: any;
            channelType: any;
            address: string;
            deliveryStatus: any;
            statusCode: any;
            message: any;
            updatedToken: any;
        }[];
    }>;
    sendSms(attrs?: {}): Promise<{
        results: {
            requestId: any;
            messageId: any;
            channelType: any;
            address: string;
            deliveryStatus: any;
            statusCode: any;
            message: any;
            updatedToken: any;
        }[];
    }>;
    sendOTP(attrs?: {}): Promise<{
        result: {
            requestId: any;
            messageId: any;
            channelType: any;
            address: string;
            deliveryStatus: any;
            statusCode: any;
            message: any;
            updatedToken: any;
        };
    }>;
    verifyOTP(attrs?: {}): Promise<{
        valid: boolean;
    }>;
    #private;
}
import { PinpointClient } from "@aws-sdk/client-pinpoint/dist-types/PinpointClient.js";
