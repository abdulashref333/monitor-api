import { CustomError } from "./custom-error";

export class ValidationError extends CustomError {
  statusCode = 400;
  // public errors: ValidationError[];
  constructor(public message: string, public errors: any[]) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }, ...this.errors];
  }
}
