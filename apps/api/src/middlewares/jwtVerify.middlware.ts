import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { JwtPayload } from "jsonwebtoken";

import { ApiError } from "../utils/ApiError.js";
import { AuthRepository } from "../modules/auth/auth.repository.js";
import { verifyAccessToken } from "../utils/jwt.helper.js";
import { SessionRepository } from "../modules/auth/session.repository.js";

export const jwtVerify: RequestHandler = async (
   req: Request,
   res: Response,
   next: NextFunction,
) => {
   try {
      // Exract Token
      let token;

      /* CHECK HEADER FIRST FOR TOKEN */
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
         token = req.headers.authorization.split(" ")[1];
      }
      /* THEN CHECK COOKIES FOR TOKEN  */
      else if (typeof req.cookies?.accessToken === "string") {
         token = req.cookies.accessToken;
      } else {
         console.log("Token Not Found in headers and cookies ");
         throw new ApiError(401, "unAuthorised Request");
      }

      // 2. Verify JWT signature and expiry
      const decodedToken: JwtPayload | string = verifyAccessToken(token as string);

      if (
         typeof decodedToken === "string" ||
         typeof decodedToken.sub !== "string" ||
         typeof decodedToken.sid !== "string"
      ) {
         throw new ApiError(401, "Invalid access token");
      }

      const userId = decodedToken.sub;
      const sessionId = decodedToken.sid;

      // 3. Verify session
      const session = await SessionRepository.findSessionById(sessionId);

      if (!session || session.userId !== userId) {
         throw new ApiError(401, "Invalid session");
      }

      if (session.revokedAt !== null) {
         throw new ApiError(401, "Session has been revoked");
      }

      if (session.expiresAt <= new Date()) {
         throw new ApiError(401, "Session has expired");
      }

      // 4. Verify user
      const user = await AuthRepository.findUserById(userId);

      if (!user) {
         throw new ApiError(401, "User not found");
      }

      if (user.status !== "ACTIVE") {
         throw new ApiError(403, "User account is not active");
      }

      // 5. Attach authenticated identity
      res.locals.auth = {
         userId,
         sessionId,
      };

      return next();
   } catch (error) {
      return next(error);
   }
};
