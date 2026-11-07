import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AuthService } from "./auth.service.js";
import type { RegisterUserDTO } from "./auth.dto.js";

export const registerUserController = asyncHandler(
   async (_req: Request, res: Response): Promise<void> => {

      const data: RegisterUserDTO = res.locals.validated.body;
      const user = await AuthService.registerUser(data);

      res.status(201).json(
         new ApiResponse(
            201, 
            {user}, 
            "User Regsiter Successfully", 
            true
         )
      );
   },
);
