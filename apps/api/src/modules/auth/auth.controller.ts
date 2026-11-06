import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AuthService } from "./auth.service.js";

export const registerUserController = asyncHandler( async (_req: Request, res: Response) => {
   const data = await AuthService.registerUser(res.locals.validated.body);

   res.status(201).json(
      new ApiResponse(
         201,
         data,
         "User Regsiter Successfully",
         true
      )
   )

})