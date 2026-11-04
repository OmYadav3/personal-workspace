import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const registerUserController = asyncHandler( async (req: Request, res: Response) => {
   const { username, email, password } = req.body;
   console.log( username, email, password);

   res.status(201).json(
      new ApiResponse(
         201,
         null,
         "User Regsiter Successfully",
         true
      )
   )

})