export class HttpError extends Error {
  public code?: number;
  constructor(message?: string, code?: number) {
    super(message); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}
