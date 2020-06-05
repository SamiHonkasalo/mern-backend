import HttpStatusCode from './http-status-code';

export class HttpError extends Error {
  public code?: HttpStatusCode;
  constructor(message?: string, code?: HttpStatusCode) {
    super(message); // 'Error' breaks prototype chain here
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}
