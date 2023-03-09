export default class PinpointError extends Error {
    constructor(e: {}, eMap: any);
    _isCustomError: boolean;
    _isPinpointError: boolean;
    service: string;
    message: any;
    statusCode: any;
    errorCode: any;
    error: {};
}
