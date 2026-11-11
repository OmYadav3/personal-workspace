import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AuthService } from "./auth.service.js";
import type { loginUserDTO, refreshTokenDTO, RegisterUserDTO } from "./auth.dto.js";

export const registerUserController = asyncHandler(
   async (_req: Request, res: Response): Promise<void> => {
      const data: RegisterUserDTO = res.locals.validated.body;

      const user = await AuthService.registerUser(data);

      res.status(201).json(new ApiResponse(201, { user }, "User Register Successfully", true));
   },
);

export const loginUserController = asyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const deviceInfo = req.get("user-agent")?.slice(0, 500);

      const data: loginUserDTO = res.locals.validated.body;

      const result = await AuthService.loginUser(data, deviceInfo);

      res.cookie("accessToken", result?.accessToken, {
         httpOnly: true,
         secure: true,
         sameSite: "lax",
         maxAge: 5 * 60 * 1000,
         path: "/",
      });

      res.cookie("refreshToken", result?.refreshToken, {
         httpOnly: true,
         secure: true,
         sameSite: "lax",
         maxAge: 30 * 24 * 60 * 60 * 1000,
         path: "/api/v1/auth",
      });

      res.status(201).json(
         new ApiResponse(
            201,
            {
               user: result?.user,
               refreshToken: result?.refreshToken,
               accessToken: result?.accessToken,
            },
            "User logged In Successfully",
            true,
         ),
      );
   },
);

export const logOutUserController = asyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const refreshToken = req.cookies.refreshToken;
      const { sessionId, userId } = res.locals.auth;

      await AuthService.logOutUser({
         refreshToken,
         sessionId,
         userId,
      });

      res.clearCookie("accessToken", {
         httpOnly: true,
         secure: true,
         sameSite: "lax",
         path: "/",
      });

      res.clearCookie("refreshToken", {
         httpOnly: true,
         secure: true,
         sameSite: "lax",
         path: "/",
      });

      res.status(200).json(new ApiResponse(200, null, "User LoggedOut Successfully", true));
   },
);

export const logOutAllUserController = asyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const refreshToken = req.cookies.refreshToken;
      const { sessionId, userId } = res.locals.auth;

      await AuthService.logOutUser({
         refreshToken,
         sessionId,
         userId,
      });

      res.clearCookie("accessToken", {
         httpOnly: true,
         secure: true,
         sameSite: "lax",
         path: "/",
      });

      res.clearCookie("refreshToken", {
         httpOnly: true,
         secure: true,
         sameSite: "lax",
         path: "/",
      });

      res.status(200).json(new ApiResponse(200, null, "User LoggedOut Successfully", true));
   },
);

export const refreshTokencontroller = asyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const refreshToken: refreshTokenDTO = {
         refreshToken: req.cookies?.refreshToken,
      };

      const token = await AuthService.refreshToken(refreshToken);

      res.cookie("accessToken", token?.accessToken, {
         httpOnly: true,
         secure: true,
         sameSite: "lax",
         maxAge: 5 * 60 * 1000,
         path: "/",
      });

      res.cookie("refreshToken", token?.refreshToken, {
         httpOnly: true,
         secure: true,
         sameSite: "lax",
         maxAge: 30 * 24 * 60 * 60 * 1000,
         path: "/api/v1/auth",
      });

      res.status(200).json(new ApiResponse(200, null, "Tokens refreshed successfully"));
   },
);

export const getCurrentUserController = asyncHandler(async (_req: Request, res: Response) => {
   const { userId } = res.locals.auth;

   const user = await AuthService.getCurrentUser(userId);

   res.status(200).json(new ApiResponse(200, user, "User Details fetch Successfully"));
});
