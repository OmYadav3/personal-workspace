import type { Request, Response, NextFunction, RequestHandler } from "express";
import { ApiError } from "../utils/ApiError.js";
import { AuthRepository } from "../modules/auth/auth.repository.js";
import { verifyAccessToken } from "../utils/jwt.helper.js";
import type { JwtPayload } from "jsonwebtoken";
import { SessionRepository } from "../modules/auth/session.repository.js";

export const jwtVerify: RequestHandler = async (
   req: Request,
   res: Response,
   next: NextFunction,
) => {
   try {
      let token;

      /* CHECK HEADER FIRST FOR TOKEN */
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
         token = req.headers.authorization.split(" ")[1];
      }
      /* THEN CHECK COOKIES FOR TOKEN  */
      else if (req.cookies?.accessToken) {
         token = req.cookies.accessToken;
      } else {
         console.log("Token Not Found in headers and cookies ");
         throw new ApiError(401, "unAuthorised Request");
      }

      const decodedToken: JwtPayload | string = verifyAccessToken(token);
      if (typeof decodedToken === "string") {
         throw new ApiError(401, "Invalid token");
      }

      const userId = decodedToken.sub;
      const sessionId = decodedToken.sid;

      const IsUserExist = await AuthRepository.findUserById(userId as string);
      if (!IsUserExist) {
         throw new ApiError(401, "User not found");
      }
      if (IsUserExist.status !== "ACTIVE") {
         throw new ApiError(401, "User Account are not found");
      }
      const IsSessionExist = await SessionRepository.findSessionById(sessionId as string);
      if (!IsSessionExist) {
         throw new ApiError(401, "Session not found");
      }
      if (IsSessionExist.revokedAt !== null) {
         throw new ApiError(401, "Session not found");
      }
      
      res.locals.auth = {
         userId,
         sessionId,
      };

      return next();
   } catch (error) {
      return res.status(401).json({
         success: false,
         message: "Invalid or expired token",
      });
   }
};
