import type { Request, Response, NextFunction, RequestHandler } from "express";
import { ApiError } from "../utils/ApiError.js";
import { AuthRepository } from "../modules/auth/auth.repository.js";
import { verifyAccessToken } from "../utils/jwt.helper.js";
import type { JwtPayload } from "jsonwebtoken";

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


      const user = await AuthRepository.findUserById(userId as string);
      if (!user) {
         throw new ApiError(401, "User not found");
      }
      // TODO:   make model schemas be correct 
      // TODO:   clean register controller and service for garbage of testing 
      // TODO:   check the session found by id or not 
      // TODO:   check the session is already revoked or not 

      res.locals.auth = {
         userId,
         sessionId
      };

      return next();
   } catch (error) {
      return res.status(401).json({
         success: false,
         message: "Invalid or expired token",
      });
   }
};
