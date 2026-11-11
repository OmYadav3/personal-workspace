import type {
   loginUserDTO,
   refreshTokenDTO,
   RegisterUserDTO,
   UserLoggedOutDTO,
} from "./auth.dto.js";
import type { JwtPayload } from "jsonwebtoken";

import { AuthRepository } from "./auth.repository.js";
import { hashPassword, verifyPassword } from "../../utils/auth.helper.js";
import { AuthMapper } from "./auth.mapper.js";

import { ApiError } from "../../utils/ApiError.js";
import { SessionRepository } from "./session.repository.js";
import {
   generateSessionId,
   generateTokenFamilyId,
   getSessionExpiry,
} from "../../utils/session.helper.js";
import {
   generateAccessToken,
   generateRefreshToken,
   HashToken,
   verifyHashedToken,
   verifyRefreshToken,
} from "../../utils/jwt.helper.js";

export const AuthService = {
   
   registerUser: async (data: RegisterUserDTO) => {
      const { name, username, email, password } = data;
      console.log(username);
      const isUsernameExist = await AuthRepository.findUserByUsername(username);
      if (isUsernameExist) {
         throw new ApiError(409, "Username Already Exists");
      }

      const isEmailExists = await AuthRepository.findUserByEmail(email);
      if (isEmailExists) {
         throw new ApiError(409, "Email already Exists ");
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await AuthRepository.createUser({
         name,
         username,
         email,
         passwordHash: hashedPassword,
      });

      return AuthMapper.toUserResponse(newUser);
   },

   loginUser: async (data: loginUserDTO, deviceInfo?: string) => {
      const { username, password } = data;

      const user = await AuthRepository.findUserByUsername(username);
      if (!user) {
         throw new ApiError(401, "InValid Credentials");
      }

      const matchPassword = await verifyPassword(user.passwordHash, password);
      if (!matchPassword) {
         throw new ApiError(401, "InValid Credentials");
      }

      if (user.status !== "ACTIVE") {
         throw new ApiError(403, "Account is not active");
      }

      // if (user.emailVerifiedAt === null || undefined ) {
      //    throw new ApiError(403, "You Email is not Verified!")
      // }

      const userId = user.id;
      const sessionId = generateSessionId();
      const tokenFamilyId = generateTokenFamilyId();
      const expiresAt = getSessionExpiry();

      const accessToken = generateAccessToken(userId, sessionId);
      const refreshToken = generateRefreshToken(userId, sessionId, tokenFamilyId);

      const refreshTokenHash = HashToken(refreshToken);

      const session = await SessionRepository.createSession({
         id: sessionId,
         userId,
         refreshTokenHash,
         tokenFamilyId,
         deviceInfo,
         expiresAt,
      });

      if (session) {
         return {
            user: AuthMapper.toUserResponse(user),
            accessToken,
            refreshToken: refreshToken,
         };
      } else {
         console.log("Session not Created yet! Please Try Again ");
      }
   },

   logOutUser: async (data: UserLoggedOutDTO) => {
      const { refreshToken, sessionId, userId } = data;

      // 1. Verify refresh JWT
      const decodedToken: JwtPayload | string = verifyRefreshToken(refreshToken);

      if (
         typeof decodedToken === "string" ||
         !decodedToken.sub ||
         typeof decodedToken.sid !== "string" ||
         typeof decodedToken.fid !== "string"
      ) {
         throw new ApiError(401, "Invalid refresh token");
      }

      // 2. Verify JWT claims
      if (decodedToken.sub !== userId || decodedToken.sid !== sessionId) {
         throw new ApiError(401, "Invalid refresh token");
      }

      // 3. Find session
      const session = await SessionRepository.findSession(sessionId, userId);

      if (!session || session.revokedAt !== null) {
         throw new ApiError(401, "Session has been revoked");
      }

      // 4. Verify token family
      if (decodedToken.fid !== session.tokenFamilyId) {
         throw new ApiError(401, "Invalid refresh token");
      }

      // 5. Verify SHA-256 refresh token hash
      const isValidToken = verifyHashedToken(session.refreshTokenHash, refreshToken);

      if (!isValidToken) {
         throw new ApiError(401, "Invalid refresh token");
      }

      // 6. Revoke current device session
      const sessionRevoked = await SessionRepository.revokeSession({
         userId,
         sessionId,
         tokenFamilyId: session.tokenFamilyId,
      });

      if (sessionRevoked.count !== 1) {
         throw new ApiError(409, "Session could not be revoked");
      }

      return true;
   },

   logOutUserAll: async (data: UserLoggedOutDTO) => {
      const { refreshToken, sessionId, userId } = data;

      // 1. Verify refresh JWT
      const decodedToken: JwtPayload | string = verifyRefreshToken(refreshToken);

      if (
         typeof decodedToken === "string" ||
         !decodedToken.sub ||
         typeof decodedToken.sid !== "string" ||
         typeof decodedToken.fid !== "string"
      ) {
         throw new ApiError(401, "Invalid refresh token");
      }

      // 2. Verify JWT claims
      if (decodedToken.sub !== userId || decodedToken.sid !== sessionId) {
         throw new ApiError(401, "Invalid refresh token");
      }

      // 3. Find session
      const session = await SessionRepository.findSession(sessionId, userId);

      if (!session || session.revokedAt !== null) {
         throw new ApiError(401, "Unauthorized request");
      }

      // 4. Verify token family
      if (decodedToken.fid !== session.tokenFamilyId) {
         throw new ApiError(401, "Invalid refresh token");
      }

      // 5. Verify SHA-256 refresh token hash
      const isValidToken = verifyHashedToken(session.refreshTokenHash, refreshToken);

      if (!isValidToken) {
         throw new ApiError(401, "Invalid refresh token");
      }

      // 6. Revoke current device session
      const sessionRevoked = await SessionRepository.revokeAllSession({
         userId,
      });

      if (sessionRevoked.count !== 1) {
         throw new ApiError(409, "Session could not be revoked");
      }

      return true;
   },

   refreshToken: async (token: refreshTokenDTO) => {
      const { refreshToken } = token;
      
      const decodedToken: JwtPayload | string = verifyRefreshToken(refreshToken);

      if (
         typeof decodedToken === "string" ||
         !decodedToken.sub ||
         typeof decodedToken.sid !== "string" ||
         typeof decodedToken.fid !== "string"
      ) {
         throw new ApiError(401, "Invalid refresh token");
      }

      const { sub: userId, sid: sessionId, fid: tokenFamilyId } = decodedToken;

      const session = await SessionRepository.findSessionById(sessionId);
      if (!session) {
         throw new ApiError(401, "Invalid Session");
      }
      if (session.userId !== userId) {
         throw new ApiError(401, "Invalid Session");
      }
      if (session.tokenFamilyId !== tokenFamilyId) {
         throw new ApiError(401, "Invalid token family");
      }
      if (session.revokedAt !== null) {
         throw new ApiError(401, "Session has been revoked");
      }
      if (session.expiresAt <= new Date()) {
         throw new ApiError(401, "Session has expired");
      }

      const user = await AuthRepository.findUserById(userId);
      if (!user || user.status !== "ACTIVE") {
         throw new ApiError(403, "User account is not active");
      }

      const isTokenValid = verifyHashedToken(session.refreshTokenHash, refreshToken);
      if (!isTokenValid) {
         throw new ApiError(401, " Invalid refresh Token");
      }

      // generate new tokens
      const newAccessToken = generateAccessToken(userId, sessionId);
      const newRefreshToken = generateRefreshToken(userId, sessionId, tokenFamilyId);


      const refreshTokenHash = HashToken(newRefreshToken);
      const oldRefreshTokenHash = HashToken(refreshToken);

      const sessionUpdated = await SessionRepository.SessionUpdate({
         sessionId,
         userId,
         oldRefreshTokenHash,
         refreshTokenHash,
      });

      if (!sessionUpdated) {
         throw new ApiError(401, "RefershToken is not longer valid");
      }

      return {
         accessToken: newAccessToken,
         refreshToken: newRefreshToken,
      };
   },


};
