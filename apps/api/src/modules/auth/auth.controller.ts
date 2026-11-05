import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const registerUserController = asyncHandler( async (_req: Request, res: Response) => {
   const { name, username, email, password } =   res.locals.validated.body;
   console.log ("result ", res.locals.validated.body);
   console.log( name, username, email, password);

   res.status(201).json(
      new ApiResponse(
         201,
         null,
         "User Regsiter Successfully",
         true
      )
   )

})