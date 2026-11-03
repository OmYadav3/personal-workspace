export class ApiError extends Error {
   public readonly statusCode: number;
   public readonly success: boolean = false;
   public readonly data: null = null;
   public readonly errors: unknown[];
   public readonly isOperational: boolean;

   constructor(
      statusCode: number,
      message: string,
      errors: unknown[] = [],
      isOperational: boolean = true,
      stack: string = "",
   ) {
      super(message);
      this.name = "ApiError";
      this.statusCode = statusCode;
      this.data = null;
      this.errors = errors;
      this.isOperational = isOperational;

      if (stack) {
         this.stack = stack;
      } else {
         Error.captureStackTrace(this, this.constructor);
      }

      Object.setPrototypeOf(this, new.target.prototype);
   }
}
