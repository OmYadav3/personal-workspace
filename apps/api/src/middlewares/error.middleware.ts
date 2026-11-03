import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ApiError } from "../utils/ApiError.js";


const errorMiddleware:ErrorRequestHandler = (
   err: Error, 
   _req: Request, 
   res: Response, 
   _next: NextFunction):void => {

      let error = err;

      // Handle Known Application Errors 
      if(error instanceof ApiError) {
         error = err;
      }

      // Default error response
      const statusCode = error instanceof ApiError ? error.statusCode : 500;

      const message = error instanceof ApiError ? error.message : "Internal Server Error";

      const errors = error instanceof ApiError ? error.errors : [];

      const data = error instanceof ApiError ? error.data : null;


      // log unexpected errors to the console for debugging purposes
      if(statusCode >= 500) {
         console.error("[ERROR] ", error);
      }

      res.status(statusCode).json({
         success: false,
         statusCode,
         message,
         data,
         errors
      })
   }

export default errorMiddleware;
